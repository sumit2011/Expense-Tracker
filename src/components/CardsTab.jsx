import React, { useMemo } from "react";
import Icon from "./Icon.jsx";
import CreditCard from "./CreditCard.jsx";
import RecordItem from "./RecordItem.jsx";

export default function CardsTab({ 
  cards, 
  records, 
  currency, 
  selectedCard, 
  onCardClick, 
  onEditCard, 
  showAllCards, 
  onToggleShowAll 
}) {
  // Calculate card balances with transactions
  const cardsWithBalances = useMemo(() => {
    if (!cards || !Array.isArray(cards)) return [];
    return cards.map(card => {
      // Filter transactions specific to this card (using card name/last digits)
      const cardTransactions = records.filter(record => 
        record.account === `Card ${card.last}` || 
        record.account === `${card.name} Card` ||
        record.account === `${card.bank} Card` ||
        (record.account === "Credit Card" && card.type === "credit") ||
        (record.account === "Debit Card" && card.type === "debit")
      );
      
      const transactionTotal = cardTransactions.reduce((sum, record) => sum + record.amount, 0);
      const baseBalance = card.baseBalance || 0; // Ensure baseBalance defaults to 0
      
      return {
        ...card,
        balance: baseBalance + transactionTotal,
        transactionCount: cardTransactions.length
      };
    });
  }, [cards, records]);

  // Calculate transactions for selected card
  const selectedCardTransactions = useMemo(() => {
    if (!selectedCard) return [];
    
    return records.filter(record => 
      record.account === `Card ${selectedCard.last}` || 
      record.account === `${selectedCard.name} Card` ||
      record.account === `${selectedCard.bank} Card` ||
      (record.account === "Credit Card" && selectedCard.type === "credit") ||
      (record.account === "Debit Card" && selectedCard.type === "debit")
    ).slice(0, 5);
  }, [records, selectedCard]);

  // Calculate balance for selected card
  const selectedCardBalance = useMemo(() => {
    if (!selectedCard) return 0;
    
    const cardTransactions = records.filter(record => 
      record.account === `Card ${selectedCard.last}` || 
      record.account === `${selectedCard.name} Card` ||
      record.account === `${selectedCard.bank} Card` ||
      (record.account === "Credit Card" && selectedCard.type === "credit") ||
      (record.account === "Debit Card" && selectedCard.type === "debit")
    );
    
    return cardTransactions.reduce((sum, record) => sum + record.amount, 0);
  }, [records, selectedCard]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency, 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const displayCards = showAllCards ? cardsWithBalances : cardsWithBalances.slice(0, 2);

  return (
    <>
      <section className="panel pad stack">
        <div className="row">
          <h2 className="section-title">Wallet Cards</h2>
          <button 
            className="link-button" 
            onClick={onToggleShowAll}
          >
            {showAllCards ? "Show Less" : "All Cards"}
          </button>
        </div>
        <div className="cards-strip">
          {displayCards.map((card) => (
            <div 
              key={card.id}
              className={`credit-card-wrapper ${selectedCard?.id === card.id ? 'selected' : ''}`}
            >
              <div onClick={() => onCardClick(card)}>
                <CreditCard name={card.name} last={card.last} />
              </div>
              <div className="card-actions">
                <button 
                  className="icon-button small" 
                  onClick={() => onEditCard(card)}
                  aria-label="Edit card"
                >
                  <Icon name="edit" />
                </button>
              </div>
              {selectedCard?.id === card.id && (
                <div className="card-details">
                  <p className="card-bank">{card.bank}</p>
                  <p className="card-type">{card.type}</p>
                  <p className="card-balance">{formatCurrency(card.balance)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {selectedCard && (
          <div className="row">
            <h2 className="section-title">My {selectedCard.type === 'credit' ? 'Credit' : 'Debit'} Card</h2>
            <Icon name="eye" />
          </div>
        )}
      </section>
    </>
  );
}
