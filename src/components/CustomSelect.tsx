import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const CustomSelect = ({ value, options, onChange }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? options.filter((o) =>
        o.toLowerCase().includes(query.trim().toLowerCase())
      )
    : options;

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setQuery("");
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      return next;
    });
  };

  return (
    <div className="m3-select" ref={ref}>
      <button
        type="button"
        className="m3-select-trigger"
        onClick={handleToggle}
      >
        <span>{value}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="m3-select-menu">
          <div className="m3-select-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts..."
            />
          </div>
          <div className="m3-select-options">
            {filtered.length === 0 && (
              <div className="m3-select-empty">No accounts found</div>
            )}
            {filtered.map((opt) => (
              <div
                key={opt}
                className={`m3-select-option${opt === value ? " selected" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
