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
        <h3>Manage Accounts</h3>

        <div className="modal-list">
          {accounts.map((a) => (
            <div key={a} className="modal-item">
              <span>{a}</span>
              <button onClick={() => handleRemove(a)}>&times;</button>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="modal-item" style={{ opacity: 0.5 }}>
              No accounts
            </div>
          )}
        </div>

        <div className="modal-add">
          <input
            type="text"
            className="flat-input"
            placeholder="New account name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button className="flat-btn" onClick={handleAdd}>
            Add
          </button>
        </div>

        <button className="flat-btn full-width" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddAccountModal;
