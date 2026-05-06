import React from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

export default function Categories({ screen, go, categories = [] }) {
  // Default categories matching the image exactly
  const defaultCategories = [
    { name: "Food & Drink", icon: "bag", tone: "#FFD700" },
    { name: "Shopping", icon: "wallet", tone: "#4169E1" },
    { name: "Health", icon: "shield", tone: "#00CED1" },
    { name: "Transport", icon: "card", tone: "#32CD32" },
    { name: "Interest", icon: "cash", tone: "#9370DB" },
    { name: "Life & Event", icon: "spark", tone: "#FFA500" },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <button className="icon-button large" onClick={() => go("menu")}><Icon name="chevronLeft" /></button>
            <h1 className="title">Edit Categories</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          <div className="categories-list">
            {displayCategories.map((category) => (
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
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
