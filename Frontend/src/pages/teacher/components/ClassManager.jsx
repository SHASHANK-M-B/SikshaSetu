// components/ClassManager.jsx
import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";

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

export default function ClassManager({ user }) {
    const [classes, setClasses] = useState(() => load("edu_class_sessions", []));
    const [courses] = useState(() => load("edu_courses", []));
    const [form, setForm] = useState({
        courseId: courses?.[0]?.id || "",
        title: "",
        datetime: "",
        duration: 60
    });

    useEffect(() => save("edu_class_sessions", classes), [classes]);

    const create = (e) => {
        e.preventDefault();
        if (!form.title || !form.courseId || !form.datetime) return alert("Provide title, course & datetime");

        const s = {
            id: uid("s_"),
            ...form,
            teacher: user.name,
            createdAt: new Date().toISOString()
        };

        setClasses([s, ...classes]);
        setForm({ courseId: courses?.[0]?.id || "", title: "", datetime: "", duration: 60 });
    };

    const remove = (id) => {
        if (!confirm("Delete session?")) return;
        setClasses((c) => c.filter((s) => s.id !== id));
    };

    const edit = (id) => {
        const sess = classes.find((s) => s.id === id);
        if (!sess) return;

        const newTitle = prompt("Session title", sess.title);
        if (newTitle != null) {
            setClasses((c) => c.map((x) => (x.id === id ? { ...x, title: newTitle } : x)));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="font-bold text-2xl text-indigo-700 flex items-center gap-2">
                <FiUsers /> Class Sessions
            </h3>

            <form
                onSubmit={create}
                className="bg-white/50 p-4 rounded-xl border border-indigo-200/40 
                grid grid-cols-1 md:grid-cols-2 gap-2"
            >
                <select
                    required
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="">Select Course *</option>
                    {courses.length === 0 && <option disabled>No courses</option>}

                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <input
                    required
                    placeholder="Session title *"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="p-2 border rounded"
                />

                <input
                    required
                    type="datetime-local"
                    value={form.datetime}
                    onChange={(e) => setForm({ ...form, datetime: e.target.value })}
                    className="p-2 border rounded"
                />

                <input
                    required
                    type="number"
                    min={10}
                    placeholder="Duration (mins) *"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    className="p-2 border rounded"
                />

                <div className="col-span-full flex gap-2">
                    <button className="px-4 py-2 bg-indigo-700 text-white rounded">Create Session</button>
                    <button
                        type="button"
                        onClick={() => setForm({ courseId: courses?.[0]?.id || "", title: "", datetime: "", duration: 60 })}
                        className="px-4 py-2 border rounded"
                    >
                        Reset
                    </button>
                </div>
            </form>

            <div>
                <h4 className="font-semibold mb-2">Upcoming Sessions</h4>

                <div className="space-y-2">
                    {classes.length === 0 && <div className="text-slate-500">No sessions scheduled.</div>}

                    {classes.map((s) => (
                        <div
                            key={s.id}
                            className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10"
                        >
                            <div>
                                <div className="font-medium">{s.title}</div>
                                <div className="text-xs text-slate-600">
                                    {new Date(s.datetime).toLocaleString()} · {s.duration} mins
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => edit(s.id)} className="px-3 py-1 bg-white/10 rounded">Edit</button>
                                <button onClick={() => remove(s.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
