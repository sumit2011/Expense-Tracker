import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import RecordItem from "../components/RecordItem.jsx";
import Nav from "../components/Nav.jsx";

export default function CardDetails({ 
  screen, 
  go, 
  records, 
  deleteRecord,
  currency = "USD", 
  cards, 
  accountBalances 
}) {
  const { id } = useParams();
  const card = cards?.find((card) => String(card.id) === id);
  const [transactionFilter, setTransactionFilter] = useState('all'); // 'all', 'income', 'expense', 'transfer'

  if (!card) {
    return (
      <div className="screen">
        <div className="stack">
          <div className="row">
            <button className="icon-button large" onClick={() => go("cards")}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Card Not Found</h1>
            <div style={{ width: "38px" }}></div>
          </div>
          <div className="panel pad">
            <p>The card you're looking for doesn't exist.</p>
            <button className="primary-action" onClick={() => go("cards")}>
              <Icon name="arrowLeft" />
              Back to Accounts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter records for this specific card
  const cardRecords = useMemo(() => {
    let filteredRecords = records?.filter(record => 
      record.account === card.name || 
      record.account === `Card ${card.last}`
    ) || [];

    // Apply transaction type filter
    if (transactionFilter !== 'all') {
      filteredRecords = filteredRecords.filter(record => {
        if (transactionFilter === 'income') return record.amount > 0;
        if (transactionFilter === 'expense') return record.amount < 0 && record.type !== 'transfer';
        if (transactionFilter === 'transfer') return record.type === 'transfer';
        return true;
      });
    }

    return filteredRecords;
  }, [records, card.name, card.last, transactionFilter]);

  // Group records by date
  const groupedRecords = useMemo(() => {
    const groups = cardRecords.reduce((acc, record) => {
      const label = new Date(record.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      if (!acc[label]) acc[label] = [];
      acc[label].push(record);
      return acc;
    }, {});

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[0]) - new Date(a[0]);
    });
  }, [cardRecords]);

  // Calculate current balance
  const currentBalance = useMemo(() => {
    return accountBalances[card.name] || accountBalances[`Card ${card.last}`] || card.baseBalance || 0;
  }, [accountBalances, card.baseBalance, card.name, card.last]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency, 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const handleEdit = () => {
    go(`edit-card/${card.id}`);
  };

  const handleAddTransaction = () => {
    go("add");
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <button className="icon-button large" onClick={() => go("cards")}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Card Details</h1>
            <button className="icon-button large" onClick={handleEdit}>
              <Icon name="edit" />
            </button>
          </div>

          <section className="panel pad stack menu-banner">
            <div className="banner-icon" style={{ background: "var(--blue)" }}>
              <Icon name="creditCard" />
            </div>
            <div>
              <p className="section-title">{card.name}</p>
              <p className="balance">{formatCurrency(currentBalance)}</p>
              <p className="subtle">{card.bank} • {card.type} card</p>
            </div>
          </section>

          <section className="panel pad stack">
            <div className="row">
              <h2 className="section-title">Transactions</h2>
              <button className="icon-button primary" onClick={handleAddTransaction}>
                <Icon name="plus" />
              </button>
            </div>
            
            <div className="tabs">
              <button 
                className={`tab ${transactionFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTransactionFilter('all')}
              >
                All
              </button>
              <button 
                className={`tab ${transactionFilter === 'income' ? 'active' : ''}`}
                onClick={() => setTransactionFilter('income')}
              >
                Income
              </button>
              <button 
                className={`tab ${transactionFilter === 'expense' ? 'active' : ''}`}
                onClick={() => setTransactionFilter('expense')}
              >
                Expense
              </button>
              <button 
                className={`tab ${transactionFilter === 'transfer' ? 'active' : ''}`}
                onClick={() => setTransactionFilter('transfer')}
              >
                Transfer
              </button>
            </div>
            
            {groupedRecords.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icon name="receipt" />
                </div>
                <h3 className="empty-title">No transactions yet</h3>
                <p className="empty-description">
                  Start adding transactions to track your spending with this card
                </p>
                <button className="primary-action" onClick={handleAddTransaction}>
                  <Icon name="plus" />
                  Add First Transaction
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </section>

          <section className="panel pad">
            <h2 className="section-title">Card Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <p className="info-label">Card Type</p>
                <p className="info-value">{card.type}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Bank</p>
                <p className="info-value">{card.bank}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Current Balance</p>
                <p className="info-value balance">{formatCurrency(currentBalance)}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Transactions</p>
                <p className="info-value">{cardRecords.length}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
