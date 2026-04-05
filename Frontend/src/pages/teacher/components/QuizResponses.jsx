// components/QuizResponses.jsx
import React, { useEffect, useState } from "react";

const load = (k, f) => {
    try {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : f;
    } catch {
        return f;
    }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export default function QuizResponses() {
    const [responses, setResponses] = useState(() =>
        load("edu_quiz_responses", [
            { id: "r1", student: "Alice", quiz: "Thermodynamics", score: 92, date: "2025-11-19" },
            { id: "r2", student: "Bob", quiz: "Thermodynamics", score: 78, date: "2025-11-19" },
        ])
    );

    useEffect(() => save("edu_quiz_responses", responses), [responses]);

    return (
        <div>
            <h3 className="font-bold mb-3">Quiz Responses</h3>

            <div className="overflow-auto">
                <table className="min-w-full bg-white/10 rounded-lg overflow-hidden">
                    <thead className="bg-white/8 text-left text-sm font-semibold">
                        <tr>
                            <th className="p-3">Quiz</th>
                            <th className="p-3">Student</th>
                            <th className="p-3">Score</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {responses.map((r) => (
                            <tr
                                key={r.id}
                                className="border-b border-white/6 hover:bg-white/6 transition"
                            >
                                <td className="p-3 font-medium">{r.quiz}</td>
                                <td className="p-3">{r.student}</td>
                                <td className="p-3 font-bold text-indigo-700">
                                    {r.score}/100
                                </td>
                                <td className="p-3 text-sm text-slate-600">{r.date}</td>

                                <td className="p-3">
                                    <button className="text-indigo-600">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
