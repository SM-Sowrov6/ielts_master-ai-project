import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Room, RoomEvent, Track, type RemoteParticipant, type TextStreamReader } from "livekit-client";
import { Mic, MicOff, ArrowLeft, Sparkles, Clock, Globe, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { recordAttempt } from "@/src/lib/progress";

type Screen = "setup" | "session" | "ended";
type SpeakerState = "connecting" | "examiner" | "listening" | "idle";

interface TranscriptEntry {
  id: string;
  speaker: "You" | "Examiner";
  isCandidate: boolean;
  text: string;
  isFinal: boolean;
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function SpeakingModule({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<Screen>("setup");
  const [candidateName, setCandidateName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [elapsed, setElapsed] = useState("00:00");
  const [speakerState, setSpeakerState] = useState<SpeakerState>("connecting");
  const [statusHint, setStatusHint] = useState("Setting up your room and microphone.");
  const [transcriptVersion, setTranscriptVersion] = useState(0);

  const roomRef = useRef<Room | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<Map<string, TranscriptEntry>>(new Map());
  const sessionStartRef = useRef<number>(0);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bumpTranscript = useCallback(() => setTranscriptVersion((v) => v + 1), []);

  const setStatus = useCallback((state: SpeakerState, hint?: string) => {
    setSpeakerState(state);
    if (hint) setStatusHint(hint);
  }, []);

  const cleanupSession = useCallback(() => {
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }
    setIsLive(false);
  }, []);

  const handleDisconnected = useCallback(() => {
    cleanupSession();
    setScreen("ended");

    // Only log sessions that actually got going — skip instant/failed connects.
    if (sessionStartRef.current && Date.now() - sessionStartRef.current > 10_000) {
      recordAttempt({ module: "speaking", band: null, label: "Speaking practice session" });
    }
  }, [cleanupSession]);

  async function connect(name: string) {
    try {
      const res = await fetch(`/api/livekit-token?identity=${encodeURIComponent(name)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not reach the token server.");
      }
      const { token, url } = await res.json();

      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.Disconnected, handleDisconnected);

      room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        if (track.kind === Track.Kind.Audio && participant.identity !== room.localParticipant.identity && audioRef.current) {
          track.attach(audioRef.current);
          audioRef.current.play().catch(() => {
            /* Autoplay can be blocked until the user interacts with the page again. */
          });
        }
      });

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const localSpeaking = speakers.some((p) => p.identity === room.localParticipant.identity);
        const remoteSpeaking = speakers.some((p) => p.identity !== room.localParticipant.identity);
        if (remoteSpeaking) setStatus("examiner", "The examiner is talking — listen closely.");
        else if (localSpeaking) setStatus("listening", "You have the floor.");
        else setStatus("idle", "Waiting for the next question.");
      });

      // LiveKit forwards both sides' speech on the "lk.transcription" text stream,
      // tagged with "lk.segment_id" (groups revisions of one utterance) and
      // "lk.transcription_final" (done being revised).
      room.registerTextStreamHandler(
        "lk.transcription",
        async (reader: TextStreamReader, participantInfo: { identity: string }) => {
          const isLocal = participantInfo.identity === room.localParticipant.identity;
          const attributes = reader.info.attributes || {};
          const segmentId = attributes["lk.segment_id"] || reader.info.id;
          const isFinal =
            attributes["lk.transcription_final"] === "true" || (attributes["lk.transcription_final"] as unknown) === true;

          let entry = segmentsRef.current.get(segmentId);
          if (!entry) {
            entry = {
              id: segmentId,
              speaker: isLocal ? "You" : "Examiner",
              isCandidate: isLocal,
              text: "",
              isFinal: false,
            };
            segmentsRef.current.set(segmentId, entry);
          }

          // Each revision of a segment (interim, interim, final...) replays the
          // full text from scratch, so reset before accumulating this revision's chunks.
          entry.text = "";

          for await (const chunk of reader) {
            entry.text += chunk;
            bumpTranscript();
            if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
          }

          if (isFinal) {
            entry.isFinal = true;
            bumpTranscript();
          }
        }
      );

      await room.connect(url, token);
      await room.localParticipant.setMicrophoneEnabled(true);

      sessionStartRef.current = Date.now();
      elapsedIntervalRef.current = setInterval(() => {
        setElapsed(formatElapsed(Date.now() - sessionStartRef.current));
      }, 1000);

      setIsLive(true);
      setStatus("idle", "Say hello when the examiner greets you.");
    } catch (err: any) {
      setScreen("setup");
      setError(err.message || "Something went wrong connecting to the practice room.");
      throw err;
    }
  }

  async function handleBegin(e: React.FormEvent) {
    e.preventDefault();
    const name = candidateName.trim();
    if (!name) return;

    setConnecting(true);
    setError(null);
    segmentsRef.current.clear();
    bumpTranscript();

    try {
      setScreen("session");
      await connect(name);
    } catch {
      // error state already set inside connect()
    } finally {
      setConnecting(false);
    }
  }

  async function handleToggleMute() {
    const room = roomRef.current;
    if (!room) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    await room.localParticipant.setMicrophoneEnabled(!nextMuted);
  }

  function handleEnd() {
    roomRef.current?.disconnect();
  }

  function handleRestart() {
    segmentsRef.current.clear();
    bumpTranscript();
    setCandidateName("");
    setIsMuted(false);
    setElapsed("00:00");
    setStatus("connecting", "Setting up your room and microphone.");
    setScreen("setup");
  }

  useEffect(() => {
    return () => {
      cleanupSession();
      roomRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transcriptEntries = Array.from(segmentsRef.current.values());

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <audio ref={audioRef} hidden />

      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
          onClick={onBack}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-3xl font-black text-white">Speaking Module</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Live Voice Agent</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {screen === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4"
              >
                <Sparkles className="w-4 h-4" />
                AI Speaking Laboratory
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.2] sm:leading-[1.1]"
              >
                Speaking Mastery <br className="hidden sm:block" />
                <span className="text-rose-400">&amp; Real-Time Fluency.</span>
              </motion.h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-medium max-w-xl mx-auto">
                A full three-part IELTS Speaking test, conducted out loud by a voice examiner — introduction, a
                cue-card long turn, and a discussion — finishing with a band-by-band assessment of how you did.
              </p>
            </div>

            <Card className="relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 space-y-10">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent pointer-events-none" />

              <form onSubmit={handleBegin} className="relative z-10 max-w-md mx-auto space-y-4">
                <label htmlFor="candidate-name" className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Your name
                </label>
                <Input
                  id="candidate-name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Samira Rahman"
                  maxLength={60}
                  required
                  className="h-12 rounded-2xl bg-white/5 border-white/10 text-white text-base px-4"
                />
                <Button
                  type="submit"
                  disabled={connecting}
                  className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black uppercase text-xs tracking-widest gap-2 transition-all disabled:opacity-60"
                >
                  <Mic className="w-4 h-4" />
                  {connecting ? "Connecting…" : "Begin the test"}
                </Button>
                <p className="text-xs text-slate-500 text-center font-medium">
                  Your browser will ask for microphone access — allow it to start.
                </p>
                {error && (
                  <p className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}
              </form>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
                {[
                  {
                    icon: Clock,
                    title: "Introduction & Interview",
                    desc: "Short questions about familiar topics — your home, studies, routine, interests. About 4–5 minutes.",
                  },
                  {
                    icon: Sparkles,
                    title: "Long Turn",
                    desc: "You get a cue card, one minute to prepare, then speak for one to two minutes on your own.",
                  },
                  {
                    icon: Globe,
                    title: "Discussion",
                    desc: "Deeper, more abstract questions building on the long-turn topic. About 4–5 minutes.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-rose-400" />
                    </div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="relative z-10 text-sm text-slate-500 max-w-2xl mx-auto border-l-2 border-rose-500/30 pl-4">
                At the end, your examiner gives you an estimated band for fluency, vocabulary, grammar, and
                pronunciation, plus an overall score.
              </p>
            </Card>
          </motion.div>
        )}

        {screen === "session" && (
          <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <Card className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-400" : "bg-rose-400"}`} />
                {candidateName || "—"}
              </div>
              <div className="font-mono text-sm text-slate-400">{elapsed}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleMute}
                  className={`w-10 h-10 rounded-full border transition-all ${
                    isMuted ? "border-rose-500/50 text-rose-400 bg-rose-500/10" : "border-white/10 text-white bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleEnd}
                  className="h-10 rounded-full px-4 border border-white/10 text-slate-300 hover:bg-white/10 gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  <PhoneOff className="w-3.5 h-3.5" /> End session
                </Button>
              </div>
            </Card>

            <Card className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center gap-4">
              <div
                className={`relative w-36 h-36 rounded-full border-2 flex items-center justify-center transition-all ${
                  speakerState === "examiner"
                    ? "border-rose-400 shadow-[0_0_0_10px_rgba(244,63,94,0.12)]"
                    : speakerState === "listening"
                    ? "border-emerald-400 shadow-[0_0_0_10px_rgba(52,211,153,0.12)]"
                    : "border-white/10"
                }`}
              >
                <motion.div
                  className="absolute inset-0 bg-rose-500/10 blur-2xl rounded-full"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <span className="relative z-10 font-mono text-xs text-slate-300 px-4">
                  {speakerState === "examiner"
                    ? "Examiner speaking"
                    : speakerState === "listening"
                    ? "Listening to you"
                    : speakerState === "connecting"
                    ? "Connecting…"
                    : "Waiting"}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">{statusHint}</p>
            </Card>

            <Card className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Live transcript
              </div>
              <div ref={transcriptRef} className="max-h-[42vh] overflow-y-auto p-5 flex flex-col gap-3">
                {transcriptEntries.length === 0 && (
                  <p className="text-sm text-slate-600 font-medium">Transcript will appear here once the conversation begins…</p>
                )}
                {transcriptEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      entry.isCandidate ? "self-end bg-rose-500 text-white" : "self-start bg-white/5 border border-white/10 text-slate-200"
                    } ${!entry.isFinal ? "opacity-60 italic" : ""}`}
                  >
                    <span className="block text-[10px] uppercase tracking-widest opacity-70 mb-1">{entry.speaker}</span>
                    {entry.text}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {screen === "ended" && (
          <motion.div key="ended" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 lg:p-16 text-center space-y-6">
              <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-400 font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest mx-auto">
                Session ended
              </Badge>
              <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">That's a wrap.</h3>
              <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
                Your examiner's band assessment was spoken at the end of the session. Start a fresh attempt anytime
                with a new cue card.
              </p>
              <Button
                onClick={handleRestart}
                className="rounded-2xl px-8 h-14 bg-rose-500 hover:bg-rose-400 text-white font-black uppercase text-xs tracking-widest gap-2 transition-all"
              >
                Practice again
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
