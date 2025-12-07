import React, { useState, useEffect } from "react";
import {
  createQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  getQuizResponses
} from "@/api/teacher";
import { FiPlus, FiTrash2, FiEye, FiEdit, FiUsers, FiX } from "react-icons/fi";

export default function QuizManager() {
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);

  // --- FORM STATE ---
  const initialQuizData = {
    quizTitle: "",
    courseId: "",
    timeLimit: "",
    questions: [
      {
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
      },
    ],
  };

  const [quizData, setQuizData] = useState(initialQuizData);
  const [editingId, setEditingId] = useState(null);

  // --- DATA STATE ---
  const [quizzes, setQuizzes] = useState([]);
  const [viewQuiz, setViewQuiz] = useState(null); // For viewing quiz details
  const [viewResponses, setViewResponses] = useState(null); // For viewing student responses

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const { data } = await getAllQuizzes();
      // Backend returns { quizzes: [...] }
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Failed to load quizzes", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e, qIndex = null, optIndex = null) => {
    const { name, value } = e.target;

    setQuizData((prev) => {
      // 1. Quiz Level Fields
      if (qIndex === null) {
        return { ...prev, [name]: value };
      }

      // 2. Question Level Fields
      const updatedQuestions = [...prev.questions];
      const question = { ...updatedQuestions[qIndex] };

      if (name === "questionText") {
        question.questionText = value;
      } else if (name === "option") {
        const updatedOptions = [...question.options];
        updatedOptions[optIndex] = value;
        question.options = updatedOptions;
      } else if (name === "correctOption") {
        question.correctOption = Number(value);
      }

      updatedQuestions[qIndex] = question;
      return { ...prev, questions: updatedQuestions };
    });
  };

  // --- QUESTION LOGIC ---
  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctOption: 0,
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const addOption = (qIndex) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIndex].options.push("");
      return { ...prev, questions: updatedQuestions };
    });
  };

  // --- API ACTIONS ---

  const handlePublish = async () => {
    // Validation
    if (!quizData.quizTitle.trim()) return alert("Quiz title is required");
    if (quizData.questions.length === 0)
      return alert("Add at least one question");

    try {
      setLoading(true);

      // Formatting payload to match API requirement types
      const payload = {
        ...quizData,
        timeLimit: Number(quizData.timeLimit) || 30, // Ensure number
      };

      if (editingId) {
        // UPDATE
        await updateQuiz(editingId, payload);
        alert("Quiz updated successfully!");
      } else {
        // CREATE
        await createQuiz(payload);
        alert("Quiz created successfully!");
      }

      // Reset & Refresh
      setQuizData(initialQuizData);
      setEditingId(null);
      setActiveTab("published");
      fetchQuizzes();
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.quizId !== id)); // Using quizId from backend
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete quiz");
    }
  };

  const handleEdit = (quiz) => {
    // Populate form with existing data
    setQuizData({
      quizTitle: quiz.quizTitle,
      courseId: quiz.courseId || "",
      timeLimit: quiz.timeLimit,
      questions: quiz.questions || [],
    });
    setEditingId(quiz.quizId); // Backend uses quizId
    setActiveTab("create");
  };

  const handleViewResponses = async (quiz) => {
    try {
      const { data } = await getQuizResponses(quiz.quizId);
      setViewResponses({
        title: quiz.quizTitle,
        list: data.responses || [], // Backend returns { responses: [...] }
      });
    } catch (error) {
      console.error("Failed to fetch responses", error);
      alert("Could not fetch responses");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen bg-gray-50">
      {/* --- HEADER TABS --- */}
      <div className="flex gap-2 bg-white shadow-sm border border-gray-200 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => {
            setActiveTab("create");
            setEditingId(null);
            setQuizData(initialQuizData);
          }}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "create"
              ? "bg-black text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {editingId ? "Edit Mode" : "Create Quiz"}
        </button>

        <button
          onClick={() => setActiveTab("published")}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "published"
              ? "bg-black text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Published Quizzes
        </button>
      </div>

      {/* ================= CREATE / EDIT TAB ================= */}
      {activeTab === "create" && (
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Quiz Title
              </label>
              <input
                placeholder="Ex: Calculus Mid-Term"
                name="quizTitle"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                value={quizData.quizTitle}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Course ID
                </label>
                <input
                  placeholder="Optional"
                  name="courseId"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                  value={quizData.courseId}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Time (mins)
                </label>
                <input
                  placeholder="30"
                  type="number"
                  name="timeLimit"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                  value={quizData.timeLimit}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* QUESTIONS LIST */}
          <div className="space-y-4">
            {quizData.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl relative group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-black text-white text-xs px-2 py-1 rounded font-bold">
                    Q{qIndex + 1}
                  </span>
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <input
                  placeholder="Type your question here..."
                  name="questionText"
                  className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:border-black outline-none bg-white"
                  value={q.questionText}
                  onChange={(e) => handleChange(e, qIndex)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((op, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border cursor-pointer transition ${
                          q.correctOption === i
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                        onClick={() => {
                          const e = {
                            target: { name: "correctOption", value: i },
                          };
                          handleChange(e, qIndex);
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <input
                        placeholder={`Option ${i + 1}`}
                        name="option"
                        className={`w-full border rounded-md p-2 text-sm outline-none focus:border-gray-400 ${
                          q.correctOption === i
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300 bg-white"
                        }`}
                        value={op}
                        onChange={(e) => handleChange(e, qIndex, i)}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-black hover:text-black transition font-medium"
          >
            + Add New Question
          </button>

          <div className="sticky bottom-4">
            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-black text-white shadow-xl rounded-xl p-4 text-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Quiz"
                : "Publish Quiz"}
            </button>
          </div>
        </div>
      )}

      {/* ================= PUBLISHED TAB ================= */}
      {activeTab === "published" && (
        <div className="space-y-4">
          {loading && (
            <p className="text-center text-gray-500">Loading quizzes...</p>
          )}

          {!loading && quizzes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">No quizzes found.</p>
              <button
                onClick={() => setActiveTab("create")}
                className="text-blue-600 font-medium mt-2"
              >
                Create one now
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {quizzes.map((q) => (
              <div
                key={q.quizId} // using quizId from backend
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {q.quizTitle}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span>⏳ {q.timeLimit} mins</span>
                    <span>
                      ❓ {q.questions ? q.questions.length : 0} Questions
                    </span>
                    {q.course && (
                      <span className="bg-gray-100 px-2 rounded text-xs py-0.5 self-center">
                        {q.course.courseCode}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewResponses(q)}
                    className="p-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                    title="View Responses"
                  >
                    <FiUsers size={20} />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button
                    onClick={() => setViewQuiz(q)}
                    className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                    title="Preview"
                  >
                    <FiEye size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-2 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition"
                    title="Edit"
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(q.quizId)}
                    className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                    title="Delete"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= PREVIEW MODAL ================= */}
      {viewQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-xl">{viewQuiz.quizTitle}</h3>
              <button
                onClick={() => setViewQuiz(null)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {viewQuiz.questions.map((q, i) => (
                <div key={i} className="space-y-3">
                  <p className="font-medium text-lg">
                    {i + 1}. {q.questionText}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((op, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-sm ${
                          idx === q.correctOption
                            ? "bg-green-100 border-green-500 text-green-800 font-medium"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}. {op}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= RESPONSES MODAL ================= */}
      {viewResponses && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-xl">Student Results</h3>
                <p className="text-xs text-gray-500">
                  for {viewResponses.title}
                </p>
              </div>
              <button
                onClick={() => setViewResponses(null)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <FiX />
              </button>
            </div>

            <div className="p-0 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase sticky top-0">
                  <tr>
                    <th className="p-4 border-b">Student</th>
                    <th className="p-4 border-b">Score</th>
                    <th className="p-4 border-b">Percentage</th>
                    <th className="p-4 border-b">Submitted</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {viewResponses.list.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">
                        No responses yet.
                      </td>
                    </tr>
                  ) : (
                    viewResponses.list.map((resp, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">
                          {resp.studentName || "Unknown"}
                        </td>
                        <td className="p-4">
                          {resp.score} / {resp.totalQuestions}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              Number(resp.percentage) >= 70
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {resp.percentage}%
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">
                          {resp.submittedAt
                            ? new Date(
                                resp.submittedAt._seconds * 1000
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
