import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatbotAPI } from '../utils/api';
import { defaultConfig } from '../config/config';
import { ChatStorage } from '../utils/storage';
import { formatMessage } from '../utils/formatMessage';
import './ChatbotWidget.css';

const ChatbotWidget = ({ config: userConfig = {} }) => {
  const config = React.useMemo(() => ({ ...defaultConfig, ...userConfig }), [userConfig]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.welcomeMessage,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const apiRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedState = ChatStorage.getState();
    if (savedState) {
      setMessages(savedState.messages);
      setIsOpen(savedState.isOpen);
      setIsMinimized(savedState.isMinimized);
      setInputText(savedState.inputText);
    }
  }, []);

  useEffect(() => {
    const state = {
      messages,
      isOpen,
      isMinimized,
      inputText
    };
    ChatStorage.saveState(state);
  }, [messages, isOpen, isMinimized, inputText]);

  useEffect(() => {
    const handleUrlChange = () => {
      const savedState = ChatStorage.getState();
      if (savedState) {
        setMessages(savedState.messages);
        setIsOpen(savedState.isOpen);
        setIsMinimized(savedState.isMinimized);
        setInputText(savedState.inputText);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    apiRef.current = new ChatbotAPI(config);
    // Restaurar la sesión si existe
    const sessionId = ChatStorage.getSession();
    if (sessionId) {
      apiRef.current.sessionId = sessionId;
    }
  }, [config]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Simular delay de escritura
      await new Promise(resolve => setTimeout(resolve, config.typingDelay));

      const botResponse = await apiRef.current.sendMessage(messageToSend);

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        // Limitar número de mensajes
        if (newMessages.length > config.maxMessages) {
          return newMessages.slice(-config.maxMessages);
        }
        return newMessages;
      });
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: error.name === 'AbortError' 
          ? 'Tiempo de espera agotado. El servidor está tardando en responder.'
          : config.offlineMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inputText === '') {
      focusInput();
    }
  }, [messages, inputText, focusInput]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const formatTime = (timestamp) => {
    // Asegurarse de que timestamp sea una instancia de Date
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chatbot-widget ${config.position}`}>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="chatbot-trigger orbit-pulse"
          style={{ backgroundColor: config.primaryColor }}
          aria-label="Abrir chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div
            className="chatbot-header"
            style={{ backgroundColor: config.primaryColor }}
          >
            <h3 className="chatbot-title">{config.widgetTitle}</h3>
            <div className="chatbot-controls">
              <button
                onClick={toggleChat}
                className="chatbot-control-btn"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Contenido del chat */}
          {!isMinimized && (
            <>
              {/* Mensajes */}
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
                  >
                    <div className="message-content">
                      <p>{formatMessage(message.text)}</p>
                      <span className="message-time">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Indicador de escritura */}
                {isTyping && (
                  <div className="message bot">
                    <div className="message-content typing">
                      <div className="typing-indicator">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chatbot-input">
                <div className="input-container">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={config.placeholderText}
                    disabled={isLoading}
                    className="message-input"
                    ref={inputRef}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className="send-button"
                    style={{ backgroundColor: config.primaryColor }}
                    aria-label="Enviar mensaje"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
