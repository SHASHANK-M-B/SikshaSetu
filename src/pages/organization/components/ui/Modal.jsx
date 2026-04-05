import React from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ children, title, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg overflow-hidden">

                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}
