import React, { useMemo, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import Donut from "../components/Donut.jsx";
import CategoryChips from "../components/CategoryChips.jsx";
import DateSwitch from "../components/DateSwitch.jsx";
import Nav from "../components/Nav.jsx";
import StatBar from "../components/StatBar.jsx";
import Chip from "../components/Chip.jsx";

export default function Stats({ screen, go, activeDate, selectedYear, dateLabel, yearLabel, onDatePrev, onDateNext, value, onSelect, currency, records, statsPeriod, setStatsPeriod, transactionType, setTransactionType, categories }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const donutRef = useRef(null);
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

  const filteredRecords = useMemo(() => {
    let filtered = records;
    
    // Filter by transaction type
    if (transactionType === 'income') {
      filtered = filtered.filter(record => record.amount > 0 && record.type !== "transfer");
    } else if (transactionType === 'expense') {
      filtered = filtered.filter(record => record.amount < 0 && record.type !== "transfer");
    }
    
    // Filter by time period
    if (statsPeriod === 'all') {
      return filtered;
    }
    return filtered.filter(record => {
      const recordDate = new Date(record.date);
      if (statsPeriod === 'monthly') {
        return recordDate.getMonth() === activeDate.getMonth() && recordDate.getFullYear() === activeDate.getFullYear();
      } else {
        return recordDate.getFullYear() === selectedYear;
      }
    });
  }, [records, activeDate, selectedYear, statsPeriod, transactionType]);

  const totalSpent = useMemo(() => {
    if (transactionType === 'income') {
      return filteredRecords
        .filter(record => record.amount > 0 && record.type !== "transfer")
        .reduce((sum, record) => sum + record.amount, 0);
    } else {
      return filteredRecords
        .filter(record => record.amount < 0 && record.type !== "transfer")
        .reduce((sum, record) => sum + Math.abs(record.amount), 0);
    }
  }, [filteredRecords, transactionType]);

  const categorySpends = useMemo(() => {
    const recordsToProcess = transactionType === 'income' 
      ? filteredRecords.filter(record => record.amount > 0 && record.type !== "transfer")
      : filteredRecords.filter(record => record.amount < 0 && record.type !== "transfer");
    
    return recordsToProcess.reduce((acc, record) => {
      const amount = transactionType === 'income' ? record.amount : Math.abs(record.amount);
      acc[record.name] = (acc[record.name] || 0) + amount;
      return acc;
    }, {});
  }, [filteredRecords, transactionType]);

  const topCategories = useMemo(() => {
    return Object.entries(categorySpends)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  }, [categorySpends]);

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.tone || 'var(--primary)';
  };

  const donutSegments = useMemo(() => {
    if (totalSpent === 0) return [];
    const sorted = Object.entries(categorySpends).sort(([,a], [,b]) => b - a);
    return sorted.map(([name, amount]) => ({
      color: getCategoryColor(name),
      percent: (amount / totalSpent) * 100
    }));
  }, [categorySpends, totalSpent, categories]);

  return (
    <>
      {statsPeriod !== 'all' && (
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
          <DateSwitch label={statsPeriod === 'yearly' ? yearLabel : dateLabel} onPrev={onDatePrev} onNext={onDateNext} value={value} onSelect={onSelect} mode={statsPeriod === 'yearly' ? 'year' : 'month'} />
        </div>
      )}
      
      <div style={{ marginTop: statsPeriod !== 'all' ? '60px' : '0px' }}>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <div className="row center"><button className="icon-button large" onClick={() => go("home")}><Icon name="chevronLeft" /></button><h1 className="title">Statistics</h1></div>
          </div>
          <div className="divider" />
          <div className="row left chips">
            <div className={`chip stats-chip ${statsPeriod === 'monthly' ? 'compact' : ''}`} style={{ "--chip": "var(--primary)", cursor: 'pointer' }} onClick={() => setStatsPeriod('monthly')}>
              <span className="chip-title">Monthly</span>
            </div>
            <div className={`chip stats-chip ${statsPeriod === 'yearly' ? 'compact' : ''}`} style={{ "--chip": "var(--primary)", cursor: 'pointer' }} onClick={() => setStatsPeriod('yearly')}>
              <span className="chip-title">Yearly</span>
            </div>
            <div className={`chip stats-chip ${statsPeriod === 'all' ? 'compact' : ''}`} style={{ "--chip": "var(--primary)", cursor: 'pointer' }} onClick={() => setStatsPeriod('all')}>
              <span className="chip-title">All</span>
            </div>

            <div className="stats-divider" />
            <div className={`chip stats-chip  ${transactionType === 'expense' ? 'compact' : ''}`} style={{ "--chip": "var(--primary)", cursor: 'pointer' }} onClick={() => setTransactionType('expense')}>
              <span className="chip-title">Expense</span>
            </div>
            <div className={`chip stats-chip ${transactionType === 'income' ? 'compact' : ''}`} style={{ "--chip": "var(--primary)", cursor: 'pointer' }} onClick={() => setTransactionType('income')}>
              <span className="chip-title">Income</span>
            </div>
          </div>
   
          <section 
            className="panel pad stack"
            ref={donutRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <Donut amount={totalSpent} currency={currency} segments={donutSegments} />
            <div className="chips">
              {topCategories.map(([name, amount]) => (
                <Chip key={name} name={name} value={formatCurrency(amount)} color={getCategoryColor(name)} compact />
              ))}
            </div>
          </section>
          <section className="panel stats-bars">
            {Object.entries(categorySpends).map(([name, amount]) => (
              <StatBar 
                key={name} 
                name={name} 
                amount={formatCurrency(amount)} 
                tone={getCategoryColor(name)} 
                value={`${totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0}%`}
                onClick={() => go(`category/${encodeURIComponent(name)}`)}
              />
            ))}
          </section>
        </div>
      </section>
      </div>
      <Nav screen={screen} go={go} />
    </>
  );
}
