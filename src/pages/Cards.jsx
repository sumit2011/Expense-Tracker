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
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedSavingAccount, setSelectedSavingAccount] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [showAllSavings, setShowAllSavings] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');

  // Safety checks for data
  const safeRecords = records || [];
  const safeCards = cards || [];
  const safeSavingAccounts = savingAccounts || [];

  // Calculate total balance from all cards and saving accounts
  const totalBalance = useMemo(() => {
    const cardsTotal = safeCards.reduce((sum, card) => sum + (card.baseBalance || 0), 0);
    const savingsTotal = safeSavingAccounts.reduce((sum, account) => sum + (account.baseBalance || 0), 0);
    const cardsTransactionsTotal = safeRecords.reduce((sum, record) => sum + record.amount, 0);
    return cardsTotal + savingsTotal + cardsTransactionsTotal;
  }, [safeCards, safeSavingAccounts, safeRecords]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency, 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const handleCardClick = (card) => {
    setSelectedCard(selectedCard?.id === card.id ? null : card);
    setSelectedSavingAccount(null); // Clear saving account selection
  };

  const handleSavingAccountClick = (account) => {
    setSelectedSavingAccount(selectedSavingAccount?.id === account.id ? null : account);
    setSelectedCard(null); // Clear card selection
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear selections when switching tabs
    setSelectedCard(null);
    setSelectedSavingAccount(null);
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

  const handleToggleShowAllCards = () => {
    setShowAllCards(!showAllCards);
  };

  const handleToggleShowAllSavings = () => {
    setShowAllSavings(!showAllSavings);
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <div style={{ width: "38px" }}></div>
            <h1 className="title">Accounts</h1>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="icon-button large primary" onClick={handleAddCard}>
                <Icon name="plus" />
              </button>
              <button className="icon-button large primary" onClick={handleAddSavingAccount}>
                <Icon name="plus" />
              </button>
            </div>
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
                <div className="account-group">
                  <div className="group-header">
                    <div className="group-info">
                      <h3 className="section-title">Credit & Debit Cards</h3>
                      <p className="group-description">Your payment cards</p>
                    </div>
                    <span className="group-count">{safeCards.length}</span>
                  </div>
                  {safeCards.length === 0 ? (
                    <div className="empty-group">
                      <div className="empty-group-icon">
                        <Icon name="creditCard" />
                      </div>
                      <p className="empty-group-text">No cards added yet</p>
                      <button className="text-button" onClick={handleAddCard}>
                        <Icon name="plus" />
                        Add your first card
                      </button>
                    </div>
                  ) : (
                    safeCards.map((card) => (
                      <div key={card.id} className="settings-item">
                        <button type="button" className="settings-item-main" onClick={() => handleCardClick(card)}>
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
                            <p className="balance">{formatCurrency(card.baseBalance || 0)}</p>
                            <Icon name="chevronRight" />
                          </div>
                        </button>
                        <button 
                          type="button" 
                          className="settings-item-edit" 
                          onClick={() => handleEditCard(card)}
                          aria-label={`Edit ${card.name} card`}
                        >
                          <Icon name="edit" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="account-group">
                  <div className="group-header">
                    <div className="group-info">
                      <h3 className="section-title">Savings Accounts</h3>
                      <p className="group-description">Your savings and checking accounts</p>
                    </div>
                    <span className="group-count">{safeSavingAccounts.length}</span>
                  </div>
                  {safeSavingAccounts.length === 0 ? (
                    <div className="empty-group">
                      <div className="empty-group-icon">
                        <Icon name="wallet" />
                      </div>
                      <p className="empty-group-text">No savings accounts yet</p>
                      <button className="text-button" onClick={handleAddSavingAccount}>
                        <Icon name="plus" />
                        Add your first savings account
                      </button>
                    </div>
                  ) : (
                    safeSavingAccounts.map((account) => (
                      <div key={account.id} className="settings-item">
                        <button type="button" className="settings-item-main" onClick={() => handleSavingAccountClick(account)}>
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
                            <p className="balance">{formatCurrency(account.baseBalance || 0)}</p>
                            <Icon name="chevronRight" />
                          </div>
                        </button>
                        <button 
                          type="button" 
                          className="settings-item-edit" 
                          onClick={() => handleEditSavingAccount(account)}
                          aria-label={`Edit ${account.name} account`}
                        >
                          <Icon name="edit" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="account-group">
                  <button type="button" className="settings-item add-item" onClick={() => go("add-card")}>
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
                </div>

                <div className="account-group">
                  <button type="button" className="settings-item add-item" onClick={() => go("add-saving-account")}>
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
                </div>
              </>
            )}
          </section>

          {(safeCards.length > 0 || safeSavingAccounts.length > 0) && (
            <section className="panel pad stack">
              <h2 className="section-title">Quick Summary</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <p className="summary-label">Total Cards</p>
                  <p className="summary-value">{safeCards.length}</p>
                </div>
                <div className="summary-item">
                  <p className="summary-label">Savings Accounts</p>
                  <p className="summary-value">{safeSavingAccounts.length}</p>
                </div>
                <div className="summary-item">
                  <p className="summary-label">Total Balance</p>
                  <p className="summary-value balance">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
