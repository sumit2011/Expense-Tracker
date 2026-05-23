import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";
import { Send, Star, MessageSquare, Bug, Lightbulb } from "lucide-react";

export default function Feedback({ screen, go }) {
  const [formData, setFormData] = useState({
    type: 'general',
    rating: 5,
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      subject: ''
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const subject = encodeURIComponent(`[${formData.type.toUpperCase()}] ${formData.subject || 'Money Manager Feedback'}`);
      const body = encodeURIComponent(`Feedback Type: ${formData.type}
Rating: ${formData.rating}/5 stars
Email: ${formData.email || 'Not provided'}

Message:
${formData.message}

---
Device Information:
User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Thank you for your feedback!`);

      window.location.href = `mailto:sumit2011kmr@gmail.com?subject=${subject}&body=${body}`;
      
      // Show success message after a short delay
      setTimeout(() => {
        setSubmitted(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'general',
      rating: 5,
      email: '',
      subject: '',
      message: ''
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <>
        <section className="screen">
          <div className="stack">
            <div className="row">
              <div className="row center">
                <button className="icon-button large" onClick={() => go("menu")}>
                  <Icon name="chevronLeft" />
                </button>
                <h1 className="title">Feedback Sent</h1>
              </div>
            </div>
            
            <div className="panel pad center" style={{ 
              textAlign: 'center', 
              padding: '2.5rem 1.5rem',
              backgroundColor: '#121418',
              borderRadius: '0.75rem',
              border: '1px solid var(--border)'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                color: 'var(--success)', 
                marginBottom: '1.5rem',
                animation: 'bounce 0.6s ease-out'
              }}>
                ✓
              </div>
              <h2 style={{ marginBottom: '1rem', color: 'var(--text)', fontSize: '1.5rem' }}>Thank You!</h2>
              <p style={{ 
                marginBottom: '2rem', 
                color: 'var(--muted)',
                lineHeight: '1.5',
                fontSize: '0.95rem'
              }}>
                Your feedback has been sent successfully. 
                <br />
                We appreciate your input and will use it to improve Money Manager.
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexDirection: 'column',
                maxWidth: '280px',
                margin: '0 auto'
              }}>
                <button 
                  className="button primary" 
                  onClick={() => go("menu")}
                  style={{ 
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  Back to Menu
                </button>
                <button 
                  className="button secondary" 
                  onClick={resetForm}
                  style={{ 
                    padding: '0.875rem 1.5rem',
                    fontSize: '0.9rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  Send More Feedback
                </button>
              </div>
            </div>
          </div>
        </section>
        <Nav screen={screen} go={go} />
      </>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug': return <Bug size={20} />;
      case 'feature': return <Lightbulb size={20} />;
      case 'general': return <MessageSquare size={20} />;
      default: return <MessageSquare size={20} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'bug': return 'Bug Report';
      case 'feature': return 'Feature Request';
      case 'general': return 'General Feedback';
      default: return 'General Feedback';
    }
  };

  return (
    <>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <div className="row center">
              <button className="icon-button large" onClick={() => go("menu")}>
                <Icon name="chevronLeft" />
              </button>
              <h1 className="title">Send Feedback</h1>
            </div>
          </div>

          <form className="form-card" onSubmit={onSubmit}>
            <div className="segmented chips">
              <button 
                type="button" 
                className={formData.type === "general" ? "active" : ""} 
                onClick={() => handleTypeChange("general")}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}
              >
                {getTypeIcon('general')}
                <span style={{ fontSize: '0.875rem' }}>General</span>
              </button>
              <button 
                type="button" 
                className={formData.type === "bug" ? "active" : ""} 
                onClick={() => handleTypeChange("bug")}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}
              >
                {getTypeIcon('bug')}
                <span style={{ fontSize: '0.875rem' }}>Bug</span>
              </button>
              <button 
                type="button" 
                className={formData.type === "feature" ? "active" : ""} 
                onClick={() => handleTypeChange("feature")}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}
              >
                {getTypeIcon('feature')}
                <span style={{ fontSize: '0.875rem' }}>Feature</span>
              </button>
            </div>

            <div className="field">
              <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>How would you rate your experience?</label>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', padding: '1.5rem 0', backgroundColor: '', borderRadius: '0.5rem', margin: '0.5rem 0' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '2rem',
                      color: star <= formData.rating ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease',
                      transform: star <= formData.rating ? 'scale(1.1)' : 'scale(1)',
                      padding: '0.25rem',
                      borderRadius: '0.25rem'
                  }}
                  >
                    <Star size={32} fill={star <= formData.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </div>
            </div>

            <div className="field">
              <label htmlFor="email" style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>Email (optional)</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'black',
                  color: 'var(--text)',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="subject" style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder={`Brief description of your ${getTypeLabel(formData.type).toLowerCase()}`}
                value={formData.subject}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'black',
                  color: 'var(--text)',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="message" style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Please share your detailed feedback here..."
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'black',
                  color: 'var(--text)',
                  transition: 'border-color 0.2s',
                  resize: 'vertical',
                  minHeight: '140px',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem', textAlign: 'right' }}>
                {formData.message.length}/500 characters
              </div>
            </div>

            <button 
              type="submit" 
              className="button primary"
              disabled={isSubmitting || !formData.message.trim() || formData.message.length > 500}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                justifyContent: 'center',
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '0.5rem',
                marginTop: '1rem',
                opacity: (isSubmitting || !formData.message.trim() || formData.message.length > 500) ? 0.6 : 1,
                cursor: (isSubmitting || !formData.message.trim() || formData.message.length > 500) ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid var(--background)', 
                    borderTop: '2px solid currentColor', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }}></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Feedback
                </>
              )}
            </button>

          <div className="panel pad" style={{ 
            marginTop: '1rem', 
            fontSize: '0.875rem', 
            color: 'var(--muted)',
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: '#121418',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)'
          }}>
            <p style={{ margin: '0', lineHeight: '1.4' }}>
              <strong>Note:</strong> This will open your email client to send feedback directly to the developer.
              <br />
              <span style={{ fontSize: '0.75rem', display: 'block', marginTop: '0.5rem' }}>
                Your feedback helps us improve Money Manager! 🎉
              </span>
            </p>
          </div>
          </form>
        </div>
      </section>
      <Nav screen={screen} go={go} />
    </>
  );
}
