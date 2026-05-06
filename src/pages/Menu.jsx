import React from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

export default function Menu({ screen, go, currency, setCurrency, totalBalance }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <div style={{ width: "38px" }}></div>
            <h1 className="title">Menu</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          <section className="panel pad stack menu-banner">
            <div className="banner-icon"><Icon name="wallet" /></div>
            <div>
              <p className="section-title">Total Balance</p>
              <p className="balance">{formatCurrency(totalBalance)}</p>
              <p className="subtle">Budget One Expense Tracker</p>
            </div>
          </section>

          <section className="panel stack settings-list">
            <button type="button" className="settings-item" onClick={() => go("budgets")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--orange)" }}><Icon name="document" /></span>
                <div>
                  <p className="settings-item-title">Budgets</p>
                  <p className="subtle">Track limits and overspending</p>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => go("stats")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--blue)" }}><Icon name="spark" /></span>
                <div>
                  <p className="settings-item-title">Statistics</p>
                  <p className="subtle">Category charts and trends</p>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => go("categories")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--purple)" }}><Icon name="bag" /></span>
                <div>
                  <p className="settings-item-title">Categories</p>
                  <p className="subtle">Manage income and expense categories</p>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => go("cards")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--green)" }}><Icon name="card" /></span>
                <div>
                  <p className="settings-item-title">Accounts</p>
                  <p className="subtle">Cards and recent payments</p>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => go("backup")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--teal)" }}><Icon name="search" /></span>
                <div>
                  <p className="settings-item-title">Backup & Data</p>
                  <p className="subtle">Export, import and manage data</p>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => go("settings")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--red)" }}><Icon name="shield" /></span>
                <div>
                  <p className="settings-item-title">Settings</p>
                  <p className="subtle">General app preferences</p>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
            <button type="button" className="settings-item" onClick={() => go("onboarding")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--pink)" }}><Icon name="smiley" /></span>
                <div>
                  <p className="settings-item-title">Onboarding</p>
                  <p className="subtle">Preview the welcome screen</p>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
