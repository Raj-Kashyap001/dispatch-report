export interface MineReportRow {
  mines: string;
  dispatchVehicles: number;
  reachedInPlant: number;
  balanceToVehicle: number;
  routeDeviations: number;
  redArea: number;
  powerCuts: number;
  oldVehicle: number;
}

export interface AlertSummary {
  totalAlerts: number;
  acknowledged: number;
}

export interface ReportResult {
  rows: MineReportRow[];
  alertSummary: AlertSummary;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  account: string;
  date: string;
  shift: string;
  rows: MineReportRow[];
  alertSummary: AlertSummary | null;
}
