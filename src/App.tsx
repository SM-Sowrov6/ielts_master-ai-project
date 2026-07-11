import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  PenTool, 
  Sparkles, 
  Loader2, 
  ChevronRight, 
  CheckCircle2,
  BarChart3,
  MessageSquare,
  AlertCircle,
  BrainCircuit,
  Send,
  Copy,
  Check,
  Keyboard,
  Clock,
  Layout,
  ArrowLeft,
  Type,
  Youtube,
  Search,
  Headphones,
  Mic,
  Heart,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateIELTSResponse, TASK1_PROMPT, TASK2_PROMPT } from "@/src/lib/gemini";
import ReadingModule from "@/src/components/ReadingModule";
import ListeningModule from "@/src/components/ListeningModule";
import SpeakingModule from "@/src/components/SpeakingModule";
import HomePage from "@/src/components/HomePage";
import WritingModule from "@/src/components/WritingModule";
import Dashboard from "@/src/components/Dashboard";
import IELTSChatbot from "@/src/components/IELTSChatbot";

type TaskType = "task1" | "task2";
type ModuleType = "writing" | "reading" | "listening" | "speaking";
type ViewType = "home" | "practice" | "dashboard";

interface GenerationResult {
  band: string;
  content: string;
  temperature: number;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-xl hover:bg-white/10 h-8 w-8 transition-all"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-white/40 hover:text-primary transition-colors" />
      )}
    </Button>
  );
}

