import { useState, useEffect } from "react";
import { initialRecords, nextId, categoryMeta } from "../utils/helpers";

export default function useAppState() {
  const [entryType, setEntryType] = useState("expense");
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem("budget-one-currency");
    return saved || "INR";
  });
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("budget-one-records");
    return saved ? JSON.parse(saved) : initialRecords;
  });
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budget-one-budgets");
    return saved ? JSON.parse(saved) : {
      "Food & Drink" : 5000,
      "Life & Event": 10000,
      Groceries: 1000,
      Health: 2000,
      Shopping: 8000,
    };
  });

  const defaultCategories = [
    { name: "Food & Drink", icon: "food", tone: "var(--yellow)", type: "expense" },
    { name: "Shopping", icon: "bag", tone: "var(--blue)", type: "expense" },
    { name: "Health", icon: "heartLightning", tone: "var(--red)", type: "expense" },
    { name: "Transport", icon: "transport", tone: "var(--green)", type: "expense" },
    { name: "Interest", icon: "dollarBox", tone: "var(--purple)", type: "income" },
    { name: "Life & Event", icon: "briefcase", tone: "var(--orange)", type: "expense" },
    { name: "Groceries", icon: "shoppingBag", tone: "var(--pink)", type: "expense" },
    { name: "Salary", icon: "cash", tone: "var(--green)", type: "income" },
  ];

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("budget-one-categories");
    if (!saved) return defaultCategories;

    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return defaultCategories;
      return parsed.map((category) => {
        if (typeof category === "string") {
          const meta = categoryMeta(category, false);
          return { name: category, icon: meta.icon, tone: meta.tone, type: "expense" };
        }
        // Add default type for existing categories that don't have it
        return { ...category, type: category.type || "expense" };
      });
    } catch {
      return defaultCategories;
    }
  });

  // Mock cards data - in a real app, this would come from an API
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("budget-one-cards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [
          { id: 1, name: "John Doe", last: "1234", type: "credit", bank: "Chase", baseBalance: 0 },
          { id: 2, name: "Sumit Kumar", last: "5609", type: "debit", bank: "Bank of America", baseBalance: 0 },
          { id: 3, name: "Budget One", last: "8821", type: "credit", bank: "Wells Fargo", baseBalance: 0 }
        ];
      }
    }
    return [
      { id: 1, name: "John Doe", last: "1234", type: "credit", bank: "Chase", baseBalance: 0 },
      { id: 2, name: "Sumit Kumar", last: "5609", type: "debit", bank: "Bank of America", baseBalance: 0 },
      { id: 3, name: "Budget One", last: "8821", type: "credit", bank: "Wells Fargo", baseBalance: 0 }
    ];
  });

  // Mock saving accounts data - in a real app, this would come from an API
  const [savingAccounts, setSavingAccounts] = useState(() => {
    const saved = localStorage.getItem("budget-one-saving-accounts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [
          { id: 1, name: "Emergency Fund", bank: "Chase", baseBalance: 0, type: "savings" },
          { id: 2, name: "Vacation Savings", bank: "Bank of America", baseBalance: 0, type: "savings" }
        ];
      }
    }
    return [
      { id: 1, name: "Emergency Fund", bank: "Chase", baseBalance: 0, type: "savings" },
      { id: 2, name: "Vacation Savings", bank: "Bank of America", baseBalance: 0, type: "savings" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("budget-one-records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("budget-one-currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("budget-one-budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("budget-one-categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("budget-one-cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("budget-one-saving-accounts", JSON.stringify(savingAccounts));
  }, [savingAccounts]);

  const categoryMetaFromState = (name, isIncome) => {
    const category = categories.find((item) => item.name === name);
    if (category) {
      return { icon: category.icon, tone: category.tone };
    }
    return categoryMeta(name, isIncome);
  };

  const addCategory = (category, icon = "bag", tone = "var(--yellow)", type = "expense") => {
    const trimmed = category.trim();
    if (!trimmed) return;
    setCategories((current) =>
      current.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())
        ? current
        : [...current, { name: trimmed, icon, tone, type }]
    );
  };

  const updateCategory = (oldName, updates) => {
    const nextName = updates.name ? updates.name.trim() : oldName;
    setCategories((current) =>
      current.map((item) =>
        item.name === oldName ? { ...item, ...updates, name: nextName } : item
      )
    );
    setRecords((current) =>
      current.map((record) => {
        if (record.name !== oldName) return record;
        const isIncomeRecord = record.amount >= 0;
        const meta = isIncomeRecord
          ? categoryMeta(nextName, true)
          : {
              icon: updates.icon || categoryMeta(oldName, false).icon,
              tone: updates.tone || categoryMeta(oldName, false).tone,
            };
        return { ...record, name: nextName, ...meta };
      })
    );
  };

  const deleteCategory = (categoryName) => {
    setCategories((current) => current.filter((item) => item.name !== categoryName));
    setRecords((current) => current.filter((record) => record.name !== categoryName));
  };

  const addCard = (card) => {
    setCards((current) => [...current, card]);
  };

  const updateCard = (id, updatedCard) => {
    setCards((current) =>
      current.map((card) => (card.id === id ? updatedCard : card))
    );
  };

  const deleteCard = (id) => {
    setCards((current) => current.filter((card) => card.id !== id));
  };

  const addSavingAccount = (account) => {
    setSavingAccounts((current) => [...current, account]);
  };

  const updateSavingAccount = (id, updatedAccount) => {
    setSavingAccounts((current) =>
      current.map((account) => (account.id === id ? updatedAccount : account))
    );
  };

  const deleteSavingAccount = (id) => {
    setSavingAccounts((current) => current.filter((account) => account.id !== id));
  };

  const addRecord = (formData, type = entryType) => {
    if (type === "transfer") {
      const amount = Number(formData.get("amount") || 0);
      const fromAccount = formData.get("fromAccount");
      const toAccount = formData.get("toAccount");
      const date = formData.get("date") || new Date().toISOString().split('T')[0];
      const note = formData.get("note") || "";
      const meta = { icon: "transfer", tone: "var(--blue)" }; // Blue color for transfers

      setRecords((current) => [
        {
          id: nextId(current),
          name: `Transfer from ${fromAccount} to ${toAccount}`,
          account: fromAccount,
          amount: -amount,
          date,
          note,
          type: "transfer",
          ...meta,
        },
        {
          id: nextId(current) + 1,
          name: `Transfer from ${fromAccount} to ${toAccount}`,
          account: toAccount,
          amount: amount,
          date,
          note,
          type: "transfer",
          ...meta,
        },
        ...current,
      ]);
    } else {
      const isIncome = type === "income";
      const amount = Number(formData.get("amount") || 0);
      const name = formData.get("category");
      const account = formData.get("account");
      const date = formData.get("date") || new Date().toISOString().split('T')[0];
      const note = formData.get("note") || "";
      
      // Use category data from state if available, otherwise fallback to categoryMeta
      const category = categories.find(cat => cat.name === name);
      const meta = category 
        ? { icon: category.icon, tone: category.tone }
        : categoryMeta(name, isIncome);
      
      // Debug logging to check what's being saved
      console.log('Adding record:', { name, category, meta });

      setRecords((current) => [
        {
          id: nextId(current),
          name,
          account,
          amount: isIncome ? amount : -amount,
          date,
          note,
          ...meta,
        },
        ...current,
      ]);
    }
  };

  const deleteRecord = (id) => {
    setRecords((current) => current.filter((record) => record.id !== id));
  };

  const updateRecord = (id, formData) => {
    const isIncome = entryType === "income";
    const amount = Number(formData.get("amount") || 0);
    const name = formData.get("category");
    const account = formData.get("account");
    const date = formData.get("date") || new Date().toISOString().split("T")[0];
    const note = formData.get("note") || "";
    
    // Use category data from state if available, otherwise fallback to categoryMeta
    const category = categories.find(cat => cat.name === name);
    const meta = category 
      ? { icon: category.icon, tone: category.tone }
      : categoryMeta(name, isIncome);

    console.log('Updating record:', { id, name, category, meta });

    setRecords((current) => current.map((record) => {
      if (record.id !== id) return record;
      return {
        ...record,
        name,
        account,
        amount: isIncome ? amount : -amount,
        date,
        note,
        ...meta,
      };
    }));
  };

  const totalBalance = records.reduce((sum, record) => sum + record.amount, 0);

  // Find the latest month with data
  const getLatestMonthWithData = () => {
    if (records.length === 0) {
      return { month: new Date().getMonth(), year: new Date().getFullYear() };
    }
    
    const latestRecord = records.reduce((latest, record) => {
      const recordDate = new Date(record.date);
      const latestDate = new Date(latest.date);
      return recordDate > latestDate ? record : latest;
    });
    
    const latestDate = new Date(latestRecord.date);
    return { month: latestDate.getMonth(), year: latestDate.getFullYear() };
  };
  
  const latestMonth = getLatestMonthWithData();
  const spentThisMonth = records
    .filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === latestMonth.month && recordDate.getFullYear() === latestMonth.year && record.amount < 0 && record.type !== "transfer";
    })
    .reduce((sum, record) => sum + Math.abs(record.amount), 0);

  const totalBudgetThisMonth = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const budgetLeft = totalBudgetThisMonth - spentThisMonth;

  const categorySpends = records
    .filter(record => record.amount < 0 && record.type !== "transfer")
    .reduce((acc, record) => {
      acc[record.name] = (acc[record.name] || 0) + Math.abs(record.amount);
      return acc;
    }, {});

  const accountBalances = records.reduce((acc, record) => {
    acc[record.account] = (acc[record.account] || 0) + record.amount;
    return acc;
  }, {});

  return {
    records,
    entryType,
    setEntryType,
    addRecord,
    updateRecord,
    deleteRecord,
    currency,
    setCurrency,
    totalBalance,
    spentThisMonth,
    budgetLeft,
    categorySpends,
    budgets,
    setBudgets,
    totalBudgetThisMonth,
    accountBalances,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    cards,
    addCard,
    updateCard,
    deleteCard,
    savingAccounts,
    addSavingAccount,
    updateSavingAccount,
    deleteSavingAccount,
  };
}
