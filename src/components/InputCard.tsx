import { useState, type RefObject } from "react";
import CustomDatePicker from "./CustomDatePicker";
import { extractDateFromFilename } from "../utils/date";

interface InputCardProps {
  reportDate: string;
  onDateChange: (date: string) => void;
  csvRef: RefObject<HTMLInputElement | null>;
  excelRef: RefObject<HTMLInputElement | null>;
  shift: string;
  onShiftChange: (shift: string) => void;
}

const InputCard = ({
  reportDate,
  onDateChange,
  csvRef,
  excelRef,
  shift,
  onShiftChange,
}: InputCardProps) => {
  const [csvName, setCsvName] = useState("");
  const [excelName, setExcelName] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const extracted = extractDateFromFilename(file.name);
    if (extracted) onDateChange(extracted);
  };

  return (
    <div id="input-card">
      <div className="field-group inline-field date-shift-row">
        <div className="date-field">
          <label>Report For Date</label>
          <CustomDatePicker value={reportDate} onChange={onDateChange} />
        </div>
        <div className="shift-field">
          <label>Shift</label>
          <div className="shift-radios">
            {(["A", "B", "C"] as const).map((s) => (
              <label key={s} className="shift-radio">
                <input
                  type="radio"
                  name="shift"
                  value={s}
                  checked={shift === s}
                  onChange={() => onShiftChange(s)}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {shift === "C" && (
        <div className="shift-warning">Shift C is not implemented yet</div>
      )}

      <div className="field-group">
        <label>Job Order Report (CSV)</label>
        <div
          className="file-picker"
          onClick={() => csvRef.current?.click()}
        >
          <i className="fa-solid fa-cloud-arrow-up file-picker-icon" />
          <span
            className={`file-picker-name ${!csvName ? "empty" : ""}`}
          >
            {csvName || "No file selected"}
          </span>
          <span className="file-picker-browse">Browse</span>
          <input
            type="file"
            accept=".csv"
            ref={csvRef}
            onChange={(e) => handleFileChange(e, setCsvName)}
            hidden
          />
        </div>
      </div>

      <div className="field-group">
        <label>Alerts Report (Excel)</label>
        <div
          className="file-picker"
          onClick={() => excelRef.current?.click()}
        >
          <i className="fa-solid fa-cloud-arrow-up file-picker-icon" />
          <span
            className={`file-picker-name ${!excelName ? "empty" : ""}`}
          >
            {excelName || "No file selected"}
          </span>
          <span className="file-picker-browse">Browse</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={excelRef}
            onChange={(e) => handleFileChange(e, setExcelName)}
            hidden
          />
        </div>
      </div>
    </div>
  );
};

export default InputCard;
