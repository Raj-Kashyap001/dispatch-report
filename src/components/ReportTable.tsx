import { useRef } from "react";
import html2canvas from "html2canvas";
import type { MineReportRow } from "../types/report";
import { toDisplayDate } from "../utils/date";

interface ReportTableProps {
  data: MineReportRow[];
  selectedDate: string;
}

const ReportTable = ({ data, selectedDate }: ReportTableProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleCopy = async () => {
    const el = cardRef.current;
    if (!el) return;
    const html = el.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const text = el.innerText;
    const textBlob = new Blob([text], { type: "text/plain" });
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": blob,
        "text/plain": textBlob,
      }),
    ]);
  };

  const handleDownload = async () => {
    const el = cardRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: "#000", scale: 2 });
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

      <div className="report-actions">
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default ReportTable;
