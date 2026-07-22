import type { RefObject } from "react";

interface InputCardProps {
  reportDate: string;
  onDateChange: (date: string) => void;
  csvRef: RefObject<HTMLInputElement | null>;
  excelRef: RefObject<HTMLInputElement | null>;
}

const InputCard = ({ reportDate, onDateChange, csvRef, excelRef }: InputCardProps) => (
  <div id="input-card">
    <div>
      <label htmlFor="report-date">Report For Date</label>
      <br />
      <input
        type="date"
        id="report-date"
        value={reportDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>

    <br />

    <div>
      <label htmlFor="job-report">Select Job Order Report File (CSV)</label>
      <br />
      <input type="file" id="job-report" accept=".csv" ref={csvRef} />
    </div>

    <br />

    <div>
      <label htmlFor="alert-report">Select Alerts Report File (Excel)</label>
      <br />
      <input type="file" id="alert-report" accept=".xlsx,.xls" ref={excelRef} />
    </div>
  </div>
);

export default InputCard;
