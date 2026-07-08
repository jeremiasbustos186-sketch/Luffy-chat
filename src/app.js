import { askLuffy} from "./chat.js";
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
        <h1>¡Bienvenido al Chat con Luffy!</h1>
        <p>Monkey D. Luffy, el futuro Rey de los Piratas, está listo para hablar con vos.</p>
        <a href="/chat" data-href="/chat" class="btn-chat">Ir al Chat 🏴‍☠️</a>
    </div>
    `;
}

function renderChat() {
    document.getElementById("app").innerHTML =`
    <div class="chat-view">
    <div class="messages" id="messages"></div>
    <form class="chat-form" id="chat-form">
        <input type="text" name="message" placeholder="Escribe un mensaje..." required />
        <button type="submit">Enviar</button>
    </form>
    </div>
    `;
    document.querySelector("#chat-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = document.querySelector("#chat-form button");
        button.disabled = true;
        button.textContent = "Enviando...";
        state.status = "loading";
        state.data = null;
        state.error = null;
        renderChatState(state);
        const input = document.querySelector("#chat-form input");
        const message = input.value;
        input.value = "";
        state.history.push({ role: "user", parts: [{ text: message }] });

        try {
            const data = await askLuffy(message, state.history);
            state.status = "success";
            state.data = data;
            state.history.push({ role: "model", parts: [{ text: data.reply }] });
            renderChatState(state);
        } catch (error) {
            state.history.pop();
            state.status = "error";
            state.error = error.message;
            renderChatState(state);
        }

        button.disabled = false;
        button.textContent = "Enviar";
    });
}

function renderChatState(state) {
    if (state.status === "loading") {
        const $messages = document.querySelector(".messages");
        $messages.innerHTML = "<p>Cargando mensajes...</p>";
    }
    if (state.status === "error") {
        const $messages = document.querySelector(".messages");
        $messages.innerHTML = `<p>${state.error}</p>`;
    }
    if (state.status === "success") {
        const $messages = document.querySelector(".messages");
        $messages.innerHTML = state.history.map(msg =>{
            const isUser= msg.role === "user";
            return `<div class="message ${isUser ? "message--user" : "message--luffy"}">${msg.parts[0].text}</div>`;
        }).join("");
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

document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-href]");
    if (!link) return;

    event.preventDefault();
    navigateTo(link.getAttribute("data-href"));
});

window.addEventListener("popstate", () => {
    router();
});

router();