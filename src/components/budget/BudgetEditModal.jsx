import React from "react";
import Icon from "../Icon.jsx";
import IconPickerModal from "./IconPickerModal.jsx";

export default function BudgetEditModal({ 
  showEditModal, 
  editingBudget, 
  editAmount, 
  editIcon, 
  editColor, 
  showIconPicker, 
  categories,
  currency,
  setEditAmount, 
  setEditIcon,
  setShowIconPicker, 
  setEditColor, 
  handleSaveBudget, 
  handleCancelEdit 
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const colors = [
    { name: 'Primary', value: 'var(--primary)' },
    { name: 'Yellow', value: 'var(--yellow)' },
    { name: 'Orange', value: 'var(--orange)' },
    { name: 'Red', value: 'var(--red)' },
    { name: 'Green', value: 'var(--green)' },
    { name: 'Blue', value: 'var(--blue)' },
    { name: 'Pink', value: 'var(--pink)' },
    { name: 'Purple', value: 'var(--purple)' },
    { name: 'Cyan', value: 'var(--cyan)' },
    { name: 'Indigo', value: 'var(--indigo)' },
    { name: 'Magenta', value: 'var(--magenta)' },
    { name: 'Teal', value: 'var(--teal)' }
  ];

  if (!showEditModal) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleCancelEdit}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Edit Budget</h3>
            <button className="modal-close-button" onClick={handleCancelEdit}>
              <Icon name="x" />
            </button>
          </div>
          <div className="modal-body">
            <div className="field">
              <label>Budget Amount</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input 
                  type="number" 
                  value={editAmount} 
                  onChange={e => setEditAmount(e.target.value)}
                  placeholder="Enter budget amount"
                  className="budget-input"
                  autoFocus
                />
              </div>
              <p className="input-help">Set your monthly budget limit for this category</p>
            </div>
            
            <div className="field">
              <label>Budget Icon</label>
              <div className="icon-selector">
                <button 
                  type="button"
                  className="icon-picker-button"
                  onClick={() => setShowIconPicker(true)}
                  style={{
                    background: `color-mix(in srgb, ${editColor} 20%, transparent)`,
                    borderColor: editColor
                  }}
                >
                  <Icon name={editIcon || 'wallet'} style={{ color: editColor || 'var(--primary)' }} />
                  <span>Choose Icon</span>
                </button>
              </div>
              <p className="input-help">Select an icon for this budget</p>
            </div>
            
            <div className="field">
              <label>Budget Color</label>
              <div className="color-selector">
                <div className="color-options">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-option ${editColor === color.value ? 'selected' : ''}`}
                      onClick={() => setEditColor(color.value)}
                      style={{
                        background: color.value,
                        border: editColor === color.value ? '2px solid var(--text)' : '2px solid transparent'
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <p className="input-help">Choose a color for this budget</p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="button secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button 
              className="button primary" 
              onClick={handleSaveBudget}
              disabled={!editAmount || Number(editAmount) <= 0}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <IconPickerModal
        showIconPicker={showIconPicker}
        editIcon={editIcon}
        editColor={editColor}
        setShowIconPicker={setShowIconPicker}
        setEditIcon={setEditIcon}
      />
    </>
  );
}
