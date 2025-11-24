import React, { useState } from "react";

export default function Doubts({ doubtItems, handleSubmitDoubt }) {

    const [text, setText] = useState("");

    const sendDoubt = () => {
        if (!text.trim()) return;
        handleSubmitDoubt(text);
        setText("");
    };

    return (
        <div className="flex flex-col h-[70vh]">

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-xl border shadow-inner flex flex-col">

                {doubtItems.map(d => (
                    <div
                        key={d.id}
                        className={`max-w-xs px-4 py-3 rounded-xl shadow text-sm 
                            ${d.status === "answered"
                                ? "bg-blue-100 self-start"
                                : "bg-green-100 self-end"}`}
                    >
                        <p className="font-medium text-gray-800">{d.text}</p>

                        <p className="text-xs text-gray-600 mt-1">{d.time}</p>

                        {d.reply && (
                            <p className="mt-2 p-2 bg-white rounded-lg text-gray-700 shadow">
                                <b>Teacher:</b> {d.reply}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex gap-3">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your doubt…"
                    className="flex-1 p-3 rounded-xl border shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
                    onKeyDown={(e) => e.key === "Enter" && sendDoubt()}
                />

                <button
                    onClick={sendDoubt}
                    className="px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
