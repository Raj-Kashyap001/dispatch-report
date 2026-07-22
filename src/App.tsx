import { useState, useRef, useEffect } from "react";
import { today } from "./utils/date";
import { validateFile } from "./utils/fileValidation";
import { spawnWorker } from "./utils/workerSpawn";
import { buildReportData } from "./utils/parseData";
import type { MineReportRow } from "./types/report";
import InputCard from "./components/InputCard";
import ProgressBar from "./components/ProgressBar";
import DataOutput from "./components/DataOutput";

const App = () => {
  const [reportData, setReportData] = useState<MineReportRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportDate, setReportDate] = useState(today);

  const csvRef = useRef<HTMLInputElement>(null);
  const excelRef = useRef<HTMLInputElement>(null);
  const workersRef = useRef<Worker[]>([]);

  useEffect(() => {
    const workers = workersRef.current;
    return () => {
      workers.forEach((w) => w.terminate());
    };
  }, []);

  const handleGenerate = async () => {
    const csvFile = csvRef.current?.files?.[0];
    const excelFile = excelRef.current?.files?.[0];
    setError("");

    if (!csvFile && !excelFile) {
      setError("Please select at least one file.");
      return;
    }

    if (csvFile && !validateFile(csvFile, "csv")) {
      setError("Invalid Job Report file. Please select a .csv file.");
      return;
    }

    if (excelFile && !validateFile(excelFile, "excel")) {
      setError("Invalid Alerts Report file. Please select a .xlsx or .xls file.");
      return;
    }

    setLoading(true);
    setReportData(null);

    try {
      const promises: Promise<unknown>[] = [];

      if (csvFile) {
        promises.push(
          spawnWorker(new URL("./workers/csv.worker.ts", import.meta.url), csvFile)
        );
      }

      if (excelFile) {
        promises.push(
          spawnWorker(new URL("./workers/excel.worker.ts", import.meta.url), excelFile)
        );
      }

      const results = await Promise.all(promises);

      const csvResult = csvFile ? (results[0] as Record<string, string>[]) : [];
      const excelResult = excelFile
        ? (results[csvFile ? 1 : 0] as Record<string, string>[])
        : [];

      const processed = buildReportData(csvResult, excelResult, reportDate);
      setReportData(processed);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error reading files");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  return (
    <div className="App">
      <h1>Report Maker</h1>

      <InputCard
        reportDate={reportDate}
        onDateChange={setReportDate}
        csvRef={csvRef}
        excelRef={excelRef}
      />

      <br />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && (
        <div style={{ color: "#d32f2f", fontWeight: "bold", margin: "0.5rem 0" }}>
          {error}
        </div>
      )}

      {loading && <ProgressBar />}

      <br />

      <DataOutput reportData={reportData} selectedDate={reportDate} />
    </div>
  );
};

export default App;
