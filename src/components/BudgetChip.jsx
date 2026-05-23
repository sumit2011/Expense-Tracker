import React from "react";

export default function BudgetChip({ name, spent, limit, color, currency }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const percentage = Math.min((spent / limit) * 100, 100);
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="budget-chip" style={{ "--chip-color": color }}>
      <div className="budget-chip-content">
        <div className="budget-chip-circle">
          <svg className="budget-chip-progress" width="44" height="44" viewBox="0 0 44 44">
            <circle
              className="budget-chip-bg"
              cx="22"
              cy="22"
              r="18"
              fill="none"
              strokeWidth="4"
            />
            <circle
              className="budget-chip-fill"
              cx="22"
              cy="22"
              r="18"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                stroke: color
              }}
              transform="rotate(-90 22 22)"
            />
          </svg>
          <span className="budget-chip-percentage">{Math.round(percentage)}%</span>
        </div>
        <div className="budget-chip-info">
          <span className="budget-chip-name">{name}</span>
          <span className="budget-chip-spent">{formatCurrency(spent)} spent</span>
        </div>
      </div>
    </div>
  );
}
