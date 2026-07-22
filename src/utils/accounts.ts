const STORAGE_KEY = "dispatch-accounts";

const DEFAULT_ACCOUNTS = [
  "PIL",
  "Rungta Mines",
  "Meenakshi Energy Limited",
  "OSR SAPL",
  "Kalyani Logistics",
  "Vrisha Minerals",
  "Shri Metalliks Limited",
  "Rashmi Group",
  "Abhishek Roadlines",
  "JPL Dhule",
  "RKM Powergen",
];

export function getAccounts(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...DEFAULT_ACCOUNTS];
}

export function saveAccounts(accounts: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}
