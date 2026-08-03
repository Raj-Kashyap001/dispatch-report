import { useState, useRef, useEffect } from "react";
import { getPreviousDay } from "../utils/date";

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  shift?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const formatDisplay = (yyyy: number, mm: number, dd: number) => {
  const d = String(dd).padStart(2, "0");
  const m = String(mm).padStart(2, "0");
  const y = String(yyyy).slice(-2);
  return `${d}/${m}/${y}`;
};

const toValue = (yyyy: number, mm: number, dd: number) => {
  return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
};

const CustomDatePicker = ({ value, onChange, shift }: CustomDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() =>
    value ? parseInt(value.split("-")[0], 10) : new Date().getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(() =>
    value ? parseInt(value.split("-")[1], 10) - 1 : new Date().getMonth()
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedParts = value ? value.split("-").map(Number) : null;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const selectDay = (day: number) => {
    onChange(toValue(viewYear, viewMonth + 1, day));
    setOpen(false);
  };

  const displayText = selectedParts
    ? shift === "C"
      ? `${getPreviousDay(value).slice(8, 10)}-${String(selectedParts[2]).padStart(2, "0")}/${String(selectedParts[1]).padStart(2, "0")}/${selectedParts[0]}`
      : formatDisplay(selectedParts[0], selectedParts[1], selectedParts[2])
    : "Select date";

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div className="m3-datepicker" ref={ref}>
      <button
        type="button"
        className={`m3-datepicker-trigger ${!value ? "placeholder" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span>{displayText}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="0" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div className="m3-calendar">
          <div className="cal-header">
            <button type="button" onClick={() => {
              if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
              else { setViewMonth(viewMonth - 1); }
            }}>
              &#8249;
            </button>
            <span>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={() => {
              if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
              else { setViewMonth(viewMonth + 1); }
            }}>
              &#8250;
            </button>
          </div>

          <div className="cal-weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d} className="cal-weekday">
                {d}
              </div>
            ))}
          </div>

          <div className="cal-grid">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} className="cal-day empty" />;
              const isSelected =
                selectedParts &&
                selectedParts[0] === viewYear &&
                selectedParts[1] === viewMonth + 1 &&
                selectedParts[2] === day;
              const todayDate = new Date();
              const isToday =
                todayDate.getFullYear() === viewYear &&
                todayDate.getMonth() === viewMonth &&
                todayDate.getDate() === day;
              return (
                <div
                  key={day}
                  className={`cal-day${isSelected ? " selected" : ""}${isToday ? " today" : ""}`}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
