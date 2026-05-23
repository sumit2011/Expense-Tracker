import React, { useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";
import { exportToExcel, importFromExcel, createSampleData } from "../utils/dataImportExport.js";

export default function Backup({ screen, go, currency, records, addRecord }) {
  const fileInputRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleExport = async () => {
    if (records.length === 0) {
      showMessage("No data to export. Add some records first!", "error");
      return;
    }

    setIsExporting(true);
    try {
      await exportToExcel(records, [], currency);
      showMessage(`Successfully exported ${records.length} records!`, "success");
    } catch (error) {
      showMessage(`Failed to export data: ${error.message}`, "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      showMessage("Please select a valid Excel file (.xlsx or .xls)", "error");
      event.target.value = '';
      return;
    }

    setIsImporting(true);
    try {
      const importedRecords = await importFromExcel(file);
      
      if (importedRecords.length === 0) {
        showMessage("No valid records found in the file", "error");
        return;
      }

      // Add imported records to the existing records
      let successCount = 0;
      for (const record of importedRecords) {
        try {
          const formData = new FormData();
          formData.append('category', record.name);
          formData.append('account', record.account);
          formData.append('amount', Math.abs(record.amount).toString());
          formData.append('date', record.date);
          formData.append('note', record.note || '');
          
          // Determine if it's income or expense based on amount sign
          const type = record.amount >= 0 ? 'income' : 'expense';
          addRecord(formData, type);
          successCount++;
        } catch (error) {
          console.error('Failed to import record:', record, error);
        }
      }

      if (successCount > 0) {
        showMessage(`Successfully imported ${successCount} out of ${importedRecords.length} records!`, "success");
      } else {
        showMessage("Failed to import any records. Please check your file format.", "error");
      }
    } catch (error) {
      showMessage(`Failed to import data: ${error.message}`, "error");
    } finally {
      setIsImporting(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleDownloadSample = async () => {
    setIsDownloading(true);
    try {
      await createSampleData();
      showMessage("Sample data downloaded successfully!", "success");
    } catch (error) {
      showMessage(`Failed to download sample data: ${error.message}`, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const getLastBackupDate = () => {
    // This would typically come from your app state
    const lastExport = localStorage.getItem('budget-one-last-export');
    if (lastExport) {
      return new Date(lastExport).toLocaleDateString();
    }
    return "Never";
  };

  const getDataSize = () => {
    // Rough estimation of data size
    const dataSize = JSON.stringify(records).length;
    if (dataSize < 1024) return `${dataSize} bytes`;
    if (dataSize < 1024 * 1024) return `${(dataSize / 1024).toFixed(1)} KB`;
    return `${(dataSize / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <button className="icon-button large" onClick={() => go("menu")}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Backup & Data</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`message-banner ${messageType}`}>
              <Icon name={messageType === "success" ? "smiley" : "x"} />
              <span>{message}</span>
            </div>
          )}

          <section className="panel pad stack backup-banner">
            <div className="banner-icon">
              <Icon name="cloudBackup" />
            </div>
            <div>
              <p className="section-title">Data Management</p>
              <p className="subtle">Export, import, and manage your financial data</p>
            </div>
          </section>

          <section className="panel stack settings-list">
            <button 
              type="button" 
              className={`settings-item ${isExporting ? 'loading' : ''}`}
              onClick={handleExport}
              disabled={isExporting || records.length === 0}
            >
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: records.length === 0 ? "var(--gray)" : "var(--green)" }}>
                  {isExporting ? (
                    <div className="spinner"></div>
                  ) : (
                    <Icon name="folderUp" />
                  )}
                </span>
                <div>
                  <p className="settings-item-title">Export Data</p>
                  <p className="subtle">
                    {records.length === 0 
                      ? "No data to export" 
                      : `Download ${records.length} records as Excel file`
                    }
                  </p>
                </div>
              </div>
              {isExporting ? (
                <span className="loading-text">Exporting...</span>
              ) : records.length === 0 ? (
                <span className="disabled-text">No Data</span>
              ) : (
                <Icon name="chevronRight" />
              )}
            </button>

            <button 
              type="button" 
              className={`settings-item ${isImporting ? 'loading' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--blue)" }}>
                  {isImporting ? (
                    <div className="spinner"></div>
                  ) : (
                    <Icon name="folderDown" />
                  )}
                </span>
                <div>
                  <p className="settings-item-title">Import Data</p>
                  <p className="subtle">Upload records from Excel file</p>
                </div>
              </div>
              {isImporting ? (
                <span className="loading-text">Importing...</span>
              ) : (
                <Icon name="chevronRight" />
              )}
            </button>

            <button 
              type="button" 
              className={`settings-item ${isDownloading ? 'loading' : ''}`}
              onClick={handleDownloadSample}
              disabled={isDownloading}
            >
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--orange)" }}>
                  {isDownloading ? (
                    <div className="spinner"></div>
                  ) : (
                    <Icon name="arrowDownToLine" />
                  )}
                </span>
                <div>
                  <p className="settings-item-title">Download Sample</p>
                  <p className="subtle">Get example Excel template</p>
                </div>
              </div>
              {isDownloading ? (
                <span className="loading-text">Downloading...</span>
              ) : (
                <Icon name="chevronRight" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </section>

          <section className="panel pad stack">
            <h2 className="section-title">Data Overview</h2>
            <div className="data-stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="document" />
                </div>
                <div className="stat-info">
                  <p className="stat-value">{records.length}</p>
                  <p className="stat-label">Total Records</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="cash" />
                </div>
                <div className="stat-info">
                  <p className="stat-value">{currency}</p>
                  <p className="stat-label">Currency</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="wallet" />
                </div>
                <div className="stat-info">
                  <p className="stat-value">{getDataSize()}</p>
                  <p className="stat-label">Data Size</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="calendar" />
                </div>
                <div className="stat-info">
                  <p className="stat-value">{getLastBackupDate()}</p>
                  <p className="stat-label">Last Export</p>
                </div>
              </div>
            </div>
          </section>

          <section className="panel pad stack">
            <h2 className="section-title">Quick Guide</h2>
            <div className="backup-tips">
              <div className="tip-item">
                <div className="tip-icon success">
                  <Icon name="shield" />
                </div>
                <div className="tip-content">
                  <p className="tip-title">Regular Backups</p>
                  <p className="subtle">Export your data weekly to prevent data loss</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon info">
                  <Icon name="document" />
                </div>
                <div className="tip-content">
                  <p className="tip-title">File Format</p>
                  <p className="subtle">Only Excel files (.xlsx, .xls) are supported</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon warning">
                  <Icon name="cash" />
                </div>
                <div className="tip-content">
                  <p className="tip-title">Data Validation</p>
                  <p className="subtle">Use the sample template for proper data format</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
