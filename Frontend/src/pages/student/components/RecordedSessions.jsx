import {
  getRecordedSessionList,
  getRecordingDetails,
  downloadRecording,
} from "@/api/student";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiDownload,
  FiEye,
  FiArrowLeft,
  FiVolume2,
  FiVolumeX,
  FiPause,
  FiPlay,
} from "react-icons/fi";

export default function RecordedSession() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Ref for audio playback
  const audioRef = useRef(new Audio());

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );

  // Fetch List of Sessions
  const getRecordedSessionLists = async () => {
    try {
      const response = await getRecordedSessionList();
      // Map backend data to frontend structure
      // Backend returns: { contentId, course: { courseName }, title, duration, ... }
      const mappedSessions = response.data.recordings.map((item) => ({
        id: item.contentId,
        course: item.course ? item.course.courseName : "Unknown Course",
        title: item.title,
        description: item.description,
        duration: item.duration || "0 min",
        createdAt: item.createdAt,
        downloaded: false, // Default state
        slides: [], // Will be fetched on view
        audio: null, // Will be fetched on view
      }));
      setSessions(mappedSessions);
    } catch (error) {
      console.error("Failed to fetch recorded sessions:", error);
    }
  };

  useEffect(() => {
    getRecordedSessionLists();

    // Load persisted downloaded sessions
    const saved = localStorage.getItem("DOWNLOADED_SESSIONS");
    if (saved) {
      const downloadedIds = JSON.parse(saved);
      setSessions((prev) =>
        prev.map((s) =>
          downloadedIds.includes(s.id) ? { ...s, downloaded: true } : s
        )
      );
    }

    // Cleanup audio on unmount
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  // Update localStorage when a session is downloaded
  useEffect(() => {
    const downloadedIds = sessions
      .filter((s) => s.downloaded)
      .map((s) => s.id);
    localStorage.setItem("DOWNLOADED_SESSIONS", JSON.stringify(downloadedIds));
  }, [sessions]);

  // Handle Audio Playback Effect
  useEffect(() => {
    if (activeSession && activeSession.audio?.url) {
      const audio = audioRef.current;

      // Only set src if it's different to avoid reloading
      if (audio.src !== activeSession.audio.url) {
        audio.src = activeSession.audio.url;
        audio.load();
      }

      audio.muted = muted;

      if (playing) {
        audio.play().catch((e) => console.log("Autoplay blocked:", e));
      } else {
        audio.pause();
      }

      // Update progress
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.addEventListener("timeupdate", updateProgress);

      // Slide Synchronization Logic
      const syncSlides = () => {
        if (!activeSession.slideAudioMapping) return;

        const currentTime = audio.currentTime;
        const mapping = activeSession.slideAudioMapping;
        const entries = Object.entries(mapping)
          .map(([idx, time]) => ({ idx: parseInt(idx), time }))
          .sort((a, b) => a.time - b.time);

        let correctSlideIdx = 0;
        for (let i = entries.length - 1; i >= 0; i--) {
          if (currentTime >= entries[i].time) {
            correctSlideIdx = entries[i].idx;
            break;
          }
        }

        if (correctSlideIdx !== currentSlideIndex) {
          setCurrentSlideIndex(correctSlideIdx);
        }
      };

      audio.addEventListener("timeupdate", syncSlides);

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("timeupdate", syncSlides);
      };
    }
  }, [activeSession, playing, muted, currentSlideIndex]);

  const handleDownload = async (sessionId) => {
    try {
      await downloadRecording(sessionId);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, downloaded: true } : s))
      );
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleView = async (sessionId) => {
    setActiveSessionId(sessionId);
    setCurrentSlideIndex(0);
    setPlaying(true);
    setProgress(0);
    setLoadingDetails(true);

    try {
      // Fetch full details (slides, audio)
      const response = await getRecordingDetails(sessionId);
      const { slides, audio } = response.data;

      // Update the specific session with detailed data
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, slides: slides || [], audio: audio } : s
        )
      );
    } catch (error) {
      console.error("Failed to fetch session details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBack = () => {
    setActiveSessionId(null);
    setPlaying(false);
    audioRef.current.pause();
    setProgress(0);
    setCurrentSlideIndex(0);
  };

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

  // Seek handler
  const handleSeek = (e) => {
    const newVal = Number(e.target.value);
    setProgress(newVal);
    if (audioRef.current.duration) {
      audioRef.current.currentTime = (newVal / 100) * audioRef.current.duration;
    }
  };

  // Sync audio when slide is changed manually
  useEffect(() => {
    if (activeSession && activeSession.slideAudioMapping && audioRef.current) {
      const mapping = activeSession.slideAudioMapping;
      const startTime = mapping[currentSlideIndex];

      // Only seek if the difference is significant to avoid stuttering during auto-play
      if (
        startTime !== undefined &&
        Math.abs(audioRef.current.currentTime - startTime) > 0.5
      ) {
        audioRef.current.currentTime = startTime;
      }
    }
  }, [currentSlideIndex]);

  if (activeSession) {
    // Check if slides exist and get the URL. Backend returns objects { url: "..." }
    const currentSlide = activeSession.slides?.[currentSlideIndex];
    // If currentSlide is an object (backend), use .url. If string (dummy), use it directly.
    const slideSrc =
      typeof currentSlide === "object" ? currentSlide?.url : currentSlide;

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
            {loadingDetails ? (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                Loading content...
              </div>
            ) : slideSrc ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={slideSrc}
                  alt={`Slide ${currentSlideIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />

                {/* SLIDE NAVIGATION OVERLAY */}
                <button
                  onClick={() => setCurrentSlideIndex((p) => Math.max(0, p - 1))}
                  disabled={currentSlideIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 disabled:opacity-30"
                >
                  <FiArrowLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlideIndex((p) =>
                      Math.min((activeSession.slides?.length || 1) - 1, p + 1)
                    )
                  }
                  disabled={
                    currentSlideIndex === (activeSession.slides?.length || 1) - 1
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 disabled:opacity-30"
                >
                  <FiPlay className="rotate-0" /> {/* Using FiPlay as a simplified arrow here or another icon if available */}
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                No slide available
              </div>
            )}

            <div className="absolute top-3 left-4 bg-emerald-500 text-[11px] px-3 py-1 rounded-full text-white">
              Slide {currentSlideIndex + 1} / {activeSession.slides?.length || 0}
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
                onChange={handleSeek}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-[11px]">{Math.round(progress)}%</span>
            </div>
          </div>
        </main>

        {/* MOBILE PLAYER */}
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
            {loadingDetails ? (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                Loading...
              </div>
            ) : slideSrc ? (
              <img
                src={slideSrc}
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
                onChange={handleSeek}
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

  // LIST VIEW
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
                  <td className="px-4 py-3 text-slate-700">
                    {session.description}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <p className="text-sm text-gray-600">
                      {convertTimestamp(session.createdAt)}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {!session.downloaded ? (
                      <button
                        onClick={() => handleDownload(session.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-600 text-white transition hover:bg-indigo-700"
                      >
                        <FiDownload className="text-[13px]" />
                        Download
                      </button>
                    ) : (
                      <button
                        onClick={() => handleView(session.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-600 text-white transition hover:bg-emerald-700"
                      >
                        <FiEye className="text-[13px]" />
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No recorded sessions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
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
          {sessions.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No recorded sessions available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}