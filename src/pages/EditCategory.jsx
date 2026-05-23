import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

export default function EditCategory({ screen, go, categories, updateCategory, deleteCategory }) {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const category = categories.find((cat) => cat.name === decodeURIComponent(name));

  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("bag");
  const [selectedTone, setSelectedTone] = useState("var(--orange)");
  const [categoryType, setCategoryType] = useState("expense");
  const [message, setMessage] = useState("");

  // Mock subcategories data
  const [subcategories, setSubcategories] = useState([
    { id: 1, name: "Food", icon: "utensils" },
    { id: 2, name: "Alcohol", icon: "utensils" },
    { id: 3, name: "Drink", icon: "utensils" },
  ]);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setSelectedIcon(category.icon);
      setSelectedTone(category.tone);
      setCategoryType(category.type || "expense");
    }
  }, [category]);

  useEffect(() => {
    if (location.state?.selectedIcon) {
      setSelectedIcon(location.state.selectedIcon);
    }
    if (location.state?.selectedTone) {
      setSelectedTone(location.state.selectedTone);
    }
  }, [location.state]);

  const handleSave = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      setMessage("Enter a category name.");
      return;
    }

    const duplicate = categories.some((cat) =>
      cat.name.toLowerCase() === trimmed.toLowerCase() && cat.name !== category.name
    );

    if (duplicate) {
      setMessage("Category already exists.");
      return;
    }

    const oldName = category.name;
    const newName = trimmed;
    const nameChanged = oldName !== newName;

    updateCategory(oldName, {
      name: newName,
      icon: selectedIcon,
      tone: selectedTone,
      type: categoryType,
    });
    
    if (nameChanged) {
      // Update URL to reflect new category name
      navigate(`/categories/edit/${encodeURIComponent(newName)}`, { replace: true });
    }
    
    setMessage("Category updated.");
    setTimeout(() => go("categories"), 1000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSave();
  };

  const handleIconClick = () => {
    navigate(`/categories/edit/${encodeURIComponent(name)}/icon`, { state: { currentIcon: selectedIcon, currentTone: selectedTone } });
  };

  const handleSubcategoryClick = (subcategory) => {
    // Navigate to subcategory edit page
    console.log('Edit subcategory:', subcategory);
  };

  const handleAddSubcategory = () => {
    // Add new subcategory
    const newSubcategory = {
      id: subcategories.length + 1,
      name: `New Subcategory ${subcategories.length + 1}`,
      icon: "utensils"
    };
    setSubcategories([...subcategories, newSubcategory]);
  };

  const handleDeleteCategory = () => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      deleteCategory(category.name);
      setMessage("Category deleted.");
      setTimeout(() => go("categories"), 1000);
    }
  };

  if (!category) {
    return (
      <>
        <section className="screen">
          <div className="stack">
            <div className="row ">
              <button className="icon-button large" onClick={() => go("categories")}><Icon name="chevronLeft" /></button>
              <h1 className="title">Edit Category</h1>
              <div></div>
            </div>
            <p>Category not found.</p>
          </div>
        </section>
        <Nav screen={screen} go={go} />
      </>
    );
  }

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <button className="icon-button large" onClick={() => go("categories")}><Icon name="chevronLeft" /></button>
            <h1 className="title">Edit Category</h1>
            <button className="icon-button large" onClick={() => go("categories")}><Icon name="x" /></button>
          </div>

          <section className="panel pad stack">
            <form onSubmit={handleSubmit} className="stack">
              <div className="field">
                <label>Icon</label>
                <button type="button" className="icon-display" onClick={handleIconClick}>
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
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
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

              {/* Subcategories Section
              <div className="subcategories-section">
                <div className="section-header">
                  <h3 className="section-title">Subcategories</h3>
                  <span className="section-count">{subcategories.length}</span>
                </div>
                <div className="subcategories-list">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className="subcategory-item"
                      onClick={() => handleSubcategoryClick(subcategory)}
                      type="button"
                    >
                      <span className="subcategory-icon" style={{ background: selectedTone }}>
                        <Icon name={subcategory.icon} />
                      </span>
                      <span className="subcategory-name">{subcategory.name}</span>
                      <Icon name="chevronRight" className="arrow-icon" />
                    </button>
                  ))}
                  <button className="subcategory-item add-subcategory" onClick={handleAddSubcategory} type="button">
                    <span className="subcategory-icon add">
                      <Icon name="plus" />
                    </span>
                    <span className="subcategory-name">Add New Subcategory</span>
                  </button>
                </div>
              </div> */}

              <div className="row gap">
                <button className="button small" type="submit">Save Changes</button>
                <button className="button danger small" type="button" onClick={handleDeleteCategory}>Delete</button>
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