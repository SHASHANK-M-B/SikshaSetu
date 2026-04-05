import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DeveloperLogin({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // 🔥 Dummy developer credentials (fully offline)
        const dummyEmail = "admin@remoteedu.com";
        const dummyPassword = "devpassword";

        // Check credentials locally
        if (email === dummyEmail && password === dummyPassword) {
            const user = {
                name: "Super Admin",
                email: dummyEmail,
                role: "developer",
            };

            localStorage.setItem("dev_user", JSON.stringify(user));
            localStorage.setItem("dev_token", "dummy_token_123");

            if (onLoginSuccess) onLoginSuccess(user);
            window.location.href = "/developer/panel";
            return;
        }

        // Wrong credentials
        setError("Invalid Developer Credentials");
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/40"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 grid place-items-center text-white font-extrabold text-xl">
                        Dev
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Developer Login</h1>
                        <p className="text-xs text-slate-500">Super Admin Access Only</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600">Email</label>
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@remoteedu.com"
                            className="mt-1 w-full px-3 py-3 border rounded-lg bg-white/70 focus:ring-2 ring-indigo-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1 w-full px-3 py-3 border rounded-lg bg-white/70 focus:ring-2 ring-indigo-400 outline-none"
                        />
                    </div>

                    {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

                    <button
                        disabled={loading}
                        className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-[1.01]"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                    {/* Demo autofill */}
                    <button
                        type="button"
                        onClick={() => {
                            setEmail("admin@remoteedu.com");
                            setPassword("devpassword");
                        }}
                        className="w-full py-2 border rounded-lg text-sm hover:bg-slate-100"
                    >
                        Autofill Demo Credentials
                    </button>
                </form>

                <p className="text-[10px] text-slate-400 mt-4">
                    * Developer login is private. Do NOT show this page in landing page or navbar.
                </p>
            </motion.div>
        </div>
    );
}
