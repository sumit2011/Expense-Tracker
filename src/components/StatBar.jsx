import React from "react";

export default function StatBar({ name, amount, tone, value, onClick }) {
  return (
    <button className="stat-bar clickable" style={{ "--tone": tone, "--value": value }} onClick={onClick}>
      <div className="row"><span style={{ fontSize: 12 }}>{name}</span><strong style={{ fontSize: 12 }}>{amount}</strong></div>
      <div className="stat-fill"><span /></div>
    </button>
  );
}
