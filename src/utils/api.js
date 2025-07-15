export class ChatbotAPI {
  constructor(config) {
    this.config = config;
    this.sessionId = this.getSessionId();
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('chatbot-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  }

  async sendMessage(message) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.apiTimeout);

    try {
      const response = await fetch(this.config.webHookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.message || 'Respuesta recibida';
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error sending message to webHook:', error);

      if (error.name === 'AbortError') {
        return 'Tiempo de espera agotado. Intenta nuevamente.';
      }

      return this.config.offlineMessage;
    }
  }
}
