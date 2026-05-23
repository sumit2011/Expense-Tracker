import React, { useState, useRef, useEffect } from "react";
import Icon from "../components/Icon.jsx";
import Nav from "../components/Nav.jsx";
import { Bot, Send, Sparkles, TrendingUp, Wallet, AlertCircle } from "lucide-react";
import { ChatManager } from "../ai/services/chatManager.js";

export default function AIChat({ screen, go, records, categories, budgets, currency, accountBalances }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatManagerRef = useRef(null);

  // Initialize ChatManager
  useEffect(() => {
    chatManagerRef.current = new ChatManager(records, categories, budgets, currency);
    
    // Load greeting
    const greeting = chatManagerRef.current.getGreeting();
    setMessages([{
      id: 1,
      type: 'ai',
      text: greeting,
      timestamp: new Date()
    }]);
    
    // Load suggestions
    setSuggestions(chatManagerRef.current.getSuggestions());
  }, []);

  // Update ChatManager when data changes
  useEffect(() => {
    if (chatManagerRef.current) {
      chatManagerRef.current.updateData(records, categories, budgets);
    }
  }, [records, categories, budgets]);

  // Update currency when it changes
  useEffect(() => {
    if (chatManagerRef.current) {
      chatManagerRef.current.updateCurrency(currency);
    }
  }, [currency]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatManagerRef.current) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const result = await chatManagerRef.current.processMessage(inputText, records);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: result.response,
        intent: result.intent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update suggestions based on context
      setSuggestions(chatManagerRef.current.getSuggestions());
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="screen" data-screen={screen} style={{ 
      padding: '0', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      {/* Enhanced Header - Mobile Optimized */}
      <header className="header" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
        padding: '16px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(106, 102, 255, 0.3)',
        minHeight: '64px',
        flexShrink: 0
      }}>
        <button 
          className="button" 
          onClick={() => go("home")}
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            backdropFilter: 'blur(10px)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <Icon name="chevronLeft" />
        </button>
        <div style={{ textAlign: 'center', flex: 1, margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '2px' }}>
            <Bot size={20} style={{ color: 'white' }} />
            <h1 className="title" style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: '600' }}>AI Assistant</h1>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', margin: 0 }}>Powered by your data</p>
        </div>
        <div style={{ width: '36px' }}></div>
      </header>

      {/* Welcome Banner - Mobile Optimized */}
      {messages.length === 1 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(106, 102, 255, 0.1) 0%, rgba(151, 71, 255, 0.1) 100%)',
          margin: '12px 16px',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--line)',
          textAlign: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={28} style={{ color: 'var(--primary)', marginBottom: '6px' }} />
          <h3 style={{ color: 'var(--text)', margin: '0 0 6px 0', fontSize: '15px', fontWeight: '600' }}>Smart Insights</h3>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '13px', lineHeight: '1.4' }}>Get personalized analysis of your spending</p>
        </div>
      )}

      {/* Messages Area - Mobile Optimized */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '0 12px',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y'
      }}>
        <div style={{ paddingTop: '12px', paddingBottom: '12px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px',
                animation: 'fadeInUp 0.3s ease-out',
                padding: '0 4px'
              }}
            >
              {message.type === 'ai' && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px',
                  flexShrink: 0
                }}>
                  <Bot size={16} style={{ color: 'white' }} />
                </div>
              )}
              
              <div
                style={{
                  maxWidth: message.type === 'user' ? '75%' : '80%',
                  background: message.type === 'user' 
                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)'
                    : 'var(--panel)',
                  color: message.type === 'user' ? 'white' : 'var(--text)',
                  padding: '12px 16px',
                  borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: message.type === 'user' 
                    ? '0 2px 10px rgba(106, 102, 255, 0.3)'
                    : '0 1px 6px rgba(0, 0, 0, 0.2)',
                  border: message.type === 'ai' ? '1px solid var(--line)' : 'none',
                  wordBreak: 'break-word'
                }}
              >
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line'
                }}>
                  {message.text}
                </p>
                <p style={{ 
                  fontSize: '10px', 
                  opacity: 0.7,
                  margin: '6px 0 0 0'
                }}>
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === 'user' && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--panel-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '8px',
                  flexShrink: 0,
                  border: '1px solid var(--line)'
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>You</span>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px', padding: '0 4px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px'
              }}>
                <Bot size={16} style={{ color: 'white' }} />
              </div>
              <div style={{
                background: 'var(--panel)',
                padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid var(--line)',
                boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--muted)',
                    animation: 'bounce 1.4s infinite ease-in-out both'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--muted)',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.16s'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--muted)',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.32s'
                  }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Mobile Optimized */}
      <div style={{
        background: 'var(--panel)',
        borderTop: '1px solid var(--line)',
        padding: '12px 16px 16px 16px',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
        paddingBottom: 'env(safe-area-inset-bottom, 16px)'
      }}>
        {/* Quick Suggestions - Mobile Optimized */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputText(suggestion)}
                style={{
                  background: 'var(--panel-2)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--primary)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--panel-2)';
                  e.target.style.color = 'var(--muted)';
                  e.target.style.borderColor = 'var(--line)';
                }}
              >
                {index === 0 && <Wallet size={12} />}
                {index === 1 && <TrendingUp size={12} />}
                {index === 2 && <Sparkles size={12} />}
                {index === 3 && <AlertCircle size={12} />}
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field - Mobile Optimized */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ 
            flex: 1, 
            position: 'relative',
            background: 'var(--panel-2)',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            minHeight: '40px'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about expenses, income..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                padding: '10px 16px',
                fontSize: '14px',
                color: 'var(--text)',
                outline: 'none',
                WebkitAppearance: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            style={{
              background: !inputText.trim() || isTyping 
                ? 'var(--panel-2)' 
                : 'linear-gradient(135deg, var(--primary) 0%, var(--purple) 100%)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: !inputText.trim() || isTyping ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: !inputText.trim() || isTyping 
                ? 'none' 
                : '0 3px 12px rgba(106, 102, 255, 0.4)',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              flexShrink: 0
            }}
          >
            <Send size={18} style={{ 
              color: !inputText.trim() || isTyping ? 'var(--dim)' : 'white' 
            }} />
          </button>
        </div>
      </div>

      <Nav screen={screen} go={go} />

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
