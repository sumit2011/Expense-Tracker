import React from "react";

export default function CreditCard({ name, last }) {
  return (
    <article className="credit-card">
      <div className="card-logo"><span /><span /></div>
      <div className="card-number"><span>****</span><span>****</span><span>****</span><span>{last}</span></div>
      <div className="card-bottom">
        <span><strong>{name}</strong><small>CVV: ***</small></span>
        <span style={{ textAlign: "right" }}><small>Expire Date</small><strong style={{ fontSize: 14 }}>**/**</strong></span>
      </div>
    </article>
  );
}
