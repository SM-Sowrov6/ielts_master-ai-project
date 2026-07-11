export type ModuleKey = "writing" | "reading" | "listening" | "speaking";

export interface ProgressEntry {
  id: string;
  module: ModuleKey;
  label: string;
  band: number | null;
  timestamp: number;
}

const STORAGE_KEY = "ielts-master-progress";
const MAX_ENTRIES = 200;

function readAll(): ProgressEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: ProgressEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail silently, dashboard just stays empty.
  }
}

export function recordAttempt(entry: Omit<ProgressEntry, "id" | "timestamp">) {
  const entries = readAll();
  entries.push({ ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now() });
  writeAll(entries);
}

export function getProgress(): ProgressEntry[] {
  return readAll().sort((a, b) => b.timestamp - a.timestamp);
}

export function clearProgress() {
  writeAll([]);
}

export const MODULE_LABELS: Record<ModuleKey, string> = {
  writing: "Writing",
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking",
};

// Rounds to the nearest official IELTS half-band (e.g. 6.25 -> 6.5, 6.1 -> 6.0).
export function roundToIeltsBand(value: number): number {
  return Math.round(value * 2) / 2;
}

export function computeOverallBand(entries: ProgressEntry[]): number | null {
  const modules: ModuleKey[] = ["writing", "reading", "listening", "speaking"];
  const latestPerModule: number[] = [];
  for (const mod of modules) {
    const latest = entries.find((e) => e.module === mod && e.band !== null);
    if (latest && latest.band !== null) latestPerModule.push(latest.band);
  }
  if (latestPerModule.length === 0) return null;
  const avg = latestPerModule.reduce((sum, b) => sum + b, 0) / latestPerModule.length;
  return roundToIeltsBand(avg);
}
