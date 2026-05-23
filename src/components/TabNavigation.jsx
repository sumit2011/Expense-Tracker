import React from "react";

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="tabs">
      <button 
        className={`tab ${activeTab === 'cards' ? 'active' : ''}`}
        onClick={() => onTabChange('cards')}
      >
        Cards
      </button>
      <button 
        className={`tab ${activeTab === 'savings' ? 'active' : ''}`}
        onClick={() => onTabChange('savings')}
      >
        Savings
      </button>
    </div>
  );
}
