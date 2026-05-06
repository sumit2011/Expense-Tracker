import React, { useMemo } from "react";
import Icon from "../components/Icon.jsx";
import DateSwitch from "../components/DateSwitch.jsx";
import Chip from "../components/Chip.jsx";
import Donut from "../components/Donut.jsx";
import CategoryChips from "../components/CategoryChips.jsx";
import RecordItem from "../components/RecordItem.jsx";
import Nav from "../components/Nav.jsx";

export default function Home({ screen, go, records, totalBalance, spentThisMonth, budgetLeft, currency, categorySpends, activeDate, dateLabel, onDatePrev, onDateNext, value, onSelect, totalBudgetThisMonth }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const activeRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate.getFullYear() === activeDate.getFullYear() && recordDate.getMonth() === activeDate.getMonth();
  });

  const categoryColors = {
    Food: 'var(--yellow)',
    Health: 'var(--orange)',
    Transport: 'var(--green)',
    Entertainment: 'var(--blue)',
    Travel: 'var(--purple)',
    Shopping: 'var(--pink)',
  };

  const currentMonthCategorySpends = useMemo(() => {
    return activeRecords
      .filter(record => record.amount < 0 && record.type !== "transfer")
      .reduce((acc, record) => {
        acc[record.name] = (acc[record.name] || 0) + Math.abs(record.amount);
        return acc;
      }, {});
  }, [activeRecords]);

  const currentMonthSpent = useMemo(() => {
    return activeRecords
      .filter(record => record.amount < 0 && record.type !== "transfer")
      .reduce((sum, record) => sum + Math.abs(record.amount), 0);
  }, [activeRecords]);

  const donutSegments = useMemo(() => {
    if (currentMonthSpent === 0) return [];
    const sorted = Object.entries(currentMonthCategorySpends).sort(([,a], [,b]) => b - a).slice(0, 5);
    return sorted.map(([name, amount]) => ({
      color: categoryColors[name] || 'var(--primary)',
      percent: (amount / currentMonthSpent) * 100
    }));
  }, [currentMonthCategorySpends, currentMonthSpent]);

  return (
    <>
      <section className="screen">
        <div className="stack">
          <DateSwitch label={dateLabel} onPrev={onDatePrev} onNext={onDateNext} value={value} onSelect={onSelect} />
          <button className="panel pad row" onClick={() => go("cards")}>

            <span>
              <p className="label">Total Balance</p>
              <p className="balance">{formatCurrency(totalBalance)}</p>
            </span>
            <span className="icon-button" style={{ background: "transparent" }}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>
          <section className="panel pad stack">
            <div className="row">
              <h2 className="section-title">Budget</h2>
              <button className="link-button" onClick={() => go("budgets")}>All Budgets</button>
            </div>
            <div>
              <p className="balance">{formatCurrency(budgetLeft)} <span style={{ fontSize: 14 }}>left</span></p>
              <p className="subtle">-{formatCurrency(spentThisMonth)} spent this month</p>
            </div>
            <div className="progress">
              <span style={{ "--value": `${(spentThisMonth / totalBudgetThisMonth * 100).toFixed(0)}%`, "--color": "var(--primary)" }} />
            </div>
            <div className="divider" />
            <div className="chips">
              {Object.entries(currentMonthCategorySpends).slice(0, 3).map(([category, amount]) => (
                <Chip key={category} name={category} value={`${formatCurrency(amount)} spent`} color="var(--orange)" />
              ))}
            </div>
          </section>
          <section className="panel pad stack">
            <div className="row">
              <h2 className="section-title">Categories</h2>
              <button className="link-button" onClick={() => go("stats")}>Statistics</button>
            </div>
            <Donut amount={currentMonthSpent} currency={currency} segments={donutSegments} />
            <CategoryChips currency={currency} categorySpends={currentMonthCategorySpends} />
          </section>
          <section className="stack">
            <h2 className="section-title" style={{ textAlign: "center" }}>Last Records</h2>
            <div className="records">{activeRecords.slice(0, 3).map((record) => <RecordItem key={record.id} record={record} currency={currency} />)}</div>
            <button className="link-button" style={{ width: "100%", height: 48 }} onClick={() => go("records")}>All Records</button>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
