import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";

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

export default function EditSavingAccount({ screen, go, savingAccounts, updateSavingAccount, deleteSavingAccount }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    bank: "Chase",
    baseBalance: 0,
    type: "savings"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const account = savingAccounts.find(acc => acc.id === parseInt(id));
    if (account) {
      setFormData(account);
      setIsLoading(false);
    } else {
      go("cards");
    }
  }, [id, savingAccounts, go]);

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
      newErrors.name = "Account name is required";
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

    const updatedAccount = {
      ...formData,
      id: parseInt(id)
    };

    updateSavingAccount(parseInt(id), updatedAccount);
    go("cards");
  };

  const handleCancel = () => {
    go("cards");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this saving account?")) {
      deleteSavingAccount(parseInt(id));
      go("cards");
    }
  };

  if (isLoading) {
    return (
      <>
        <section className="screen">
          <div className="stack">
            <div className="row">
              <button className="icon-button large" onClick={handleCancel}>
                <Icon name="chevronLeft" />
              </button>
              <h1 className="title">Edit Saving Account</h1>
              <div style={{ width: "38px" }}></div>
            </div>
            <div className="panel pad stack">
              <p>Loading...</p>
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
            <h1 className="title">Edit Saving Account</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          <form onSubmit={handleSubmit} className="panel pad stack">
            <div className="field">
              <label htmlFor="name">Account Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter account name"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
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
                Update Account
              </button>
              <button type="button" onClick={handleCancel} className="button secondary small">
                Cancel
              </button>
            </div>
          </form>

          <section className="panel pad stack">
            <h3 className="section-title">Account Preview</h3>
            <div className="savings-account-preview">
              <div className="account-icon">
                <Icon name="wallet" size="large" />
              </div>
              <div className="account-details">
                <h4>{formData.name || "Account Name"}</h4>
                <p>{formData.bank}</p>
                <p className="balance">Balance: ${formData.baseBalance.toFixed(2)}</p>
              </div>
            </div>
          </section>

          <section className="panel pad stack">
            <button 
              type="button" 
              onClick={handleDelete} 
              className="button secondary small destructive"
            >
              <Icon name="trash" />
              Delete Account
            </button>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
