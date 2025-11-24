import React from "react";

export default function RoleSelectPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="p-8 bg-white rounded shadow max-w-lg w-full">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Choose Registration Type
                </h2>

                <div className="space-y-4">

                    <button className="w-full p-4 border rounded hover:bg-gray-50">
                        🏫 Register as Organization
                    </button>

                    <button className="w-full p-4 border rounded hover:bg-gray-50">
                        👨‍🏫 Register as Teacher
                    </button>

                    <button className="w-full p-4 border rounded hover:bg-gray-50">
                        🎓 Register as Student
                    </button>

                </div>
            </div>
        </div>
    );
}
