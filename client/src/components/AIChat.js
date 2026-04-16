import { useState } from "react";
import API from "../services/api";
import "./AIChat.css";

function AIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
  if (!message.trim()) return;

  const updatedChat = [...chat, { type: "user", text: message }];
  setChat(updatedChat);

  try {
    const res = await API.post("/user/ai-insights", {
      message: message
    });

    setChat([
      ...updatedChat,
      { type: "ai", text: res.data.insight }
    ]);

  } catch (err) {
    console.error(err);
    setChat([
      ...updatedChat,
      { type: "ai", text: "AI error ❌" }
    ]);
  }

  setMessage("");
};

  return (
    <div className="ai-wrapper">

      {/* FLOAT BUTTON + TOOLTIP */}
      <div className="ai-float-wrapper">

        <div className="ai-tooltip">Ask AI 🤖</div>

        <div className="ai-float" onClick={() => setOpen(!open)}>
          🤖
        </div>

      </div>

      {/* CHAT BOX */}
      {open && (
        <div className="ai-chatbox">

          {/* HEADER */}
          <div className="ai-header">
            AI Assistant 🤖
          </div>

          {/* MESSAGES */}
          <div className="ai-messages">
            {chat.length === 0 && (
              <div className="ai-empty">
                Ask anything about your productivity 🚀
              </div>
            )}

            {chat.map((msg, i) => (
              <div
                key={i}
                className={msg.type === "user" ? "msg user" : "msg ai"}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="ai-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
            />

            <button onClick={sendMessage}>
              ➤
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default AIChat;