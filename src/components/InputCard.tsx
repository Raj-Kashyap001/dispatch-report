import { useState, useCallback, type RefObject } from "react";
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
  const [csvDrag, setCsvDrag] = useState(false);
  const [excelDrag, setExcelDrag] = useState(false);

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

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      ref: RefObject<HTMLInputElement | null>,
      setName: (name: string) => void,
      accept: string
    ) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (accept.split(",").some((a) => a.trim().replace(".", "") === ext)) {
        setName(file.name);
        const extracted = extractDateFromFilename(file.name);
        if (extracted) onDateChange(extracted);
        if (ref.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          ref.current.files = dt.files;
        }
      }
    },
    [onDateChange]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
          className={`file-picker${csvDrag ? " drag-over" : ""}`}
          onClick={() => csvRef.current?.click()}
          onDragOver={onDragOver}
          onDragEnter={() => setCsvDrag(true)}
          onDragLeave={() => setCsvDrag(false)}
          onDrop={(e) => {
            setCsvDrag(false);
            handleDrop(e, csvRef, setCsvName, ".csv");
          }}
        >
          <i className="fa-solid fa-cloud-arrow-up file-picker-icon" />
          <span className={`file-picker-name ${!csvName ? "empty" : ""}`}>
            {csvName || "Drop CSV file here or click to browse"}
          </span>
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
          className={`file-picker${excelDrag ? " drag-over" : ""}`}
          onClick={() => excelRef.current?.click()}
          onDragOver={onDragOver}
          onDragEnter={() => setExcelDrag(true)}
          onDragLeave={() => setExcelDrag(false)}
          onDrop={(e) => {
            setExcelDrag(false);
            handleDrop(e, excelRef, setExcelName, ".xlsx,.xls");
          }}
        >
          <i className="fa-solid fa-cloud-arrow-up file-picker-icon" />
          <span className={`file-picker-name ${!excelName ? "empty" : ""}`}>
            {excelName || "Drop Excel file here or click to browse"}
          </span>
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
