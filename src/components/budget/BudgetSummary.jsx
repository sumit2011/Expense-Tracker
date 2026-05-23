import React from "react";
import Icon from "../Icon.jsx";

export default function BudgetSummary({ totalBudget, totalSpent, totalLeft, totalPercentage, currency }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  return (
    <div className="budget-summary-card">
      <h2 className="section-title" style={{ textAlign: "center", marginBottom: 8 }}>Total Budget</h2>
      <div className="budget-total-display">
        <span className="budget-amount">{formatCurrency(totalBudget)}</span>
        <div className="budget-badge" style={{ 
          background: totalPercentage > 100 ? 'var(--red)' : totalPercentage > 75 ? 'var(--orange)' : 'var(--green)',
          color: 'white'
        }}>
          {totalPercentage}%
        </div>
      </div>
      {totalLeft < 0 ? (
        <div className="budget-status danger">
          {/* <Icon name="alert" /> */}
          <span>Over budget by {formatCurrency(Math.abs(totalLeft))}</span>
        </div>
      ) : (
        <div className="budget-stats">
          <div className="stat-item">
            <span className="stat-label">Spent</span>
            <span className="stat-value expense">{formatCurrency(totalSpent)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Remaining</span>
            <span className={`stat-value ${totalLeft < 0 ? 'expense' : 'income'}`}>
              {formatCurrency(Math.abs(totalLeft))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
