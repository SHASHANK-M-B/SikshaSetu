import {
  getQuizQuestion,
  listOfQuizes,
  submitQuizResponses,
} from "@/api/student";
import React, { useState, useEffect } from "react";

// ===========================================
// 1. QUIZ ATTEMPT SCREEN COMPONENT
//    - Dynamically calls 'getQuizQuestion' and 'submitQuizResponses'.
// ===========================================

function QuizAttemptScreen({ quizId, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Effect to fetch questions dynamically using the provided API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await getQuizQuestion(quizId);
        // Assuming response.data is an array of question objects
        setQuestions(response.data, questions);
      } catch (err) {
        console.error("Error fetching quiz questions:", err);
        // Implement proper error handling UI here
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Structure submission data
      const submissionData = Object.keys(answers).map((qid) => ({
        questionId: qid,
        selectedOption: answers[qid],
      }));

      // Call the submission API
      const response = await submitQuizResponses(quizId, submissionData);

      // Handle the response and set the result state
      setSubmitResult({
        score: response.data.score,
        message: response.data.message || "Quiz submitted successfully!",
        isSuccessful: response.data.isSuccessful || true,
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitResult({
        message: "Submission failed. Please try again.",
        isSuccessful: false,
        score: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic: Submission Result ---
  if (submitResult) {
    return (
      <div className="min-h-screen w-full p-10 space-y-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-indigo-700">
          Quiz Submission Complete!
        </h2>
        <div
          className={`p-6 rounded-xl shadow-lg ${
            submitResult.isSuccessful
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } inline-block`}
        >
          <p className="font-semibold">{submitResult.message}</p>
          {submitResult.score !== null && (
            <p className="mt-2 text-xl">Your Score: **{submitResult.score}**</p>
          )}
        </div>
        <button
          onClick={onBack}
          className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Go Back to Quiz List
        </button>
      </div>
    );
  }

  // --- Render Logic: Loading and Questions ---
  if (isLoading) {
    return (
      <div className="p-10 text-center text-lg">Loading quiz questions...</div>
    );
  }

  // Basic check for no questions
  if (questions.length === 0) {
    return (
      <div className="p-10 text-center text-lg">
        No questions found for this quiz.
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-100 transition mt-4 block mx-auto"
        >
          &larr; Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 px-3 sm:px-10 py-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-3xl font-bold text-indigo-700">
          Quiz Attempt: {questions[3]}
        </h2>
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          disabled={isSubmitting}
        >
          &larr; Back to List
        </button>
      </div>

      <div className="space-y-8">
        {Array.isArray(questions) &&
          questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-xl shadow-md border"
            >
              <p className="text-lg font-semibold text-gray-800 mb-4">
                {index + 1}. {q.questionText}
              </p>
              <div className="space-y-2">
                {q.options &&
                  q.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-indigo-50"
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleAnswerChange(q.id, option)}
                        className="form-radio h-5 w-5 text-indigo-600"
                        disabled={isSubmitting}
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full mt-8 px-6 py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}

// ===========================================
// 2. QUIZ LIST COMPONENT (Accepts data as props)
// ===========================================

function AttemptQuizzes({ quizItems, handleQuizAttempt }) {
  // NOTE: Removed local state/useEffect. Data now comes from QuizApp.
  return (
    <div className="min-h-screen w-full bg-gray-50 px-3 sm:px-6 md:px-10 py-6 sm:py-10 space-y-6">
      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
        Attempt pending quizzes.
      </p>

      <div className="space-y-4 sm:space-y-6">
        {!quizItems || quizItems.length === 0 ? (
          <div className="p-6 sm:p-10 bg-white rounded-xl border border-dashed text-center text-gray-500">
            🎉 No pending quizzes to attempt.
          </div>
        ) : (
          quizItems.map((quiz) => (
            <div
              key={quiz.id} // Ensure you use the correct key property (id or quizId)
              className="w-full bg-white border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400"
            >
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-600 leading-tight">
                  {quiz.quizTitle || quiz.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {quiz.course || "N/A"} ·
                  {/* Status logic should check a consistent boolean/string property */}
                  <span
                    className={`ml-1 font-bold ${
                      quiz.hasAttempted ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {quiz.hasAttempted ? "Attempted" : "Pending"}
                  </span>
                </p>

                {quiz.hasAttempted && (
                  <p className="pt-1 text-green-600 font-bold text-base sm:text-lg">
                    ⭐ Score: {quiz.score || "--"} / {quiz.totalMarks || "--"}
                  </p>
                )}
              </div>

              <button
                disabled={quiz.hasAttempted}
                onClick={() => handleQuizAttempt(quiz.id || quiz.quizId)}
                className={`w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all ${
                  quiz.hasAttempted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800"
                }`}
              >
                {quiz.hasAttempted ? "Completed" : "Start Quiz"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ===========================================
// 3. MAIN CONTAINER (Handles State and Routing)
// ===========================================

export default function QuizApp() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptingQuizId, setAttemptingQuizId] = useState(null);

  // Function to fetch the quiz list using the real API
  const fetchQuizzesList = async () => {
    try {
      setIsLoading(true);
      const response = await listOfQuizes();
      // Adjust this based on your API response structure (e.g., response.data or response.data.quizzes)
      setQuizzes(
        Array.isArray(response.data)
          ? response.data
          : response.data.quizzes || []
      );
      setError(null);
    } catch (err) {
      console.error("Error fetching quiz list:", err);
      setError("Failed to load quizzes. Please check the network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch list on initial load
  useEffect(() => {
    fetchQuizzesList();
  }, []);

  // **CORRECTED HANDLER:** This handler must set the state to trigger the attempt screen.
  const handleQuizAttempt = (quizId) => {
    setAttemptingQuizId(quizId);
    // Do NOT call getQuizQuestion() here. It belongs in QuizAttemptScreen's useEffect.
  };

  // Handler to switch back to the list and refresh data
  const handleBackToList = () => {
    setAttemptingQuizId(null);
    fetchQuizzesList();
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Loading quizzes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-xl font-semibold text-red-600">
        Error: {error}
      </div>
    );
  }

  // Dynamic Rendering: Attempt Screen
  if (attemptingQuizId) {
    return (
      <QuizAttemptScreen quizId={attemptingQuizId} onBack={handleBackToList} />
    );
  }

  // Dynamic Rendering: Quiz List
  return (
    <AttemptQuizzes quizItems={quizzes} handleQuizAttempt={handleQuizAttempt} />
  );
}
