export const toDateString = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const today = toDateString(new Date());

export const toDDMMYYYY = (dateStr: string): string => {
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}-${mm}-${yyyy}`;
};

export const toDisplayDate = (dateStr: string): string => toDDMMYYYY(dateStr);

export function extractDateFromFilename(filename: string): string | null {
  const ddmmmyyyy = filename.match(/(\d{2})[-._](\d{2})[-._](\d{4})/);
  if (ddmmmyyyy) {
    const [, dd, mm, yyyy] = ddmmmyyyy;
    const m = parseInt(mm, 10);
    const d = parseInt(dd, 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  const yyyymmdd = filename.match(/(\d{4})[-._](\d{2})[-._](\d{2})/);
  if (yyyymmdd) {
    const [, yyyy, mm, dd] = yyyymmdd;
    const m = parseInt(mm, 10);
    const d = parseInt(dd, 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  return null;
}

export function getCurrentShift(): string {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes >= 360 && minutes < 870) return "A";
  if (minutes >= 870 && minutes < 1350) return "B";
  return "C";
}

export function getPreviousDay(dateStr: string): string {
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  d.setDate(d.getDate() - 1);
  return toDateString(d);
}
