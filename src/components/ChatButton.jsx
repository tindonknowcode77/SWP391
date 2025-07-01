import React, { useState } from "react";
import "../styles/ChatButton.css";
import {aichat} from '../api/auth';

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setInput("");
    try {
      const res = await aichat(userMessage);
      console.log("API response:", res); // res chính là data luôn
  
      // Vì res là object { reply: "..." }, không cần res.data.reply
      const aiReply = res.reply ? res.reply : "AI không có phản hồi.";
      setMessages((msgs) => [...msgs, { from: "ai", text: aiReply }]);
    } catch (err) {
      console.log("API error:", err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && err.response.data.reply) {
          setMessages((msgs) => [...msgs, { from: "ai", text: err.response.data.reply }]);
        } else if (typeof err.response.data === 'string') {
          setMessages((msgs) => [...msgs, { from: "ai", text: err.response.data }]);
        } else {
          setMessages((msgs) => [...msgs, { from: "ai", text: "AI không có phản hồi." }]);
        }
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "ai", text: "Đã xảy ra lỗi khi kết nối AI." }
        ]);
      }
    }
  };

  return (
    <>
      <button className="chat-ai-button" onClick={() => setOpen(true)}>
        <span className="chat-ai-icon">💬</span>
        <span className="chat-ai-text">Chat với AI ngay</span>
      </button>
      {open && (
        <div className="chat-ai-box">
          <div className="chat-ai-box-header">
            <span>Chat với AI</span>
            <button className="chat-ai-close" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="chat-ai-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-ai-msg chat-ai-msg-${msg.from}`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-ai-input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
