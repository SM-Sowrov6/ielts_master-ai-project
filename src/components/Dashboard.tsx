import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { PenTool, Search, Headphones, Mic, ArrowLeft, Trash2, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getProgress,
  clearProgress,
  computeOverallBand,
  MODULE_LABELS,
  type ModuleKey,
  type ProgressEntry,
} from "@/src/lib/progress";

const MODULE_META: Record<ModuleKey, { icon: any; color: string; bg: string; border: string }> = {
  writing: { icon: PenTool, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  reading: { icon: Search, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  listening: { icon: Headphones, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  speaking: { icon: Mic, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

const MODULES: ModuleKey[] = ["writing", "reading", "listening", "speaking"];

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function Dashboard({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<ProgressEntry[]>(() => getProgress());

  const overallBand = useMemo(() => computeOverallBand(entries), [entries]);

  const perModule = useMemo(() => {
    return MODULES.map((mod) => {
      const modEntries = entries.filter((e) => e.module === mod);
      const scored = modEntries.filter((e) => e.band !== null) as (ProgressEntry & { band: number })[];
      const latest = scored[0]?.band ?? null;
      const avg = scored.length ? scored.reduce((s, e) => s + e.band, 0) / scored.length : null;
      return { module: mod, attempts: modEntries.length, latest, avg };
    });
  }, [entries]);

  const focusArea = useMemo(() => {
    const withAvg = perModule.filter((m) => m.avg !== null);
    if (withAvg.length === 0) return null;
    return withAvg.reduce((lowest, m) => (m.avg! < lowest.avg! ? m : lowest));
  }, [perModule]);

  function handleClear() {
    clearProgress();
    setEntries([]);
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-3xl font-black text-white">My Progress</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Unified Dashboard</p>
          </div>
        </div>

        <Card className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-2xl font-black text-white">No practice recorded yet</h3>
          <p className="text-slate-500 max-w-md mx-auto font-medium">
            Complete a Writing evaluation, a Reading test, a Listening test, or a Speaking session, and it'll show up here automatically.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-3xl font-black text-white">My Progress</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Unified Dashboard</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleClear}
          className="text-slate-500 hover:text-rose-400 font-bold text-xs uppercase tracking-widest gap-2"
        >
          <Trash2 className="w-4 h-4" /> Clear history
        </Button>
      </div>

      {/* Overall band + focus area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 flex items-center gap-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Estimated Overall Band</p>
            <p className="text-7xl font-black text-white tracking-tighter">{overallBand !== null ? overallBand.toFixed(1) : "—"}</p>
            <p className="text-xs text-slate-500 font-medium">
              {overallBand !== null ? "Average of your latest band per module" : "Complete at least one scored module"}
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {perModule.map(({ module, latest }) => {
              const meta = MODULE_META[module];
              return (
                <div key={module} className={`p-4 rounded-2xl border ${meta.border} ${meta.bg} space-y-1`}>
                  <div className="flex items-center gap-2">
                    <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{MODULE_LABELS[module]}</span>
                  </div>
                  <p className={`text-2xl font-black ${meta.color}`}>{latest !== null ? latest.toFixed(1) : "—"}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <Target className="w-4 h-4" /> Focus Area
          </div>
          {focusArea ? (
            <>
              <p className="text-2xl font-black text-white">{MODULE_LABELS[focusArea.module]}</p>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Your lowest average band so far ({focusArea.avg!.toFixed(1)}). Spend extra practice time here.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500 font-medium">Not enough scored attempts yet to tell.</p>
          )}
        </Card>
      </div>

      {/* Per-module attempt counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {perModule.map(({ module, attempts, avg }) => {
          const meta = MODULE_META[module];
          return (
            <Card key={module} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3">
              <div className={`w-10 h-10 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center`}>
                <meta.icon className={`w-5 h-5 ${meta.color}`} />
              </div>
              <p className="text-sm font-bold text-white">{MODULE_LABELS[module]}</p>
              <p className="text-xs text-slate-500 font-medium">
                {attempts} attempt{attempts === 1 ? "" : "s"}
                {avg !== null ? ` · avg ${avg.toFixed(1)}` : ""}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Recent attempts */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Recent Activity</p>
        <div className="space-y-3">
          {entries.slice(0, 20).map((entry, i) => {
            const meta = MODULE_META[entry.module];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
              >
                <Card className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center shrink-0`}>
                    <meta.icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{entry.label}</p>
                    <p className="text-xs text-slate-500 font-medium">{timeAgo(entry.timestamp)}</p>
                  </div>
                  {entry.band !== null ? (
                    <Badge className={`${meta.bg} ${meta.color} border-white/10 text-sm px-3 py-1 rounded-lg font-black shrink-0`}>
                      Band {entry.band.toFixed(1)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/10 text-white/40 text-[10px] uppercase tracking-widest shrink-0">
                      Session logged
                    </Badge>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
