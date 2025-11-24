import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow rounded-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>

                <button
                    onClick={() => navigate("/register/select")}
                    className="w-full py-3 border rounded mb-4 hover:bg-gray-50"
                >
                    Continue → Choose Role
                </button>

                <p className="text-center">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
