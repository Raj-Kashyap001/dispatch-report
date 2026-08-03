import { useState, useRef, useEffect } from "react";
import { today, getCurrentShift } from "./utils/date";
import { validateFile } from "./utils/fileValidation";
import { spawnWorker } from "./utils/workerSpawn";
import { buildReportData } from "./utils/parseData";
import { getAccounts, saveAccounts } from "./utils/accounts";
import type { MineReportRow, AlertSummary } from "./types/report";
import InputCard from "./components/InputCard";
import ProgressBar from "./components/ProgressBar";
import DataOutput from "./components/DataOutput";
import AccountSelector from "./components/AccountSelector";
import AddAccountModal from "./components/AddAccountModal";
import CsvWorker from "./workers/csv.worker.ts?worker";
import ExcelWorker from "./workers/excel.worker.ts?worker";

const App = () => {
  const [reportData, setReportData] = useState<MineReportRow[] | null>(null);
  const [alertSummary, setAlertSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportDate, setReportDate] = useState(today);
  const [selectedAccount, setSelectedAccount] = useState(
    () => localStorage.getItem("dispatch-selected-account") || "PIL",
  );
  const [accounts, setAccounts] = useState<string[]>(getAccounts);
  const [modalOpen, setModalOpen] = useState(false);
  const [shift, setShift] = useState(getCurrentShift);
  const [debug, setDebug] = useState(false);

  const csvRef = useRef<HTMLInputElement>(null);
  const excelRef = useRef<HTMLInputElement>(null);
  const workersRef = useRef<Worker[]>([]);

  useEffect(() => {
    const workers = workersRef.current;
    return () => {
      workers.forEach((w) => w.terminate());
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("dispatch-selected-account", selectedAccount);
  }, [selectedAccount]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        setDebug((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleAccountsUpdate = (newAccounts: string[]) => {
    setAccounts(newAccounts);
    saveAccounts(newAccounts);
    if (!newAccounts.includes(selectedAccount) && newAccounts.length > 0) {
      setSelectedAccount(newAccounts[0]);
    }
  };

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
      setError(
        "Invalid Alerts Report file. Please select a .xlsx or .xls file.",
      );
      return;
    }

    setLoading(true);
    setReportData(null);

    try {
      const promises: Promise<unknown>[] = [];

      if (csvFile) {
        promises.push(spawnWorker(CsvWorker, csvFile));
      }

      if (excelFile) {
        promises.push(spawnWorker(ExcelWorker, excelFile));
      }

      const results = await Promise.all(promises);

      const csvResult = csvFile ? (results[0] as Record<string, string>[]) : [];
      const excelResult = excelFile
        ? (results[csvFile ? 1 : 0] as Record<string, string>[])
        : [];

      const processed = buildReportData(csvResult, excelResult, reportDate, shift);
      if (debug) {
        console.log("[DEBUG] CSV rows:", csvResult.length, "Excel rows:", excelResult.length);
        console.log("[DEBUG] Report:", processed);
      }
      setReportData(processed.rows);
      setAlertSummary(processed.alertSummary);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error reading files");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div className="App">
      {debug && <div className="debug-badge">debug</div>}
      <h1 style={{ textTransform: "uppercase" }}> Create Report For </h1>
      <hr style={{ marginBottom: 32 }} />

      <AccountSelector
        selectedAccount={selectedAccount}
        accounts={accounts}
        onAccountChange={setSelectedAccount}
        onOpenModal={() => setModalOpen(true)}
      />

      <InputCard
        reportDate={reportDate}
        onDateChange={setReportDate}
        csvRef={csvRef}
        excelRef={excelRef}
        shift={shift}
        onShiftChange={setShift}
      />

      <div className="generate-row">
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Generating...
            </>
          ) : (
            <>
              <i className="fa-solid fa-bolt" /> Generate Report
            </>
          )}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading && <ProgressBar />}

      <DataOutput
        reportData={reportData}
        selectedDate={reportDate}
        accountName={selectedAccount}
        shift={shift}
        alertSummary={alertSummary}
      />

      <footer className="footer">
        &copy; {year} Raj Kashyap &middot; Dispatch Report Generator v1.0
      </footer>

      <AddAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        accounts={accounts}
        onUpdate={handleAccountsUpdate}
      />
    </div>
  );
};

export default App;
