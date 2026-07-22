import type { MineReportRow } from "../types/report";
import ReportTable from "./ReportTable";

interface DataOutputProps {
  reportData: MineReportRow[] | null;
  selectedDate: string;
  accountName: string;
  shift: string;
}

const DataOutput = ({
  reportData,
  selectedDate,
  accountName,
  shift,
}: DataOutputProps) => {
  if (!reportData) return null;
  return (
    <ReportTable
      data={reportData}
      selectedDate={selectedDate}
      accountName={accountName}
      shift={shift}
    />
  );
};

export default DataOutput;
