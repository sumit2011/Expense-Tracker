import React from "react";
import Icon from "../components/Icon.jsx";

export default function Onboarding({ start }) {
  return (
    <section className="screen no-nav onboarding">
      <div className="onboarding-art">
        <span className="floating-row" style={{ "--top": "10px", "--rot": "-4deg" }} />
        <span className="floating-row" style={{ "--top": "86px", "--rot": "3deg" }} />
        <span className="floating-row" style={{ "--top": "164px", "--rot": "-2deg" }} />
        <span className="floating-row" style={{ "--top": "242px", "--rot": "4deg" }} />
      </div>
      <div className="onboarding-logo"><Icon name="wallet" /></div>
      <h1>Track Your Budget</h1>
      <p>Track your income and expenses easily.</p>
      <div className="trust-pill"><Icon name="shield" /> Does not save any data</div>
      <div className="happy"><strong>20M+</strong><span>HAPPY USERS</span><p style={{ color: "var(--yellow)", fontSize: 22, margin: "12px 0" }}>*****</p></div>
      <button className="primary-action" onClick={start}>Start Tracking</button>
      <p style={{ maxWidth: 260, margin: "18px auto 0", fontSize: 11 }}>By continuing in, you accept the privacy policy and terms of use.</p>
    </section>
  );
}
