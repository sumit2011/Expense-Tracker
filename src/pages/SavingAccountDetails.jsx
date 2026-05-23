import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import RecordItem from "../components/RecordItem.jsx";
import Nav from "../components/Nav.jsx";

export default function SavingAccountDetails({ 
  screen, 
  go, 
  records, 
  deleteRecord,
  currency = "USD", 
  savingAccounts, 
  accountBalances 
}) {
  const { id } = useParams();
  const account = savingAccounts?.find((account) => String(account.id) === id);
  const [transactionFilter, setTransactionFilter] = useState('all'); // 'all', 'income', 'expense', 'transfer'

  if (!account) {
    return (
      <div className="screen">
        <div className="stack">
          <div className="row">
            <button className="icon-button large" onClick={() => go("cards")}>
              <Icon name="arrowLeft" />
            </button>
            <h1 className="title">Account Not Found</h1>
            <div style={{ width: "38px" }}></div>
          </div>
          <div className="panel pad">
            <p>The savings account you're looking for doesn't exist.</p>
            <button className="primary-action" onClick={() => go("cards")}>
              <Icon name="arrowLeft" />
              Back to Accounts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter records for this specific savings account
  const accountRecords = useMemo(() => {
    let filteredRecords = records?.filter(record => record.account === account.name) || [];

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
  }, [records, account.name, transactionFilter]);

  // Group records by date
  const groupedRecords = useMemo(() => {
    const groups = accountRecords.reduce((acc, record) => {
      const label = new Date(record.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      if (!acc[label]) acc[label] = [];
      acc[label].push(record);
      return acc;
    }, {});

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[0]) - new Date(a[0]);
    });
  }, [accountRecords]);

  // Calculate current balance
  const currentBalance = useMemo(() => {
    return accountBalances[account.name] || account.baseBalance || 0;
  }, [accountBalances, account.baseBalance, account.name]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency, 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const handleEdit = () => {
    go(`edit-saving-account/${account.id}`);
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
            <h1 className="title">Account Details</h1>
            <button className="icon-button large" onClick={handleEdit}>
              <Icon name="edit" />
            </button>
          </div>

          <section className="panel pad stack menu-banner">
            <div className="banner-icon" style={{ background: "var(--green)" }}>
              <Icon name="wallet" />
            </div>
            <div>
              <p className="section-title">{account.name}</p>
              <p className="balance">{formatCurrency(currentBalance)}</p>
              <p className="subtle">{account.bank} savings account</p>
            </div>
          </section>

          <section className="panel pad stack">
            <div className="row">
              <h2 className="section-title">Transactions</h2>
              <button className="icon-button primary" onClick={handleAddTransaction}>
                <Icon name="plus" />
              </button>
            </div>
            
            <div className="tabs chips">
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
                  Start adding transactions to track your savings account activity
                </p>
                {/* <button className="primary-action" onClick={handleAddTransaction}>
                  <Icon name="plus" />
                  Add First Transaction
                </button> */}
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
            <h2 className="section-title">Account Information</h2>
            <div className="divider" />
            <div className="info-grid">
              <div className="info-item">
                <p className="info-label">Account Type</p>
                <p className="info-value">Savings Account</p>
              </div>
              <div className="info-item">
                <p className="info-label">Bank</p>
                <p className="info-value">{account.bank}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Current Balance</p>
                <p className="info-value balance">{formatCurrency(currentBalance)}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Transactions</p>
                <p className="info-value">{accountRecords.length}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
