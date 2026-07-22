import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const CustomSelect = ({ value, options, onChange }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="m3-select" ref={ref}>
      <button
        type="button"
        className="m3-select-trigger"
        onClick={() => setOpen(!open)}
      >
        <span>{value}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="m3-select-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className={`m3-select-option${opt === value ? " selected" : ""}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
