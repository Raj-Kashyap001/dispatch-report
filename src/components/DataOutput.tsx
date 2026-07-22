import type { MineReportRow } from "../types/report";
import ReportTable from "./ReportTable";

interface DataOutputProps {
  reportData: MineReportRow[] | null;
  selectedDate: string;
}

const DataOutput = ({ reportData, selectedDate }: DataOutputProps) => {
  if (!reportData) return null;
  return <ReportTable data={reportData} selectedDate={selectedDate} />;
};

export default DataOutput;
