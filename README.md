# Chat con Luffy 🏴‍☠️

Una Single Page Application que te permite chatear con Monkey D. Luffy usando inteligencia artificial (Google Gemini).

## Demo

🔗 [luffy-chat-amber.vercel.app](https://luffy-chat-amber.vercel.app)

## Tecnologías

- HTML, CSS, JavaScript (Vanilla)
- Google Gemini AI API
- Vercel Serverless Functions
- Vitest

## Estructura del proyecto

```
luffy-chat/
├── api/
│   └── functions.js        # Serverless function (proxy a Gemini)
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── app.js              # Router y lógica principal
│   ├── chat.js             # Función askLuffy
│   └── utils.js            # Funciones utilitarias
├── tests/
│   ├── utils.test.js
│   └── app.test.js
├── .env.example
├── .gitignore
└── package.json
```

## Instalación local

1. Clonar el repositorio:
```bash
git clone https://github.com/jeremiasbustos186-sketch/Luffy-chat
cd Luffy-chat
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear el archivo `.env` con tu API key de Gemini:
```
GEMINI_API_KEY=tu_api_key_aqui
```

4. Ejecutar los tests:
```bash
npm test
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `GEMINI_API_KEY` | API key de Google AI Studio |

La API key nunca se expone en el frontend — se usa únicamente en la Serverless Function.

## Despliegue en Vercel

1. Conectar el repositorio de GitHub con Vercel
2. Agregar la variable de entorno `GEMINI_API_KEY` en el dashboard de Vercel
3. Hacer deploy

## Correr tests

```bash
npm test
```

8 tests unitarios con Vitest cubriendo funciones de `utils.js`.
