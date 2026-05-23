import React from "react";
import Chip from "./Chip.jsx";

export default function CategoryChips({ currency = "USD", categorySpends = {}, categories = [] }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const topCategories = Object.entries(categorySpends).sort(([,a], [,b]) => b - a).slice(0, 4);

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.tone || 'var(--primary)';
  };

  return (
    <div className="chips">
      {topCategories.map(([name, amount]) => (
        <Chip key={name} name={name} value={formatCurrency(amount)} color={getCategoryColor(name)} compact />
      ))}
    </div>
  );
}
