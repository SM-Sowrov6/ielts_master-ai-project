import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  HelpCircle, 
  Globe,
  Compass,
  GraduationCap,
  Loader2
} from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { text: "How can I score Band 8 in Speaking?", icon: GraduationCap },
  { text: "Help me translate a Bengali sentence to English.", icon: Globe },
  { text: "How do I practice Writing on this website?", icon: Compass },
  { text: "Explain the difference between Band 6 and Band 7.", icon: HelpCircle },
];

export default function IELTSChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ielts_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (e) {
        console.error("Failed to parse chat history", e);
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ielts_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const initializeWelcomeMessage = () => {
    const welcome: Message = {
      id: "welcome",
      role: "model",
      text: "Hello! I am your **IELTS Master AI Tutor**. 🌟\n\nI am here to guide you to your target IELTS band score! I can help you with:\n- **Writing & Speaking guides** (scoring high bands, format, study plans)\n- **Reading & Listening strategies**\n- **How to use this website's tools** to practice effectively\n- **Language support** (translating sentences, proofreading, grammar, spelling, & vocabulary explanation)\n\nAsk me anything about IELTS or this website!",
      timestamp: new Date()
    };
    setMessages([welcome]);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      localStorage.removeItem("ielts_chat_history");
      initializeWelcomeMessage();
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Map history for API payload (excluding timestamps and IDs)
      const apiHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: apiHistory
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const botMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        text: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        text: "I'm sorry, I encountered an issue connecting to the IELTS AI servers. Please try again in a moment! Let's keep practicing.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="chatbot-fab"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border shadow-2xl transition-all focus:outline-none ${
            isOpen 
              ? "bg-zinc-900 border-white/20 text-white" 
              : "bg-primary border-primary/30 text-white hover:scale-110"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {/* Ambient Glow */}
          {!isOpen && (
            <span className="absolute -inset-0.5 bg-gradient-to-r from-primary to-violet-500 rounded-full blur opacity-40 animate-pulse" />
          )}
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 border-2 border-primary rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 border-2 border-primary rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[380px] sm:w-[440px] h-[600px] max-h-[calc(100vh-120px)] bg-zinc-950/95 border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between relative">
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center premium-glow">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">IELTS Master AI</h4>
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    AI Exam Coach &amp; Translator
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  title="Clear chat history"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
              {messages.map((msg) => {
                const isBot = msg.role === "model";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[85%] ${
                      isBot ? "self-start text-left" : "ml-auto flex-row-reverse text-right"
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        isBot
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-white/5 border-white/10 text-slate-300"
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed border ${
                        isBot
                          ? "bg-white/[0.02] border-white/5 text-slate-200 rounded-tl-sm"
                          : "bg-primary text-white border-primary/20 rounded-tr-sm"
                      }`}
                    >
                      {isBot ? (
                        <div className="text-left select-text whitespace-pre-wrap">
                          <Markdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-left">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-left">{children}</ol>,
                              li: ({ children }) => <li className="text-slate-300 mb-1">{children}</li>,
                              h1: ({ children }) => <h1 className="text-base font-bold text-white mt-3 mb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm font-bold text-white mt-3 mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-xs font-bold text-white mt-2 mb-1">{children}</h3>,
                              code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono text-primary-light">{children}</code>,
                            }}
                          >
                            {msg.text}
                          </Markdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap select-text">{msg.text}</p>
                      )}
                      
                      {/* Timestamp */}
                      <span className="block mt-1 text-[9px] opacity-40 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 max-w-[85%] self-start text-left animate-pulse">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl rounded-tl-sm text-sm text-slate-400 flex items-center gap-2">
                    <span>AI Master is drafting response...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (rendered if there is only 1 message or user wants quick prompts) */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 bg-black/30 border-t border-white/5 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-1">Quick prompts</p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTIONS.map((sug, idx) => {
                    const Icon = sug.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug.text)}
                        className="p-2 bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all rounded-xl text-left text-xs text-slate-300 flex flex-col justify-between min-h-[60px] cursor-pointer group"
                      >
                        <Icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform mb-1" />
                        <span className="line-clamp-2 leading-tight font-medium">{sug.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-zinc-950 border-t border-white/5 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about IELTS, scores, translation, or this site..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 text-sm text-white px-3.5 py-2.5 rounded-2xl transition-all focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-2xl bg-primary hover:bg-primary-hover disabled:bg-white/5 border border-primary/20 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
