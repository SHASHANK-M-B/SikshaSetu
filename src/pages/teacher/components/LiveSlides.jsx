// components/LiveSlides.jsx
import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

export default function LiveSlides() {
    const [slidesDecks] = useState(() =>
        load("edu_uploads", []).filter(
            (u) => u.type === "application/pdf" || u.name.endsWith(".ppt") || u.name.endsWith(".pptx")
        )
    );

    const [selected, setSelected] = useState(slidesDecks?.[0]?.id ?? null);
    const [slideIndex, setSlideIndex] = useState(0);
    const [log, setLog] = useState(() => load("edu_slide_log", []));

    useEffect(() => save("edu_slide_log", log), [log]);

    useEffect(() => {
        const handler = (e) => {
            const entry = { type: "auto", at: new Date().toISOString(), reason: e?.detail?.reason ?? "external" };
            setLog((l) => [entry, ...l]);
            alert("Auto slide push initiated (demo)");
        };

        window.addEventListener("edu_push_slide", handler);
        return () => window.removeEventListener("edu_push_slide", handler);
    }, []);

    const pushIndex = (idx, type = "manual") => {
        setSlideIndex(idx);

        const ev = new CustomEvent("edu_slide_index", { detail: { index: idx } });
        window.dispatchEvent(ev);

        setLog((l) => [{ type, index: idx, at: new Date().toISOString() }, ...l]);
    };

    const next = () => pushIndex(slideIndex + 1);
    const prev = () => pushIndex(Math.max(0, slideIndex - 1));

    return (
        <div className="max-w-3xl">
            <h3 className="font-bold mb-2">Live Slide Push</h3>

            <p className="text-sm text-slate-600 mb-3">
                Synchronize slides to students by broadcasting only the slide index (very lightweight).
            </p>

            <div className="flex gap-2 items-center mb-3">
                <select
                    value={selected ?? ""}
                    onChange={(e) => setSelected(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Choose slide deck (from uploads)</option>

                    {slidesDecks.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>

                <button
                    onClick={() => {
                        const ev = new CustomEvent("edu_push_slide");
                        window.dispatchEvent(ev);
                        alert("Auto push triggered (demo)");
                    }}
                    className="px-3 py-2 bg-purple-600 text-white rounded"
                >
                    Auto Push
                </button>

                <div className="ml-auto flex gap-2">
                    <button onClick={prev} className="px-3 py-2 border rounded">
                        <FiChevronLeft />
                    </button>

                    <div className="px-4 py-2 bg-white/20 rounded">
                        Slide {slideIndex + 1}
                    </div>

                    <button onClick={next} className="px-3 py-2 border rounded">
                        <FiChevronRight />
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="font-semibold mb-2">Activity log</h4>

                <ul className="space-y-2">
                    {log.length === 0 && <div className="text-slate-500">No pushes yet.</div>}

                    {log.map((l, i) => (
                        <li
                            key={i}
                            className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10"
                        >
                            <div>
                                <div className="font-medium">
                                    {l.index != null ? `Slide ${l.index + 1}` : "Auto push"}
                                </div>

                                <div className="text-xs text-slate-600">{l.type}</div>
                            </div>

                            <div className="text-xs text-slate-500">
                                {new Date(l.at).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
