import React, { useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";
import DateSwitch from "../components/DateSwitch.jsx";
import { BudgetCard, BudgetSummary, BudgetEditModal } from "../components/budget/index.js";

export default function Budgets({ screen, go, records, currency, budgets, budgetSpends, setBudgets, updateBudget, addBudget, deleteBudget, categories, activeDate, dateLabel, onDatePrev, onDateNext, value, onSelect }) {
  const [editingBudget, setEditingBudget] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editColor, setEditColor] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const getBudgetSpendsForMonth = (budgetCategories, month, year) => {
    return records
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === month && 
               recordDate.getFullYear() === year && 
               record.amount < 0 && 
               record.type !== "transfer" &&
               budgetCategories.includes(record.name);
      })
      .reduce((acc, record) => acc + Math.abs(record.amount), 0);
  };

  const budgetsList = useMemo(() => {
    if (!budgets || typeof budgets !== 'object') {
      return [];
    }
    
    const selectedMonth = activeDate.getMonth();
    const selectedYear = activeDate.getFullYear();
    
    return Object.entries(budgets).map(([budgetName, budgetData]) => {
      try {
        // Handle backward compatibility for old budget format
        let budgetCategories;
        if (typeof budgetData === 'number') {
          // Old format: use budget name as category
          budgetCategories = [budgetName];
        } else {
          // New format: use specified categories, fallback to budget name if empty
          budgetCategories = budgetData.categories && budgetData.categories.length > 0 
            ? budgetData.categories 
            : [budgetName];
        }
        
        const budget = budgets[budgetName];
        const limit = typeof budget === 'number' ? budget : budget?.limit || 0;
        const spent = getBudgetSpendsForMonth(budgetCategories, selectedMonth, selectedYear);
        const left = limit - spent;
        const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        const isOver = spent > limit;
        const change = percentage > 0 ? `+${percentage}%` : `${percentage}%`;
        
        // Get category icon and color as defaults
        const category = categories.find(cat => cat.name === budgetName);
        const categoryIcon = category?.icon || 'wallet';
        const categoryColor = category?.tone || 'var(--primary)';
        
        const budgetIcon = typeof budget === 'number' ? categoryIcon : budget?.icon || categoryIcon;
        const budgetColor = typeof budget === 'number' ? categoryColor : budget?.color || categoryColor;
        
        return {
          name: budgetName,
          total: formatCurrency(limit),
          percentage: change,
          spent: formatCurrency(spent),
          left: formatCurrency(Math.abs(left)),
          color: budgetColor,
          icon: budgetIcon,
          value: `${Math.min(percentage, 100)}%`,
          isOver,
          limit,
        };
      } catch (error) {
        console.error('Error processing budget:', budgetName, error);
        return null;
      }
    }).filter(Boolean);
  }, [budgets, activeDate, records, categories]);

  const totalBudget = Object.values(budgets || {}).reduce((sum, budget) => {
    return sum + (typeof budget === 'number' ? budget : budget?.limit || 0);
  }, 0);
  
  // Calculate total spent for the selected month
  const totalSpent = useMemo(() => {
    const selectedMonth = activeDate.getMonth();
    const selectedYear = activeDate.getFullYear();
    
    return Object.entries(budgets || {}).reduce((sum, [budgetName, budgetData]) => {
      try {
        // Handle backward compatibility for old budget format
        let budgetCategories;
        if (typeof budgetData === 'number') {
          budgetCategories = [budgetName];
        } else {
          budgetCategories = budgetData.categories && budgetData.categories.length > 0 
            ? budgetData.categories 
            : [budgetName];
        }
        
        return sum + getBudgetSpendsForMonth(budgetCategories, selectedMonth, selectedYear);
      } catch (error) {
        console.error('Error calculating total spent for budget:', budgetName, error);
        return sum;
      }
    }, 0);
  }, [budgets, activeDate, records]);
  
  const totalLeft = totalBudget - totalSpent;
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleEditBudget = (budgetName, budgetData) => {
    setEditingBudget(budgetName);
    const budget = budgets[budgetName];
    setEditAmount(typeof budget === 'number' ? budget.toString() : budget?.limit?.toString() || "");
    
    // Try to get icon and color from category first, then from budget
    const category = categories.find(cat => cat.name === budgetName);
    const categoryIcon = category?.icon || 'wallet';
    const categoryColor = category?.tone || 'var(--primary)';
    
    setEditIcon(typeof budget === 'number' ? categoryIcon : budget?.icon || categoryIcon);
    setEditColor(typeof budget === 'number' ? categoryColor : budget?.color || categoryColor);
  };

  const handleSaveBudget = () => {
    if (!editingBudget || !editAmount) return;
    const newAmount = Number(editAmount);
    if (newAmount <= 0) return;

    updateBudget(editingBudget, {
      limit: newAmount,
      icon: editIcon,
      color: editColor
    });
    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setEditAmount("");
    setEditIcon("");
    setEditColor("");
  };

  const handleDeleteBudget = (budgetName) => {
    if (window.confirm(`Are you sure you want to delete the "${budgetName}" budget?`)) {
      deleteBudget(budgetName);
    }
  };

  const handleResetBudgets = () => {
    if (window.confirm('This will reset all budgets to default values. Are you sure?')) {
      const defaultBudgets = {
        "Food & Drink": { limit: 5000, icon: "food", color: "var(--yellow)" },
        "Life & Event": { limit: 10000, icon: "briefcase", color: "var(--orange)" },
        "Groceries": { limit: 1000, icon: "shoppingBag", color: "var(--pink)" },
        "Health": { limit: 2000, icon: "heartLightning", color: "var(--red)" },
        "Shopping": { limit: 8000, icon: "bag", color: "var(--blue)" },
      };
      
      // Update default budgets to use category colors and icons if available
      Object.keys(defaultBudgets).forEach(budgetName => {
        const category = categories.find(cat => cat.name === budgetName);
        if (category) {
          defaultBudgets[budgetName].icon = category.icon || defaultBudgets[budgetName].icon;
          defaultBudgets[budgetName].color = category.tone || defaultBudgets[budgetName].color;
        }
      });
      
      setBudgets(defaultBudgets);
      localStorage.setItem("budget-one-budgets", JSON.stringify(defaultBudgets));
    }
  };

  const handleAddBudget = () => {
    go("add-budget");
  };

  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        background: 'var(--bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--line)'
      }}>
        <DateSwitch label={dateLabel} onPrev={onDatePrev} onNext={onDateNext} value={value} onSelect={onSelect} />
      </div>
      
      <div style={{ marginTop: '60px' }}>
      <section className="screen">
        <div className="stack">
          
          <div className="row">
            <div className="row center"><button className="icon-button large" onClick={() => go("menu")}><Icon name="chevronLeft" /></button><h1 className="title">Budgets</h1></div>
            <button className="icon-button large primary" onClick={handleAddBudget}><Icon name="plus" /></button>
          </div>
          
          <div className="divider" />
          <section className="stack" style={{ gap: 20 }}>
            <BudgetSummary 
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              totalLeft={totalLeft}
              totalPercentage={totalPercentage}
              currency={currency}
            />
            <div className="divider" />
            {budgetsList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icon name="wallet" />
                </div>
                <h3 className="empty-title">No budgets yet</h3>
                <p className="empty-description">Create your first budget to start tracking your spending</p>
                <div className="empty-actions center" >
                  <button className="primary-action center" onClick={handleAddBudget}>
                    {/* <Icon name="plus" /> */}
                    Create Your First Budget
                  </button>
                </div>
              </div>
            ) : (
              budgetsList.map(budget => (
                <BudgetCard
                  key={budget.name}
                  {...budget}
                  currency={currency}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              ))
            )}
          </section>
          <div className="divider" />
        </div>
      </section>

      <BudgetEditModal
        showEditModal={!!editingBudget}
        editingBudget={editingBudget}
        editAmount={editAmount}
        editIcon={editIcon}
        editColor={editColor}
        showIconPicker={showIconPicker}
        categories={categories}
        currency={currency}
        setEditAmount={setEditAmount}
        setEditIcon={setEditIcon}
        setShowIconPicker={setShowIconPicker}
        setEditColor={setEditColor}
        handleSaveBudget={handleSaveBudget}
        handleCancelEdit={handleCancelEdit}
      />

      </div>
      <Nav screen={screen} go={go} />
    </>
  );
}
