import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow rounded-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border rounded mb-4"
                />

                <button className="w-full py-3 bg-blue-600 text-white rounded">
                    Login
                </button>

                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-blue-600 cursor-pointer"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}
