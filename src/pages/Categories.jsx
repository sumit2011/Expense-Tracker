import React from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

export default function Categories({ screen, go, categories = [] }) {
  // Default categories matching the image exactly
  const defaultCategories = [
    { name: "Food & Drink", icon: "bag", tone: "#FFD700", type: "expense" },
    { name: "Shopping", icon: "wallet", tone: "#4169E1", type: "expense" },
    { name: "Health", icon: "shield", tone: "#00CED1", type: "expense" },
    { name: "Transport", icon: "card", tone: "#32CD32", type: "expense" },
    { name: "Interest", icon: "cash", tone: "#9370DB", type: "income" },
    { name: "Life & Event", icon: "spark", tone: "#FFA500", type: "expense" },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // Separate categories by type
  const incomeCategories = displayCategories.filter(cat => cat.type === "income");
  const expenseCategories = displayCategories.filter(cat => cat.type !== "income");

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <button className="icon-button large" onClick={() => go("menu")}><Icon name="chevronLeft" /></button>
            <h1 className="title">Edit Categories</h1>
            <button className="icon-button large primary" onClick={() => go("add-category")}><Icon name="plus" /></button>
          </div>

          {/* Income Categories Section */}
          {incomeCategories.length > 0 && (
            <div className="categories-section">
              <h2 className="section-title" style={{ color: "var(--green)" }}>Income Categories</h2>
              <div className="categories-list">
                {incomeCategories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    className="category-item"
                    style={{ "--tone": category.tone }}
                    onClick={() => go(`edit-category/${category.name}`)}
                  >
                    <span className="category-icon">
                      <Icon name={category.icon} />
                    </span>
                    <span className="category-name">{category.name}</span>
                    <Icon name="chevronRight" className="category-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Expense Categories Section */}
          {expenseCategories.length > 0 && (
            <div className="categories-section">
              <h2 className="section-title" style={{ color: "var(--orange)" }}>Expense Categories</h2>
              <div className="categories-list">
                {expenseCategories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    className="category-item"
                    style={{ "--tone": category.tone }}
                    onClick={() => go(`edit-category/${category.name}`)}
                  >
                    <span className="category-icon">
                      <Icon name={category.icon} />
                    </span>
                    <span className="category-name">{category.name}</span>
                    <Icon name="chevronRight" className="category-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Category Button */}
          <div className="categories-section">
            <div className="categories-list">
              <button
                type="button"
                className="category-item add-category"
                onClick={() => go("add-category")}
              >
                <span className="category-icon add">
                  <Icon name="plus" />
                </span>
                <span className="category-name">Add New Category</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
