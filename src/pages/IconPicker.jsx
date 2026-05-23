import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

const allIcons = [

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

const colorOptions = [
  // Row 1
  { name: "violet", value: "#8B5CF6" },
  { name: "brightGreen", value: "#10B981" },
  { name: "orange", value: "#F97316" },
  { name: "brightPink", value: "#EC4899" },
  // Row 2
  { name: "red", value: "#EF4444" },
  { name: "white", value: "#ffffff" },
  { name: "purple", value: "#A855F7" },
  { name: "lightBlue", value: "#60A5FA" },
  // Row 3
  { name: "hotPink", value: "#F472B6" },
  { name: "blueViolet", value: "#7C3AED" },
  { name: "limeGreen", value: "#84CC16" },
  { name: "yellow", value: "#EAB308" },
  // Row 4
  { name: "lightGray", value: "#D1D5DB" },
  { name: "mediumGray", value: "#9CA3AF" },
  { name: "darkGray", value: "#6B7280" },
  { name: "darkerGray", value: "#4B5563" },
  // Row 5
  { name: "greenCyan", value: "#06B6D4" },
  { name: "teal", value: "#14B8A6" },
  { name: "darkPurple", value: "#6D28D9" },
  { name: "orange2", value: "#FB923C" },
  // Row 6
  { name: "blueGray", value: "#64748B" },
  { name: "darkTeal", value: "#0F766E" },
  { name: "lavender", value: "#A78BFA" },
  { name: "skyBlue", value: "#0EA5E9" },
];

export default function IconPicker({ screen, go }) {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentIcon = location.state?.currentIcon || "bag";
  const currentTone = location.state?.currentTone || "var(--orange)";

  const [selectedIcon, setSelectedIcon] = useState(currentIcon);
  const [selectedTone, setSelectedTone] = useState(currentTone);

  const handleSelectIcon = (icon) => {
    setSelectedIcon(icon);
  };

  const handleSelectColor = (tone) => {
    setSelectedTone(tone);
  };

  const handleConfirm = () => {
    const backPath = name ? `/categories/edit/${encodeURIComponent(name)}` : '/categories/add';
    navigate(backPath, { state: { selectedIcon, selectedTone } });
  };

  const handleBack = () => {
    const backPath = name ? `/categories/edit/${encodeURIComponent(name)}` : '/categories/add';
    navigate(backPath, { state: { selectedIcon, selectedTone } });
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row space-between ">
            <button className="icon-button large" onClick={handleBack}><Icon name="chevronLeft" /></button>
            <h1 className="title">Select Icon & Color</h1>
            <button className="icon-button large" onClick={handleBack}><Icon name="x" /></button>
          </div>

          <section className="panel pad stack icon-picker-page">
            {/* Color Picker - Horizontal Scroll */}
            <div className="color-picker-horizontal">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={`color-circle ${selectedTone === color.value ? "selected" : ""}`}
                  style={{ 
                    background: color.value,
                    border: selectedTone === color.value ? `2px solid ${color.value}` : '2px solid transparent'
                  }}
                  onClick={() => handleSelectColor(color.value)}
                />
              ))}
            </div>

            {/* Icon Grid */}
            <div className="icon-grid">
              {allIcons.map((icon) => (
                <button
                  key={icon.name}
                  type="button"
                  className={`icon-circle ${selectedIcon === icon.name ? "selected" : ""}`}
                  style={{ 
                    background: selectedIcon === icon.name ? selectedTone : 'transparent',
                    border: selectedIcon === icon.name ? `2px solid ${selectedTone}` : '1px solid rgba(255,255,255,0.2)',
                    color: selectedIcon === icon.name ? '#ffffff' : 'rgba(255,255,255,0.6)'
                  }}
                  onClick={() => handleSelectIcon(icon.name)}
                >
                  <Icon name={icon.name} />
                </button>
              ))}
            </div>

            {/* Save Button */}
            <div className="save-button-container">
              <button className="save-button" onClick={handleConfirm}>Save</button>
            </div>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
