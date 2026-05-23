import React, { useEffect } from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

const parseDateValue = (dateString) => {
  const parsed = new Date(dateString);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString().split("T")[0] : parsed.toISOString().split("T")[0];
};

export default function AddRecord({ screen, go, entryType, setEntryType, addRecord, recordToEdit, updateRecord, categories, cards = [], savingAccounts = [] }) {
  useEffect(() => {
    if (recordToEdit) {
      setEntryType(recordToEdit.amount >= 0 ? "income" : "expense");
    }
  }, [recordToEdit, setEntryType]);

  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (recordToEdit) {
      updateRecord(recordToEdit.id, formData);
    } else {
      addRecord(formData, entryType);
    }
    go("records");
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <div className="row center"><button className="icon-button large" onClick={() => go("home")}><Icon name="chevronLeft" /></button><h1 className="title">{recordToEdit ? "Edit Record" : "Add Record"}</h1></div>
          </div>
          <form className="form-card" onSubmit={onSubmit}>
            <div className="segmented">
              <button type="button" className={entryType === "expense" ? "active" : ""} onClick={() => setEntryType("expense")}>Expense</button>
              <button type="button" className={entryType === "income" ? "active" : ""} onClick={() => setEntryType("income")}>Income</button>
              <button type="button" className={entryType === "transfer" ? "active" : ""} onClick={() => setEntryType("transfer")}>Transfer</button>
            </div>
            <div className="field"><label htmlFor="amount">Amount</label><input id="amount" name="amount" type="number"  min="0" step="0.01" placeholder="Enter amount" defaultValue={recordToEdit ? Math.abs(recordToEdit.amount) : ""} required /></div>
            {entryType !== "transfer" && (
              <div className="field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  defaultValue={recordToEdit?.name || categories[0]?.name || "Shopping"}
                >
                  {categories
                    .filter(category => {
                      // Filter categories based on their type property
                      if (entryType === "expense") {
                        return category.type === "expense";
                      }
                      // When adding income, show only income categories
                      return category.type === "income";
                    })
                    .map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {entryType === "transfer" ? (
              <>
                <div className="field">
                  <label htmlFor="fromAccount">From Account</label>
                  <select id="fromAccount" name="fromAccount" defaultValue={recordToEdit?.account || cards[0]?.name }>
                    {cards.map(card => (
                      <option key={card.id} value={card.name}>
                        {card.name} Card (****{card.last})
                      </option>
                    ))}
                    {savingAccounts.map(account => (
                      <option key={account.id} value={account.name}>
                        {account.name} ({account.bank})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="toAccount">To Account</label>
                  <select id="toAccount" name="toAccount" defaultValue={recordToEdit?.account || savingAccounts[0]?.name }>
                    {cards.map(card => (
                      <option key={card.id} value={card.name}>
                        {card.name} Card (****{card.last})
                      </option>
                    ))}
                    {savingAccounts.map(account => (
                      <option key={account.id} value={account.name}>
                        {account.name} ({account.bank})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="field">
                <label htmlFor="account">Account</label>
                <select id="account" name="account" defaultValue={recordToEdit?.account || cards[0]?.name }>
                  {cards.map(card => (
                    <option key={card.id} value={card.name}>
                      {card.name} Card (****{card.last})
                    </option>
                  ))}
                  {savingAccounts.map(account => (
                    <option key={account.id} value={account.name}>
                      {account.name} ({account.bank})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="field"><label htmlFor="date">Date</label><input id="date" name="date" type="date" defaultValue={recordToEdit ? parseDateValue(recordToEdit.date) : new Date().toISOString().split("T")[0]} required /></div>
            <div className="field"><label htmlFor="note">Note</label><textarea id="note" name="note" rows="3" placeholder="Add a note (optional)" defaultValue={recordToEdit?.note || ""} /></div>
            <button className="primary-action center" type="submit">{recordToEdit ? "Update Record" : "Add Record"}</button>
          </form>
          <section className="panel pad stack">
            <h2 className="section-title">Quick Categories</h2>
            <div className="chips">
              <button className="chip" type="button" style={{ "--chip": "var(--orange)" }}><span className="chip-dot" /><span><span className="chip-title">Food</span><span className="chip-value">$430</span></span></button>
              <button className="chip" type="button" style={{ "--chip": "var(--yellow)" }}><span className="chip-dot" /><span><span className="chip-title">Shopping</span><span className="chip-value">$220</span></span></button>
              <button className="chip" type="button" style={{ "--chip": "var(--green)" }}><span className="chip-dot" /><span><span className="chip-title">Travel</span><span className="chip-value">$180</span></span></button>
            </div>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
