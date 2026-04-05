import React, { useState, useEffect, useRef } from "react";
import { askAI } from "@/api/teacher";
import { FiSend, FiCpu, FiUser, FiClock, FiTrash2 } from "react-icons/fi";

export default function AIStudio() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const scrollRef = useRef(null);

  // --- LOAD HISTORY ON MOUNT ---
  useEffect(() => {
    fetchHistory();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const { data } = await getAIHistory();

      // Transform backend history [{ query, response }] into flat chat messages
      // Backend returns history sorted by createdAt desc (usually), we might want to reverse for chat flow
      const formattedHistory = [];
      const rawHistory = data.history || [];

      // Assuming backend returns newest first, we reverse to show oldest at top
      [...rawHistory].reverse().forEach((item) => {
        formattedHistory.push({
          id: item.id + "_q",
          role: "user",
          content: item.query,
          createdAt: item.createdAt,
        });
        formattedHistory.push({
          id: item.id + "_a",
          role: "assistant",
          content: item.response,
          createdAt: item.createdAt,
        });
      });

      setMessages(formattedHistory);
    } catch (error) {
      console.error("Failed to load AI history", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentQuery = query;
    setQuery(""); // Clear input immediately
    setLoading(true);

    // Optimistically add user message
    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        role: "user",
        content: currentQuery,
        createdAt: new Date(),
      },
    ]);

    try {
      // API Call
   const { data } = await askAI({ query: currentQuery });


      // Add AI Response
      setMessages((prev) => [
        ...prev,
        {
          id: tempId + 1,
          role: "assistant",
          content: data.response,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("AI request failed", error);
      // Optional: Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: tempId + 1,
          role: "error",
          content: "Sorry, I encountered an error processing your request.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <FiCpu size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Teaching Assistant</h2>
            {/* <p className="text-xs text-indigo-100">Powered by OpenAI GPT-4o</p> */}
          </div>
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
        {historyLoading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!historyLoading && messages.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <FiCpu className="mx-auto text-4xl mb-3 opacity-20" />
            <p>
              Ask me anything about lesson plans, calculus concepts, or quiz
              ideas!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* AVATAR */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === "user"
                  ? "bg-indigo-100 text-indigo-700"
                  : msg.role === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-purple-600 text-white"
              }`}
            >
              {msg.role === "user" ? <FiUser /> : <FiCpu />}
            </div>

            {/* MESSAGE BUBBLE */}
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : msg.role === "error"
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <FiCpu />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={scrollRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <form
          onSubmit={handleAsk}
          className="relative flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Explain calculus concepts for beginners..."
            className="w-full pl-5 pr-14 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md"
          >
            <FiSend size={20} />
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-2">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}
