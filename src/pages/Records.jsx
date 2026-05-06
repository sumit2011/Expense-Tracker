import React, { useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import DateSwitch from "../components/DateSwitch.jsx";
import RecordItem from "../components/RecordItem.jsx";
import Nav from "../components/Nav.jsx";

export default function Records({ screen, go, records, deleteRecord, selectedYear, yearLabel, onYearPrev, onYearNext, value, onSelect, currency }) {
  const [query, setQuery] = useState("");
  const yearRecords = useMemo(() => {
    return records.filter((record) => new Date(record.date).getFullYear() === selectedYear);
  }, [records, selectedYear]);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return yearRecords;
    return yearRecords.filter((record) => {
      const formattedAmount = record.amount.toLocaleString("en-US", { style: "currency", currency, minimumFractionDigits: 2 });
      return `${record.name} ${record.account} ${formattedAmount} ${record.date}`.toLowerCase().includes(normalized);
    });
  }, [query, yearRecords, currency]);

  const groupedRecords = useMemo(() => {
    const groups = filteredRecords.reduce((acc, record) => {
      const label = new Date(record.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      if (!acc[label]) acc[label] = [];
      acc[label].push(record);
      return acc;
    }, {});

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[0]) - new Date(a[0]);
    });
  }, [filteredRecords]);

  return (
    <>
      <section className="screen">
        <div className="stack">
          <DateSwitch label={yearLabel} onPrev={onYearPrev} onNext={onYearNext} value={value} onSelect={onSelect} />
          <div className="row">
            <h1 className="title">Records</h1>
            <button className="icon-button large primary" onClick={() => go("add")} aria-label="Add record"><Icon name="plus" /></button>
          </div>
          <label className="search">
            <Icon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Record" />
          </label>
          <div className="divider" />
          {groupedRecords.length === 0 && (
            <p className="subtle">No records found for {yearLabel}.</p>
          )}
          {groupedRecords.map(([dateLabel, records]) => (
            <React.Fragment key={dateLabel}>
              <p className="label">{dateLabel}</p>
              <div className="records">
                {records.map((record) => (
                  <RecordItem
                    key={record.id}
                    record={record}
                    currency={currency}
                    onClick={() => go(`edit/${record.id}`)}
                    onDelete={deleteRecord}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
