import React, { useState, useMemo } from "react";
import Icon from "../components/Icon.jsx";
import RecordItem from "../components/RecordItem.jsx";
import Nav from "../components/Nav.jsx";
import TabNavigation from "../components/TabNavigation.jsx";
import CardsTab from "../components/CardsTab.jsx";
import SavingsTab from "../components/SavingsTab.jsx";

export default function Cards({ 
  screen, 
  go, 
  records, 
  currency = "USD", 
  cards, 
  updateCard, 
  deleteCard, 
  savingAccounts, 
  updateSavingAccount, 
  deleteSavingAccount, 
  accountBalances 
}) {
  const [activeTab, setActiveTab] = useState('cards');

  // Safety checks for data
  const safeRecords = records || [];
  const safeCards = cards || [];
  const safeSavingAccounts = savingAccounts || [];

  // Calculate total balance from all cards and saving accounts using actual balances
  const totalBalance = useMemo(() => {
    let total = 0;
    
    // Add card balances
    safeCards.forEach(card => {
      const balance = accountBalances[card.name] || accountBalances[`Card ${card.last}`] || card.baseBalance || 0;
      total += balance;
    });
    
    // Add savings account balances
    safeSavingAccounts.forEach(account => {
      const balance = accountBalances[account.name] || account.baseBalance || 0;
      total += balance;
    });
    
    return total;
  }, [safeCards, safeSavingAccounts, accountBalances]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency, 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const handleCardClick = (card) => {
    go(`card-details/${card.id}`);
  };

  const handleSavingAccountClick = (account) => {
    go(`saving-account-details/${account.id}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddCard = () => {
    go("add-card");
  };

  const handleAddSavingAccount = () => {
    go("add-saving-account");
  };

  const handleEditCard = (card) => {
    go(`edit-card/${card.id}`);
  };

  const handleEditSavingAccount = (account) => {
    go(`edit-saving-account/${account.id}`);
  };

  
  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <button className="icon-button large" onClick={() => go("home")}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Accounts</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          <section className="panel pad stack menu-banner">
            <div className="banner-icon"><Icon name="wallet" /></div>
            <div>
              <p className="section-title">Total Balance</p>
              <p className="balance">{formatCurrency(totalBalance)}</p>
              <p className="subtle">{safeCards.length + safeSavingAccounts.length} accounts total</p>
            </div>
          </section>

          <section className="panel stack settings-list">
            {safeCards.length === 0 && safeSavingAccounts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icon name="wallet" />
                </div>
                <h3 className="empty-title">No accounts yet</h3>
                <p className="empty-description">
                  Start by adding your first card or savings account to track your finances
                </p>
                <div className="empty-actions">
                  <button className="primary-action" onClick={handleAddCard}>
                    <Icon name="plus" />
                    Add Your First Card
                  </button>
                  <button className="secondary-action" onClick={handleAddSavingAccount}>
                    <Icon name="wallet" />
                    Add Savings Account
                  </button>
                </div>
              </div>
            ) : (
              <>
              <div>
                    <p className="subtle " style={{paddingLeft:"14px"}}> cards</p>
              </div>
                    
                {safeCards.map((card) => (
                  <button key={card.id} type="button" className="settings-item" onClick={() => handleCardClick(card)}>
                    <div className="settings-item-left">
                      <span className="settings-icon" style={{ background: "var(--blue)" }}>
                        <Icon name="creditCard" />
                      </span>
                      <div>
                        <p className="settings-item-title">{card.name}</p>
                        <p className="subtle">{card.bank} • {card.type} card</p>
                      </div>
                    </div>
                    <div className="settings-item-right">
                      <p className="balance">{formatCurrency(accountBalances[card.name] || accountBalances[`Card ${card.last}`] || card.baseBalance || 0)}</p>
                      <Icon name="chevronRight" />
                    </div>
                  </button>
                ))}

                <div>
                    <p className="subtle " style={{paddingLeft:"14px"}}> accounts</p>
              </div>
                {safeSavingAccounts.map((account) => (
                  <button key={account.id} type="button" className="settings-item" onClick={() => handleSavingAccountClick(account)}>
                    <div className="settings-item-left">
                      <span className="settings-icon" style={{ background: "var(--green)" }}>
                        <Icon name="wallet" />
                      </span>
                      <div>
                        <p className="settings-item-title">{account.name}</p>
                        <p className="subtle">{account.bank} savings account</p>
                      </div>
                    </div>
                    <div className="settings-item-right">
                      <p className="balance">{formatCurrency(accountBalances[account.name] || account.baseBalance || 0)}</p>
                      <Icon name="chevronRight" />
                    </div>
                  </button>
                ))}

                <div>
                    <p className="subtle " style={{paddingLeft:"14px"}}> add card or account</p>
              </div>

                <button type="button" className="settings-item" onClick={handleAddCard}>
                  <div className="settings-item-left">
                    <span className="settings-icon" style={{ background: "var(--primary)" }}>
                      <Icon name="plus" />
                    </span>
                    <div>
                      <p className="settings-item-title">Add New Card</p>
                      <p className="subtle">Credit or debit card</p>
                    </div>
                  </div>
                  <Icon name="chevronRight" />
                </button>

                <button type="button" className="settings-item" onClick={handleAddSavingAccount}>
                  <div className="settings-item-left">
                    <span className="settings-icon" style={{ background: "var(--purple)" }}>
                      <Icon name="plus" />
                    </span>
                    <div>
                      <p className="settings-item-title">Add Savings Account</p>
                      <p className="subtle">Bank or credit union account</p>
                    </div>
                  </div>
                  <Icon name="chevronRight" />
                </button>
              </>
            )}
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
