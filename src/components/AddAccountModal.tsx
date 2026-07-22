import { useState } from "react";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: string[];
  onUpdate: (accounts: string[]) => void;
}

const AddAccountModal = ({
  isOpen,
  onClose,
  accounts,
  onUpdate,
}: AddAccountModalProps) => {
  const [newName, setNewName] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed && !accounts.includes(trimmed)) {
      onUpdate([...accounts, trimmed]);
      setNewName("");
    }
  };

  const handleRemove = (name: string) => {
    onUpdate(accounts.filter((a) => a !== name));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Manage Accounts</div>

        <div className="modal-list">
          {accounts.map((a) => (
            <div key={a} className="modal-item">
              <span>{a}</span>
              <button
                className="modal-delete"
                onClick={() => handleRemove(a)}
                title="Remove"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="modal-empty">No accounts added yet</div>
          )}
        </div>

        <div className="modal-add">
          <input
            type="text"
            className="modal-input"
            placeholder="Enter account name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button className="modal-add-btn" onClick={handleAdd}>
            Add
          </button>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default AddAccountModal;