function LoadingCard({ index }: { index: number }) {
  const bands = ["6.5", "7.5", "8+"];
  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8 h-[500px] sm:h-[680px] flex flex-col items-center justify-center gap-10 relative overflow-hidden premium-glow">
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-teal-500/5"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Pulsing Icon */}
      <div className="relative">
        <motion.div 
          className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative z-10 bg-zinc-950 p-6 rounded-2xl border border-white/10"
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
      </div>

      <div className="text-center space-y-4 relative z-10">
        <h4 className="text-xl font-bold text-white">Crafting Band {bands[index]}</h4>
        <p className="text-sm text-slate-400 font-medium">Analyzing patterns & vocabulary...</p>
      </div>

      {/* Simulated Progress Bar */}
      <div className="w-full max-w-[240px] h-2 bg-white/5 rounded-full overflow-hidden relative z-10 border border-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-teal-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        />
      </div>

      {/* Skeleton Lines */}
      <div className="w-full space-y-5 mt-6 opacity-10 relative z-10">
        <div className="h-3 bg-white/20 rounded-full w-full" />
        <div className="h-3 bg-white/20 rounded-full w-[90%]" />
        <div className="h-3 bg-white/20 rounded-full w-[95%]" />
        <div className="h-3 bg-white/20 rounded-full w-[85%]" />
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<ViewType>("home");
  const [activeModule, setActiveModule] = useState<ModuleType>("writing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-x-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg" />
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-20 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 xl:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer justify-self-start shrink-0" onClick={() => setView("home")}>
            <div className="bg-primary/20 p-2 sm:p-2.5 rounded-2xl border border-primary/30 neuro-glow group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gradient">IELTS MASTER</h1>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-indigo-400/80 font-semibold">
                AI-Powered Exam Prep
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl sm:rounded-2xl shrink-0 justify-self-center">
            {[
              { id: "writing", icon: PenTool, label: "Writing" },
              { id: "reading", icon: Search, label: "Reading" },
              { id: "listening", icon: Headphones, label: "Listening" },
              { id: "speaking", icon: Mic, label: "Speaking" },
            ].map((mod) => {
              const isActive = view === "practice" && activeModule === mod.id;
              return (
                <Button
                  key={mod.id}
                  variant="ghost"
                  className={`relative rounded-lg sm:rounded-xl gap-1 sm:gap-1.5 font-bold px-2 sm:px-3 lg:px-3.5 xl:px-4 h-9 sm:h-10 text-[10px] sm:text-sm transition-colors hover:bg-transparent ${
                    isActive ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveModule(mod.id as ModuleType);
                    setView("practice");
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-primary rounded-lg sm:rounded-xl shadow-lg shadow-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                    <mod.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xl:inline">{mod.label}</span>
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-self-end shrink-0">
            <Button
              variant={view === "dashboard" ? "default" : "ghost"}
              className={`rounded-xl sm:rounded-2xl gap-1 sm:gap-1.5 font-bold px-2 sm:px-3 lg:px-3.5 xl:px-3.5 h-9 sm:h-10 text-[10px] sm:text-sm transition-all ${
                view === "dashboard"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
              }`}
              onClick={() => setView("dashboard")}
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xl:inline">My Progress</span>
            </Button>

            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500" />

              <Button
                className="relative rounded-full gap-1.5 sm:gap-2 h-10 px-3 sm:px-4 bg-zinc-950 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden"
                onClick={() => window.open("https://www.youtube.com/@IELTSDailySpeaking", "_blank")}
              >
                <Youtube className="w-4 h-4 text-[#FF0000] group-hover:scale-110 transition-transform relative z-10" />
                <span className="font-bold hidden xl:inline text-white/90 text-xs uppercase tracking-wider relative z-10">
                  Speaking Practice
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {view === "dashboard" ? (
        <Dashboard onBack={() => setView("home")} />
      ) : view === "home" ? (
        <HomePage
          onSelectModule={(module) => {
            setActiveModule(module);
            setView("practice");
          }} 
        />
      ) : (
        <main className="container mx-auto px-4 py-12 sm:py-24 max-w-7xl relative z-10">
        <AnimatePresence mode="wait">
          {activeModule === "writing" ? (
            <motion.div
              key="writing-module"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
           <WritingModule onBack={() => setView("home")} />

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-2xl border border-red-500/20 max-w-4xl mx-auto mt-8"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </motion.div>
          ) : activeModule === "reading" ? (
            <motion.div
              key="reading-module"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ReadingModule onBack={() => setView("home")} />
            </motion.div>
          ) : activeModule === "listening" ? (
            <motion.div
              key="listening-module"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ListeningModule onBack={() => setView("home")} />
            </motion.div>
          ) : (
            <motion.div
              key="speaking-module"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <SpeakingModule onBack={() => setView("home")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      )}

      <footer className="border-t border-white/5 pt-16 sm:pt-24 pb-10 mt-16 sm:mt-24 bg-black/40 backdrop-blur-xl relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
            <div className="text-left space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 premium-glow">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight text-2xl text-gradient">IELTS MASTER</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-semibold">AI-Powered Exam Prep</p>
                </div>
              </div>
              <p className="text-base text-slate-500 leading-relaxed max-w-xs font-medium">
                Empowering students with AI-driven practice, feedback, and band-level insight across all four IELTS skills.
              </p>
            </div>

            <div className="flex flex-col sm:items-center gap-8">
              <h4 className="text-xs uppercase tracking-[0.3em] text-slate-600 font-bold">Quick Navigation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
                <a href="#" className="relative text-slate-400 hover:text-primary transition-all text-sm font-semibold group w-fit">
                  Terms
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
                </a>
                <a href="#" className="relative text-slate-400 hover:text-primary transition-all text-sm font-semibold group w-fit">
                  Privacy
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
                </a>
                <a href="#" className="relative text-slate-400 hover:text-primary transition-all text-sm font-semibold group w-fit">
                  Support
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
                </a>
              </div>
            </div>

            <div className="text-left lg:text-right space-y-6">
              <div>
                <p className="text-xs tracking-[0.3em] text-slate-600 uppercase font-bold mb-3">Crafted With Care</p>
                <p className="text-lg font-bold text-white flex items-center gap-2 lg:justify-end">
                  Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> by
                  <span className="text-gradient">Sowrov &amp; Esrat</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-600 text-xs font-bold uppercase tracking-widest">
            <p>© 2026 IELTS MASTER. ALL RIGHTS RESERVED.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group"
            >
              Back to top
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:-translate-y-0.5 transition-all">
                <ArrowUp className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </footer>
      <IELTSChatbot />
    </div>
  );
}
