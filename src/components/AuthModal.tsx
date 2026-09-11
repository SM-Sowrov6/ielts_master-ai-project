import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface DemoUser {
  name: string;
  email: string;
  password?: string;
}

const USER_KEY = "ielts-master-demo-user";
const SESSION_KEY = "ielts-master-demo-session";
const REMEMBER_KEY = "ielts-master-demo-remember";

function readStoredUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

function getActiveSession(): DemoUser | null {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) ??
      sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

interface AuthModalProps {
  onAuthenticated: (user: DemoUser) => void;
}

export default function AuthModal({ onAuthenticated }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_KEY);
    setRemember(remembered !== "false");
  }, []);

  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  function persistSession(user: DemoUser) {
    const safeUser = { name: user.name, email: user.email };

    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.setItem(REMEMBER_KEY, "true");
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      localStorage.removeItem(SESSION_KEY);
      localStorage.setItem(REMEMBER_KEY, "false");
    }

    onAuthenticated(safeUser);
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "register") {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 450));

      const user: DemoUser = {
        name: name.trim(),
        email: normalizedEmail,
      };

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      persistSession(user);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));

    // Frontend-only demo authentication:
    // if a user registered on this browser, use their saved profile.
    // Otherwise, accept any valid email/password and create a local profile.
    const currentUser = readStoredUser();
    const user: DemoUser = currentUser
      ? {
          name: currentUser.name,
          email: normalizedEmail,
        }
      : {
          name:
            normalizedEmail
              .split("@")[0]
              .replace(/[._-]+/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "IELTS User",
          email: normalizedEmail,
        };

    if (currentUser && currentUser.email !== normalizedEmail) {
      // Keep the flow forgiving for a classroom/demo environment.
      // The login remains frontend-only and does not contact a backend.
      user.name =
        normalizedEmail
          .split("@")[0]
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "IELTS User";
    }

    persistSession(user);
    setIsSubmitting(false);
  }

  const isRegister = mode === "register";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#08080b]/95 shadow-[0_30px_100px_rgba(0,0,0,0.75)]"
        >
          <div className="pointer-events-none absolute -top-28 -left-20 h-56 w-56 rounded-full bg-primary/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-64 w-64 rounded-full bg-violet-600/15 blur-[100px]" />

          <div className="relative p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 shadow-lg shadow-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-lg font-black tracking-tight text-white">
                    IELTS MASTER
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-indigo-400">
                    AI-Powered Exam Prep
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-500">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-display text-3xl font-black tracking-tight text-white">
                {isRegister ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                {isRegister
                  ? "Start your personalized IELTS preparation journey."
                  : "Sign in to continue your personalized IELTS journey."}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  !isRegister
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  isRegister
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-10 text-sm text-white placeholder:text-slate-600 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-10 text-sm text-white placeholder:text-slate-600 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-10 pr-11 text-sm text-white placeholder:text-slate-600 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-10 text-sm text-white placeholder:text-slate-600 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-3 text-xs font-semibold text-rose-300"
                >
                  {error}
                </motion.div>
              )}

              {!isRegister && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-500">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-3.5 w-3.5 accent-indigo-500"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setError("For this preview, use any valid email and a 6+ character password.")
                    }
                    className="text-xs font-bold text-primary transition-colors hover:text-indigo-300"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20 transition-all hover:from-indigo-400 hover:to-violet-500 disabled:opacity-60"
              >
                {isSubmitting ? (
                  "Please wait..."
                ) : (
                  <>
                    {isRegister ? "Create Account" : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs font-medium text-slate-600">
                {isRegister ? "Already have an account?" : "New to IELTS MASTER?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode(isRegister ? "login" : "register")}
                  className="font-bold text-primary transition-colors hover:text-indigo-300"
                >
                  {isRegister ? "Sign in" : "Create account"}
                </button>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/5 pt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">
              <Check className="h-3 w-3 text-primary/60" />
              Personalized IELTS practice workspace
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function getSessionUser(): DemoUser | null {
  return getActiveSession();
}

export function getUserInitials(name: string) {
  return getInitials(name);
}

export function logoutDemoUser() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
