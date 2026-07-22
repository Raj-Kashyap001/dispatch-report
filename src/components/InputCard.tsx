import type { RefObject } from "react";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import { extractDateFromFilename } from "../utils/date";

interface InputCardProps {
  reportDate: string;
  onDateChange: (date: string) => void;
  csvRef: RefObject<HTMLInputElement | null>;
  excelRef: RefObject<HTMLInputElement | null>;
  shift: string;
  onShiftChange: (shift: string) => void;
}

const SHIFT_HINTS: Record<string, string> = {
  A: "06:00 — 14:00",
  B: "14:00 — 22:00",
  C: "22:00 — 06:00",
};

const InputCard = ({
  reportDate,
  onDateChange,
  csvRef,
  excelRef,
  shift,
  onShiftChange,
}: InputCardProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const extracted = extractDateFromFilename(file.name);
    if (extracted) onDateChange(extracted);
  };

  return (
    <div id="input-card">
      <div className="field-group inline-field">
        <label>Report For Date</label>
        <CustomDatePicker value={reportDate} onChange={onDateChange} />
      </div>

      <div className="field-group inline-field">
        <label>Shift</label>
        <CustomSelect
          value={shift}
          options={["A", "B", "C"]}
          onChange={onShiftChange}
        />
        {shift === "C" ? (
          <span className="shift-hint warn">Not Implemented</span>
        ) : (
          <span className="shift-hint">{SHIFT_HINTS[shift]}</span>
        )}
      </div>

      <div className="field-group">
        <label>Job Order Report (CSV)</label>
        <input
          type="file"
          accept=".csv"
          ref={csvRef}
          onChange={handleFileChange}
          className="flat-file"
        />
      </div>

      <div className="field-group">
        <label>Alerts Report (Excel)</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={excelRef}
          onChange={handleFileChange}
          className="flat-file"
        />
      </div>
    </div>
  );
};

export default InputCard;
