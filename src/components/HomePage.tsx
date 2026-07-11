import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  PenTool,
  Search,
  ChevronRight,
  Star,
  Users,
  Globe,
  ArrowRight,
  BookOpen,
  Headphones,
  Mic,
  Target,
  Languages,
  MousePointerClick,
  BrainCircuit,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HOW_IT_WORKS_STEPS = [
  { step: "01", icon: MousePointerClick, title: "Pick a Module", desc: "Choose Writing, Reading, Listening, or Speaking based on what you want to improve." },
  { step: "02", icon: BrainCircuit, title: "Practice with AI", desc: "Work through real exam-style tasks with an AI examiner guiding every step." },
  { step: "03", icon: CheckCircle2, title: "Get Instant Band Feedback", desc: "Receive a detailed band score and explanation the moment you finish." },
  { step: "04", icon: BarChart3, title: "Track Your Progress", desc: "Watch your overall band estimate grow on your personal dashboard over time." },
];

function HowItWorksStep({
  index,
  total,
  icon: Icon,
  step,
  title,
  desc,
  scrollYProgress,
}: {
  index: number;
  total: number;
  icon: any;
  step: string;
  title: string;
  desc: string;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const mid = (index + 0.6) / total;
  const glow = useTransform(scrollYProgress, [start, mid], [0, 1]);
  const scale = useTransform(glow, [0, 1], [0.82, 1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative text-center space-y-4"
    >
      <motion.div
        style={{ scale }}
        className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto shadow-lg shadow-primary/10"
      >
        <motion.div style={{ opacity: glow }} className="absolute inset-0 rounded-2xl bg-primary/40 blur-xl" />
        <motion.div style={{ opacity: glow }} className="absolute inset-0 rounded-2xl border-2 border-primary" />
        <Icon className="relative z-10 w-7 h-7 text-primary" />
      </motion.div>
      <span className="block text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Step {step}</span>
      <h4 className="text-xl font-bold text-white">{title}</h4>
      <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">{desc}</p>
    </motion.div>
  );
}

function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotLeft = useTransform(scrollYProgress, [0, 1], ["12.5%", "87.5%"]);
  const dotOpacity = useTransform(scrollYProgress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <section className="py-24 px-6 border-y border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary uppercase tracking-widest mb-6">
            Your Journey
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">From first practice session to Band 9, in four simple steps.</p>
        </div>

        <div ref={containerRef} className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-white/10" />
          <motion.div
            style={{ scaleX: lineScale }}
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-[2px] origin-left bg-gradient-to-r from-primary via-indigo-400 to-primary rounded-full"
          />
          <motion.div
            style={{ left: dotLeft, opacity: dotOpacity }}
            className="hidden md:block absolute top-8 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_16px_4px_rgba(99,102,241,0.7)]"
          />

          {HOW_IT_WORKS_STEPS.map((s, i) => (
            <HowItWorksStep
              key={i}
              index={i}
              total={HOW_IT_WORKS_STEPS.length}
              icon={s.icon}
              step={s.step}
              title={s.title}
              desc={s.desc}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface HomePageProps {
  onSelectModule: (module: "writing" | "reading" | "listening" | "speaking") => void;
}

export default function HomePage({ onSelectModule }: HomePageProps) {
  return (
    <div className="relative selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-6 lg:pt-24 lg:pb-24">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary uppercase tracking-widest mb-6">
              AI-Powered IELTS Excellence
            </span>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tight leading-tight lg:leading-none mb-8">
              Master Your <span className="text-gradient">IELTS Journey</span> <br />
              with Intelligence.
            </h1>
            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the future of IELTS preparation. Real-time AI feedback, 
              authentic practice tests, and personalized insights to reach Band 9.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Standard IELTS Rubrics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300">
              <Users className="w-4 h-4 text-primary" />
              <span>100% Free Practice</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Running Bar */}
      <div className="relative py-4 bg-white/5 border-y border-white/5 overflow-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="text-xl lg:text-2xl font-black text-white/20 uppercase tracking-tighter">Academic Reading</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-xl lg:text-2xl font-black text-white/20 uppercase tracking-tighter">Writing Task 1 & 2</span>
              <PenTool className="w-4 h-4 text-primary" />
              <span className="text-xl lg:text-2xl font-black text-white/20 uppercase tracking-tighter">Listening Intelligence</span>
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span className="text-xl lg:text-2xl font-black text-white/20 uppercase tracking-tighter">Speaking Simulation</span>
              <Mic className="w-4 h-4 text-rose-400" />
              <span className="text-xl lg:text-2xl font-black text-white/20 uppercase tracking-tighter">Band 9 Strategy</span>
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-xl lg:text-2xl font-black text-white/20 uppercase tracking-tighter">Vocabulary Mastery</span>
              <Languages className="w-4 h-4 text-primary" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Module Selection */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary uppercase tracking-widest mb-6">
              Four Skills, One Platform
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Choose Your Practice Module</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Every IELTS skill covered with dedicated AI-powered tools, from instant essay scoring to live voice examiners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Writing Module Card */}
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 lg:p-14 overflow-hidden premium-glow transition-all"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <PenTool className="w-48 h-48" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-inner">
                  <PenTool className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-white tracking-tight">Writing Master</h3>
                  <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                    Instant scoring and detailed feedback for Task 1 & 2. 
                    Improve your grammar, vocabulary, and coherence with AI analysis.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Task 1 & 2", "Band Scoring", "AI Feedback"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button 
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg transition-all group shadow-xl shadow-primary/20"
                  onClick={() => onSelectModule("writing")}
                >
                  Start Writing Practice
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Reading Module Card */}
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 lg:p-14 overflow-hidden premium-glow-indigo transition-all"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity text-indigo-500">
                <Search className="w-48 h-48" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                  <Search className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-white tracking-tight">Reading Expert</h3>
                  <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                    Full Cambridge-style academic tests. Interactive scoring, 
                    timed simulations, and AI-generated explanations for every answer.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Full Tests", "Timed System", "AI Explanations"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button 
                  className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg transition-all group shadow-xl shadow-indigo-600/20"
                  onClick={() => onSelectModule("reading")}
                >
                  Enter Reading Hub
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Listening Module Card */}
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 lg:p-14 overflow-hidden premium-glow transition-all"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Globe className="w-48 h-48" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                  <Globe className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-4xl font-bold text-white tracking-tight">Listening Lab</h3>
                  </div>
                  <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                    Immerse yourself in authentic audio scenarios.
                    Practice note-completion, matching, and multi-choice with instant feedback.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Audio Tests", "Transcript Mode", "Band Analysis"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg transition-all group shadow-xl shadow-emerald-600/20"
                  onClick={() => onSelectModule("listening")}
                >
                  Start Listening Practice
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Speaking Module Card */}
            <motion.div
              whileHover={{ y: -10 }}
              className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 lg:p-14 overflow-hidden premium-glow-rose transition-all"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity text-rose-500">
                <Star className="w-48 h-48" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shadow-inner">
                  <Star className="w-8 h-8 text-rose-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-4xl font-bold text-white tracking-tight">Speaking Pro</h3>
                  </div>
                  <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                    Interactive IELTS speaking simulations guided by a real-time AI examiner.
                    Practice all three test parts and receive instant band score feedback.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Real-time Voice", "Full Parts 1-3", "Band Assessment"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full h-16 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-lg transition-all group shadow-xl shadow-rose-600/20"
                  onClick={() => onSelectModule("speaking")}
                >
                  Start Speaking Practice
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "4", label: "Skills Covered" },
            { value: "9.0", label: "Full Band Scale Coverage" },
            { value: "100%", label: "Free Practice" },
            { value: "24/7", label: "AI Availability" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl lg:text-5xl font-black text-gradient tracking-tighter">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <HowItWorksSection />

      {/* Closing CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/20 via-indigo-600/10 to-transparent border border-primary/20 p-12 lg:p-20 text-center space-y-8"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="relative z-10 text-4xl lg:text-6xl font-black text-white tracking-tight">
              Ready to Reach <span className="text-gradient">Band 9?</span>
            </h2>
            <p className="relative z-10 text-lg text-slate-400 max-w-xl mx-auto font-medium">
              Jump into any module right now — no signup, no cost, just instant AI-powered IELTS practice.
            </p>
            <div className="relative z-10">
              <Button
                className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/30 transition-all group"
                onClick={() => onSelectModule("writing")}
              >
                Start Practicing Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
