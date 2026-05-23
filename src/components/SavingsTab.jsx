import React, { useMemo } from "react";
import Icon from "./Icon.jsx";
import SavingAccount from "./SavingAccount.jsx";
import RecordItem from "./RecordItem.jsx";

export default function SavingsTab({ 
  savingAccounts, 
  records, 
  currency, 
  selectedSavingAccount, 
  onSavingAccountClick, 
  onEditSavingAccount, 
  showAllSavings, 
  onToggleShowAll 
}) {
  // Calculate saving account balances with transactions
  const savingAccountsWithBalances = useMemo(() => {
    if (!savingAccounts || !Array.isArray(savingAccounts)) return [];
    return savingAccounts.map(account => {
      // Filter transactions specific to this saving account
      const accountTransactions = records.filter(record => 
        record.account === `${account.name}` || 
        record.account === `${account.name} Savings` ||
        record.account === `${account.bank} Savings`
      );
      
      const transactionTotal = accountTransactions.reduce((sum, record) => sum + record.amount, 0);
      const baseBalance = account.baseBalance || 0; // Ensure baseBalance defaults to 0
      
      return {
        ...account,
        balance: baseBalance + transactionTotal,
        transactionCount: accountTransactions.length
      };
    });
  }, [savingAccounts, records]);

  // Calculate transactions for selected saving account
  const selectedSavingAccountTransactions = useMemo(() => {
    if (!selectedSavingAccount) return [];
    
    return records.filter(record => 
      record.account === `${selectedSavingAccount.name}` || 
      record.account === `${selectedSavingAccount.name} Savings` ||
      record.account === `${selectedSavingAccount.bank} Savings`
    ).slice(0, 5);
  }, [records, selectedSavingAccount]);

  // Calculate balance for selected saving account
  const selectedSavingAccountBalance = useMemo(() => {
    if (!selectedSavingAccount) return 0;
    
    const accountTransactions = records.filter(record => 
      record.account === `${selectedSavingAccount.name}` || 
      record.account === `${selectedSavingAccount.name} Savings` ||
      record.account === `${selectedSavingAccount.bank} Savings`
    );
    
    return accountTransactions.reduce((sum, record) => sum + record.amount, 0);
  }, [records, selectedSavingAccount]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency, 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const displaySavingAccounts = showAllSavings ? savingAccountsWithBalances : savingAccountsWithBalances.slice(0, 2);

  return (
    <>
      <section className="panel pad stack">
        <div className="row">
          <h2 className="section-title">Saving Accounts</h2>
          <button 
            className="link-button" 
            onClick={onToggleShowAll}
          >
            {showAllSavings ? "Show Less" : "All Accounts"}
          </button>
        </div>
        <div className="savings-accounts-list">
          {displaySavingAccounts.map((account) => (
            <div 
              key={account.id}
              className="savings-account-wrapper"
            >
              <SavingAccount 
                name={account.name}
                bank={account.bank}
                balance={account.balance}
                currency={currency}
                onClick={() => onSavingAccountClick(account)}
                isSelected={selectedSavingAccount?.id === account.id}
              />
              <div className="account-actions">
                <button 
                  className="icon-button small" 
                  onClick={() => onEditSavingAccount(account)}
                  aria-label="Edit account"
                >
                  <Icon name="edit" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {selectedSavingAccount && (
          <div className="row">
            <h2 className="section-title">{selectedSavingAccount.name}</h2>
            <Icon name="eye" />
          </div>
        )}
      </section>
    </>
  );
}
