import { useState } from "react";

interface PasswordGateProps {
  onUnlock: () => void;
}

const PasswordGate = ({ onUnlock }: PasswordGateProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === import.meta.env.VITE_APP_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="lock-screen">
      <div className="lock-card">
        <div className="lock-icon">
          <i className="fa-solid fa-lock" />
        </div>
        <h1>Dispatch Report Generator</h1>
        <p>Enter the password to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="lock-input"
            placeholder="Password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            autoFocus
          />
          {error && <div className="lock-error">Incorrect password</div>}
          <button type="submit" className="lock-btn">
            <i className="fa-solid fa-key" /> Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordGate;
