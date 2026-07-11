import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  AlertCircle,
  ArrowRight,
  Gauge,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { recordAttempt } from "@/src/lib/progress";

type QuestionType = "completion" | "short_answer" | "mcq" | "matching";

interface Question {
  id: number;
  type: QuestionType;
  question: string; // use "_______" as the blank marker for completion questions
  options?: string[]; // for mcq / matching
  correctAnswer: string;
  explanation: string;
}

interface Section {
  id: number;
  title: string;
  instruction: string;
  audioUrl: string;
  questions: Question[];
}

interface ListeningTest {
  id: number;
  title: string;
  sections: Section[];
  isComingSoon?: boolean;
}

// ---------------------------------------------------------------------------
// Original content — script written from scratch and voiced with Gemini TTS
// (see scripts/generate-listening-audio.mts). Not sourced from any published
// IELTS test. To add another test, follow the same pattern and see
// public/audio/listening/README.md.
// ---------------------------------------------------------------------------
const LISTENING_TESTS: ListeningTest[] = [
  {
    id: 1,
    title: "Practice Test 1 — AI Topics",
    sections: [
      {
        id: 1,
        title: "Part 1",
        instruction: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
        audioUrl: "/audio/listening/test-1/part1.wav",
        questions: [
          { id: 1, type: "completion", question: "Caller's surname: _______", correctAnswer: "Whitfield", explanation: "Daniel spells his surname as W-H-I-T-F-I-E-L-D." },
          { id: 2, type: "completion", question: "Address: 14 _______ Street", correctAnswer: "Marlow", explanation: "Daniel gives his address as 14 Marlow Street." },
          { id: 3, type: "completion", question: "Course day: _______", correctAnswer: "Wednesday", explanation: "The course runs every Wednesday evening." },
          { id: 4, type: "completion", question: "Start time: _______ o'clock", correctAnswer: "seven", explanation: "The course starts at seven o'clock." },
          { id: 5, type: "completion", question: "Session length: _______ minutes", correctAnswer: "ninety", explanation: "Each session lasts ninety minutes." },
          { id: 6, type: "completion", question: "Full course fee: £_______", correctAnswer: "180", explanation: "The full course fee is one hundred and eighty pounds." },
          { id: 7, type: "completion", question: "Student fee: £_______", correctAnswer: "140", explanation: "Students pay one hundred and forty pounds." },
          { id: 8, type: "completion", question: "Bring your own: _______", correctAnswer: "laptop", explanation: "Daniel is asked to bring his own laptop for hands-on exercises." },
          { id: 9, type: "completion", question: "Room number: _______", correctAnswer: "12", explanation: "The class takes place in Room 12." },
          { id: 10, type: "completion", question: "Confirmation sent by: _______", correctAnswer: "text", explanation: "Confirmation is sent by text message once payment goes through." },
        ],
      },
      {
        id: 2,
        title: "Part 2",
        instruction: "Questions 11–15: Choose the correct letter, A, B or C. Questions 16–20: Complete the notes below. Write ONE WORD ONLY for each answer.",
        audioUrl: "/audio/listening/test-1/part2.wav",
        questions: [
          { id: 11, type: "mcq", question: "What day is the exhibition closed?", options: ["Sunday", "Monday", "Saturday"], correctAnswer: "B", explanation: "The exhibition is closed on Mondays for maintenance." },
          { id: 12, type: "mcq", question: "What isn't allowed near the robotic arm display?", options: ["Eating", "Flash photography", "Phone calls"], correctAnswer: "B", explanation: "Flash photography can interfere with the sensors." },
          { id: 13, type: "mcq", question: "Which exhibit does the guide recommend visiting early?", options: ["The history hall", "The coding workshop", "The self-driving car simulator"], correctAnswer: "C", explanation: "The self-driving car simulator is the most popular exhibit, so queues build up." },
          { id: 14, type: "mcq", question: "Where does the coding workshop take place?", options: ["Hall One", "The Learning Lab", "The café"], correctAnswer: "B", explanation: "The coding workshop takes place in the Learning Lab." },
          { id: 15, type: "mcq", question: "What time does the coding workshop start?", options: ["12pm", "1pm", "2pm"], correctAnswer: "C", explanation: "The workshop takes place every afternoon at two o'clock." },
          { id: 16, type: "completion", question: "Adult ticket price: £_______", correctAnswer: "15", explanation: "Tickets for adults are fifteen pounds." },
          { id: 17, type: "completion", question: "Concessions available for pensioners and _______ under twelve", correctAnswer: "children", explanation: "Concessions are available for pensioners and children under twelve." },
          { id: 18, type: "completion", question: "The café is next to the main _______", correctAnswer: "entrance", explanation: "The café is on the ground floor, next to the main entrance." },
          { id: 19, type: "completion", question: "Robotics kits reduced by _______ percent today", correctAnswer: "20", explanation: "All robotics kits are reduced by twenty percent today only." },
          { id: 20, type: "completion", question: "Hall One covers the _______ of artificial intelligence", correctAnswer: "history", explanation: "Hall One shows the history of artificial intelligence up to today's systems." },
        ],
      },
      {
        id: 3,
        title: "Part 3",
        instruction: "Questions 21–28: Choose the correct letter, A, B or C. Questions 29–30: Complete the sentences below. Write ONE WORD ONLY for each answer.",
        audioUrl: "/audio/listening/test-1/part3.wav",
        questions: [
          { id: 21, type: "mcq", question: "What is the group project's specific focus?", options: ["Treating diseases", "Diagnosing diseases from medical images", "Training doctors"], correctAnswer: "B", explanation: "Maya says they're focusing on how AI is used to diagnose diseases from medical images." },
          { id: 22, type: "mcq", question: "Who is researching the technical side of the algorithms?", options: ["Maya", "Maya's partner", "Dr Bennett"], correctAnswer: "A", explanation: "Maya says she is researching the technical side herself." },
          { id: 23, type: "mcq", question: "Who focuses on the ethical questions?", options: ["Maya", "Maya's partner", "Dr Bennett"], correctAnswer: "B", explanation: "Maya says her partner focuses on ethical questions like privacy and bias." },
          { id: 24, type: "mcq", question: "What extra source do they hope to add?", options: ["A textbook", "An interview with a radiologist", "A government report"], correctAnswer: "B", explanation: "They want to interview a radiologist if they can." },
          { id: 25, type: "mcq", question: "When is the presentation due?", options: ["This week", "Next week", "The second week of next month"], correctAnswer: "C", explanation: "Maya says it's scheduled for the second week of next month." },
          { id: 26, type: "mcq", question: "What do they think will be the biggest challenge?", options: ["Finding sources", "Simplifying technical details", "Meeting the deadline"], correctAnswer: "B", explanation: "Maya says simplifying the technical details for a general audience is their biggest worry." },
          { id: 27, type: "mcq", question: "What does Dr Bennett suggest using instead of dense text?", options: ["Videos", "Diagrams", "Surveys"], correctAnswer: "B", explanation: "Dr Bennett advises using lots of diagrams rather than dense text." },
          { id: 28, type: "mcq", question: "Where was the case-study research team based?", options: ["London", "Toronto", "Sydney"], correctAnswer: "B", explanation: "Maya says the study was published by a research team in Toronto." },
          { id: 29, type: "completion", question: "Ethical questions include patient _______ and bias in the data", correctAnswer: "privacy", explanation: "Maya's partner focuses on patient privacy and bias in the data." },
          { id: 30, type: "completion", question: "Maya will research how the _______ are trained", correctAnswer: "algorithms", explanation: "Maya says she'll research how the algorithms are trained." },
        ],
      },
      {
        id: 4,
        title: "Part 4",
        instruction: "Complete the notes below. Write ONE WORD ONLY for each answer.",
        audioUrl: "/audio/listening/test-1/part4.wav",
        questions: [
          { id: 31, type: "completion", question: "Neural networks are loosely inspired by the structure of the human _______", correctAnswer: "brain", explanation: "The lecturer says neural networks are inspired by the human brain." },
          { id: 32, type: "completion", question: "Information passes through an input layer, hidden layers, and an _______ layer", correctAnswer: "output", explanation: "The final layer is called the output layer." },
          { id: 33, type: "completion", question: "Internal values controlling connection influence are called _______", correctAnswer: "weights", explanation: "These values are called weights." },
          { id: 34, type: "completion", question: "Training requires a large amount of _______ data", correctAnswer: "labelled", explanation: "The system needs labelled data to compare predictions against correct answers." },
          { id: 35, type: "completion", question: "Memorising training data too closely is called _______", correctAnswer: "overfitting", explanation: "This problem is called overfitting." },
          { id: 36, type: "completion", question: "A technique used to reduce this problem is called _______", correctAnswer: "regularisation", explanation: "Regularisation discourages reliance on any single feature." },
          { id: 37, type: "completion", question: "One banking application mentioned is detecting _______", correctAnswer: "fraud", explanation: "The lecturer mentions detecting fraud in banking transactions." },
          { id: 38, type: "completion", question: "A key ethical concern discussed is _______ in the training data", correctAnswer: "bias", explanation: "The lecturer discusses bias as an ethical concern." },
          { id: 39, type: "completion", question: "Researchers want systems to be more _______", correctAnswer: "transparent", explanation: "Researchers want systems to be more transparent." },
          { id: 40, type: "completion", question: "This quality is also known as _______", correctAnswer: "explainability", explanation: "Transparency in this sense is called explainability." },
        ],
      },
    ],
  },
  { id: 2, title: "Practice Test 2", sections: [], isComingSoon: true },
  { id: 3, title: "Practice Test 3", sections: [], isComingSoon: true },
  { id: 4, title: "Practice Test 4", sections: [], isComingSoon: true },
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

function AudioBar({
  src,
  locked,
  onFinished,
}: {
  src: string;
  locked: boolean;
  onFinished: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  function togglePlay() {
    if (!audioRef.current || locked) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setError("Could not play this audio file."));
      setIsPlaying(true);
    }
  }

  function seekTo(fraction: number) {
    if (!audioRef.current || !duration || locked) return;
    audioRef.current.currentTime = fraction * duration;
    setCurrentTime(audioRef.current.currentTime);
  }

  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onError={() => setError("Audio file not found — add it under public/audio/listening/.")}
        onEnded={() => {
          setIsPlaying(false);
          onFinished();
        }}
        muted={muted}
      />
      <Button
        onClick={togglePlay}
        disabled={locked}
        className="w-10 h-10 shrink-0 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center p-0 disabled:opacity-40"
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
      </Button>

      <span className="text-white font-mono text-xs shrink-0 tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <div
        className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden relative cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seekTo((e.clientX - rect.left) / rect.width);
        }}
      >
        <div className="absolute top-0 left-0 h-full bg-white transition-all" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
      </div>

      <button
        onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
        className="flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold shrink-0"
        title="Playback speed"
      >
        <Gauge className="w-3.5 h-3.5" /> {speed}x
      </button>

      <button onClick={() => setMuted((m) => !m)} className="text-white/70 hover:text-white shrink-0">
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {error && (
        <span className="flex items-center gap-1 text-rose-400 text-xs shrink-0">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </span>
      )}
    </div>
  );
}

