export const initialRecords = [
  { id: 1, name: "Shopping", account: "Credit Card", amount: -25.56, date: "2026-05-15", icon: "bag", tone: "var(--yellow)" },
  { id: 2, name: "Salary", account: "Cash", amount: 500.5, date: "2026-05-01", icon: "cash", tone: "var(--green)" },
  { id: 3, name: "Groceries", account: "Credit Card", amount: -25.56, date: "2026-05-10", icon: "shoppingCart", tone: "var(--orange)" },
  { id: 4, name: "Food & Drink", account: "Cash", amount: -45.3, date: "2026-05-12", icon: "utensils", tone: "var(--orange)" },
  { id: 5, name: "Transport", account: "Debit Card", amount: -12.8, date: "2026-05-08", icon: "bus", tone: "var(--blue)" },
];

export const screenNames = new Set(["onboarding", "home", "records", "budgets", "add-budget", "stats", "cards", "categories", "add-category", "edit-category", "icon-picker", "settings", "add", "add-card", "edit-card", "card-details", "saving-account-details", "menu"]);

export function money(amount) {
  const sign = amount < 0 ? "-$" : "$";
  return `${sign}${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function nextId(records) {
  return Math.max(0, ...records.map((record) => record.id)) + 1;
}

export function categoryMeta(name, isIncome) {
  if (isIncome) return { icon: "cash", tone: "var(--green)" };

  const map = {
    "Food & Drink": { icon: "bag", tone: "var(--orange)" },
    Shopping: { icon: "bag", tone: "var(--yellow)" },
    Health: { icon: "shield", tone: "var(--green)" },
    Transport: { icon: "card", tone: "var(--blue)" },
    Interest: { icon: "cash", tone: "var(--pink)" },
    "Life & Event": { icon: "spark", tone: "var(--purple)" },
    Vacation: { icon: "briefcase", tone: "var(--orange)" },
  };

  return map[name] || { icon: "bag", tone: "var(--yellow)" };
}

export function screenToPath(screen) {
  if (screen === "onboarding") return "/";
  if (screen === "add-category") return "/categories/add";
  if (screen === "add-card") return "/add-card";
  if (screen === "add-budget") return "/add-budget";
  if (screen.startsWith("edit-category/")) {
    const name = screen.split("/")[1];
    return `/categories/edit/${encodeURIComponent(name)}`;
  }
  if (screen.startsWith("edit-card/")) {
    const id = screen.split("/")[1];
    return `/edit-card/${id}`;
  }
  if (screen.startsWith("card-details/")) {
    const id = screen.split("/")[1];
    return `/card/${id}`;
  }
  if (screen.startsWith("saving-account-details/")) {
    const id = screen.split("/")[1];
    return `/saving-account/${id}`;
  }
  return `/${screen}`;
}

export function pathToScreen(pathname) {
  if (!pathname || pathname === "/") return "onboarding";
  const raw = pathname.replace(/^\//, "");
  if (raw.startsWith("categories/edit/")) {
    const parts = raw.split("/");
    if (parts.length === 4 && parts[3] === "icon") {
      return "icon-picker";
    }
    const name = parts[2];
    return `edit-category/${decodeURIComponent(name)}`;
  }
  if (raw.startsWith("card/")) {
    const parts = raw.split("/");
    if (parts.length === 2) {
      return `card-details/${parts[1]}`;
    }
  }
  if (raw.startsWith("saving-account/")) {
    const parts = raw.split("/");
    if (parts.length === 2) {
      return `saving-account-details/${parts[1]}`;
    }
  }
  if (raw === "categories/add") return "add-category";
  return screenNames.has(raw) ? raw : "home";
}
