import type { MineReportRow } from "../types/report";
import { toDDMMYYYY } from "./date";

type CSVRow = Record<string, string>;

const normalizeAlertType = (text: string): string => {
  const lower = text.toLowerCase().trim();
  if (/power\s*cut/.test(lower)) return "powerCut";
  if (/halt/.test(lower)) return "halt";
  if (/route\s*deviat/.test(lower)) return "routeDeviation";
  return "";
};

const parseExcelAlerts = (
  excelData: CSVRow[],
  mineName: string,
  csvDate: string
): { powerCuts: number; haltsInGreyArea: number; routeDeviations: number } => {
  const result = { powerCuts: 0, haltsInGreyArea: 0, routeDeviations: 0 };
  if (!excelData.length) return result;

  const columns = Object.keys(excelData[0]);

  const mineCol = columns.find((c) => /^Route Name$/i.test(c));
  const alertCol = columns.find((c) => /^Alert$/i.test(c));
  const dateCol = columns.find((c) => /^Date$/i.test(c));

  if (!mineCol || !alertCol) return result;

  const mineRows = excelData.filter((row) => {
    const val = (row[mineCol] ?? "").trim();
    if (val !== mineName && !val.includes(mineName) && !mineName.includes(val)) return false;
    if (dateCol) {
      const cellDate = (row[dateCol] ?? "").trim().slice(0, 10);
      if (cellDate !== csvDate) return false;
    }
    return true;
  });

  mineRows.forEach((row) => {
    const type = normalizeAlertType(row[alertCol] ?? "");
    if (type === "powerCut") result.powerCuts++;
    else if (type === "halt") result.haltsInGreyArea++;
    else if (type === "routeDeviation") result.routeDeviations++;
  });

  return result;
};

export const buildReportData = (
  csvData: CSVRow[],
  excelData: CSVRow[],
  selectedDate: string
): MineReportRow[] => {
  const csvDate = toDDMMYYYY(selectedDate);

  const mineNames = [
    ...new Set(csvData.map((row) => (row["Trip/Route/Name"] ?? "").trim())),
  ].filter(Boolean);

  return mineNames.map((mines) => {
    const mineTrips = csvData.filter(
      (row) => (row["Trip/Route/Name"] ?? "").trim() === mines
    );

    const dispatchVehicles = mineTrips.filter(
      (row) =>
        row["Start Date"] === csvDate &&
        (row["TRIP STATUS"] === "IN PROGRESS" ||
          row["TRIP STATUS"] === "COMPLETED")
    ).length;

    const reachedInPlant = mineTrips.filter(
      (row) =>
        row["TRIP STATUS"] === "COMPLETED" &&
        row["Arrival Date At Destination"] === csvDate
    ).length;

    const balanceToVehicle = mineTrips.filter(
      (row) => row["TRIP STATUS"] === "IN PROGRESS"
    ).length;

    const oldVehicle = mineTrips.filter(
      (row) =>
        row["Start Date"] !== csvDate &&
        row["TRIP STATUS"] === "IN PROGRESS"
    ).length;

    const excelAlerts = parseExcelAlerts(excelData, mines, csvDate);

    return {
      mines,
      dispatchVehicles,
      reachedInPlant,
      balanceToVehicle,
      routeDeviations: excelAlerts.routeDeviations,
      haltsInGreyArea: excelAlerts.haltsInGreyArea,
      powerCuts: excelAlerts.powerCuts,
      oldVehicle,
    };
  });
};
