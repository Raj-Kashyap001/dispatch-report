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
