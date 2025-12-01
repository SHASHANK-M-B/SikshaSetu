// components/QuizManager.jsx
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEye, FiEdit } from "react-icons/fi";

// --- localStorage helpers ---
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, f) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : f;
  } catch {
    return f;
  }
};

const uid = () => Math.random().toString(36).slice(2, 9);

export default function QuizManager() {
  // which tab is open
  const [activeTab, setActiveTab] = useState("create");

  // form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);

  // saved quizzes
  const [quizzes, setQuizzes] = useState(() => load("edu_quizzes", []));
  useEffect(() => save("edu_quizzes", quizzes), [quizzes]);

  // for view modal
  const [viewQuiz, setViewQuiz] = useState(null);

  // add question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: uid(), q: "", options: ["", ""], correctIndex: 0 },
    ]);
  };

  // update a question
  const updateQuestion = (id, patch) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  };

  // remove question
  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // publish / update quiz
  const publish = (e) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) {
      alert("Please enter a title and at least one question.");
      return;
    }

    if (editingId) {
      // update existing quiz
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === editingId ? { ...q, title, timeLimit, questions } : q
        )
      );
      alert("Quiz updated.");
    } else {
      // new quiz
      const quiz = {
        id: uid(),
        title,
        timeLimit,
        questions,
        createdAt: new Date().toISOString(),
      };
      setQuizzes((prev) => [quiz, ...prev]);
      alert("Quiz created.");
    }

    // reset form
    setTitle("");
    setTimeLimit("");
    setQuestions([]);
    setEditingId(null);
    setActiveTab("published");
  };

  // load quiz into form for editing
  const startEdit = (quiz) => {
    setTitle(quiz.title);
    setTimeLimit(quiz.timeLimit);
    setQuestions(quiz.questions);
    setEditingId(quiz.id);
    setActiveTab("create");
  };
  return (
    <div className="w-full max-w-3xl mx-auto p-4">

      {/* TAB SWITCH */}
      <div className="flex gap-2 bg-slate-100 rounded-full p-1 w-fit mb-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 text-xs rounded-full ${activeTab === "create" ? "bg-black text-white" : "text-black"
            }`}
        >
          {editingId ? "Edit Quiz" : "Create Quiz"}
        </button>

        <button
          onClick={() => setActiveTab("published")}
          className={`px-4 py-2 text-xs rounded-full ${activeTab === "published" ? "bg-black text-white" : "text-black"
            }`}
        >
          Published
        </button>
      </div>

      {/* === CREATE TAB === */}
      {activeTab === "create" && (
        <div className="w-full bg-white border border-slate-300 p-4 rounded-lg space-y-3">

          <input
            placeholder="Quiz Title"
            className="w-full border border-slate-300 rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Time limit (ex: 30 mins)"
            className="w-full border border-slate-300 rounded p-2"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
          {/* Question blocks */}
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="border border-slate-300 p-3 rounded-md bg-white space-y-2"
            >
              <input
                placeholder={`Question ${idx + 1}`}
                className="w-full border border-slate-300 rounded p-2"
                value={q.q}
                onChange={(e) => updateQuestion(q.id, { q: e.target.value })}
              />

              {q.options.map((op, i) => (
                <input
                  key={i}
                  placeholder={`Option ${i + 1}`}
                  className="w-full border border-slate-300 rounded p-2"
                  value={op}
                  onChange={(e) =>
                    updateQuestion(q.id, {
                      options: q.options.map((o, j) =>
                        j === i ? e.target.value : o
                      ),
                    })
                  }
                />
              ))}

              <div className="flex items-center gap-2 text-xs">
                Correct:
                <select
                  value={q.correctIndex}
                  onChange={(e) =>
                    updateQuestion(q.id, {
                      correctIndex: Number(e.target.value),
                    })
                  }
                  className="border border-slate-300 rounded p-1"
                >
                  {q.options.map((_, i) => (
                    <option key={i} value={i}>
                      Option {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(q.id, { options: [...q.options, ""] })
                  }
                  className="px-3 py-1 bg-slate-200 rounded text-xs"
                >
                  + Add Option
                </button>

                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                >
                  Remove Question
                </button>

              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-black text-white rounded p-2 text-sm"
          >
            + Add Question
          </button>

          <button
            onClick={publish}
            className="w-full bg-green-600 text-white rounded p-2 text-sm font-semibold"
          >
            {editingId ? "Update Quiz" : "Publish Quiz"}
          </button>

        </div>
      )}
      {/* === PUBLISHED TAB === */}
      {activeTab === "published" && (
        <div className="w-full bg-white border border-slate-300 p-4 rounded-lg space-y-2">

          {quizzes.length === 0 && (
            <div className="text-center text-slate-600 py-6 text-sm">
              No quizzes published yet
            </div>
          )}

          {quizzes.map((q) => (
            <div
              key={q.id}
              className="border border-slate-300 rounded p-3 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="text-sm font-medium">{q.title}</div>

              <div className="flex gap-2">

                {/* VIEW */}
                <button
                  onClick={() => setViewQuiz(q)}
                  className="w-9 h-9 rounded-full border border-blue-500 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                >
                  <FiEye size={19} />
                </button>

                {/* EDIT */}
                <button
                  onClick={() => startEdit(q)}
                  className="w-9 h-9 rounded-full border border-yellow-500 text-yellow-600 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition"
                >
                  <FiEdit size={19} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    setQuizzes((prev) => prev.filter((item) => item.id !== q.id))
                  }
                  className="w-9 h-9 rounded-full border border-red-600 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                >
                  <FiTrash2 size={19} />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
      {/* VIEW MODAL */}
      {viewQuiz && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-3">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">

            <div className="text-lg font-semibold">
              {viewQuiz.title}
            </div>

            <div className="text-xs text-slate-600">
              {viewQuiz.timeLimit || "No time limit"}
            </div>

            {viewQuiz.questions.map((q, i) => (
              <div
                key={q.id}
                className="border border-slate-300 rounded p-3 bg-white space-y-1"
              >
                <div className="font-medium">
                  {i + 1}. {q.q}
                </div>

                {q.options.map((op, idx) => (
                  <div
                    key={idx}
                    className={`text-sm px-2 py-1 border ${idx === q.correctIndex
                        ? "bg-green-200 border-green-400"
                        : "bg-white border-slate-200"
                      }`}
                  >
                    {op}
                  </div>
                ))}
              </div>
            ))}

            <button
              className="w-full bg-black text-white rounded p-2"
              onClick={() => setViewQuiz(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
