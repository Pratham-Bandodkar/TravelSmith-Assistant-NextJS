function toggleChat() {
    const widget = document.getElementById("chat-widget");
    widget.style.display = widget.style.display === "flex" ? "none" : "flex";
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function formatReply(text) {
    return text
        .replace(/\n/g, "<br>")
        .replace(/---/g, "<hr style='border:none;border-top:1px solid #ddd;margin:8px 0;'>");
}

function sendQuickMessage(msg) {
    document.getElementById("user-input").value = msg;
    sendMessage();
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const message = input.value.trim();
    if (message === "") return;

    chatBox.innerHTML += `<div class="message user">${message}</div>`;
    input.value = "";

    const typingId = "typing-" + Date.now();
    chatBox.innerHTML += `<div class="message bot" id="${typingId}">Smith Assistant is typing...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        const formattedReply = formatReply(data.reply);

        document.getElementById(typingId).outerHTML =
            `<div class="message bot">${formattedReply}</div>`;

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        document.getElementById(typingId).innerText =
            "Server error. Please try again.";
    }
}

/* Greeting */
window.onload = function () {
    const chatBox = document.getElementById("chat-box");

    chatBox.innerHTML += `
        <div class="message bot">
            👋 Welcome to <b>Travel Smith</b>!<br><br>
            👉 Choose a category below:
            <div class="quick-buttons">
                <div class="quick-btn" onclick="sendQuickMessage('Beach tours in Goa')">🏖 Beach</div>
                <div class="quick-btn" onclick="sendQuickMessage('Adventure activities in Goa')">🚀 Adventure</div>
                <div class="quick-btn" onclick="sendQuickMessage('Heritage tours in Goa')">🏛 Heritage</div>
                <div class="quick-btn" onclick="sendQuickMessage('Cruises and water fun in Goa')">🚢 Cruises</div>
            </div>
        </div>
    `;
};
