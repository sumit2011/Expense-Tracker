import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import useAppState from "./hooks/useAppState.jsx";
import Home from "./pages/Home.jsx";
import Records from "./pages/Records.jsx";
import Budgets from "./pages/Budgets.jsx";
// import AddBudget from "./pages/AddBudget.jsx";
import Stats from "./pages/Stats.jsx";
import CategoryDetails from "./pages/CategoryDetails.jsx";
import Cards from "./pages/Cards.jsx";
import Categories from "./pages/Categories.jsx";
import AddCategory from "./pages/AddCategory.jsx";
import EditCategory from "./pages/EditCategory.jsx";
import IconPicker from "./pages/IconPicker.jsx";
import Settings from "./pages/Settings.jsx";
import AddRecord from "./pages/AddRecord.jsx";
import AddCard from "./pages/AddCard.jsx";
import EditCard from "./pages/EditCard.jsx";
import AddSavingAccount from "./pages/AddSavingAccount.jsx";
import EditSavingAccount from "./pages/EditSavingAccount.jsx";
import CardDetails from "./pages/CardDetails.jsx";
import SavingAccountDetails from "./pages/SavingAccountDetails.jsx";
import AddBudget from "./pages/AddBudget.jsx";
import Menu from "./pages/Menu.jsx";
import Backup from "./pages/Backup.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Feedback from "./pages/Feedback.jsx";
import { screenToPath } from "./utils/helpers";

