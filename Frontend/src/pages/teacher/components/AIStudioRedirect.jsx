// components/AIStudioRedirect.jsx
import React, { useState } from "react";

export default function AIStudioRedirect() {
    const [prompt, setPrompt] = useState("");
    const [externalURL, setExternalURL] = useState("");

    const generate = (e) => {
        e.preventDefault();
        if (!prompt) return alert("Give a short prompt for AI video");

        // Create ChatGPT URL with prompt included
        const url = `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`;

        // Save the URL so we show it below
        setExternalURL(url);

        // Put the generated link back inside the textarea
        setPrompt((prev) => `${prev}\n\n🔗 ChatGPT Link: ${url}`);

        // Open ChatGPT in new tab
        window.open(url, "_blank");
    };

    return (
        <div className="max-w-2xl">
            <h3 className="font-bold text-lg mb-3">AI Video Studio — ChatGPT Redirect</h3>

            <form onSubmit={generate} className="space-y-3">
                <textarea
                    placeholder="Short video prompt: e.g. 'Explain Newton's 2nd law'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="w-full p-3 border rounded"
                />

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-700 text-white rounded">
                        Generate & Open ChatGPT
                    </button>

                    <button
                        type="button"
                        onClick={() => setPrompt("")}
                        className="px-4 py-2 border rounded"
                    >
                        Reset
                    </button>
                </div>
            </form>

            {externalURL && (
                <div className="mt-3 text-xs text-slate-500">
                    Opened: {externalURL}
                </div>
            )}
        </div>
    );
}
