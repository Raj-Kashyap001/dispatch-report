import { useState, useRef, useEffect } from "react";
import { today } from "./utils/date";
import { validateFile } from "./utils/fileValidation";
import { spawnWorker } from "./utils/workerSpawn";
import { buildReportData } from "./utils/parseData";
import { getAccounts, saveAccounts } from "./utils/accounts";
import type { MineReportRow } from "./types/report";
import InputCard from "./components/InputCard";
import ProgressBar from "./components/ProgressBar";
import DataOutput from "./components/DataOutput";
import AccountSelector from "./components/AccountSelector";
import AddAccountModal from "./components/AddAccountModal";

const App = () => {
  const [reportData, setReportData] = useState<MineReportRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportDate, setReportDate] = useState(today);
  const [selectedAccount, setSelectedAccount] = useState(
    () => localStorage.getItem("dispatch-selected-account") || "PIL",
  );
  const [accounts, setAccounts] = useState<string[]>(getAccounts);
  const [modalOpen, setModalOpen] = useState(false);

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
        promises.push(
          spawnWorker(
            new URL("./workers/csv.worker.ts", import.meta.url),
            csvFile,
          ),
        );
      }

      if (excelFile) {
        promises.push(
          spawnWorker(
            new URL("./workers/excel.worker.ts", import.meta.url),
            excelFile,
          ),
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

  const year = new Date().getFullYear();

  return (
    <div className="App">
      <h1>~ Create Report For ~</h1>

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
      />

      <footer className="footer">
        &copy; {year} Raj Kashyap &middot; Dispatch Report Generator v0.1
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
