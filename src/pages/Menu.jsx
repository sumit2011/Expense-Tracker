import React from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";
import { 
  FileText, 
  BarChart3, 
  Grid3x3, 
  CreditCard, 
  Download, 
  DownloadCloud,
  Settings, 
  Share2, 
  Smile, 
  ChevronRight,
  Wallet,
  Bot,
  MessageCircle,
  CloudBackup,
  ArrowDownToLine,
} from "lucide-react";

export default function Menu({ screen, go, currency, setCurrency, totalBalance }) {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isInstallable, setIsInstallable] = React.useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    console.log('Install button clicked');
    console.log('deferredPrompt:', deferredPrompt);
    console.log('window.installPrompt:', window.installPrompt);
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      alert('Money Manager is already installed on your device!');
      return;
    }

    // Try to get the stored prompt or use current state
    const prompt = window.installPrompt || deferredPrompt;
    console.log('Using prompt:', prompt);
    
    if (!prompt) {
      alert('Please refresh the page and try again.');
      return;
    }

    try {
      console.log('Calling prompt()...');
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
        alert('Money Manager has been successfully installed!');
        // Clear the stored prompt
        window.installPrompt = null;
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.log('Installation prompt error:', error);
      alert('Installation prompt is no longer available. Please refresh the page and try again.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Expense Tracker',
      text: 'Check out Expense Tracker, a simple and powerful expense tracker app to manage your finances, budgets, and spending!',
      url: 'https://trackyourcash.netlify.app'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('App link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleFeedback = () => {
    go("feedback");
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row ">
            <div style={{ width: "38px" }}></div>
            <h1 className="title">Menu</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          <section className="panel pad stack menu-banner">
            <div className="banner-icon"><Wallet size={24} /></div>
            <div>
              <p className="section-title">Total Balance</p>
              <p className="balance">{formatCurrency(totalBalance)}</p>
              <p className="subtle">Expense Tracker</p>
            </div>
          </section>

          <section className="panel stack settings-list">
            <button type="button" className="settings-item" onClick={() => go("budgets")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--orange)" }}>
                  <FileText size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Budgets</p>
                  <p className="subtle">Track limits and overspending</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={() => go("stats")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--blue)" }}>
                  <BarChart3 size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Statistics</p>
                  <p className="subtle">Category charts and trends</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={() => go("categories")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--purple)" }}>
                  <Grid3x3 size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Categories</p>
                  <p className="subtle">Manage income and expense categories</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={() => go("cards")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--green)" }}>
                  <CreditCard size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Accounts</p>
                  <p className="subtle">Cards and recent payments</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={() => go("backup")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--gray)" }}>
                  <CloudBackup size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Backup & Data</p>
                  <p className="subtle">Export, import and manage data</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={() => go("settings")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--red)" }}>
                  <Settings size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Settings</p>
                  <p className="subtle">General app preferences</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={handleShare}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--primary)" }}>
                  <Share2 size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Share App</p>
                  <p className="subtle">Share Money Manager with friends</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={handleFeedback}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--indigo)" }}>
                  <MessageCircle size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Send Feedback</p>
                  <p className="subtle">Help us improve the app</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
            <button type="button" className="settings-item" onClick={handleInstallApp}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--pink)" }}>
                  <ArrowDownToLine size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Install App</p>
                  <p className="subtle">Install Money Manager on your device</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button> 
            {/* <button type="button" className="settings-item" onClick={() => go("onboarding")}>
              <div className="settings-item-left">
                <span className="settings-icon" style={{ background: "var(--pink)" }}>
                  <Smile size={20} />
                </span>
                <div>
                  <p className="settings-item-title">Onboarding</p>
                  <p className="subtle">Preview the welcome screen</p>
                </div>
              </div>a
              <ChevronRight size={20} />
            </button> */}
          </section>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
