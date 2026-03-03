"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        role: "bot",
        content: `
          👋 Welcome to <b>Travel Smith</b>!<br><br>
          👉 Choose a category below:
        `,
        isGreeting: true,
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatReply = (text) => {
    return text
      .replace(/\n/g, "<br>")
      .replace(/---/g, "<hr style='border:none;border-top:1px solid #ddd;margin:8px 0;'>");
  };

  const handleQuickMessage = (msg) => {
    sendMessage(msg);
  };

  const sendMessage = async (manualMsg = null) => {
    const text = manualMsg || input.trim();
    if (!text) return;

    // Add user message to UI
    const newUserMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, newUserMessage]);

    if (!manualMsg) setInput("");
    setIsTyping(true);

    try {
      // Prepare history for API (excluding greeting and mapping roles)
      const apiHistory = messages
        .filter(msg => !msg.isGreeting)
        .map(msg => ({
          role: msg.role === "bot" ? "assistant" : "user",
          content: msg.content.replace(/<br>/g, "\n").replace(/<[^>]*>/g, "") // Strip HTML for AI
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: apiHistory
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: formatReply(data.reply) }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Server error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <main>
      {/* Floating Button */}
      <div id="chat-toggle" onClick={toggleChat}>
        {isOpen ? "✖" : "💬"}
      </div>

      {/* Chat Widget */}
      <div
        className="chat-widget"
        style={{ display: isOpen ? "flex" : "none" }}
      >
        <div className="chat-header">
          🤖 Smith Assistant
          <span className="close-btn" onClick={toggleChat}>
            ✖
          </span>
        </div>

        <div id="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              {msg.isGreeting && (
                <div className="quick-buttons">
                  <div
                    className="quick-btn"
                    onClick={() => handleQuickMessage("Beach tours in Goa")}
                  >
                    🏖 Beach
                  </div>
                  <div
                    className="quick-btn"
                    onClick={() => handleQuickMessage("Adventure activities in Goa")}
                  >
                    🚀 Adventure
                  </div>
                  <div
                    className="quick-btn"
                    onClick={() => handleQuickMessage("Heritage tours in Goa")}
                  >
                    🏛 Heritage
                  </div>
                  <div
                    className="quick-btn"
                    onClick={() => handleQuickMessage("Cruises and water fun in Goa")}
                  >
                    🚢 Cruises
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message bot">Smith Assistant is typing...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Goa tours..."
            onKeyPress={handleKeyPress}
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </main>
  );
}
