// components/LiveReactionsDashboard.jsx
import React, { useEffect, useState } from "react";

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, f) => {
    try {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : f;
    } catch {
        return f;
    }
};
const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

export default function LiveReactionsDashboard() {
    const [reactions, setReactions] = useState(() => load("edu_reactions", []));
    const [counts, setCounts] = useState({
        understood: 0,
        doubt: 0,
    });

    useEffect(() => save("edu_reactions", reactions), [reactions]);

    const pushReaction = (type) => {
        const r = {
            id: uid("rx_"),
            type,
            at: new Date().toISOString(),
        };

        setReactions((s) => [r, ...s]);
        setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
    };

    useEffect(() => {
        const handler = (e) => {
            const t = e?.detail?.type;
            if (t) pushReaction(t);
        };

        window.addEventListener("edu_reaction", handler);
        return () => window.removeEventListener("edu_reaction", handler);
    }, []);

    const reset = () => {
        if (!confirm("Reset counts?")) return;

        setReactions([]);
        setCounts({ understood: 0, doubt: 0 });
    };

    return (
        <div className="max-w-2xl">
            <h3 className="font-bold mb-3">Live Reactions</h3>

            <p className="text-sm text-slate-600 mb-3">
                Real-time reactions help you adapt pace during a live class.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-4 bg-white/30 rounded flex flex-col items-center">
                    <div className="text-xs text-slate-600">Understood</div>
                    <div className="text-3xl font-bold text-green-600">
                        {counts.understood}
                    </div>
                </div>

                <div className="p-4 bg-white/30 rounded flex flex-col items-center">
                    <div className="text-xs text-slate-600">Doubt</div>
                    <div className="text-3xl font-bold text-red-600">
                        {counts.doubt}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => pushReaction("understood")}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Demo: Understood
                </button>

                <button
                    onClick={() => pushReaction("doubt")}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Demo: Doubt
                </button>

                <button onClick={reset} className="px-4 py-2 border rounded">
                    Reset
                </button>
            </div>

            <div className="mt-4">
                <h4 className="font-semibold mb-2">Recent Reactions</h4>

                <ul className="space-y-1">
                    {reactions.length === 0 && (
                        <div className="text-slate-500">No reactions yet.</div>
                    )}

                    {reactions.map((r) => (
                        <li key={r.id} className="text-xs text-slate-700">
                            {r.type} · {new Date(r.at).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
