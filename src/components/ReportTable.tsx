import type { MineReportRow } from "../types/report";
import { toDisplayDate } from "../utils/date";

interface ReportTableProps {
  data: MineReportRow[];
  selectedDate: string;
}

const ReportTable = ({ data, selectedDate }: ReportTableProps) => {
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

  return (
    <div id="output-card">
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
    </div>
  );
};

export default ReportTable;
