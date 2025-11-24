import React, { useState } from "react";
import { FiImage } from "react-icons/fi";

export default function ViewSlides() {

    const [showSlide] = useState(true);

    const slide = {
        title: "Slide 15 — Recursion Examples",
        course: "CSE101"
    };

    return (
        <div className="max-w-3xl space-y-8">

            <h3 className="text-3xl font-bold text-indigo-600">Live Slides 🖼️</h3>

            {showSlide ? (
                <div className="p-10 border-4 border-indigo-400 rounded-2xl
                    bg-indigo-50 shadow-inner text-center">

                    <FiImage size={60} className="mx-auto text-indigo-600 mb-4" />

                    <h4 className="text-2xl font-black text-indigo-700 mb-2">
                        {slide.title}
                    </h4>

                    <p className="text-indigo-600 font-medium">Course: {slide.course}</p>
                </div>
            ) : (
                <div className="p-10 bg-gray-50 border-2 border-gray-300 rounded-2xl text-center">
                    <FiImage size={40} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No live slides right now.</p>
                </div>
            )}
        </div>
    );
}
