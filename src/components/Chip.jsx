import React from "react";

export default function Chip({ name, value, color, compact = false }) {
  return (
    <div className={`chip ${compact ? "compact" : ""}`} style={{ "--chip": color }}>
      <span className="chip-dot" />
      <span>
        <span className="chip-title">{name}</span>
        <span className="chip-value">{value}</span>
      </span>
    </div>
  );
}
