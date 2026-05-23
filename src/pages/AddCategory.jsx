import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

export default function AddCategory({ screen, go, addCategory }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("bag");
  const [selectedTone, setSelectedTone] = useState("var(--orange)");
  const [categoryType, setCategoryType] = useState("expense");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.selectedIcon) {
      setSelectedIcon(location.state.selectedIcon);
    }
    if (location.state?.selectedTone) {
      setSelectedTone(location.state.selectedTone);
    }
  }, [location.state]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage("Enter a category name.");
      return;
    }
    addCategory(trimmed, selectedIcon, selectedTone, categoryType);
    setMessage("Category added.");
    setTimeout(() => go("categories"), 1000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <button className="icon-button large" onClick={() => go("categories")}><Icon name="chevronLeft" /></button>
            <h1 className="title">Add Category</h1>
            <div></div>
          </div>

          <section className="panel pad stack">
            <form onSubmit={handleSubmit} className="stack">
              <div className="field">
                <label>Icon</label>
                <button type="button" className="icon-display" onClick={() => navigate('/categories/add/icon', { state: { currentIcon: selectedIcon, currentTone: selectedTone } })}>
                  <span className="settings-icon" style={{ background: selectedTone }}>
                    <Icon name={selectedIcon} />
                  </span>
                  <span className="icon-text">Tap to change</span>
                </button>
              </div>

              <div className="field">
                <label htmlFor="category-name">Category name</label>
                <input
                  id="category-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setMessage("");
                  }}
                  placeholder="Enter category label"
                />
              </div>

              <div className="field">
                <label>Category Type</label>
                <div className="segmented">
                  <button
                    type="button"
                    className={categoryType === "expense" ? "active" : ""}
                    onClick={() => setCategoryType("expense")}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={categoryType === "income" ? "active" : ""}
                    onClick={() => setCategoryType("income")}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="row gap">
                <button className="button small" type="submit">Create Category</button>
                <button className="button secondary small" type="button" onClick={() => go("categories")}>Cancel</button>
              </div>
              {message && <p className="subtle">{message}</p>}
            </form>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}