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
  "NCL Jaypee Adani",
  "CCL Jaypee Adani",
  "Sanvijay Steel",
  "Hind Logistics",
  "Shyam Buildcon",
  "ACC Sulliyari",
  "Ambuja Bhatapara",
  "ACC Chanda Maratha",
  "ACC Sanghi Cement",
  "ACC Thermal Power",
  "ACC Ambuja Nagar",
  "ACC Kymore_Tikariya_Ametha",
  "ACC Jamul_Lakheri",
  "ACC Panipat",
  "Marwar Cement",
  "Orient Cement",
  "ACC Rajdhar",
  "ACC Damodar",
  "Sanghi clinker",
  "Modinagar clinker",
  "Mahan Energen",
  "Korba Jairamnagar",
  "JP Paras",
];

export function getAccounts(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = [...DEFAULT_ACCOUNTS];
        parsed.forEach((a) => {
          if (!merged.includes(a)) merged.push(a);
        });
        return merged;
      }
    }
  } catch {}
  return [...DEFAULT_ACCOUNTS];
}

export function saveAccounts(accounts: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}
