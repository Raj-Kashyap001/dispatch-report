import type { RefObject } from "react";

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
}: InputCardProps) => (
  <div id="input-card">
    <div className="field-group">
      <label htmlFor="report-date">Report For Date</label>
      <input
        type="date"
        id="report-date"
        className="flat-input"
        value={reportDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>

    <div className="field-group">
      <label htmlFor="job-report">Job Order Report (CSV)</label>
      <input
        type="file"
        id="job-report"
        accept=".csv"
        ref={csvRef}
        className="flat-file"
      />
    </div>

    <div className="field-group">
      <label htmlFor="alert-report">Alerts Report (Excel)</label>
      <input
        type="file"
        id="alert-report"
        accept=".xlsx,.xls"
        ref={excelRef}
        className="flat-file"
      />
    </div>
  </div>
);

export default InputCard;
