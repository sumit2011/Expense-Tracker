import React from "react";
import Icon from "./Icon.jsx";

function NavButton({ active, iconName, label, onClick }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      <Icon name={iconName} />
      <span>{label}</span>
    </button>
  );
}

export default function Nav({ screen, go }) {
  return (
    <nav className="nav" aria-label="Primary">
      <NavButton active={screen === "home"} iconName="home" label="Home" onClick={() => go("home")} />
      <NavButton active={screen === "records"} iconName="records" label="Records" onClick={() => go("records")} />
      <button className="add" onClick={() => go("add")} aria-label="Add record">
        <span>
          <Icon name="plus" />
        </span>
      </button>
      <NavButton active={screen === "cards"} iconName="wallet" label="Accounts" onClick={() => go("cards")} />
      <NavButton active={screen === "menu"} iconName="menu" label="Menu" onClick={() => go("menu")} />
    </nav>
  );
}
