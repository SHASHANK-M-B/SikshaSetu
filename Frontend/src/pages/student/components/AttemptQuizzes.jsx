import React from "react";

export default function AttemptQuizzes({ quizItems, handleQuizAttempt }) {

    return (
        <div className="space-y-8">
            <p className="text-gray-600 text-lg">
                Attempt pending quizzes. Offline attempts will sync automatically.
            </p>

            {quizItems.map((quiz) => (
                <div
                    key={quiz.id}
                    className="p-6 rounded-2xl bg-white border shadow hover:shadow-xl
                    flex items-center justify-between transition transform hover:-translate-y-1"
                >
                    <div>
                        <h3 className="text-2xl font-bold text-indigo-600">{quiz.title}</h3>

                        <p className="text-sm text-gray-600 mt-1">
                            {quiz.course} |
                            <span
                                className={`ml-1 font-bold ${quiz.status === "Pending"
                                    ? "text-red-600"
                                    : "text-green-600"
                                    }`}
                            >
                                {quiz.status}
                            </span>
                        </p>

                        {quiz.status === "Attempted" && (
                            <p className="mt-2 text-green-600 font-bold text-lg">
                                ⭐ Score: {quiz.score}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={quiz.status === "Attempted"}
                        onClick={() => handleQuizAttempt(quiz.id)}
                        className={`px-6 py-3 rounded-xl text-white font-semibold transition
                            ${quiz.status === "Attempted"
                                ? "bg-gray-400"
                                : "bg-indigo-600 hover:bg-indigo-700"}`}
                    >
                        {quiz.status === "Attempted" ? "Completed" : "Start Quiz"}
                    </button>
                </div>
            ))}
        </div>
    );
}
