export interface MineReportRow {
  mines: string;
  dispatchVehicles: number;
  reachedInPlant: number;
  balanceToVehicle: number;
  routeDeviations: number;
  haltsInGreyArea: number;
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
