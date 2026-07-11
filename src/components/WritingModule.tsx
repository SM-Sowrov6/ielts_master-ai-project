import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ChevronRight, 
  Target, 
  FileText, 
  Languages, 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  Zap,
  Workflow,
  ScrollText,
  BrainCircuit,
  ImageIcon,
  CheckCircle2,
  Copy,
  Check,
  Highlighter,
  MessageSquare,
  XCircle,
  Clock,
  History,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PenTool,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Markdown from "react-markdown";
import { generateIELTSResponse } from "@/src/lib/gemini";
import { recordAttempt } from "@/src/lib/progress";
import { Badge } from "@/components/ui/badge";

type WritingTool = "evaluator" | "samples" | "paraphraser" | "grammar";

const FALLBACK_TASK1_TYPES = ["Line Graph", "Bar Chart", "Pie Chart", "Table", "Map", "Process Diagram"];

export default function WritingModule({ onBack }: { onBack: () => void }) {
  const [activeTool, setActiveTool] = useState<WritingTool | null>(null);
  const [initialTopic, setInitialTopic] = useState("");

  const handleOpenSamplesWithTopic = (topic: string) => {
    setInitialTopic(topic);
    setActiveTool("samples");
  };

  const renderTool = () => {
    switch (activeTool) {
      case "evaluator": return <WritingEvaluator onBack={() => setActiveTool(null)} onGetModelAnswer={handleOpenSamplesWithTopic} />;
      case "samples": return <SampleHub onBack={() => setActiveTool(null)} defaultTopic={initialTopic} />;
      case "paraphraser": return <ParaphraseTool onBack={() => setActiveTool(null)} />;
      case "grammar": return <GrammarGuard onBack={() => setActiveTool(null)} />;
      default: return <ToolSelection onSelect={setActiveTool} onBack={onBack} />;
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {renderTool()}
      </AnimatePresence>
    </div>
  );
}

function ToolSelection({ onSelect, onBack }: { onSelect: (tool: WritingTool) => void; onBack: () => void }) {
  const tools = [
    {
      id: "evaluator",
      title: "Writing Evaluator",
      desc: "Dual Mode: Task 1 (Multimodal) & Task 2. Get marks based on 4 official pillars.",
      icon: Target,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      id: "samples",
      title: "Sample Answer",
      desc: "Multimodal expert responses (Band 6 to 8+). Analyzes Task 1 images for accurate modeling.",
      icon: FileText,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10"
    },
    {
      id: "paraphraser",
      title: "Paraphrase Engine",
      desc: "Rephrase your sentences for better Lexical Resource scores.",
      icon: Languages,
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    },
    {
      id: "grammar",
      title: "Grammar Guard AI",
      desc: "Deep mistake auditor that finds and fixes structural weaknesses in your writing.",
      icon: ShieldCheck,
      color: "text-rose-400",
      bg: "bg-rose-500/10"
    }
  ];

  return (
    <div className="space-y-20">
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
          <h2 className="text-3xl font-black text-white">Writing Module</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Essay & Task Practice</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4"
        >
          <Sparkles className="w-4 h-4" />
          AI Writing Laboratory
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-7xl font-extrabold tracking-tight text-gradient leading-[1.2] sm:leading-[1.1]"
        >
          Writing Mastery <br className="hidden sm:block" />
          <span className="text-primary">& AI Innovation.</span>
        </motion.h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
      >
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className="glass-card border-white/5 hover:border-primary/40 transition-all cursor-pointer group overflow-hidden"
            onClick={() => onSelect(tool.id as WritingTool)}
          >
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className={`w-20 h-20 rounded-3xl ${tool.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <tool.icon className={`w-10 h-10 ${tool.color}`} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">{tool.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
              </div>
              <Button variant="ghost" className="text-primary font-bold group-hover:translate-x-2 transition-transform">
                Open Tool <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

// 1. WRITING EVALUATOR (Dual Mode)
function WritingEvaluator({ onBack, onGetModelAnswer }: { onBack: () => void, onGetModelAnswer: (topic: string) => void }) {
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [visualType, setVisualType] = useState("Line Graph");
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    band: string;
    pillars: { title: string; content: string; score: string; color: string; bg: string; icon: any }[];
    improvements: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    setEvaluation(null);
    try {
      const prompt = `Act as an OFFICIAL SENIOR IELTS EXAMINER with 20+ years of experience. Conduct a RIGOROUS, CLINICAL evaluation of this Task ${taskType === "task1" ? "1 Report" : "2 Essay"}.

      CONTEXTUAL INFO:
      - Task: Writing Task ${taskType === "task1" ? "1" : "2"}
      - Topic: ${topic}
      ${base64Image ? "- VISUAL SOURCE PROVIDED: Evaluate if the student's writing captures all key trends, data points, and comparisons accurately from the image." : ""}
      
      STUDENT WRITING:
      """
      ${essay}
      """

      EVALUATION PROTOCOL:
      1. Be FAIR but strictly adhere to official band descriptors.
      2. If the writing exhibits sophisticated vocabulary, flawless grammar, and expert cohesion, award Band 8.5/9.0. Do not default to lower scores for high-level academic writing.
      3. Check for specific IELTS features: Overview (Task 1), Thesis/Position (Task 2), and Paragraph Unity.

      REQUIRED STRUCTURE (Use these tags exactly):
      [BAND_SCORE]: X.X
      
      [PILLAR_1]: ${taskType === "task1" ? "Task Achievement" : "Task Response"}
      [PILLAR_1_SCORE]: X.X
      [PILLAR_1_CONTENT]: Detailed analysis of task coverage and clarity of position (Task 2) or overview (Task 1).
      
      [PILLAR_2]: Coherence & Cohesion
      [PILLAR_2_SCORE]: X.X
      [PILLAR_2_CONTENT]: Analysis of logical flow, paragraphing, and sophisticated use of cohesive devices.
      
      [PILLAR_3]: Lexical Resource
      [PILLAR_3_SCORE]: X.X
      [PILLAR_3_CONTENT]: Evaluation of vocabulary range, precision, and professional/academic collocations.
      
      [PILLAR_4]: Grammatical Range & Accuracy
      [PILLAR_4_SCORE]: X.X
      [PILLAR_4_CONTENT]: Evaluation of sentence structures (simple vs complex) and frequency of error-free sentences.
      
      [IMPROVEMENTS]: A MASTERSTRATEGY to bridge the gap to the next 0.5/1.0 band level. Use Markdown bullet points.`;

      const response = await generateIELTSResponse(prompt, 0.3, base64Image || undefined);
      
      if (response) {
        const band = response.match(/\[BAND_SCORE\]:\s*(.*)/)?.[1] || "6.0";
        const pillars = [];
        const icons = [Target, Workflow, Languages, ScrollText];
        const colors = ["text-emerald-400", "text-indigo-400", "text-amber-400", "text-rose-400"];
        const bgs = ["bg-emerald-500/10", "bg-indigo-500/10", "bg-amber-500/10", "bg-rose-500/10"];
        
        for (let i = 1; i <= 4; i++) {
          const contentMatch = response.match(new RegExp(`\\[PILLAR_${i}_CONTENT\\]:\\s*([\\s\\S]*?)(?=\\[PILLAR|\\n\\[IMPROVEMENTS|$)`));
          pillars.push({
            title: response.match(new RegExp(`\\[PILLAR_${i}\\]:\\s*(.*)`))?.[1] || "Criteria Analysis",
            score: response.match(new RegExp(`\\[PILLAR_${i}_SCORE\\]:\\s*(.*)`))?.[1] || "6.0",
            content: contentMatch ? contentMatch[1].trim() : "Detailed analysis currently unavailable.",
            color: colors[i-1],
            bg: bgs[i-1],
            icon: icons[i-1]
          });
        }
        
        const improvementsMatch = response.match(/\[IMPROVEMENTS\]:\s*([\s\S]*)/);
        const improvements = improvementsMatch ? improvementsMatch[1].trim() : "Follow standard paragraphing and enhance vocabulary variety.";

        setEvaluation({ band, pillars, improvements });

        const bandNum = parseFloat(band);
        if (!Number.isNaN(bandNum)) {
          recordAttempt({
            module: "writing",
            band: bandNum,
            label: `${taskType === "task1" ? "Task 1" : "Task 2"} — ${topic.trim().slice(0, 60) || "Untitled"}`,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Writing Evaluator</h2>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1">Writing Examiner Pro</Badge>
      </div>

      <div className="space-y-8 pb-32">
        {/* Input Column */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 space-y-10 border-white/5 bg-white/[0.02]">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Task Type Selection */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Practice Mode</Label>
              <div className="flex gap-4">
                <Button 
                  variant={taskType === "task1" ? "default" : "outline"}
                  className="flex-1 rounded-2xl h-14 font-black text-xs uppercase tracking-widest"
                  onClick={() => setTaskType("task1")}
                >Task 1 (Report)</Button>
                <Button 
                  variant={taskType === "task2" ? "default" : "outline"}
                  className="flex-1 rounded-2xl h-14 font-black text-xs uppercase tracking-widest"
                  onClick={() => setTaskType("task2")}
                >Task 2 (Essay)</Button>
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Topic / Writing Prompt</Label>
              <Input 
                placeholder="Paste your practice question or topic here..."
                className="bg-white/5 border-white/10 h-16 rounded-2xl px-6 text-lg"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Task 1 Specific Inputs - Stacked Vertically */}
            {taskType === "task1" && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Data Type</Label>
                  <Select value={visualType} onValueChange={setVisualType}>
                    <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl px-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10">
                      {FALLBACK_TASK1_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Visual Evidence</Label>
                  {!base64Image ? (
                    <div className="relative group cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="h-20 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all bg-white/5 group-hover:border-primary/40">
                        <ImageIcon className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Attach Source Image (Optional)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-32 rounded-2xl overflow-hidden group border border-white/10">
                      <img src={base64Image} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" onClick={() => setBase64Image(null)} className="text-red-400 font-bold uppercase text-xs">Remove Image</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Textarea */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Your Practice Draft</Label>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] text-indigo-400 border-indigo-400/20">{essay.trim() ? essay.trim().split(/\s+/).length : 0} Words</Badge>
                </div>
              </div>
              <Textarea 
                placeholder="Type or paste your answer here..."
                className="min-h-[400px] bg-white/5 border-white/10 rounded-2xl p-8 text-lg leading-relaxed focus:ring-2 focus:ring-emerald-500/20"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 rounded-[2rem] font-black text-2xl shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
              disabled={isAnalyzing || !topic.trim() || !essay.trim()}
              onClick={handleEvaluate}
            >
              {isAnalyzing ? <><Loader2 className="mr-3 h-8 w-8 animate-spin" /> EXAMINING DRAFT...</> : <><Zap className="mr-3 h-8 w-8" /> COMPLETE EVALUATION</>}
            </Button>
          </div>
        </div>

        {/* Traditional 4 Pillars Evaluation UI */}
        <AnimatePresence>
          {evaluation && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               {/* Overall Band Section */}
               <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-8 py-4">
                  <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Estimated Overall Band</span>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-emerald-500/40">
                    {evaluation.band}
                  </div>
                </div>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {evaluation.pillars.map((pillar, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-card border-none bg-white/[0.03] h-full overflow-hidden flex flex-col group hover:ring-2 hover:ring-white/20 transition-all shadow-2xl">
                      <CardContent className="p-8 space-y-6 flex-1">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                             <div className={`p-2 rounded-lg ${pillar.bg} inline-block`}>
                                <pillar.icon className={`w-5 h-5 ${pillar.color}`} />
                             </div>
                             <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{pillar.title}</h4>
                          </div>
                          <Badge className={`${pillar.color} ${pillar.bg} border-white/10 text-xl py-1 px-3 rounded-lg font-black`}>{pillar.score}</Badge>
                        </div>
                        <div className="text-sm text-slate-300 leading-relaxed min-h-[140px] prose prose-invert prose-sm prose-p:leading-relaxed prose-strong:text-white marker:text-primary custom-markdown">
                          <Markdown>{pillar.content}</Markdown>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Strategic Advice */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <Card className="lg:col-span-2 glass-card border-none bg-indigo-600/5 relative overflow-hidden group">
                  <CardContent className="p-12 relative z-10 space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
                          <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-2xl font-black text-white tracking-tight">Strategic Advice</h4>
                     </div>
                     <div className="text-lg text-indigo-100/70 leading-relaxed markdown-body prose prose-invert max-w-none prose-ul:list-disc custom-markdown">
                        <Markdown>{evaluation.improvements}</Markdown>
                     </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                  <Card className="flex-1 glass-card border-none bg-emerald-500/5 p-8 flex flex-col items-center justify-center text-center group transition-all hover:bg-emerald-500/10 shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/40">
                       <Sparkles className="w-8 h-8 text-emerald-400 group-hover:scale-125 transition-transform" />
                    </div>
                    <h5 className="text-xl font-bold text-white mb-2">Master This Topic</h5>
                    <p className="text-slate-400 text-sm mb-6">Unlock a Band 8.5+ model response for this exact prompt to study elite patterns.</p>
                    <Button 
                      className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl"
                      onClick={() => onGetModelAnswer(topic)}
                    >
                      See Model Answer
                    </Button>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button 
       variant="ghost" 
       size="sm" 
       className="h-8 w-8 hover:bg-white/10"
       onClick={() => {
         navigator.clipboard.writeText(text);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
       }}
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40" />}
    </Button>
  );
}

// 2. SAMPLE ANSWER
function SampleHub({ onBack, defaultTopic = "" }: { onBack: () => void, defaultTopic?: string }) {
  const [step, setStep] = useState<"select" | "input">("select");
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [topic, setTopic] = useState(defaultTopic);
  const [visualType, setVisualType] = useState("Line Graph");
  const [task2Category, setTask2Category] = useState("Opinion (Agree/Disagree)");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [samples, setSamples] = useState<{ band: string; content: string }[] | null>(null);

  const handleSelectTask = (type: "task1" | "task2") => {
    setTaskType(type);
    setStep("input");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSamples = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setSamples(null);
    try {
      const prompt = `Act as an Expert IELTS Examiner (British Council/IDP Style). Generate EXACTLY three sample answers for this Task ${taskType === "task1" ? "1 Report" : "2 Essay"}.
      ${taskType === "task1" ? `Data Type: ${visualType}.` : `Essay Category: ${task2Category}.`}
      Topic: ${topic}
      ${taskType === "task1" && base64Image ? "AN IMAGE OF THE DATA SOURCE IS PROVIDED. ANALYZE IT ACCURATELY TO ENSURE THE SAMPLES REFLECT THE REAL DATA." : ""}

      STRICT REQUIREMENTS:
      - For Task 2: Answers MUST be 260-320 words. Follow the standard structure: Introduction (Paraphrase + Thesis), Body Paragraph 1 (Point + Support + Example), Body Paragraph 2 (Point + Support + Example), and Conclusion.
      - For Task 1: Answers MUST be 160-200 words. Include a clear overview and detailed data comparison.
      - DO NOT include any introductory or concluding meta-commentary, explanations, or 'Key Vocabulary' sections. 
      - Output ONLY the response text itself using the markers below.

      [BAND_6]: (Generate a realistic Band 6.0 level response. It should be correct but lack sophisticated range.)
      [BAND_7]: (Generate a Band 7.5 level response with good range and coherent paragraphing.)
      [BAND_8+]: (Generate a flawess Band 8.5-9.0 model answer with high-level lexical precision and complex structures.)`;

      const response = await generateIELTSResponse(prompt, 0.7, taskType === "task1" ? (base64Image || undefined) : undefined);
      
      if (response) {
        // Robust regex to handle variations in AI output formatting
        const band6Match = response.match(/\[BAND_6\][*\s:]*([\s\S]*?)(?=\[BAND_7\]|$)/i);
        const band7Match = response.match(/\[BAND_7\][*\s:]*([\s\S]*?)(?=\[BAND_8\+\]|$)/i);
        const band8Match = response.match(/\[BAND_8\+\][*\s:]*([\s\S]*)/i);

        const parsedSamples = [
          { band: "6.0", content: band6Match ? band6Match[1].trim() : "" },
          { band: "7.5", content: band7Match ? band7Match[1].trim() : "" },
          { band: "8+", content: band8Match ? band8Match[1].trim() : "" }
        ];

        setSamples(parsedSamples.filter(s => s.content.length > 50));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={step === "input" ? () => { setStep("select"); setSamples(null); } : onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 w-4 h-4" /> {step === "input" ? "Back to Choice" : "Back to Tools"}
          </Button>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Sample Answer</h2>
        </div>
        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1">Sample Answer Lab</Badge>
      </div>

      <AnimatePresence mode="wait">
        {step === "select" ? (
          <motion.div 
            key="select-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card 
              className="glass-card p-12 flex flex-col items-center text-center space-y-6 cursor-pointer hover:border-indigo-400/50 transition-all group border-white/5 bg-white/[0.02]"
              onClick={() => handleSelectTask("task1")}
            >
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tight">Task 1 Samples</h3>
                <p className="text-slate-500 text-base">Expert reports for Graphs, Charts & Diagrams.</p>
                <div className="pt-4">
                   <Button variant="outline" className="rounded-full border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">Select Task 1</Button>
                </div>
              </div>
            </Card>

            <Card 
              className="glass-card p-12 flex flex-col items-center text-center space-y-6 cursor-pointer hover:border-indigo-400/50 transition-all group border-white/5 bg-white/[0.02]"
              onClick={() => handleSelectTask("task2")}
            >
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tight">Task 2 Samples</h3>
                <p className="text-slate-500 text-base">Analytical essays across all categories.</p>
                <div className="pt-4">
                   <Button variant="outline" className="rounded-full border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">Select Task 2</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="input-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass-card rounded-[2.5rem] p-10 md:p-16 space-y-10 shadow-2xl relative overflow-hidden border-white/5 bg-white/[0.02]">
              <div className="text-center space-y-4 max-w-xl mx-auto">
                <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-indigo-500/50 underline-offset-8">
                  {taskType === "task1" ? "Task 1 Sample Answer" : "Task 2 Sample Answer"}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">Fill in the mandatory details to unlock examiner-level sample responses.</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-8">
                {taskType === "task1" ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Task 1 Title / Prompt</Label>
                      <Input 
                        placeholder="e.g., Energy consumption by fuel type in France..."
                        className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-medium focus:ring-2 focus:ring-indigo-500/20"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Visual Data Category</Label>
                        <Select value={visualType} onValueChange={setVisualType}>
                          <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl px-6">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-white/10">
                            {FALLBACK_TASK1_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Visual Source (Optional)</Label>
                        {!base64Image ? (
                          <div className="relative group cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="h-16 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 bg-white/5 group-hover:border-indigo-400 group-hover:bg-indigo-500/5 transition-all">
                              <ImageIcon className="w-5 h-5 text-white/30 group-hover:text-indigo-400" />
                              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Attach Graph</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-16 rounded-2xl overflow-hidden group border border-white/10">
                            <img src={base64Image} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" onClick={() => setBase64Image(null)} className="text-red-400 text-xs font-black uppercase">Replace</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Essay Type / Question Category</Label>
                      <Select value={task2Category} onValueChange={setTask2Category}>
                        <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10">
                          <SelectItem value="Opinion (Agree/Disagree)">Opinion (Agree/Disagree)</SelectItem>
                          <SelectItem value="Discussion (Both Views)">Discussion (Both Views)</SelectItem>
                          <SelectItem value="Advantages & Disadvantages">Advantages & Disadvantages</SelectItem>
                          <SelectItem value="Problem & Solution">Problem & Solution</SelectItem>
                          <SelectItem value="Double Question">Double Question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Full Essay Topic / Title</Label>
                      <Input 
                        placeholder="e.g., Robots are becoming essential in modern industry..."
                        className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-medium focus:ring-2 focus:ring-indigo-500/20"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 rounded-3xl font-black text-2xl shadow-2xl shadow-indigo-600/30 active:scale-[0.98] transition-all"
                  onClick={handleGenerateSamples}
                  disabled={isGenerating || !topic.trim()}
                >
                  {isGenerating ? <><Loader2 className="animate-spin w-8 h-8 mr-3" /> ANALYZING PARAMETERS...</> : "GENERATE MODELS"}
                </Button>
              </div>
            </div>

            {samples && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {samples.map((sample, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass-card border-none h-full flex flex-col group overflow-hidden hover:ring-2 hover:ring-indigo-500/30 transition-all shadow-2xl bg-white/[0.03]">
                      <div className={`h-2 w-full ${sample.band === '8+' ? 'bg-emerald-500' : sample.band === '7.5' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                      <CardContent className="p-8 space-y-6 flex-1 flex flex-col pt-6">
                        <div className="flex justify-between items-center pb-6 border-b border-white/5">
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quality Profile</span>
                              <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-white/10 text-white/40 font-bold bg-white/5">
                                {sample.content.trim() ? sample.content.trim().split(/\s+/).length : 0} Words
                              </Badge>
                            </div>
                            <span className={`text-4xl font-black tracking-tighter ${sample.band === '8+' ? 'text-emerald-400' : sample.band === '7.5' ? 'text-indigo-400' : 'text-amber-400'}`}>
                              BAND {sample.band}
                            </span>
                          </div>
                          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                            <CopyButton text={sample.content} />
                          </div>
                        </div>
                        <div className="flex-1 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed text-slate-300 markdown-body custom-markdown">
                          <Markdown>{sample.content}</Markdown>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// 3. PARAPHRASE TOOL
function ParaphraseTool({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleParaphrase = async () => {
    setLoading(true);
    try {
      const resp = await generateIELTSResponse(`Paraphrase this text for IELTS Writing to achieve high Lexical Resource scores:\n\n"${input}"`, 0.8);
      setOutput(resp);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Tools
          </Button>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Paraphrase Engine</h2>
        </div>
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-4 py-1">Lexical Booster</Badge>
      </div>
      <div className="glass-card rounded-[2.5rem] p-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Original Text</Label>
            <Textarea 
              className="min-h-[250px] bg-white/5 border-white/10 rounded-2xl p-6"
              placeholder="Paste sentence or paragraph..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">AI Refined Version</Label>
            <div className="min-h-[250px] bg-white/5 border-white/10 rounded-2xl p-6 prose prose-invert prose-sm">
                {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20 opacity-20" /> : <Markdown>{output}</Markdown>}
            </div>
          </div>
        </div>
        <Button className="w-full h-16 bg-amber-600 hover:bg-amber-500 rounded-2xl font-black text-xl" onClick={handleParaphrase} disabled={loading || !input.trim()}>
          Transform Selection
        </Button>
      </div>
    </motion.div>
  );
}

// 4. GRAMMAR GUARD
function GrammarGuard({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [mistakes, setMistakes] = useState<{
    type: string;
    original: string;
    correction: string;
    explanation: string;
  }[] | null>(null);
  const [generalAdvice, setGeneralAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFix = async () => {
    setLoading(true);
    setMistakes(null);
    setGeneralAdvice("");
    try {
      const prompt = `Act as an IELTS Writing Expert. Conduct a deep audit of the text below for Grammar, Punctuation, and Spelling errors.
      
      For EACH mistake, use this EXACT format:
      [TYPE]: (Grammar | Punctuation | Spelling | Range)
      [ORIGINAL]: (The specific snippet with the error)
      [CORRECTION]: (The corrected version)
      [EXPLANATION]: (Brief rule explanation)
      [END_MISTAKE]

      Finally, provide a [GENERAL_ADVICE] section with a summary of the student's weaknesses.
      
      Text:\n"${input}"`;

      const resp = await generateIELTSResponse(prompt, 0.2);
      
      if (resp) {
        const mistakeBlocks = resp.split("[END_MISTAKE]");
        const parsedMistakes = mistakeBlocks.map(block => {
          const type = block.match(/\[TYPE\]:\s*(.*)/)?.[1] || "";
          const original = block.match(/\[ORIGINAL\]:\s*(.*)/)?.[1] || "";
          const correction = block.match(/\[CORRECTION\]:\s*(.*)/)?.[1] || "";
          const explanation = block.match(/\[EXPLANATION\]:\s*(.*)/)?.[1] || "";
          return { type, original, correction, explanation };
        }).filter(m => m.original && m.correction);

        const adviceMatch = resp.match(/\[GENERAL_ADVICE\]:\s*([\s\S]*)/);
        setMistakes(parsedMistakes);
        setGeneralAdvice(adviceMatch ? adviceMatch[1].trim() : "Focus on sentence variety and subject-verb agreement.");
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Tools
          </Button>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Grammar Guard AI</h2>
        </div>
        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-4 py-1">Mistake Auditor</Badge>
      </div>

      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 space-y-10 border-white/5 bg-white/[0.02]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
            <Highlighter className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-4xl font-black text-white tracking-tight uppercase">Sentence Audit</h3>
          <p className="text-slate-500 text-base font-medium">Paste your writing to identify and resolve structural weaknesses.</p>
        </div>

        <div className="space-y-6">
          <Textarea 
            className="min-h-[300px] bg-white/5 border-white/10 rounded-[1.5rem] p-8 text-lg leading-relaxed focus:ring-2 focus:ring-rose-500/20 transition-all placeholder:text-white/10"
            placeholder="e.g., Firstly, the graph illustrate that there is a significant increase in the amount of..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            className="w-full h-20 bg-rose-600 hover:bg-rose-500 rounded-[2rem] font-black text-2xl shadow-2xl shadow-rose-600/20 active:scale-[0.98] transition-all" 
            onClick={handleFix} 
            disabled={loading || !input.trim()}
          >
            {loading ? <><Loader2 className="animate-spin w-8 h-8 mr-3" /> ANALYZING GRAMMAR...</> : "RUN DEEP AUDIT"}
          </Button>
        </div>

        <AnimatePresence>
          {mistakes && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-3 px-1">
                   <XCircle className="w-5 h-5 text-rose-400" />
                   <h4 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Detected Issues ({mistakes.length})</h4>
                </div>
                {mistakes.map((mistake, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-none bg-white/[0.03] overflow-hidden group hover:bg-white/[0.05] transition-all">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-12">
                          <div className="md:col-span-1 bg-rose-500/10 flex items-center justify-center p-4">
                            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-widest text-rose-400/60">
                              {mistake.type}
                            </span>
                          </div>
                          <div className="md:col-span-11 p-8 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Original</span>
                                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-white italic font-medium">
                                  "{mistake.original}"
                                </div>
                              </div>
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Corrected</span>
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-50 font-bold">
                                  {mistake.correction}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                               <div className="mt-1"><BrainCircuit className="w-4 h-4 text-indigo-400" /></div>
                               <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                 <strong className="text-white">The Rule:</strong> {mistake.explanation}
                               </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {generalAdvice && (
                <Card className="border-none bg-indigo-500/10 p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Zap className="w-24 h-24 text-indigo-400" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-black text-white tracking-tight">Examiner's General Advice</h4>
                    </div>
                    <div className="text-lg text-emerald-50/70 leading-relaxed font-medium prose prose-invert max-w-none">
                      <Markdown>{generalAdvice}</Markdown>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
