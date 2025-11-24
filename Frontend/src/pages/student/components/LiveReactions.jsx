import React, { useState } from "react";

export default function LiveReactions() {

    const [reaction, setReaction] = useState("");

    return (
        <div className="space-y-8 bg-white p-6 rounded-2xl shadow border">

            <h3 className="text-2xl font-bold text-indigo-700">Live Reactions</h3>
            <p className="text-gray-600">Send quick reactions during the class.</p>

            <div className="flex gap-6">

                <button
                    onClick={() => setReaction("Understood")}
                    className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow transition"
                >
                    👍 Understood
                </button>

                <button
                    onClick={() => setReaction("Doubt")}
                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow transition"
                >
                    ❓ Doubt
                </button>

            </div>

            {reaction && (
                <p className="text-xl font-semibold text-gray-700">
                    Reaction Sent: <span className="text-indigo-600">{reaction}</span>
                </p>
            )}
        </div>
    );
}
