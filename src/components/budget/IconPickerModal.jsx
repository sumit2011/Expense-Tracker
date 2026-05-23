import React from "react";
import Icon from "../Icon.jsx";

export default function IconPickerModal({ 
  showIconPicker, 
  editIcon, 
  editColor, 
  setShowIconPicker, 
  setEditIcon 
}) {
  const icons = [
     { name: "home", label: "Home" },
  { name: "records", label: "Records" },
  { name: "wallet", label: "Wallet" },
  { name: "menu", label: "Menu" },
  { name: "search", label: "Search" },
  { name: "bag", label: "Shopping Bag" },
  { name: "cash", label: "Dollar Sign" },
  { name: "briefcase", label: "Briefcase" },
  { name: "card", label: "Credit Card" },
  { name: "dots", label: "More Vertical" },
  { name: "shield", label: "Shield" },
  { name: "eye", label: "Eye" },
  { name: "trash", label: "Trash" },
  { name: "x", label: "Close" },
  { name: "heart", label: "Heart" },
  { name: "spark", label: "Zap" },
  { name: "utensils", label: "Utensils" },
  { name: "scooter", label: "Scooter" },
  { name: "shoppingBag", label: "Shopping Bag" },
  { name: "car", label: "Car" },
  { name: "bus", label: "Bus" },
  { name: "heartLightning", label: "Heart Lightning" },
  { name: "smiley", label: "Smile" },
  { name: "dollarBox", label: "Dollar Sign" },
  { name: "building", label: "Building" },
  { name: "calendar", label: "Calendar" },
  { name: "document", label: "Document" },
  { name: "edit", label: "Edit" },
  { name: "share", label: "Share" },
  { name: "shoppingCart", label: "Shopping Cart" },
  { name: "dumbell", label: "Dumbbell" },
  { name: "coffee", label: "Coffee" },
  { name: "carFront", label: "Car Front" },
  { name: "partyPopper", label: "Party Popper" },
  ];

  if (!showIconPicker) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowIconPicker(false)}>
      <div className="modal-content icon-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Choose Budget Icon</h2>
          <button className="modal-close-button" onClick={() => setShowIconPicker(false)}>
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="icon-grid">
            {icons.map(icon => (
              <button
                key={icon.name}
                type="button"
                className={`icon-option ${editIcon === icon.name ? 'selected' : ''}`}
                onClick={() => {
                  setEditIcon(icon.name);
                }}
                style={{
                  background: editIcon === icon.name
                    ? `color-mix(in srgb, ${editColor} 30%, transparent)`
                    : 'var(--panel-2)',
                  borderColor: editIcon === icon.name ? editColor : 'var(--line)'
                }}
              >
                <Icon name={icon.name} style={{ color: editColor || 'var(--primary)' }} />
              </button>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="button secondary" onClick={() => setShowIconPicker(false)}>
            Cancel
          </button>
          <button 
            className="button primary" 
            onClick={() => setShowIconPicker(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
