import React, { useState } from "react";
import { FiPlayCircle, FiPlusCircle } from "react-icons/fi";

export default function ViewCourses() {
    const availableCourses = [
        { code: "PHY111", name: "Physics Fundamentals", instructor: "Dr. Rao" },
        { code: "CSE250", name: "Web Development Basics", instructor: "Prof. Lena" },
        { code: "BUS310", name: "Business Strategy", instructor: "Mr. Albert" }
    ];

    const initialJoined = [
        { code: "CSE101", name: "Intro to Programming", progress: 70, instructor: "Dr. Sharma" },
        { code: "ENG201", name: "Communication Skills", progress: 40, instructor: "Prof. Kim" },
        { code: "MATH202", name: "Discrete Mathematics", progress: 90, instructor: "Dr. Anya" }
    ];

    const [joinedCourses, setJoinedCourses] = useState(initialJoined);

    const handleJoin = (course) => {
        const newCourse = {
            ...course,
            progress: 0
        };
        setJoinedCourses([...joinedCourses, newCourse]);
    };

    return (
        <div className="space-y-10">

            {/* AVAILABLE COURSES TO JOIN */}
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-4">
                    Join New Courses
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                    Courses shared by your teacher will appear here.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {availableCourses.map(course => (
                        <div
                            key={course.code}
                            className="p-6 rounded-2xl bg-white shadow-md border hover:shadow-xl hover:-translate-y-1 transition"
                        >
                            <h3 className="text-xl font-bold text-indigo-600">{course.code}</h3>
                            <p className="text-lg font-semibold">{course.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Instructor: {course.instructor}
                            </p>

                            <button
                                onClick={() => handleJoin(course)}
                                className="mt-4 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <FiPlusCircle className="text-lg" /> Join Course
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* JOINED COURSES */}
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-4">
                    Joined Courses
                </h2>
                <p className="text-gray-600 text-lg">
                    Continue learning from your joined courses.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {joinedCourses.map(course => (
                        <div
                            key={course.code}
                            className="p-6 rounded-2xl bg-white shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition"
                        >
                            <h3 className="text-xl font-bold text-indigo-600">{course.code}</h3>
                            <p className="text-lg font-semibold">{course.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Instructor: {course.instructor}
                            </p>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                </div>

                                <div className="w-full bg-gray-200 h-2.5 rounded-full mt-1 overflow-hidden">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <FiPlayCircle /> Resume Learning
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
