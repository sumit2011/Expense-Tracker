import React from "react";

export default function StatBar({ name, amount, tone, value }) {
  return (
    <div className="stat-bar" style={{ "--tone": tone, "--value": value }}>
      <div className="row"><span style={{ fontSize: 12 }}>{name}</span><strong style={{ fontSize: 12 }}>{amount}</strong></div>
      <div className="stat-fill"><span /></div>
    </div>
  );
}
