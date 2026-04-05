// components/LiveAudio.jsx
import React, { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

export default function LiveAudio({ user }) {
    const [isLive, setIsLive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [lowBandwidthMode, setLowBandwidthMode] = useState(true);

    useEffect(() => {
        let id;
        if (isLive) {
            id = setInterval(() => setSeconds((s) => s + 1), 1000);
        }
        return () => clearInterval(id);
    }, [isLive]);

    useEffect(() => {
        const start = () => setIsLive(true);
        window.addEventListener("edu_start_audio", start);
        return () => window.removeEventListener("edu_start_audio", start);
    }, []);

    const toggle = () => {
        setIsLive((s) => {
            const next = !s;
            alert(next ? "Live audio session started (demo)" : "Live audio session ended (demo)");
            if (!next) setSeconds(0);
            return next;
        });
    };

    const fmt = (s) => new Date(s * 1000).toISOString().substr(11, 8);

    return (
        <div className="max-w-md">
            <h3 className="font-bold mb-2">Live Audio Session</h3>
            <p className="text-sm text-slate-600 mb-3">
                Start an audio-only lecture optimized for low-bandwidth connections (demo simulation).
            </p>

            <div className="flex gap-2 items-center mb-3">
                <button
                    onClick={toggle}
                    className={`px-4 py-2 rounded-lg font-semibold ${isLive ? "bg-red-600 text-white" : "bg-green-600 text-white"
                        }`}
                >
                    {isLive ? "End Session" : "Start Session"}
                </button>

                <div className="flex items-center gap-2">
                    <label className="text-sm">Low bandwidth</label>
                    <input
                        type="checkbox"
                        checked={lowBandwidthMode}
                        onChange={(e) => setLowBandwidthMode(e.target.checked)}
                    />
                </div>

                <button
                    onClick={() => { setSeconds(0); setIsLive(false); }}
                    className="px-3 py-1 border rounded"
                >
                    Reset
                </button>
            </div>

            {isLive && (
                <div className="mt-4 p-3 bg-white/30 rounded-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500 grid place-items-center text-white font-bold">
                        ●
                    </div>

                    <div>
                        <div className="font-medium">LIVE</div>
                        <div className="text-xs text-slate-600">
                            <FiClock className="inline mr-1" /> {fmt(seconds)} ·{" "}
                            {lowBandwidthMode ? "Low-bandwidth codec (simulated)" : "Standard audio"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
