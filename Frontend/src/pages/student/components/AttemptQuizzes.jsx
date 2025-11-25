import React from "react";

export default function AttemptQuizzes({ quizItems, handleQuizAttempt }) {

    return (
        <div className="min-h-screen w-full bg-gray-50 px-3 sm:px-6 md:px-10 py-6 sm:py-10 space-y-6">

            {/* Header text */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Attempt pending quizzes. Offline attempts will sync automatically.
            </p>

            {/* QUIZ LIST */}
            <div className="space-y-4 sm:space-y-6">

                {quizItems.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="
                        w-full
                        bg-white 
                        border 
                        rounded-2xl
                        p-4 sm:p-6 

                        flex flex-col sm:flex-row 
                        sm:items-center 
                        justify-between
                        
                        gap-4 sm:gap-0

                        shadow-sm
                        hover:shadow-xl

                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-indigo-400
                        "
                    >
                        {/* LEFT */}
                        <div className="space-y-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-indigo-600 leading-tight">
                                {quiz.title}
                            </h3>

                            <p className="text-sm text-gray-600">
                                {quiz.course} ·
                                <span
                                    className={`ml-1 font-bold 
                                    ${quiz.status === "Pending"
                                        ? "text-red-600"
                                        : "text-green-600"
                                        }`
                                    }
                                >
                                    {quiz.status}
                                </span>
                            </p>

                            {quiz.status === "Attempted" && (
                                <p className="pt-1 text-green-600 font-bold text-base sm:text-lg">
                                    ⭐ Score: {quiz.score}
                                </p>
                            )}
                        </div>

                        {/* RIGHT BUTTON */}
                        <button
                            disabled={quiz.status === "Attempted"}
                            onClick={() => handleQuizAttempt(quiz.id)}
                            className={`
                            w-full sm:w-auto
                            px-5 py-3
                            rounded-xl
                            font-semibold
                            text-white
                            text-sm sm:text-base
                            transition-all

                            ${
                                quiz.status === "Attempted"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800"
                            }
                        `}
                        >
                            {quiz.status === "Attempted" ? "Completed" : "Start Quiz"}
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}