export default function ListeningModule({ onBack }: { onBack: () => void }) {
  const [activeTest, setActiveTest] = useState<ListeningTest | null>(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [playedSections, setPlayedSections] = useState<Set<number>>(new Set());
  const [practiceOnly, setPracticeOnly] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; band: number } | null>(null);

  const currentSection = activeTest?.sections[currentSectionIdx];
  const questionsInScope = practiceOnly
    ? currentSection?.questions || []
    : activeTest?.sections.flatMap((s) => s.questions) || [];

  function startTest(test: ListeningTest, sectionIdx = 0, onlyThisSection = false) {
    setActiveTest(test);
    setCurrentSectionIdx(sectionIdx);
    setAnswers({});
    setIsSubmitted(false);
    setResult(null);
    setPlayedSections(new Set());
    setPracticeOnly(onlyThisSection);
  }

  function calculateResult() {
    let score = 0;
    questionsInScope.forEach((q) => {
      if ((answers[q.id] || "").toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) score++;
    });

    const total = questionsInScope.length;
    const getBand = (s: number, of: number) => {
      const pct = s / of;
      if (pct >= 0.95) return 9.0;
      if (pct >= 0.87) return 8.0;
      if (pct >= 0.75) return 7.0;
      if (pct >= 0.62) return 6.0;
      if (pct >= 0.5) return 5.0;
      return 4.0;
    };

    const band = getBand(score, total || 1);
    setResult({ score, total, band });
    setIsSubmitted(true);

    recordAttempt({
      module: "listening",
      band,
      label: activeTest ? `${activeTest.title}${practiceOnly ? ` — ${currentSection?.title}` : ""}` : "Listening Test",
    });
  }

  if (!activeTest) {
    return (
      <div className="space-y-12 max-w-6xl mx-auto px-4 py-8">
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
            <h2 className="text-3xl font-black text-white">Listening Module</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Audio Mastery</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4" />
            AI Listening Laboratory
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.2] sm:leading-[1.1]"
          >
            Audio Mastery <br className="hidden sm:block" />
            <span className="text-emerald-400">&amp; Precision Listening.</span>
          </motion.h2>
          <p className="text-slate-400 text-base sm:text-lg font-medium max-w-xl mx-auto">
            Practice tests with your own audio — real-time constraints and instant band scoring.
          </p>
        </div>

        <div className="grid gap-4">
          {LISTENING_TESTS.map((test) => (
            <button
              key={test.id}
              disabled={test.isComingSoon}
              onClick={() => !test.isComingSoon && startTest(test)}
              className={`group flex items-center justify-between p-8 bg-white/[0.03] border border-white/5 rounded-3xl transition-all text-left ${
                test.isComingSoon ? "opacity-50 cursor-not-allowed" : "hover:bg-white/[0.08] hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{test.title}</h3>
                  <p className="text-slate-500 font-medium">
                    {test.isComingSoon ? "Coming soon" : `${test.sections.length} Parts • ${test.sections.flatMap((s) => s.questions).length} Questions`}
                  </p>
                </div>
              </div>
              {!test.isComingSoon && <ArrowRight className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors mr-4" />}
              {test.isComingSoon && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-black text-[8px] uppercase mr-4">
                  Soon
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col pt-4">
      <div className="flex items-center justify-between px-8 pb-4">
        <Button variant="ghost" className="text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] gap-2" onClick={() => setActiveTest(null)}>
          <ChevronLeft className="w-4 h-4" /> All tests
        </Button>
        {practiceOnly && (
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-black text-[10px] uppercase tracking-widest">
            Practicing {currentSection?.title} only
          </Badge>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/5 flex flex-col bg-zinc-950/50 min-h-0">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-8 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <HelpCircle className="w-4 h-4" /> Instructions
                </div>
                <p className="text-sm font-bold text-slate-400 italic leading-relaxed">{currentSection?.instruction}</p>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Parts</p>
                <div className="space-y-2">
                  {activeTest.sections.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        currentSectionIdx === idx && !practiceOnly ? "bg-primary/10 border-primary text-white" : "bg-white/5 border-white/5 text-white/40"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setCurrentSectionIdx(idx);
                          setPracticeOnly(false);
                        }}
                        className="font-bold text-sm tracking-tight text-left flex-1"
                      >
                        {s.title}
                      </button>
                      <button
                        onClick={() => startTest(activeTest, idx, true)}
                        className="text-[9px] font-black uppercase tracking-widest text-primary/70 hover:text-primary"
                      >
                        Practice only
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Question Navigator</p>
                <div className="grid grid-cols-5 gap-2">
                  {questionsInScope.map((q) => (
                    <div
                      key={q.id}
                      className={`aspect-square rounded-lg flex items-center justify-center font-black text-[10px] border ${
                        answers[q.id] ? "bg-primary text-black border-primary" : "bg-white/5 border-white/10 text-white/40"
                      }`}
                    >
                      {q.id}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a] min-h-0">
          <div className="px-8 py-5 border-b border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-white tracking-widest text-lg">{currentSection?.title}</h2>
              <Button
                onClick={calculateResult}
                className="bg-primary text-black hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest px-6 h-10 rounded-lg"
              >
                Submit {practiceOnly ? "Part" : "Test"}
              </Button>
            </div>
            {currentSection && (
              <AudioBar
                key={currentSection.id}
                src={currentSection.audioUrl}
                locked={!practiceOnly && playedSections.has(currentSection.id) && !isSubmitted}
                onFinished={() => setPlayedSections((prev) => new Set(prev).add(currentSection.id))}
              />
            )}
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-16">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div key={currentSection?.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-16">
                    <div className="grid gap-12">
                      {currentSection?.questions.map((q) => {
                        const isCorrect = (answers[q.id] || "").toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                        return (
                          <div key={q.id} className="space-y-6">
                            <div className="flex gap-6 items-start">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 transition-all ${
                                  answers[q.id] ? "bg-primary text-black" : "bg-white/10 text-white/30"
                                }`}
                              >
                                {q.id}
                              </div>
                              <div className="space-y-6 flex-1">
                                {q.type === "completion" ? (
                                  <div className="text-2xl font-black text-white leading-tight">
                                    {q.question.split("_______").map((part, i, arr) => (
                                      <span key={i}>
                                        {part}
                                        {i < arr.length - 1 && (
                                          <Input
                                            className={`inline-block mx-3 w-48 bg-white/5 border-0 border-b-4 ${
                                              isSubmitted ? (isCorrect ? "border-emerald-500" : "border-rose-500") : "border-primary/30 focus:border-primary"
                                            } text-center focus:outline-none transition-all placeholder:text-white/5 text-primary font-black text-2xl h-12 rounded-none focus-visible:ring-0`}
                                            placeholder="..."
                                            value={answers[q.id] || ""}
                                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                            disabled={isSubmitted}
                                          />
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                ) : q.type === "short_answer" ? (
                                  <div className="space-y-4">
                                    <p className="text-2xl font-black text-white leading-tight">{q.question}</p>
                                    <Input
                                      className="w-72 bg-white/5 border-white/20 h-12 rounded-xl text-primary font-black"
                                      placeholder="Your answer"
                                      value={answers[q.id] || ""}
                                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                      disabled={isSubmitted}
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-6">
                                    <p className="text-2xl font-black text-white leading-tight">{q.question}</p>
                                    <RadioGroup
                                      className="grid gap-3"
                                      value={answers[q.id] || ""}
                                      onValueChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                                      disabled={isSubmitted}
                                    >
                                      {q.options?.map((option, idx) => {
                                        const letter = String.fromCharCode(65 + idx);
                                        const isSelected = answers[q.id] === letter;
                                        return (
                                          <div
                                            key={idx}
                                            className={`flex items-center space-x-4 p-6 rounded-3xl border transition-all cursor-pointer ${
                                              isSelected ? "bg-primary/10 border-primary" : "bg-white/5 border-white/5 hover:bg-white/[0.08]"
                                            }`}
                                          >
                                            <RadioGroupItem value={letter} id={`q-${q.id}-${letter}`} className="border-white/20 w-8 h-8 shadow-none" />
                                            <Label htmlFor={`q-${q.id}-${letter}`} className="flex-1 cursor-pointer flex gap-6 items-center">
                                              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${isSelected ? "bg-primary text-black" : "bg-white/10 text-white/40"}`}>
                                                {letter}
                                              </span>
                                              <span className="font-bold text-xl text-white leading-tight">{option}</span>
                                            </Label>
                                          </div>
                                        );
                                      })}
                                    </RadioGroup>
                                  </div>
                                )}

                                {isSubmitted && (
                                  <div className={`p-6 rounded-3xl border ${isCorrect ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                      <Badge className={isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}>{isCorrect ? "Correct" : "Incorrect"}</Badge>
                                      <span className="text-white font-black">Correct Answer: {q.correctAnswer}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed">{q.explanation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!practiceOnly && currentSectionIdx < activeTest.sections.length - 1 && !isSubmitted && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => setCurrentSectionIdx((i) => i + 1)}
                          className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest gap-2"
                        >
                          Next part <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {isSubmitted && result && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-16 rounded-[4rem] bg-zinc-900/80 border border-white/10 premium-glow text-center space-y-10"
                      >
                        <div className="space-y-3">
                          <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em]">Result</p>
                          <h3 className="text-6xl font-black text-white italic">
                            Mock <span className="text-primary italic-none">Evaluation</span>
                          </h3>
                        </div>

                        <div className="flex justify-center items-center gap-16">
                          <div className="space-y-2">
                            <p className="text-7xl font-black text-white tracking-tighter">
                              {result.score}/{result.total}
                            </p>
                            <p className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">Raw Score</p>
                          </div>
                          <div className="h-24 w-px bg-white/10" />
                          <div className="space-y-2">
                            <p className="text-7xl font-black text-primary italic tracking-tighter">Band {result.band.toFixed(1)}</p>
                            <p className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">Estimated Band</p>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-center gap-4">
                          <Button
                            onClick={() => startTest(activeTest, 0, practiceOnly)}
                            className="h-20 px-16 rounded-[2rem] bg-white text-black font-black text-2xl hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                          >
                            Retake
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
