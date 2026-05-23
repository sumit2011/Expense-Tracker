import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

export default function Settings({ screen, go, currency, setCurrency }) {
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <button className="icon-button large" onClick={() => go("menu")}><Icon name="chevronLeft" /></button>
            <h1 className="title">Settings</h1>
            <button className="icon-button primary" onClick={() => {}}><Icon name="shield" /></button>
          </div>

          <section className="panel pad stack settings-banner">
            <div className="banner-icon"><Icon name="shield" /></div>
            <div>
              <p className="section-title">Go Premium</p>
              <p className="subtle">Unlock advanced features and themes.</p>
            </div>
            <button className="button small">Get Premium</button>
          </section>

          <section className="panel stack settings-list">
            <button type="button" className="settings-item" onClick={() => go("categories")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--orange)" }}><Icon name="bag" /></span>
                <div>
                  <p className="settings-item-title">Categories</p>
                  {/* <p className="subtle">Manage expense categories</p> */}
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => go("cards")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--blue)" }}><Icon name="card" /></span>
                <div>
                  <p className="settings-item-title">Accounts</p>
                  {/* <p className="subtle">Review your wallet balances</p> */}
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => setShowCurrencyOptions((current) => !current)}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--green)" }}><Icon name="cash" /></span>
                <div>
                  <p className="settings-item-title">Default Currency</p>
                  {/* <p className="subtle">Set your preferred currency</p> */}
                </div>
              </div>
              <div className="settings-item-right">
                <span>{currency}</span>
                <Icon name="chevronRight" />
              </div>
            </button>
            {showCurrencyOptions && (
              <div className="field currency-panel">
                <label htmlFor="currency">Choose currency</label>
                <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            )}
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
