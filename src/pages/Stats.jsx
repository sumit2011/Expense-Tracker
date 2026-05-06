import React, { useMemo } from "react";
import Icon from "../components/Icon.jsx";
import Donut from "../components/Donut.jsx";
import Chip from "../components/Chip.jsx";
import StatBar from "../components/StatBar.jsx";
import Nav from "../components/Nav.jsx";
import DateSwitch from "../components/DateSwitch.jsx";

export default function Stats({ screen, go, activeDate, selectedYear, dateLabel, yearLabel, onDatePrev, onDateNext, value, onSelect, currency, records, statsPeriod, setStatsPeriod }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const recordDate = new Date(record.date);
      if (statsPeriod === 'monthly') {
        return recordDate.getMonth() === activeDate.getMonth() && recordDate.getFullYear() === activeDate.getFullYear();
      } else {
        return recordDate.getFullYear() === selectedYear;
      }
    });
  }, [records, activeDate, selectedYear, statsPeriod]);

  const totalSpent = useMemo(() => {
    return filteredRecords
      .filter(record => record.amount < 0 && record.type !== "transfer")
      .reduce((sum, record) => sum + Math.abs(record.amount), 0);
  }, [filteredRecords]);

  const categorySpends = useMemo(() => {
    return filteredRecords
      .filter(record => record.amount < 0 && record.type !== "transfer")
      .reduce((acc, record) => {
        acc[record.name] = (acc[record.name] || 0) + Math.abs(record.amount);
        return acc;
      }, {});
  }, [filteredRecords]);

  const topCategories = useMemo(() => {
    return Object.entries(categorySpends)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  }, [categorySpends]);

  const categoryColors = {
    Food: 'var(--yellow)',
    Health: 'var(--orange)',
    Transport: 'var(--green)',
    Entertainment: 'var(--blue)',
    Travel: 'var(--purple)',
  };

  const donutSegments = useMemo(() => {
    if (totalSpent === 0) return [];
    const sorted = Object.entries(categorySpends).sort(([,a], [,b]) => b - a).slice(0, 5);
    return sorted.map(([name, amount]) => ({
      color: categoryColors[name] || 'var(--primary)',
      percent: (amount / totalSpent) * 100
    }));
  }, [categorySpends, totalSpent]);

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <div className="row center"><button className="icon-button large" onClick={() => go("home")}><Icon name="chevronLeft" /></button><h1 className="title">Statistics</h1></div>
          </div>
          <div className="divider" />
          <div className="row center">
            <button className={`toggle-button ${statsPeriod === 'monthly' ? 'active' : ''}`} onClick={() => setStatsPeriod('monthly')}>Monthly</button>
            <button className={`toggle-button ${statsPeriod === 'yearly' ? 'active' : ''}`} onClick={() => setStatsPeriod('yearly')}>Yearly</button>
          </div>
          <DateSwitch label={statsPeriod === 'yearly' ? yearLabel : dateLabel} onPrev={onDatePrev} onNext={onDateNext} value={value} onSelect={onSelect} mode={statsPeriod === 'yearly' ? 'year' : 'month'} />
          <section className="panel pad stack">
            <Donut amount={totalSpent} currency={currency} segments={donutSegments} />
            <div className="chips">
              {topCategories.map(([name, amount]) => (
                <Chip key={name} name={name} value={formatCurrency(amount)} color={categoryColors[name] || 'var(--primary)'} compact />
              ))}
            </div>
          </section>
          <section className="panel stats-bars">
            {Object.entries(categorySpends).map(([name, amount]) => (
              <StatBar key={name} name={name} amount={formatCurrency(amount)} tone={categoryColors[name] || 'var(--primary)'} value={`${totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0}%`} />
            ))}
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
