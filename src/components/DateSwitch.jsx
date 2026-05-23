import React, { useRef, useState } from "react";
import Icon from "./Icon.jsx";

export default function DateSwitch({ label = "AUG 2023", onPrev, onNext, onSelect, value, mode = "month" }) {
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  const openPicker = () => {
    setShowPicker(!showPicker);
  };

  const handleMonthSelect = (year, month) => {
    const dateValue = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    if (onSelect) {
      onSelect(dateValue);
    }
    setShowPicker(false);
  };

  const handleYearSelect = (year) => {
    const dateValue = `${year}-01-01`;
    if (onSelect) {
      onSelect(dateValue);
    }
    setShowPicker(false);
  };

  const getCurrentDate = () => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  };

  const currentDate = getCurrentDate();
  const currentYear = currentDate.getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="row date-switch" style={{ position: 'relative' }}>
      <button className="icon-button" type="button" aria-label="Previous" onClick={onPrev}>
        <Icon name="chevronLeft" />
      </button>
      <button className="date-pill" type="button" onClick={openPicker}>
        {label} <Icon name="chevronDown" />
      </button>
      <button className="icon-button" type="button" aria-label="Next" onClick={onNext}>
        <Icon name="chevronRight" />
      </button>
      
      {showPicker && (
        <div className="month-picker-overlay" onClick={() => setShowPicker(false)}>
          <div className="month-picker" onClick={(e) => e.stopPropagation()}>
            <div className="month-picker-header">
              <h4>Select {mode === 'year' ? 'Year' : 'Month'}</h4>
            </div>
            <div className="month-picker-content">
              {mode === 'year' ? (
                <div className="years-grid">
                  {years.map(year => (
                    <button
                      key={year}
                      className={`year-button ${currentYear === year ? 'selected' : ''}`}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              ) : (
                years.map(year => (
                  <div key={year} className="year-section">
                    <div className="year-label">{year}</div>
                    <div className="months-grid">
                      {months.map((month, index) => (
                        <button
                          key={`${year}-${index}`}
                          className={`month-button ${currentYear === year && currentDate.getMonth() === index ? 'selected' : ''}`}
                          onClick={() => handleMonthSelect(year, index)}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