function EditRecord({ state, go }) {
  const { id } = useParams();
  const record = state.records.find((record) => String(record.id) === id);

  if (!record) {
    return <Navigate replace to="/records" />;
  }

  return (
    <AddRecord {...state} screen="edit" go={go} recordToEdit={record} updateRecord={state.updateRecord} cards={state.cards} savingAccounts={state.savingAccounts} />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const state = useAppState();
  const started = localStorage.getItem("budget-one-started") === "true";
  const [activeDate, setActiveDate] = useState(() => {
    // Get the latest record date or use current date
    if (state.records && state.records.length > 0) {
      const latestRecord = state.records.reduce((latest, record) => {
        const recordDate = new Date(record.date);
        const latestDate = new Date(latest.date);
        return recordDate > latestDate ? record : latest;
      });
      return new Date(latestRecord.date);
    }
    return new Date();
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    // Get the latest record year or use current year
    if (state.records && state.records.length > 0) {
      const latestRecord = state.records.reduce((latest, record) => {
        const recordDate = new Date(record.date);
        const latestDate = new Date(latest.date);
        return recordDate > latestDate ? record : latest;
      });
      return new Date(latestRecord.date).getFullYear();
    }
    return new Date().getFullYear();
  });
  const [statsPeriod, setStatsPeriod] = useState('monthly');
  const [transactionType, setTransactionType] = useState('expense');

  const go = (next) => {
    navigate(screenToPath(next));
  };

  const start = () => {
    localStorage.setItem("budget-one-started", "true");
    setTimeout(() => navigate("/home"), 0);
  };

  const changeMonth = (direction) => {
    setActiveDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, current.getDate()));
  };

  const changeYear = (direction) => {
    setSelectedYear((current) => current + direction);
  };

  const selectMonth = (value) => {
    if (!value) return;
    setActiveDate(new Date(value));
  };

  const selectYear = (value) => {
    if (!value) return;
    setSelectedYear(new Date(value).getFullYear());
  };

  const formatDateLabel = (date) => {
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    return `${month} ${date.getFullYear()}`;
  };

  const dateLabel = formatDateLabel(activeDate);
  const yearLabel = selectedYear === new Date().getFullYear() ? "This Year" : String(selectedYear);

  const initialRoute = started ? <Navigate replace to="/home" /> : <Onboarding start={start} />;

  return (
    <main className="stage">
      <section className="phone" aria-label="Budget tracking wallet app">
        <Routes>
          <Route path="/" element={initialRoute} />
          <Route path="/home" element={<Home {...state} screen="home" go={go} activeDate={activeDate} dateLabel={dateLabel} onDatePrev={() => changeMonth(-1)} onDateNext={() => changeMonth(1)} value={activeDate.toISOString().split("T")[0]} onSelect={selectMonth} categories={state.categories} budgets={state.budgets} deleteRecord={state.deleteRecord} />} />
          <Route path="/records" element={<Records {...state} screen="records" go={go} selectedYear={selectedYear} yearLabel={yearLabel} onYearPrev={() => changeYear(-1)} onYearNext={() => changeYear(1)} value={`${selectedYear}-01-01`} onSelect={selectYear} />} />
          <Route path="/budgets" element={<Budgets {...state} screen="budgets" go={go} categories={state.categories} budgetSpends={state.budgetSpends} updateBudget={state.updateBudget} addBudget={state.addBudget} deleteBudget={state.deleteBudget} activeDate={activeDate} dateLabel={dateLabel} onDatePrev={() => changeMonth(-1)} onDateNext={() => changeMonth(1)} value={activeDate.toISOString().split("T")[0]} onSelect={selectMonth} />} />
          <Route path="/add-budget" element={<AddBudget {...state} screen="add-budget" go={go} categories={state.categories} />} />
          <Route path="/stats" element={<Stats {...state} screen="stats" go={go} categories={state.categories} activeDate={activeDate} selectedYear={selectedYear} dateLabel={dateLabel} yearLabel={yearLabel} onDatePrev={statsPeriod === 'yearly' ? () => changeYear(-1) : () => changeMonth(-1)} onDateNext={statsPeriod === 'yearly' ? () => changeYear(1) : () => changeMonth(1)} value={statsPeriod === 'yearly' ? `${selectedYear}-01-01` : activeDate.toISOString().split("T")[0]} onSelect={statsPeriod === 'yearly' ? selectYear : selectMonth} statsPeriod={statsPeriod} setStatsPeriod={setStatsPeriod} transactionType={transactionType} setTransactionType={setTransactionType} />} />
          <Route path="/category/:categoryName" element={<CategoryDetails {...state} screen="category-details" go={go} categories={state.categories} activeDate={activeDate} selectedYear={selectedYear} statsPeriod={statsPeriod} deleteRecord={state.deleteRecord} dateLabel={dateLabel} yearLabel={yearLabel} onDatePrev={statsPeriod === 'yearly' ? () => changeYear(-1) : () => changeMonth(-1)} onDateNext={statsPeriod === 'yearly' ? () => changeYear(1) : () => changeMonth(1)} value={statsPeriod === 'yearly' ? `${selectedYear}-01-01` : activeDate.toISOString().split("T")[0]} onSelect={statsPeriod === 'yearly' ? selectYear : selectMonth} />} />
          <Route path="/cards" element={<Cards {...state} screen="cards" go={go} savingAccounts={state.savingAccounts} updateSavingAccount={state.updateSavingAccount} deleteSavingAccount={state.deleteSavingAccount} accountBalances={state.accountBalances} />} />
          <Route path="/categories" element={<Categories {...state} screen="categories" go={go} updateCategory={state.updateCategory} />} />
          <Route path="/categories/add" element={<AddCategory {...state} screen="add-category" go={go} />} />
          <Route path="/categories/add/icon" element={<IconPicker {...state} screen="icon-picker" go={go} />} />
          <Route path="/categories/edit/:name" element={<EditCategory {...state} screen="edit-category" go={go} />} />
          <Route path="/categories/edit/:name/icon" element={<IconPicker {...state} screen="icon-picker" go={go} />} />
          <Route path="/settings" element={<Settings {...state} screen="settings" go={go} />} />
          <Route path="/add" element={<AddRecord {...state} screen="add" go={go} cards={state.cards} savingAccounts={state.savingAccounts} />} />
          <Route path="/add-card" element={<AddCard {...state} screen="add-card" go={go} addCard={state.addCard} />} />
          <Route path="/add-saving-account" element={<AddSavingAccount {...state} screen="add-saving-account" go={go} addSavingAccount={state.addSavingAccount} />} />
          <Route path="/edit-card/:id" element={<EditCard {...state} screen="edit-card" go={go} cards={state.cards} updateCard={state.updateCard} deleteCard={state.deleteCard} />} />
          <Route path="/edit-saving-account/:id" element={<EditSavingAccount {...state} screen="edit-saving-account" go={go} savingAccounts={state.savingAccounts} updateSavingAccount={state.updateSavingAccount} deleteSavingAccount={state.deleteSavingAccount} />} />
          <Route path="/card/:id" element={<CardDetails {...state} screen="card-details" go={go} cards={state.cards} accountBalances={state.accountBalances} deleteRecord={state.deleteRecord} />} />
          <Route path="/saving-account/:id" element={<SavingAccountDetails {...state} screen="saving-account-details" go={go} savingAccounts={state.savingAccounts} accountBalances={state.accountBalances} deleteRecord={state.deleteRecord} />} />
          <Route path="/edit/:id" element={<EditRecord state={state} go={go} />} />
          <Route path="/menu" element={<Menu {...state} screen="menu" go={go} />} />
          <Route path="/feedback" element={<Feedback {...state} screen="feedback" go={go} />} />
          <Route path="/backup" element={<Backup {...state} screen="backup" go={go} records={state.records} addRecord={state.addRecord} />} />
          <Route path="*" element={<Navigate replace to={started ? "/home" : "/"} />} />
        </Routes>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
