# Widget de Chat Rafiko

Un widget de chat personalizable para integrar en cualquier sitio web.

## Características

- Diseño moderno y atractivo
- Interfaz limpia y fácil de usar
- Comunicación en tiempo real
- Personalización completa
- Integración sencilla
- Soporte para mensajes de texto
- Estado de conexión persistente

## Instalación y Configuración

1. Instalacion de dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
- Copia `.env.example` a `.env`
- Configura las variables según tus necesidades

## Variables de Entorno

```
REACT_APP_CHAT_URL=URL_DEL_SERVICIO
REACT_APP_PRIMARY_COLOR=#000000ff
REACT_APP_SECONDARY_COLOR=#EFF6FF
REACT_APP_POSITION=bottom-right
REACT_APP_MAX_MESSAGES=100
REACT_APP_TYPING_DELAY=1000
REACT_APP_API_TIMEOUT=10000
```

## Uso

### Como componente React

```javascript
import { ChatbotWidget } from 'my.agent.widget';

<ChatbotWidget 
  config={{
    widgetTitle: "Rafiko responde",
    welcomeMessage: "¡Hola soy Rafiko! ¿En qué puedo ayudarte?",
    position: "bottom-right",
    primaryColor: "#000000ff",
    secondaryColor: "#EFF6FF"
  }}
/>
```

### Como widget embebido

Para integrar el widget en cualquier sitio web (HTML):

```html
<!-- 1. Incluir el CSS -->
<link rel="stylesheet" href="https://ruta-a-tu-widget/build/static/css/main.css">

<!-- 2. Incluir el JavaScript -->
<script src="https://ruta-a-tu-widget/build/static/js/main.js"></script>

<!-- 3. Insertar el widget -->
<div id="chat-widget"></div>

<!-- 4. Inicializar el widget -->
<script>
  window.onload = function() {
    new ChatbotWidget(document.getElementById('chat-widget'), {
      widgetTitle: "Rafiko responde",
      welcomeMessage: "¡Hola soy Rafiko! ¿En qué puedo ayudarte?",
      position: "bottom-right",
      primaryColor: "#000000ff",
      secondaryColor: "#EFF6FF"
    });
  };
</script>
```

## Scripts

### `npm start`
Inicia el servidor de desarrollo.

### `npm run build`
Construye la aplicación para producción.

### `npm test`
Ejecuta las pruebas del proyecto.

## Configuración del Widget

- `widgetTitle`: Título del widget
- `welcomeMessage`: Mensaje de bienvenida
- `position`: Posición del widget (top-left, top-right, bottom-left, bottom-right)
- `primaryColor`: Color principal del widget
- `secondaryColor`: Color secundario del widget
- `maxMessages`: Número máximo de mensajes
- `typingDelay`: Tiempo de espera simulado para la respuesta
- `apiTimeout`: Tiempo máximo de espera para la API 