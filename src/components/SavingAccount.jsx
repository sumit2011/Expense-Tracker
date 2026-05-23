import React from "react";
import Icon from "./Icon.jsx";

const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency, 
    minimumFractionDigits: 2 
  }).format(amount);
};

export default function SavingAccount({ name, bank, balance, onClick, isSelected, currency = "USD" }) {
  return (
    <div 
      className={`savings-account ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="savings-account-header">
        <div className="account-icon">
          <Icon name="wallet" size="medium" />
        </div>
        <div className="account-info">
          <h4 className="account-name">{name}</h4>
          <p className="account-bank">{bank}</p>
        </div>
        <div className="account-balance">
          <p className="account-balance">{formatCurrency(balance, currency)}</p>
        </div>
      </div>
      {isSelected && (
        <div className="account-details">
          <div className="account-stats">
            <div className="stat">
              <span className="stat-label">Account Type</span>
              <span className="stat-value">Savings</span>
            </div>
            <div className="stat">
              <span className="stat-label">Status</span>
              <span className="stat-value active">Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
