import { useState, useRef, useEffect } from "react";
import { today, getCurrentShift } from "./utils/date";
import { validateFile } from "./utils/fileValidation";
import { spawnWorker } from "./utils/workerSpawn";
import { buildReportData } from "./utils/parseData";
import { getAccounts, saveAccounts } from "./utils/accounts";
import {
  getHistory,
  addHistory,
  deleteHistoryEntry,
  clearHistory,
} from "./utils/history";
import type { MineReportRow, AlertSummary, HistoryEntry } from "./types/report";
import InputCard from "./components/InputCard";
import ProgressBar from "./components/ProgressBar";
import DataOutput from "./components/DataOutput";
import AccountSelector from "./components/AccountSelector";
import AddAccountModal from "./components/AddAccountModal";
import HistoryModal from "./components/HistoryModal";
import PasswordGate from "./components/PasswordGate";

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD as string | undefined;
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
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("dispatch-unlocked") === "1"
  );

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
      addHistory({
        account: selectedAccount,
        date: reportDate,
        shift,
        rows: processed.rows,
        alertSummary: processed.alertSummary,
      });
      setHistory(getHistory());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error reading files");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const handleRestore = (entry: HistoryEntry) => {
    setSelectedAccount(entry.account);
    setReportDate(entry.date);
    setShift(entry.shift);
    setReportData(entry.rows);
    setAlertSummary(entry.alertSummary);
    setError("");
    setHistoryOpen(false);
  };

  const handleDeleteHistory = (id: string) => {
    deleteHistoryEntry(id);
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleReset = () => {
    localStorage.removeItem("dispatch-accounts");
    localStorage.removeItem("dispatch-selected-account");
    setAccounts(getAccounts());
    setSelectedAccount("PIL");
    setReportData(null);
    setAlertSummary(null);
    setReportDate(today);
    setShift(getCurrentShift());
    setError("");
  };

  const handleUnlock = () => {
    try {
      sessionStorage.setItem("dispatch-unlocked", "1");
    } catch {}
    setUnlocked(true);
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem("dispatch-unlocked");
    } catch {}
    setUnlocked(false);
  };

  const year = new Date().getFullYear();

  if (APP_PASSWORD && !unlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

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

      <div className="toolbar-row">
        <button className="icon-btn" onClick={() => setHistoryOpen(true)}>
          <i className="fa-solid fa-clock-rotate-left" />
          History
          {history.length > 0 && (
            <span className="toolbar-count">{history.length}</span>
          )}
        </button>
        <button className="icon-btn reset-btn" onClick={handleReset}>
          <i className="fa-solid fa-rotate-right" />
          Reset
        </button>
        {APP_PASSWORD && (
          <button className="icon-btn" onClick={handleLock}>
            <i className="fa-solid fa-lock" />
            Lock
          </button>
        )}
      </div>

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
        &copy; {year} Raj Kashyap &middot; Dispatch Report Generator v1.1
      </footer>

      <AddAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        accounts={accounts}
        onUpdate={handleAccountsUpdate}
      />

      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onRestore={handleRestore}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />
    </div>
  );
};

export default App;
