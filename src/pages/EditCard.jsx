import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

const cardTypes = [
  { value: "credit", label: "Credit Card" },
  { value: "debit", label: "Debit Card" }
];

const banks = [
  { value: "Chase", label: "Chase" },
  { value: "Bank of America", label: "Bank of America" },
  { value: "Wells Fargo", label: "Wells Fargo" },
  { value: "Citibank", label: "Citibank" },
  { value: "Capital One", label: "Capital One" },
  { value: "US Bank", label: "US Bank" },
  { value: "PNC Bank", label: "PNC Bank" },
  { value: "Other", label: "Other" }
];

export default function EditCard({ screen, go, cards, updateCard, deleteCard }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardId = parseInt(id);
  const card = cards.find(c => c.id === cardId);

  const [formData, setFormData] = useState({
    name: "",
    last: "",
    type: "credit",
    bank: "Chase",
    baseBalance: 0
  });
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        last: card.last,
        type: card.type,
        bank: card.bank,
        baseBalance: card.baseBalance
      });
    }
  }, [card]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "baseBalance" ? parseFloat(value) || 0 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Card holder name is required";
    }
    
    if (!formData.last.trim()) {
      newErrors.last = "Last 4 digits are required";
    } else if (!/^\d{4}$/.test(formData.last)) {
      newErrors.last = "Last 4 digits must be exactly 4 numbers";
    }
    
    if (formData.baseBalance < 0) {
      newErrors.baseBalance = "Base balance cannot be negative";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedCard = {
      ...card,
      ...formData
    };

    updateCard(cardId, updatedCard);
    go("cards");
  };

  const handleCancel = () => {
    go("cards");
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteCard(cardId);
    go("cards");
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!card) {
    return (
      <>
        <section className="screen">
          <div className="stack">
            <div className="row ">
              <button className="icon-button large" onClick={() => go("cards")}>
                <Icon name="chevronLeft" />
              </button>
              <h1 className="title">Card Not Found</h1>
              <div style={{ width: "38px" }}></div>
            </div>
            <div className="panel pad stack">
              <p>The card you're trying to edit was not found.</p>
              <button className="button small" onClick={() => go("cards")}>
                Back to Cards
              </button>
            </div>
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
            <button className="icon-button large" onClick={handleCancel}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Edit Card</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          <form onSubmit={handleSubmit} className="panel pad stack">
            <div className="field">
              <label htmlFor="name">Card Holder Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter card holder name"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="last">Last 4 Digits</label>
              <input
                id="last"
                name="last"
                type="text"
                value={formData.last}
                onChange={handleInputChange}
                placeholder="1234"
                maxLength="4"
                className={errors.last ? "error" : ""}
              />
              {errors.last && <span className="error-message">{errors.last}</span>}
            </div>

            <div className="field">
              <label htmlFor="type">Card Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                {cardTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="bank">Bank</label>
              <select
                id="bank"
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
              >
                {banks.map(bank => (
                  <option key={bank.value} value={bank.value}>
                    {bank.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="baseBalance">Starting Balance</label>
              <input
                id="baseBalance"
                name="baseBalance"
                type="number"
                value={formData.baseBalance}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.baseBalance ? "error" : ""}
              />
              {errors.baseBalance && <span className="error-message">{errors.baseBalance}</span>}
            </div>

            <div className="row gap">
              <button type="submit" className="button small">
                Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="button secondary small">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="button danger small">
                Delete
              </button>
            </div>
          </form>

          <section className="panel pad stack">
            <h3 className="section-title">Card Preview</h3>
            <div className="credit-card-preview">
              <div className="card-logo"><span /><span /></div>
              <div className="card-number">
                <span>****</span>
                <span>****</span>
                <span>****</span>
                <span>{formData.last || "****"}</span>
              </div>
              <div className="card-bottom">
                <span>
                  <strong>{formData.name || "YOUR NAME"}</strong>
                  <small>CVV: ***</small>
                </span>
                <span style={{ textAlign: "right" }}>
                  <small>Expire Date</small>
                  <strong style={{ fontSize: 14 }}>**/**</strong>
                </span>
              </div>
            </div>
          </section>
        </div>
      </section>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Card</h3>
              <button className="icon-button" onClick={cancelDelete}>
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this card?</p>
              <p><strong>{formData.name} (****{formData.last})</strong></p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="button secondary" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="button danger" onClick={confirmDelete}>
                Delete Card
              </button>
            </div>
          </div>
        </div>
      )}

      <Nav screen={screen} go={go} />
    </>
  );
}
