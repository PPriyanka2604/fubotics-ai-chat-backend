import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000"; // change to deployed backend URL later

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // load history on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, []);

  // auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/messages`, {
        content: input,
      });
      setMessages(res.data.messages);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error sending message. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="app-root">
      <div className="chat-shell">
        {/* LEFT: branding / info */}
        <aside className="chat-sidebar">
          <div className="logo-circle">F</div>
          <h1 className="app-title">Fubotics AI Chat</h1>
          <p className="app-subtitle">
            Talk to your personal AI assistant. Your conversations are safely
            stored and reloaded every time.
          </p>

          <div className="status-chip">
            <span className="status-dot" />
            <span>AI is online</span>
          </div>

          <div className="tips-card">
            <h2>TRY ASKING:</h2>
            <ul>
              <li>“Summarize my day in one line.”</li>
              <li>“Help me prepare for an interview.”</li>
              <li>“Explain transformers in simple words.”</li>
            </ul>
          </div>

          <div className="footer-note">
            Built by <span className="highlight">Pabbathi Priyanka</span> for
            the Fubotics Software &amp; AI Internship.
          </div>
        </aside>

        {/* MIDDLE: chat */}
        <main className="chat-main">
          <header className="chat-header">
            <div>
              <h2>Conversation</h2>
              <p className="chat-header-sub">
                Messages are synced with the backend and persist on refresh.
              </p>
            </div>
            <div className="model-pill">Model: gpt-4o-mini</div>
          </header>

          <section className="messages-container">
            {messages.length === 0 && !loading && (
              <div className="empty-state">
                <p>Start the conversation…</p>
                <span>Type a message below and hit Enter.</span>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`message-row ${
                  m.role === "user" ? "from-user" : "from-ai"
                }`}
              >
                <div className="avatar">
                  {m.role === "user" ? "You" : "AI"}
                </div>
                <div className="bubble-wrapper">
                  <div className="bubble">
                    {m.content}
                    <div className="timestamp">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleTimeString()
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row from-ai typing-row">
                <div className="avatar">AI</div>
                <div className="bubble-wrapper">
                  <div className="bubble typing-bubble">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </section>

          <form className="input-bar" onSubmit={handleSend}>
            <textarea
              className="input-field"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything… Press Enter to send, Shift+Enter for new line."
            />
            <button
              type="submit"
              className="send-button"
              disabled={loading || !input.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </main>

        {/* RIGHT: interactive session overview */}
        <section className="extra-panel">
          <div className="extra-glow" />

          <div className="extra-card">
            <h3>Session overview</h3>
            <p className="extra-muted">
              Live snapshot of this chat session, updated from your stored
              history.
            </p>

            <div className="stat-grid">
              <div className="stat-card">
                <span className="stat-label">Total messages</span>
                <span className="stat-value">{messages.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">User turns</span>
                <span className="stat-value">
                  {messages.filter((m) => m.role === "user").length}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">AI replies</span>
                <span className="stat-value">
                  {messages.filter((m) => m.role === "assistant").length}
                </span>
              </div>
            </div>

            <div className="timeline">
              <div className="timeline-header">Recent activity</div>
              <div className="timeline-body">
                {messages.length === 0 && (
                  <div className="timeline-empty">
                    Start chatting to see the live timeline here.
                  </div>
                )}

                {messages
                  .slice(-4)
                  .reverse()
                  .map((m) => (
                    <div key={m.id} className="timeline-item">
                      <span
                        className={`timeline-dot ${
                          m.role === "user" ? "user-dot" : "ai-dot"
                        }`}
                      />
                      <div className="timeline-text">
                        <span className="timeline-role">
                          {m.role === "user" ? "You" : "AI"}
                        </span>
                        <span className="timeline-content">
                          {m.content.length > 60
                            ? m.content.slice(0, 60) + "…"
                            : m.content}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="shortcut-card">
              <div className="shortcut-row">
                <span>Enter</span>
                <span>Send message</span>
              </div>
              <div className="shortcut-row">
                <span>Shift + Enter</span>
                <span>New line</span>
              </div>
              <div className="shortcut-row">
                <span>Refresh</span>
                <span>Load saved history</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
