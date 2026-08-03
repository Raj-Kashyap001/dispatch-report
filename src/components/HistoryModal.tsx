import type { HistoryEntry } from "../types/report";
import { formatTimestamp } from "../utils/history";
import { toDisplayDate } from "../utils/date";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const HistoryModal = ({
  isOpen,
  onClose,
  history,
  onRestore,
  onDelete,
  onClearAll,
}: HistoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Report History</div>

        <div className="history-list">
          {history.map((entry) => (
            <div key={entry.id} className="history-item">
              <div className="history-info">
                <div className="history-account">
                  <i className="fa-solid fa-user" /> {entry.account}
                </div>
                <div className="history-meta">
                  <i className="fa-solid fa-calendar-days" />{" "}
                  {toDisplayDate(entry.date)} (SHIFT {entry.shift})
                </div>
                <div className="history-meta">
                  <i className="fa-solid fa-clock" /> {formatTimestamp(entry.timestamp)}
                </div>
              </div>
              <button
                className="history-restore"
                onClick={() => onRestore(entry)}
                title="Restore"
              >
                <i className="fa-solid fa-rotate-left" />
              </button>
              <button
                className="modal-delete"
                onClick={() => onDelete(entry.id)}
                title="Delete"
              >
                <i className="fa-solid fa-trash-can" />
              </button>
            </div>
          ))}
          {history.length === 0 && (
            <div className="modal-empty">No saved reports yet</div>
          )}
        </div>

        <div className="modal-actions">
          <button
            className="modal-danger-btn"
            onClick={onClearAll}
            disabled={history.length === 0}
          >
            <i className="fa-solid fa-trash-can" /> Clear All
          </button>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-check" /> Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
