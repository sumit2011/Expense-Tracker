import React, { useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

export default function AddBudget({ screen, go, budgets, setBudgets, categories, currency }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [errors, setErrors] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  // Get available categories that don't have budgets yet
  const availableCategories = useMemo(() => {
    const budgetedCategories = Object.keys(budgets);
    return categories.filter(category => !budgetedCategories.includes(category.name));
  }, [categories, budgets]);

  const handleInputChange = (field, value) => {
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    if (field === "category") {
      setSelectedCategory(value);
    } else if (field === "amount") {
      setBudgetAmount(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedCategory.trim()) {
      newErrors.category = "Please select a category";
    }

    if (!budgetAmount.trim()) {
      newErrors.amount = "Budget amount is required";
    } else {
      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Please enter a valid amount greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const amount = parseFloat(budgetAmount);
    const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);
    
    setBudgets(prev => ({
      ...prev,
      [selectedCategory.trim()]: {
        limit: amount,
        icon: selectedCategoryData?.icon || 'wallet',
        color: selectedCategoryData?.tone || 'var(--primary)'
      }
    }));

    go("budgets");
  };

  const handleCancel = () => {
    go("budgets");
  };

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <button className="icon-button large" onClick={handleCancel}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Add Budget</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          {availableCategories.length === 0 ? (
            <div className="panel pad stack">
              <div className="empty-state">
                <Icon name="alert" />
                <h3>No Available Categories</h3>
                <p>All categories already have budgets. You can edit existing budgets or add new categories first.</p>
                <div className="row gap">
                  <button className="button small" onClick={() => go("budgets")}>
                    Back to Budgets
                  </button>
                  <button className="button secondary small" onClick={() => go("categories")}>
                    Manage Categories
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="panel pad stack">
              <div className="field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className={errors.category ? "error" : ""}
                >
                  <option value="">Select a category</option>
                  {availableCategories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="field">
                <label htmlFor="amount">Budget Amount</label>
                <input
                  id="amount"
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter budget amount"
                  step="0.01"
                  min="0"
                  className={errors.amount ? "error" : ""}
                />
                {errors.amount && <span className="error-message">{errors.amount}</span>}
              </div>

              {selectedCategoryData && budgetAmount && (
                <div className="budget-preview">
                  <h3>Budget Preview</h3>
                  <div className="preview-card">
                    <div className="preview-header">
                      <div className="preview-icon" style={{ background: selectedCategoryData.tone }}>
                        <Icon name={selectedCategoryData.icon} />
                      </div>
                      <div className="preview-info">
                        <h4>{selectedCategoryData.name}</h4>
                        <p className="preview-amount">{formatCurrency(parseFloat(budgetAmount) || 0)}</p>
                      </div>
                    </div>
                    <div className="preview-details">
                      <span className="chip compact" style={{ "--chip": selectedCategoryData.tone }}>
                        New Budget
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="row gap">
                <button type="submit" className="button small">
                  Add Budget
                </button>
                <button type="button" onClick={handleCancel} className="button secondary small">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {availableCategories.length > 0 && (
            <section className="panel pad stack">
              <h3 className="section-title">Available Categories</h3>
              <div className="category-list">
                {availableCategories.map(category => (
                  <div key={category.name} className="category-item">
                    <div className="category-icon" style={{ background: category.tone }}>
                      <Icon name={category.icon} />
                    </div>
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
