import { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import type { MineReportRow, AlertSummary } from "../types/report";
import { toDisplayDate } from "../utils/date";

interface ReportTableProps {
  data: MineReportRow[];
  selectedDate: string;
  accountName: string;
  shift: string;
  alertSummary: AlertSummary | null;
}

type NumericField = Omit<MineReportRow, "mines">;

const NUMERIC_FIELDS: (keyof NumericField)[] = [
  "dispatchVehicles",
  "reachedInPlant",
  "balanceToVehicle",
  "routeDeviations",
  "redArea",
  "powerCuts",
  "oldVehicle",
];

const ReportTable = ({ data, selectedDate, accountName, shift, alertSummary }: ReportTableProps) => {
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
      redArea: acc.redArea + row.redArea,
      powerCuts: acc.powerCuts + row.powerCuts,
      oldVehicle: acc.oldVehicle + row.oldVehicle,
    }),
    {
      dispatchVehicles: 0,
      reachedInPlant: 0,
      balanceToVehicle: 0,
      routeDeviations: 0,
      redArea: 0,
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

  return (
    <>
      <div id="output-card" ref={cardRef}>
        <h2>Dispatch Report</h2>
        <h3>
          {accountName} (SHIFT {shift}) {displayDate}
        </h3>

        <table>
          <thead>
            <tr>
              <th>MINES</th>
              <th>DISPATCH</th>
              <th>REACHED IN PLANT<br />{displayDate}</th>
              <th>BALANCE TO VEHICLE</th>
              <th>ROUTE DEVIATIONS</th>
              <th>RED AREA</th>
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
              <th>{total.redArea}</th>
              <th>{total.powerCuts}</th>
              <th>{total.oldVehicle}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="btn-row">
        <button className="icon-btn" onClick={handleCopy}>
          <i className="fa-solid fa-copy" />
          Copy
          <span className="keybind-hint">Ctrl+Shift+C</span>
        </button>
        <button className="icon-btn" onClick={handleDownload}>
          <i className="fa-solid fa-download" />
          Download
          <span className="keybind-hint">Ctrl+Shift+S</span>
        </button>
      </div>

      {alertSummary && (
        <div className="alert-summary">
          <span>
            <i className="fa-solid fa-triangle-exclamation" /> Alert Summary:
          </span>
          <span>Total Alerts: <strong>{alertSummary.totalAlerts}</strong></span>
          <span>Acknowledged: <strong>{alertSummary.acknowledged}</strong></span>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default ReportTable;
