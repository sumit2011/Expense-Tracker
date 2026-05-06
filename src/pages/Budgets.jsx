import React, { useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import Progress from "../components/Progress.jsx";
import Nav from "../components/Nav.jsx";

export default function Budgets({ screen, go, records, currency, budgets, setBudgets, categories }) {
  const [editingBudget, setEditingBudget] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const categorySpends = useMemo(() => {
    return records
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear && record.amount < 0;
      })
      .reduce((acc, record) => {
        acc[record.name] = (acc[record.name] || 0) + Math.abs(record.amount);
        return acc;
      }, {});
  }, [records]);

  const categoryColors = {
    "Food & Drink": 'var(--yellow)',
    Health: 'var(--orange)',
    Groceries: 'var(--blue)',
    "Life & Event": 'var(--green)',
    Shopping: 'var(--pink)',
  };

  const budgetsList = useMemo(() => {
    return Object.entries(budgets).map(([category, limit]) => {
      const spent = categorySpends[category] || 0;
      const left = limit - spent;
      const percentage = Math.round((spent / limit) * 100);
      const isOver = spent > limit;
      const change = percentage > 100 ? `-${percentage - 100}%` : `${100 - percentage}%`;

      return {
        name: category,
        total: formatCurrency(limit),
        percentage: change,
        spent: formatCurrency(spent),
        left: formatCurrency(Math.abs(left)),
        color: categoryColors[category] || 'var(--primary)',
        value: `${Math.min(percentage, 100)}%`,
        isOver,
        limit,
      };
    });
  }, [budgets, categorySpends]);

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const totalSpent = Object.values(categorySpends).reduce((sum, val) => sum + val, 0);
  const totalLeft = totalBudget - totalSpent;
  const totalPercentage = Math.round((totalSpent / totalBudget) * 100);

  const handleEditBudget = (category, currentAmount) => {
    setEditingBudget(category);
    setEditAmount(String(currentAmount));
  };

  const handleSaveBudget = () => {
    if (!editingBudget || !editAmount) return;
    const newAmount = Number(editAmount);
    if (newAmount <= 0) return;

    setBudgets(prev => ({
      ...prev,
      [editingBudget]: newAmount
    }));
    setEditingBudget(null);
    setEditAmount("");
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setEditAmount("");
  };

  const handleAddBudget = () => {
    go("add-budget");
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <div className="row center"><button className="icon-button large" onClick={() => go("menu")}><Icon name="chevronLeft" /></button><h1 className="title">Budgets</h1></div>
            <button className="icon-button large primary" onClick={handleAddBudget}><Icon name="plus" /></button>
          </div>
          <div className="divider" />
          <section className="stack" style={{ gap: 15 }}>
            <h2 className="section-title" style={{ textAlign: "center" }}>Total Budget</h2>
            <div className="budget-total"><strong>{formatCurrency(totalBudget)}</strong><span className="subtle" style={{ color: "white" }}>{totalPercentage}%</span></div>
            <Progress value={`${Math.min(totalPercentage, 100)}%`} color={totalPercentage > 100 ? "var(--red)" : "var(--primary)"} />
            <div className="row"><span className="subtle">{formatCurrency(totalSpent)} spent</span><span style={{ fontSize: 12 }}>{formatCurrency(totalLeft)} left</span></div>
          </section>
          <div className="divider" />
          {budgetsList.map(({ name, total, percentage, spent, left, color, value, isOver, limit }) => (
            <article className="budget-card" style={{ "--tone": color }} key={name}>
              <div className="row"><h2 className="budget-name">{name}</h2><button style={{ background: "transparent", color: "var(--muted)" }} onClick={() => handleEditBudget(name, limit)}><Icon name="dots" /></button></div>
              <div className="budget-total"><strong>{total}</strong><span className={isOver ? "expense" : ""} style={{ fontSize: 12 }}>{percentage}</span></div>
              <Progress value={value} color={isOver ? "var(--red)" : "var(--primary)"} />
              <div className="row" style={{ marginTop: 15 }}><span className="subtle">{spent} spent</span><span className={isOver ? "expense" : ""} style={{ fontSize: 12 }}>{left} {isOver ? "overspent" : "left"}</span></div>
            </article>
          ))}
        </div>
      </section>

      {editingBudget && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 15 }}>Edit {editingBudget} Budget</h2>
            <input 
              type="number" 
              value={editAmount} 
              onChange={e => setEditAmount(e.target.value)}
              placeholder="Enter budget amount"
              style={{ width: "100%", padding: "10px", marginBottom: 15, borderRadius: 6, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)" }}
            />
            <div className="row" style={{ gap: 10 }}>
              <button onClick={handleSaveBudget} style={{ flex: 1, padding: "10px", background: "var(--primary)", color: "white", borderRadius: 6, border: "none", cursor: "pointer" }}>Save</button>
              <button onClick={handleCancelEdit} style={{ flex: 1, padding: "10px", background: "var(--panel)", color: "var(--text)", borderRadius: 6, border: "1px solid var(--line)", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Nav screen={screen} go={go} />
    </>
  );
}
