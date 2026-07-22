export type FileType = "csv" | "excel";

const EXTENSIONS: Record<FileType, string[]> = {
  csv: ["csv"],
  excel: ["xlsx", "xls"],
};

export const validateFile = (file: File, type: FileType): boolean => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSIONS[type].includes(ext);
};
