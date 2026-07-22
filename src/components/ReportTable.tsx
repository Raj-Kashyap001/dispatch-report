import { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import type { MineReportRow } from "../types/report";
import { toDisplayDate } from "../utils/date";

interface ReportTableProps {
  data: MineReportRow[];
  selectedDate: string;
  accountName: string;
}

type NumericField = Omit<MineReportRow, "mines">;

const NUMERIC_FIELDS: (keyof NumericField)[] = [
  "dispatchVehicles",
  "reachedInPlant",
  "balanceToVehicle",
  "routeDeviations",
  "haltsInGreyArea",
  "powerCuts",
  "oldVehicle",
];

const ReportTable = ({ data, selectedDate, accountName }: ReportTableProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<MineReportRow[]>(data);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setRows(data);
  }, [data]);

  const total = rows.reduce(
    (acc, row) => ({
      dispatchVehicles: acc.dispatchVehicles + row.dispatchVehicles,
      reachedInPlant: acc.reachedInPlant + row.reachedInPlant,
      balanceToVehicle: acc.balanceToVehicle + row.balanceToVehicle,
      routeDeviations: acc.routeDeviations + row.routeDeviations,
      haltsInGreyArea: acc.haltsInGreyArea + row.haltsInGreyArea,
      powerCuts: acc.powerCuts + row.powerCuts,
      oldVehicle: acc.oldVehicle + row.oldVehicle,
    }),
    {
      dispatchVehicles: 0,
      reachedInPlant: 0,
      balanceToVehicle: 0,
      routeDeviations: 0,
      haltsInGreyArea: 0,
      powerCuts: 0,
      oldVehicle: 0,
    }
  );

  const displayDate = toDisplayDate(selectedDate);

  const handleCopy = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: "#000", scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setToast("Copied to clipboard!");
      } catch {
        setToast("Failed to copy");
      }
      setTimeout(() => setToast(""), 2000);
    }, "image/png");
  }, []);

  const handleDownload = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: "#000", scale: 2 });
    const link = document.createElement("a");
    link.download = `dispatch-report-${selectedDate}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [selectedDate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        handleCopy();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleCopy, handleDownload]);

  const handleCellEdit = (
    rowIndex: number,
    field: keyof NumericField,
    value: string
  ) => {
    const num = parseInt(value, 10);
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? { ...row, [field]: isNaN(num) ? 0 : num }
          : row
      )
    );
  };

  const CopyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" />
      <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

  return (
    <>
      <div id="output-card" ref={cardRef}>
        <h2>Dispatch Report</h2>
        <h3>
          {accountName} (SHIFT B) {displayDate}
        </h3>

        <table>
          <thead>
            <tr>
              <th>MINES</th>
              <th>DISPATCH</th>
              <th>REACHED IN PLANT {displayDate}</th>
              <th>BALANCE TO VEHICLE</th>
              <th>ROUTE DEVIATIONS</th>
              <th>HALTS IN GREY AREA</th>
              <th>POWER CUTS</th>
              <th>OLD VEHICLES</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.mines}</td>
                {NUMERIC_FIELDS.map((field) => (
                  <td key={field}>
                    <input
                      type="number"
                      className="editable-cell"
                      value={row[field]}
                      onChange={(e) =>
                        handleCellEdit(index, field, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>TOTAL</th>
              <th>{total.dispatchVehicles}</th>
              <th>{total.reachedInPlant}</th>
              <th>{total.balanceToVehicle}</th>
              <th>{total.routeDeviations}</th>
              <th>{total.haltsInGreyArea}</th>
              <th>{total.powerCuts}</th>
              <th>{total.oldVehicle}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="btn-row">
        <button className="icon-btn" onClick={handleCopy}>
          <CopyIcon />
          Copy
          <span className="keybind-hint">Ctrl+Shift+C</span>
        </button>
        <button className="icon-btn" onClick={handleDownload}>
          <DownloadIcon />
          Download
          <span className="keybind-hint">Ctrl+Shift+S</span>
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default ReportTable;
