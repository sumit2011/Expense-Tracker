import React from "react";
import Chip from "./Chip.jsx";

export default function CategoryChips({ currency = "USD", categorySpends = {} }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const topCategories = Object.entries(categorySpends).sort(([,a], [,b]) => b - a).slice(0, 4);

  const categoryColors = {
    Food: 'var(--yellow)',
    Health: 'var(--orange)',
    Transport: 'var(--green)',
    Entertainment: 'var(--blue)',
    Travel: 'var(--purple)',
    Shopping: 'var(--pink)',
  };

  return (
    <div className="chips">
      {topCategories.map(([name, amount]) => (
        <Chip key={name} name={name} value={formatCurrency(amount)} color={categoryColors[name] || 'var(--primary)'} compact />
      ))}
    </div>
  );
}
