import { getRecordedSessionList } from "@/api/student";
import React, { useState, useMemo, useEffect } from "react";
import {
  FiDownload,
  FiEye,
  FiArrowLeft,
  FiVolume2,
  FiVolumeX,
  FiPause,
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const initialSessions = [
  {
    id: "rec_1",
    course: "Python Essentials",
    title: "Functions & Recursion - Recorded",
    duration: "42 min",
    downloaded: false,
    slides: [
      "https://via.placeholder.com/960x540?text=Python+Slide+1",
      "https://via.placeholder.com/960x540?text=Python+Slide+2",
      "https://via.placeholder.com/960x540?text=Python+Slide+3",
    ],
  },
  {
    id: "rec_2",
    course: "React Masterclass",
    title: "Hooks & State Management - Recorded",
    duration: "35 min",
    downloaded: false,
    slides: [
      "https://via.placeholder.com/960x540?text=React+Slide+1",
      "https://via.placeholder.com/960x540?text=React+Slide+2",
    ],
  },
  {
    id: "rec_3",
    course: "DBMS & SQL",
    title: "Joins & Query Optimization - Recorded",
    duration: "27 min",
    downloaded: true,
    slides: [
      "https://via.placeholder.com/960x540?text=SQL+Slide+1",
      "https://via.placeholder.com/960x540?text=SQL+Slide+2",
      "https://via.placeholder.com/960x540?text=SQL+Slide+3",
      "https://via.placeholder.com/960x540?text=SQL+Slide+4",
    ],
  },
];

export default function RecordedSession() {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );

  const handleDownload = (sessionId) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, downloaded: true } : s))
    );
  };

  const handleView = (sessionId) => {
    setActiveSessionId(sessionId);
    setCurrentSlideIndex(0);
    setPlaying(true);
    setProgress(0);
  };

  const handleBack = () => {
    setActiveSessionId(null);
    setPlaying(true);
    setProgress(0);
    setCurrentSlideIndex(0);
  };

  const handleStop = () => {};
  const getRecordedSessionLists = async () => {
    try {
      const response = await getRecordedSessionList();
      setSessions(response.data.recordings);
    } catch (error) {}
  };

  useEffect(() => {
    getRecordedSessionLists();
  }, []);

  const convertTimestamp = (timestamp) => {
  if (!timestamp?._seconds) return "";

  const date = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6
  );

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};


  if (activeSession) {
    const currentSlide = activeSession.slides[currentSlideIndex] || null;

    return (
      <div className="min-h-screen w-full bg-slate-100 flex flex-col">
        {/* DESKTOP HEADER */}
        <header className="hidden md:flex w-full px-6 py-4 bg-white border-b justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-slate-700"
          >
            <FiArrowLeft /> Back
          </button>

          <div className="text-center">
            <div className="text-xs uppercase text-slate-500">
              Recorded Session
            </div>
            <div className="font-semibold text-slate-800">
              {activeSession.course} — {activeSession.title}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Duration: {activeSession.duration}
          </div>
        </header>

        {/* DESKTOP PLAYER */}
        <main className="hidden md:flex flex-col items-center py-6 w-full">
          <div className="w-full max-w-5xl aspect-video rounded-2xl bg-slate-900 overflow-hidden relative">
            {currentSlide ? (
              <img
                src={currentSlide}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                No slide available
              </div>
            )}

            <div className="absolute top-3 left-4 bg-emerald-500 text-[11px] px-3 py-1 rounded-full">
              Static PPT Dashboard
            </div>
          </div>

          {/* Controls */}
          <div className="w-full max-w-5xl mt-4 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMuted(!muted)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-sm font-medium"
              >
                {muted ? <FiVolumeX /> : <FiVolume2 />}
                {muted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={() => setPlaying(!playing)}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-sm font-medium"
              >
                {playing ? <FiPause /> : <FiPlay />}
                {playing ? "Pause" : "Resume"}
              </button>

              <button
                onClick={handleBack}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-sm font-medium"
              >
                <FiArrowLeft /> Back
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium">Scroll</span>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-[11px]">{Math.round(progress)}%</span>
            </div>
          </div>
        </main>

        {/* MOBILE */}
        <div className="md:hidden flex flex-col flex-1">
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs uppercase text-slate-500">
              Recorded Video
            </div>
            <div className="font-semibold text-base text-slate-900">
              {activeSession.course}
            </div>
            <div className="text-sm text-slate-600">{activeSession.title}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Duration: {activeSession.duration}
            </div>
          </div>

          <div className="relative w-full h-[50vh] bg-slate-900 overflow-hidden">
            {currentSlide ? (
              <img
                src={currentSlide}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                No slide available
              </div>
            )}

            <div className="absolute top-2 left-2 bg-emerald-500 text-[10px] px-2 py-1 rounded-full">
              Static PPT Dashboard
            </div>
          </div>

          <div className="px-4 py-4 flex flex-col gap-4 bg-slate-100">
            <div className="flex gap-3">
              <button
                onClick={() => setMuted(!muted)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium"
              >
                {muted ? <FiVolumeX /> : <FiVolume2 />}
                {muted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={() => setPlaying(!playing)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium"
              >
                {playing ? <FiPause /> : <FiPlay />}
                {playing ? "Pause" : "Resume"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700 shrink-0">
                Scroll
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 shrink-0">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium"
              >
                <FiArrowLeft /> Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">Recorded Session</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access your recorded classes, download them, and watch the Static PPT
          Dashboard with audio controls.
        </p>

        <div className="hidden md:block mt-6 rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Description
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Time
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-slate-800">{session.title}</td>
                  <td className="px-4 py-3 text-slate-700">{session.description}</td>
                  <td className="px-4 py-3 text-slate-500">
                   <p className="text-sm text-gray-600">
  {convertTimestamp(session.createdAt)}
</p>

                  </td>

                  <td className="px-4 py-3 text-right">
                    {!session.downloaded ? (
                      <button
                        onClick={() => handleDownload(session.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-600 text-white"
                      >
                        <FiDownload className="text-[13px]" />
                        Download
                      </button>
                    ) : (
                      <button
                        onClick={() => handleView(session.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-600 text-white"
                      >
                        <FiEye className="text-[13px]" />
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden mt-6 flex flex-col gap-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-col gap-2"
            >
              <div className="text-xs uppercase text-emerald-600 font-semibold">
                Recorded Session
              </div>

              <div className="font-semibold text-slate-900">
                {session.course}
              </div>

              <div className="text-sm text-slate-700">{session.title}</div>

              <div className="text-xs text-slate-500 mt-1">
                Time: {session.duration}
              </div>

              <div className="mt-3 flex justify-end">
                {!session.downloaded ? (
                  <button
                    onClick={() => handleDownload(session.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-600 text-white"
                  >
                    <FiDownload className="text-[13px]" />
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => handleView(session.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-600 text-white"
                  >
                    <FiEye className="text-[13px]" />
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
