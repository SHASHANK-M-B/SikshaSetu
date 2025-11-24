import React from "react";
import { FiPlayCircle } from "react-icons/fi";

export default function ViewCourses() {
    const courses = [
        { code: "CSE101", name: "Intro to Programming", progress: 70, instructor: "Dr. Sharma" },
        { code: "ENG201", name: "Communication Skills", progress: 40, instructor: "Prof. Kim" },
        { code: "MATH202", name: "Discrete Mathematics", progress: 90, instructor: "Dr. Anya" }
    ];

    return (
        <div className="space-y-6">
            <p className="text-gray-600 text-lg">Continue learning from your enrolled courses.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.code} className="p-6 rounded-2xl bg-white shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition">
                        <h3 className="text-xl font-bold text-indigo-600">{course.code}</h3>
                        <p className="text-lg font-semibold">{course.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>

                        <div className="mt-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                            </div>

                            <div className="w-full bg-gray-200 h-2.5 rounded-full mt-1">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                            </div>
                        </div>

                        <button className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                            <FiPlayCircle /> Resume Learning
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
