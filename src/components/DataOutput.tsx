import type { MineReportRow } from "../types/report";
import ReportTable from "./ReportTable";

interface DataOutputProps {
  reportData: MineReportRow[] | null;
  selectedDate: string;
  accountName: string;
}

const DataOutput = ({
  reportData,
  selectedDate,
  accountName,
}: DataOutputProps) => {
  if (!reportData) return null;
  return (
    <ReportTable
      data={reportData}
      selectedDate={selectedDate}
      accountName={accountName}
    />
  );
};

export default DataOutput;
