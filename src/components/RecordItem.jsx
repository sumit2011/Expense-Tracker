import React, { useRef, useState } from "react";
import Icon from "./Icon.jsx";

export default function RecordItem({ record, currency = "USD", onClick, onDelete }) {
  const [translateX, setTranslateX] = useState(0);
  const [swiped, setSwiped] = useState(false);
  const startXRef = useRef(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleTouchStart = (event) => {
    startXRef.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    const currentX = event.touches[0].clientX;
    const delta = currentX - startXRef.current;
    if (delta < 0) {
      setTranslateX(Math.max(delta, -100));
    } else if (swiped) {
      setTranslateX(Math.min(delta - 100, 0));
    }
  };

  const handleTouchEnd = () => {
    if (translateX <= -60) {
      setTranslateX(-100);
      setSwiped(true);
    } else {
      setTranslateX(0);
      setSwiped(false);
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(record.id);
  };

  return (
    <div className="record-swipe">
      <button
        className={`record-delete ${swiped ? "visible" : ""}`}
        type="button"
        onClick={handleDelete}
        aria-label={`Delete ${record.name}`}
      >
        <Icon name="trash" />
      </button>
      <div
        className="record"
        style={{ "--tone": record.tone, transform: `translateX(${translateX}px)` }}
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="record-left">
          <span className="record-icon">
            <Icon name={record.icon} />
          </span>
          <span>
            <p className="record-name">{record.name}</p>
            <p className="record-meta">{record.account}</p>
          </span>
        </div>
        <div className="record-right">
          <p className={`record-amount ${record.type === "transfer" ? "transfer" : (record.amount >= 0 ? "income" : "expense")}`}>{formatCurrency(record.amount)}</p>
          <p className="record-meta">{formatDate(record.date)}</p>
        </div>
      </div>
    </div>
  );
}
