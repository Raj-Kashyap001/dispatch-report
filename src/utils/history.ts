import type { HistoryEntry } from "../types/report";

const STORAGE_KEY = "dispatch-history";
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((e) => e && typeof e.timestamp === "number" && Array.isArray(e.rows))
          .sort((a, b) => b.timestamp - a.timestamp);
      }
    }
  } catch {}
  return [];
}

export function addHistory(
  entry: Omit<HistoryEntry, "id" | "timestamp">
): HistoryEntry {
  const full: HistoryEntry = {
    ...entry,
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
  try {
    const history = [full, ...getHistory()].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
  return full;
}

export function deleteHistoryEntry(id: string): void {
  try {
    const history = getHistory().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} at ${time}`;
}
