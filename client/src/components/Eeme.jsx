/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config.js";

const samplePrompts = [
  "Analyze my day",
  "How was my mood last week?",
  "Suggest habits for better mood",
];

const Eeme = ({ date }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi! I'm Eeme, your AI Assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/ai`,
        { date, prompt: currentInput },
        { withCredentials: true }
      );
      const aiMessage = {
        from: "ai",
        text: res.data.response || "Sorry, I couldn't process that.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      let errorMessage = "Error: Unable to reach AI server.";
      if (err.response?.data?.message) {
        errorMessage = `Error: ${err.response.data.message}`;
      }
      const aiErrorMessage = { from: "ai", text: errorMessage };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSample = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 flex flex-col relative">
      {/* Sample Prompts always visible, horizontal, hide after first input */}
      {showSuggestions && (
        <>
          <h3 className="text-lg font-semibold text-[#03A6A1] mb-2">
            Sample Prompts
          </h3>
          <div className="flex flex-row flex-wrap gap-2 justify-center mb-4">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                className="bg-[#E0F7F6] text-[#03A6A1] px-3 py-1 rounded-full text-sm hover:bg-[#B2EBE9] transition"
                onClick={() => handleSample(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        </>
      )}
      <div
        className="flex-1 w-full overflow-y-scroll mb-4 bg-gray-50 rounded p-3 scrollbar-thin scrollbar-thumb-[#03A6A1]/30 scrollbar-track-gray-100"
        style={{ maxHeight: "350px" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-2 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs ${
                msg.from === "user"
                  ? "bg-[#03A6A1] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              {...(msg.from === "ai" && /<\/?[a-z][\s\S]*>/i.test(msg.text)
                ? { dangerouslySetInnerHTML: { __html: msg.text } }
                : {})}
            >
              {msg.from === "user" || !/<\/?[a-z][\s\S]*>/i.test(msg.text)
                ? msg.text
                : null}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex mb-2 justify-start">
            <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-200 text-gray-800 animate-pulse">
              Eeme is typing...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-[#03A6A1] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#028985] transition"
          disabled={loading}
        >
          Send
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-2 text-center">
        For your privacy, this chat will be deleted and not stored on our
        server.
      </p>
    </div>
  );
};

export default Eeme;
