import { askLuffy} from "./chat.js";
// app.js - Routing y lógica principal
const state = {
    status: "idle",
    data: null,
    error: null,
};

function renderHome() {
    document.getElementById("app").innerHTML = "<h1>home</h1>";
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
    document.querySelector("#chat-form").addEventListener("submit",async (event) => {
        event.preventDefault();
        state.status = "loading";
        state.data = null;
        state.error = null;
        renderChatState(state);
        const input = document.querySelector("#chat-form input");
        const message = input.value;

try {
  const data = await askLuffy(message);
  state.status = "success";
  state.data = data;
  renderChatState(state);
} catch (error) {
  state.status = "error";
  state.error = error.message;
  renderChatState(state);
}
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
        $messages.innerHTML = `<p>${state.data.reply}</p>`;
    }
}



function renderAbout() {
    document.getElementById("app").innerHTML = "<h1>about</h1>";
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