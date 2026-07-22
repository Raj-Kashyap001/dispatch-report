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
                <i className="fa-solid fa-xmark" />
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
            <i className="fa-solid fa-plus" /> Add
          </button>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          <i className="fa-solid fa-check" /> Done
        </button>
      </div>
    </div>
  );
};

export default AddAccountModal;
