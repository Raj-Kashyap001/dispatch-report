import type { RefObject } from "react";
import CustomDatePicker from "./CustomDatePicker";
import { extractDateFromFilename } from "../utils/date";

interface InputCardProps {
  reportDate: string;
  onDateChange: (date: string) => void;
  csvRef: RefObject<HTMLInputElement | null>;
  excelRef: RefObject<HTMLInputElement | null>;
}

const InputCard = ({
  reportDate,
  onDateChange,
  csvRef,
  excelRef,
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
