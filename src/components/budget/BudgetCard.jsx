import React, { useState, useRef, useEffect } from "react";
import Icon from "../Icon.jsx";
import Progress from "../Progress.jsx";

export default function BudgetCard({ 
  name, 
  total, 
  percentage, 
  spent, 
  left, 
  color, 
  icon, 
  value, 
  isOver, 
  limit, 
  currency,
  onEdit,
  onDelete
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  return (
    <article className={`budget-card ${isOver ? 'over-budget' : ''} ${value === '100%' ? 'fully-used' : ''}`} style={{ "--tone": color }}>
      <div className="budget-card-header">
        <div className="budget-info">
          <div className="budget-icon-wrapper">
            <div className="budget-icon" style={{ background: `color-mix(in srgb, ${color} 20%, transparent)` }}>
              <Icon name={icon} style={{ color }} />
            </div>
            {isOver && (
              <div className="budget-status-indicator danger">
                {/* <Icon name="alert" /> */}
              </div>
            )}
            {value === '100%' && !isOver && (
              <div className="budget-status-indicator warning">
                <Icon name="check" />
              </div>
            )}
          </div>
          <div className="budget-details">
            <h2 className="budget-name">{name}</h2>
            <span className="budget-percentage">{percentage}</span>
          </div>
        </div>
        <div className="budget-menu-wrapper" ref={menuRef}>
          <button 
            className="budget-menu-button" 
            onClick={() => setShowMenu(!showMenu)}
          >
            <Icon name="dots" />
          </button>
          {showMenu && (
            <div className="budget-dropdown-menu">
              <button 
                className="dropdown-item"
                onClick={() => {
                  onEdit(name, { limit });
                  setShowMenu(false);
                }}
              >
                <Icon name="edit" />
                <span>Edit Budget</span>
              </button>
              <button 
                className="dropdown-item danger"
                onClick={() => {
                  if (onDelete) {
                    onDelete(name);
                  }
                  setShowMenu(false);
                }}
              >
                <Icon name="trash" />
                <span>Delete Budget</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="budget-total">
        <strong className="budget-amount">{total}</strong>
        
      </div>
      <div className="budget-progress-wrapper">
          <Progress value={value} color={isOver ? "var(--red)" : value === '100%' ? "var(--orange)" : color} />
          <div className="progress-labels">
            <span className="progress-label">{spent} spent</span>
            <span className={`progress-label ${isOver ? 'overspent' : ''}`}>
              {left} {isOver ? 'overspent' : 'left'}
            </span>
          </div>
        </div>
    </article>
  );
}
