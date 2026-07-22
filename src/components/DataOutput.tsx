import type { MineReportRow, AlertSummary } from "../types/report";
import ReportTable from "./ReportTable";

interface DataOutputProps {
  reportData: MineReportRow[] | null;
  selectedDate: string;
  accountName: string;
  shift: string;
  alertSummary: AlertSummary | null;
}

const DataOutput = ({
  reportData,
  selectedDate,
  accountName,
  shift,
  alertSummary,
}: DataOutputProps) => {
  if (!reportData) return null;
  return (
    <ReportTable
      data={reportData}
      selectedDate={selectedDate}
      accountName={accountName}
      shift={shift}
      alertSummary={alertSummary}
    />
  );
};

export default DataOutput;
