import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatbotWidget from './components/ChatbotWidget';

// Función para inicializar el widget
window.ChatbotWidget = function(container, config) {
  const root = ReactDOM.createRoot(container);
  root.render(<ChatbotWidget config={config} />);
};

// Si se está ejecutando en modo normal (con root)
if (document.getElementById('root')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<ChatbotWidget />);
}
