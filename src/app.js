import { askLuffy } from "./chat.js";

// app.js - Routing y lógica principal
const state = {
    status: "idle",
    data: null,
    error: null,
    history: [],
};

function renderHome() {
    document.getElementById("app").innerHTML = `
    <div class="home-view">
        <div class="home-view__icon"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Straw_Hats_Pirates_Jolly_Roger.svg" alt="Jolly Roger" /></div>
        <h1>¡Bienvenido al Chat con Luffy!</h1>
        <p>Monkey D. Luffy, el futuro Rey de los Piratas, está listo para hablar con vos.</p>
        <p>Pregúntale sobre sus aventuras, su tripulación, o su sueño de encontrar el One Piece.</p>
        <a href="/chat" data-href="/chat" class="btn-chat">Empezar a Chatear 🏴‍☠️</a>
    </div>
    `;
}

function renderChat() {
    // Activar modo chat (overflow hidden para que solo el div de mensajes haga scroll)
    document.getElementById("app").classList.add("chat-mode");

    document.getElementById("app").innerHTML = `
    <div class="chat-view">
        <div class="character-panel">
            <div class="character-panel__image">
                <img
                    src="https://static.wikia.nocookie.net/onepiece/images/e/e5/Monkey_D._Luffy_Anime_Pre_Timeskip_Infobox.png/revision/latest?cb=20260611005119"
                    alt="Monkey D. Luffy"
                    onerror="this.style.display='none'"
                />
            </div>
            <div class="character-panel__info">
                <h2>Monkey D. Luffy</h2>
                <p>Futuro Rey de los Piratas</p>
                <div class="character-status" id="character-status">
                    <span class="status-dot status-dot--online"></span>
                    <span>En línea</span>
                </div>
            </div>
        </div>
        <div class="chat-area">
            <div class="messages" id="messages">
                <div class="messages__empty">
                    ¡Hablá con Luffy! Pregúntale sobre sus aventuras, su tripulación o el One Piece 🏴‍☠️
                </div>
            </div>
            <form class="chat-form" id="chat-form">
                <input type="text" name="message" placeholder="Escribe un mensaje para Luffy..." required />
                <button type="submit">Enviar ⚓</button>
            </form>
        </div>
    </div>
    `;

    document.querySelector("#chat-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = document.querySelector("#chat-form button");
        button.disabled = true;
        button.textContent = "Enviando...";

        const input = document.querySelector("#chat-form input");
        const message = input.value;
        input.value = "";

        // Agregar el mensaje del usuario al historial y mostrar estado loading
        state.status = "loading";
        state.data = null;
        state.error = null;
        state.history.push({ role: "user", parts: [{ text: message }] });
        renderChatState(state);

        try {
            const data = await askLuffy(message, state.history);
            state.status = "success";
            state.data = data;
            state.history.push({ role: "model", parts: [{ text: data.reply }] });
            renderChatState(state);
        } catch (error) {
            // Rollback: sacar el mensaje del usuario si hubo error
            state.history.pop();
            state.status = "error";
            state.error = error.message;
            renderChatState(state);
        }

        button.disabled = false;
        button.textContent = "Enviar ⚓";
    });
}

function renderChatState(state) {
    const $messages = document.querySelector(".messages");
    const $status = document.getElementById("character-status");
    if (!$messages) return;

    // Generar HTML de todos los mensajes del historial
    const historyHTML = state.history.map(msg => {
        const isUser = msg.role === "user";
        return `<div class="message ${isUser ? "message--user" : "message--luffy"}">${msg.parts[0].text}</div>`;
    }).join("");

    if (state.status === "loading") {
        // Actualizar estado del personaje
        if ($status) {
            $status.innerHTML = `<span class="status-dot status-dot--typing"></span><span>Escribiendo...</span>`;
        }
        // Mostrar historial actual + indicador de escritura animado
        $messages.innerHTML = historyHTML + `
            <div class="message message--luffy message--typing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>`;
        $messages.scrollTop = $messages.scrollHeight;
    }

    if (state.status === "error") {
        if ($status) {
            $status.innerHTML = `<span class="status-dot status-dot--online"></span><span>En línea</span>`;
        }
        $messages.innerHTML = historyHTML + `<div class="message message--error">⚠️ ${state.error}</div>`;
        $messages.scrollTop = $messages.scrollHeight;
    }

    if (state.status === "success") {
        if ($status) {
            $status.innerHTML = `<span class="status-dot status-dot--online"></span><span>En línea</span>`;
        }
        $messages.innerHTML = historyHTML;
        $messages.scrollTop = $messages.scrollHeight;
    }
}

function renderAbout() {
    document.getElementById("app").innerHTML = `
    <div class="about-view">
        <h1>Acerca de</h1>
        <p>Esta aplicación fue desarrollada como Proyecto Integrador 3 del bootcamp Henry.</p>
        <p>Utiliza Google Gemini AI para simular una conversación con Monkey D. Luffy de One Piece.</p>
        <p>Tecnologías: HTML, CSS, JavaScript, Vercel Serverless Functions.</p>
    </div>
    `;
}

function renderNotFound() {
    document.getElementById("app").innerHTML = "<h1>404 - Not Found</h1>";
}

const routes = {
    "/home": renderHome,
    "/chat": renderChat,
    "/about": renderAbout,
};

function router() {
    // Limpiar modo chat al salir de la vista de chat
    document.getElementById("app").classList.remove("chat-mode");

    const path = window.location.pathname;
    if (path === "/") {
        navigateTo("/home");
        return;
    }
    const render = routes[path] || renderNotFound;
    render();
}

function navigateTo(path) {
    history.pushState(null, "", path);
    router();
}

// Interceptar clicks en links con data-href (navegación SPA)
document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-href]");
    if (!link) return;
    event.preventDefault();
    // Cerrar el menú hamburguesa si está abierto
    document.querySelector(".navbar__links")?.classList.remove("is-open");
    navigateTo(link.getAttribute("data-href"));
});

// Manejar el botón atrás/adelante del navegador
window.addEventListener("popstate", () => {
    router();
});

// Toggle del menú hamburguesa en mobile
const hamburger = document.getElementById("hamburger-btn");
const navLinks = document.querySelector(".navbar__links");
if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("is-open");
    });
}

router();
