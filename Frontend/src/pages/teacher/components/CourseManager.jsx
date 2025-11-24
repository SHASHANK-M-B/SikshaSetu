// components/CourseManager.jsx
import React, { useState, useEffect } from "react";
import { FiBook } from "react-icons/fi";

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, fallback) => {
    try {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};
const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

export default function CourseManager({ user }) {
    const [courses, setCourses] = useState(() => load("edu_courses", []));
    const [form, setForm] = useState({ name: "", code: "", desc: "" });

    useEffect(() => save("edu_courses", courses), [courses]);

    const create = (e) => {
        e.preventDefault();
        if (!form.name || !form.code) return alert("Provide name & code");

        const c = {
            id: uid("c_"),
            name: form.name,
            code: form.code,
            desc: form.desc,
            students: 0,
        };

        setCourses((s) => [c, ...s]);
        setForm({ name: "", code: "", desc: "" });
    };

    const remove = (id) => {
        if (!confirm("Delete course?")) return;
        setCourses((s) => s.filter((c) => c.id !== id));
    };

    const edit = (id) => {
        const c = courses.find((x) => x.id === id);
        if (!c) return;
        const newName = prompt("Course name", c.name);
        if (newName != null) {
            setCourses((s) => s.map((x) => (x.id === id ? { ...x, name: newName } : x)));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="font-bold text-2xl text-indigo-700 flex items-center gap-2">
                <FiBook /> Manage Courses
            </h3>

            <form onSubmit={create} className="space-y-3 bg-white/50 p-4 rounded-xl border border-indigo-200/40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                        placeholder="Course name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="p-2 rounded border"
                    />
                    <input
                        placeholder="Course code"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        className="p-2 rounded border"
                    />
                    <input
                        placeholder="Short desc"
                        value={form.desc}
                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        className="p-2 rounded border"
                    />
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-700 text-white rounded">Create</button>
                    <button type="button" onClick={() => setForm({ name: "", code: "", desc: "" })} className="px-4 py-2 border rounded">Reset</button>
                </div>
            </form>

            <div>
                <h4 className="font-semibold mb-2">Your Courses</h4>
                <div className="grid gap-3">
                    {courses.length === 0 && <div className="text-slate-500">No courses yet.</div>}

                    {courses.map((c) => (
                        <div
                            key={c.id}
                            className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10"
                        >
                            <div>
                                <div className="font-medium">{c.name}</div>
                                <div className="text-xs text-slate-600">{c.code} · {c.students} students</div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => edit(c.id)} className="px-3 py-1 bg-white/10 rounded">Edit</button>
                                <button onClick={() => remove(c.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
