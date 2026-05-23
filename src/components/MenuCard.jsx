import React from "react";
import Icon from "./Icon.jsx";

export default function MenuCard({ screen, iconName, title, text, go }) {
  return (
    <button className="menu-card" onClick={() => go(screen)}>
      <Icon name={iconName} />
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}
