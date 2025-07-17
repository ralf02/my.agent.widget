export const ChatStorage = {
  SESSION_KEY: 'chatbot-session',
  STATE_KEY: 'chatbot-state',

  saveSession(sessionId) {
    localStorage.setItem(this.SESSION_KEY, sessionId);
  },

  getSession() {
    return localStorage.getItem(this.SESSION_KEY);
  },

  saveState(state) {
    localStorage.setItem(this.STATE_KEY, JSON.stringify(state));
  },

  getState() {
    const state = localStorage.getItem(this.STATE_KEY);
    return state ? JSON.parse(state) : null;
  },

  clear() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.STATE_KEY);
  }
};
