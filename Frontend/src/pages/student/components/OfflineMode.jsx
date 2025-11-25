import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiSquare, FiVolume2, FiVolumeX } from "react-icons/fi";

const STORAGE_KEY = "edu_missed_sessions";

// 🔹 Multiple dummy sessions
const createDummySessions = () => [
  {
    id: "session_1",
    course: "Python Essentials",
    topic: "Functions & Recursion",
    duration: "42 min",
    progress: 0,
    completed: false,
  },
  {
    id: "session_2",
    course: "React Masterclass",
    topic: "Hooks & State Management",
    duration: "35 min",
    progress: 12,
    completed: false,
  },
  {
    id: "session_3",
    course: "Java OOP",
    topic: "Polymorphism & Inheritance",
    duration: "58 min",
    progress: 75,
    completed: false,
  },
  {
    id: "session_4",
    course: "SQL & DBMS",
    topic: "Joins & Query Optimization",
    duration: "27 min",
    progress: 100,
    completed: true,
  },
  {
    id: "session_5",
    course: "DSA Basics",
    topic: "Arrays & Linked Lists",
    duration: "50 min",
    progress: 0,
    completed: false,
  },
];

export default function OfflineMode() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [tempProgress, setTempProgress] = useState(0);

  // Load from localStorage or use dummy
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
        } else {
          const dummy = createDummySessions();
          setSessions(dummy);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dummy));
        }
      } else {
        const dummy = createDummySessions();
        setSessions(dummy);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummy));
      }
    } catch {
      const dummy = createDummySessions();
      setSessions(dummy);
    }
  }, []);

  // Save whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const incompleteSessions = sessions.filter((s) => !s.completed);
  const completedSessions = sessions.filter((s) => s.completed);

  const handleOpen = (session) => {
    setActiveSessionId(session.id);
    setTempProgress(session.progress || 0);
    setPlaying(true);
  };

  const handleBack = () => {
    setActiveSessionId(null);
    setPlaying(true);
  };

  const handleSave = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? { ...s, progress: tempProgress, completed: tempProgress >= 100 }
          : s
      )
    );
    handleBack();
  };

  const handleComplete = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id ? { ...s, progress: 100, completed: true } : s
      )
    );
    handleBack();
  };

  const handleStop = () => {
    setPlaying(false);
    setTempProgress(0);
  };

  // ================= PLAYER =================
  if (activeSession) {
    return (
      <div className="min-h-screen w-full bg-slate-100 flex flex-col">

        {/* DESKTOP HEADER (UNCHANGED) */}
        <header className="hidden md:flex w-full px-6 py-4 bg-white border-b justify-between items-center">
          <button
            onClick={handleBack}
            className="flex gap-2 text-sm items-center text-slate-700"
          >
            <FiArrowLeft /> Back
          </button>

          <div className="text-center">
            <div className="text-xs uppercase text-slate-500">
              Missed Session
            </div>
            <div className="font-semibold text-slate-800">
              {activeSession.course} — {activeSession.topic}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="bg-red-500 px-3 py-2 rounded text-white flex items-center gap-2 text-sm"
          >
            <FiSquare /> stop
          </button>
        </header>

        {/* DESKTOP PLAYER (SAME VIDEO + NEW CONTROLS AT BOTTOM) */}
        <main className="hidden md:flex flex-col items-center py-6 w-full">
          <div className="w-full max-w-4xl aspect-video rounded-2xl bg-slate-900" />

          {/* Desktop controls block */}
          <div className="w-full max-w-4xl mt-4 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-4">

            {/* Row 1: Mute / Pause */}
            <div className="flex gap-4">
              <button
                onClick={() => setMuted(!muted)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100 transition"
              >
                {muted ? (
                  <FiVolumeX className="text-slate-700" />
                ) : (
                  <FiVolume2 className="text-slate-700" />
                )}
                {muted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={() => setPlaying(!playing)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100 transition"
              >
                {playing ? "Pause" : "Resume"}
              </button>
            </div>

            {/* Row 2: Scroll slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-700 shrink-0">
                Scroll
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={tempProgress}
                onChange={(e) => setTempProgress(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 shrink-0">
                {Math.round(tempProgress)}%
              </span>
            </div>
          </div>
        </main>

        {/* ======== MOBILE VIEW ONLY ======== */}
        <div className="md:hidden flex flex-col flex-1">

          {/* Topic name */}
          <div className="text-center py-3 px-4 font-bold text-lg text-slate-900">
            {activeSession.topic}
          </div>

          {/* Half-screen video (no margin) */}
          <div className="relative w-full h-[50vh] bg-[#0B132B] flex justify-center items-center text-white">
            <div className="absolute top-2 left-2 bg-emerald-500 text-[10px] px-2 py-1 rounded-full">
              Downloaded
            </div>

            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-[10px] rounded-full">
              {activeSession.duration}
            </div>

            <div className="text-sm opacity-90 text-center px-4">
              {activeSession.course} — {activeSession.topic}
              <div className="mt-2 text-[11px] text-slate-200/80">
                Offline playback (demo)
              </div>
            </div>
          </div>

          {/* Controls below video */}
          <div className="px-4 py-4 flex flex-col gap-4 bg-slate-100">

            {/* Row 1: Mute - Pause */}
            <div className="flex gap-3">
              <button
                onClick={() => setMuted(!muted)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium shadow-sm active:scale-[0.98] transition"
              >
                {muted ? (
                  <FiVolumeX className="text-slate-700" />
                ) : (
                  <FiVolume2 className="text-slate-700" />
                )}
                {muted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={() => setPlaying(!playing)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium shadow-sm active:scale-[0.98] transition"
              >
                {playing ? "Pause" : "Resume"}
              </button>
            </div>

            {/* Row 2: Scroll (progress slider) – fixed % layout */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700 shrink-0">
                Scroll
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={tempProgress}
                onChange={(e) => setTempProgress(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 shrink-0">
                {Math.round(tempProgress)}%
              </span>
            </div>

            {/* Row 3: Stop - Back */}
            <div className="flex gap-3">
           
              <button
                onClick={handleBack}
                className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium text-slate-800 shadow-sm active:scale-[0.98] transition"
              >
                Back
              </button>
            </div>

           
            
          </div>
        </div>
      </div>
    );
  }

  // ================= LIST (ALL MISSED SESSIONS) =================
  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Offline Mode</h1>
        <p className="mt-2 text-sm text-slate-600">
          View and continue your downloaded missed classes anytime.
        </p>

        {sessions.length === 0 ? (
          <div className="mt-10 text-sm text-slate-500">
            No offline sessions available.
          </div>
        ) : (
          <>
            {/* Incomplete sessions */}
            {incompleteSessions.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">
                  Incomplete sessions
                </h2>
                <div className="flex flex-col gap-3">
                  {incompleteSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                            Missed Session
                          </div>
                          <div className="mt-1 font-semibold text-slate-900">
                            {session.course}
                          </div>
                          <div className="text-sm text-slate-600">
                            {session.topic}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 text-right">
                          Duration: {session.duration}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span>
                          <span>{session.progress || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{ width: `${session.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <button
                        className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 rounded-xl transition active:scale-[0.98]"
                        onClick={() => handleOpen(session)}
                      >
                        Open Missed Class
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed sessions */}
            {completedSessions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">
                  Completed sessions
                </h2>
                <div className="flex flex-col gap-3">
                  {completedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                            Completed
                          </div>
                          <div className="mt-1 font-semibold text-slate-900">
                            {session.course}
                          </div>
                          <div className="text-sm text-slate-600">
                            {session.topic}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 text-right">
                          {session.duration}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-slate-500">
                          100% watched
                        </span>
                        <button
                          onClick={() => handleOpen(session)}
                          className="text-xs font-medium text-indigo-600 underline"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
