import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import type { MineReportRow } from "../types/report";
import { toDisplayDate } from "../utils/date";

interface ReportTableProps {
  data: MineReportRow[];
  selectedDate: string;
}

const ReportTable = ({ data, selectedDate }: ReportTableProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState("");

  const total = data.reduce(
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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const captureCanvas = async () => {
    const el = cardRef.current;
    if (!el) return null;
    if (actionsRef.current) actionsRef.current.style.display = "none";
    const canvas = await html2canvas(el, { backgroundColor: "#000", scale: 2 });
    if (actionsRef.current) actionsRef.current.style.display = "";
    return canvas;
  };

  const handleCopy = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      showToast("Copied to clipboard!");
    }, "image/png");
  };

  const handleDownload = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `dispatch-report-${selectedDate}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div id="output-card" ref={cardRef}>
      <h2>Dispatch Report</h2>
      <h3>PIL (SHIFT B) {displayDate}</h3>

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
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.mines}</td>
              <td>{row.dispatchVehicles}</td>
              <td>{row.reachedInPlant}</td>
              <td>{row.balanceToVehicle}</td>
              <td>{row.routeDeviations}</td>
              <td>{row.haltsInGreyArea}</td>
              <td>{row.powerCuts}</td>
              <td>{row.oldVehicle}</td>
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

      <div className="report-actions" ref={actionsRef}>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleDownload}>Download</button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default ReportTable;
