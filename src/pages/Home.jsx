import React, { useMemo, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import DateSwitch from "../components/DateSwitch.jsx";
import Chip from "../components/Chip.jsx";
import BudgetChip from "../components/BudgetChip.jsx";
import Donut from "../components/Donut.jsx";
import CategoryChips from "../components/CategoryChips.jsx";
import RecordItem from "../components/RecordItem.jsx";
import Nav from "../components/Nav.jsx";

export default function Home({ screen, go, records, totalBalance, budgets, currency, activeDate, dateLabel, onDatePrev, onDateNext, value, onSelect, categories, deleteRecord }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const swipeRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onDateNext) {
      onDateNext();
    } else if (isRightSwipe && onDatePrev ) {
      
      onDatePrev();
    }
  };

  const activeRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate.getFullYear() === activeDate.getFullYear() && recordDate.getMonth() === activeDate.getMonth();
  });

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.tone || 'var(--primary)';
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

  const getAllBudgetedCategories = () => {
    const budgetedCategories = new Set();
    Object.entries(budgets || {}).forEach(([budgetName, budgetData]) => {
      if (typeof budgetData === 'number') {
        budgetedCategories.add(budgetName);
      } else {
        const categories = budgetData.categories && budgetData.categories.length > 0 
          ? budgetData.categories 
          : [budgetName];
        categories.forEach(cat => budgetedCategories.add(cat));
      }
    });
    return budgetedCategories;
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

  // Calculate budget values based on selected date
  const selectedMonth = activeDate.getMonth();
  const selectedYear = activeDate.getFullYear();
  
  const totalBudgetThisMonth = useMemo(() => {
    return Object.values(budgets || {}).reduce((sum, budget) => {
      return sum + (typeof budget === 'number' ? budget : budget?.limit || 0);
    }, 0);
  }, [budgets]);

  const spentThisMonth = useMemo(() => {
    return Object.entries(budgets || {}).reduce((sum, [budgetName, budgetData]) => {
      try {
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
        console.error('Error calculating spent for budget:', budgetName, error);
        return sum;
      }
    }, 0);
  }, [budgets, selectedMonth, selectedYear, records]);

  const budgetLeft = totalBudgetThisMonth - spentThisMonth;

  const donutSegments = useMemo(() => {
    if (currentMonthSpent === 0) return [];
    const sorted = Object.entries(currentMonthCategorySpends).sort(([,a], [,b]) => b - a);
    return sorted.map(([name, amount]) => ({
      color: getCategoryColor(name),
      percent: (amount / currentMonthSpent) * 100
    }));
  }, [currentMonthCategorySpends, currentMonthSpent, categories]);

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
              {Object.entries(currentMonthCategorySpends)
                .filter(([category]) => {
                  // Only show categories that are budgeted
                  return budgets?.[category] !== undefined;
                })
                .slice(0, 5)
                .map(([category, amount]) => {
                  const budgetLimit = typeof budgets?.[category] === 'number' 
                    ? budgets[category] 
                    : budgets?.[category]?.limit || 0;
                  return (
                    <BudgetChip 
                      key={category} 
                      name={category} 
                      spent={amount} 
                      limit={budgetLimit} 
                      color={getCategoryColor(category)} 
                      currency={currency} 
                    />
                  );
                })}
            </div>
          </section>
          <section 
            className="panel pad stack"
            ref={swipeRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <div className="row">
              <h2 className="section-title">Categories</h2>
              <button className="link-button" onClick={() => go("stats")}>Statistics</button>
            </div>
            <Donut amount={currentMonthSpent} currency={currency} segments={donutSegments} />
            <CategoryChips currency={currency} categorySpends={currentMonthCategorySpends} categories={categories} />
          </section>
          <section className="stack">
            <h2 className="section-title" style={{ textAlign: "center" }}>Last Records</h2>
            <div className="records">{activeRecords.slice(0, 5).map((record) => <RecordItem key={record.id} record={record} currency={currency} onClick={() => go(`edit/${record.id}`)} onDelete={deleteRecord} />)}</div>
            <button className="link-button" style={{ width: "100%", height: 48 }} onClick={() => go("records")}>All Records</button>
          </section>
        </div>
      </section>
      </div>
      <Nav screen={screen} go={go} />
    </>
  );
}
