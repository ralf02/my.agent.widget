export const defaultConfig = {
    url: process.env.REACT_APP_CHAT_URL,
    widgetTitle: "Rafiko responde",
    primaryColor: process.env.REACT_APP_PRIMARY_COLOR,
    secondaryColor: process.env.REACT_APP_SECONDARY_COLOR,
    position: process.env.REACT_APP_POSITION,
    welcomeMessage: "¡Hola soy Rafiko! ¿En qué puedo ayudarte?",
    placeholderText: "Preguntame algo...",
    offlineMessage: "Lo siento, el servicio no está disponible en este momento.",
    maxMessages: parseInt(process.env.REACT_APP_MAX_MESSAGES) || 100,
    typingDelay: parseInt(process.env.REACT_APP_TYPING_DELAY) || 1000,
    apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
};
// 