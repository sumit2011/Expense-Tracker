import React from "react";

export default function Progress({ value = "54%", color = "var(--primary)" }) {
  return (
    <div className="progress">
      <span style={{ "--value": value, "--color": color }} />
    </div>
  );
}
