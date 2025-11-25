// import React, { useEffect, useState } from "react";

// // Inline SVG Icons (Replaced react-icons/fi)
// const IconArrowLeft = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
// );
// const IconVolume2 = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
// );
// const IconVolumeX = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
// );
// const IconPlay = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
// );
// const IconPause = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
// );
// const IconDownload = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
// );
// const IconMonitor = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
// );
// // Removed IconCheckCircle as "Mark as Complete" functionality is removed.

// // Storage key for persistence
// const STORAGE_KEY = "edu_recorded_sessions";

// const dummySession = {
//   id: "rec_1",
//   course: "Data Structures 101",
//   topic: "Linked Lists Deep Dive",
//   time: "65 min",
//   progress: 0,
//   isDownloaded: false,
// };

// const createDummySessions = () => [
//   { ...dummySession, id: "rec_1", progress: 40, isDownloaded: true },
//   { ...dummySession, id: "rec_2", topic: "Stack & Queue Algorithms", progress: 0, isDownloaded: false },
//   { ...dummySession, id: "rec_3", topic: "Graph Traversal (BFS/DFS)", progress: 100, isDownloaded: true },
// ];

// export default function RecordedSessions() {
//   const [sessions, setSessions] = useState([]);
//   const [activeSessionId, setActiveSessionId] = useState(null);
//   const [muted, setMuted] = useState(false);
//   const [playing, setPlaying] = useState(false); // Start paused
//   const [tempProgress, setTempProgress] = useState(0);

//   // --- Persistence Hooks ---
//   useEffect(() => {
//     // Note: LocalStorage is used here as a placeholder for Firebase Firestore for simplicity in this context.
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) {
//         const data = JSON.parse(raw);
//         if (Array.isArray(data) && data.length) {
//           setSessions(data);
//         } else {
//           setSessions(createDummySessions());
//         }
//       } else {
//         setSessions(createDummySessions());
//       }
//     } catch {
//       setSessions(createDummySessions());
//     }
//   }, []);

//   useEffect(() => {
//     // Save to localStorage whenever sessions change
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
//   }, [sessions]);
//   // -------------------------

//   const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

//   const handleDownload = (sessionId) => {
//     setSessions((prev) =>
//       prev.map((s) =>
//         s.id === sessionId ? { ...s, isDownloaded: true } : s
//       )
//     );
//   };

//   const handleOpen = (session) => {
//     setActiveSessionId(session.id);
//     setTempProgress(session.progress || 0);
//     setMuted(false);
//     setPlaying(false); // Player starts paused
//   };

//   const handleBack = () => {
//     // Save current progress before navigating back to the list
//     if (activeSession) {
//       setSessions((prev) =>
//         prev.map((s) =>
//           s.id === activeSession.id
//             ? {
//                 ...s,
//                 progress: tempProgress,
//               }
//             : s
//         )
//       );
//     }
//     setActiveSessionId(null);
//   };

//   // Removed handleMarkComplete function

//   // PLAYER VIEW
//   if (activeSession) {

//     return (
//       <div className="min-h-screen w-full bg-slate-100 flex flex-col">
//         {/* HEADER */}
//         <header className="w-full px-4 py-3 flex items-center justify-between bg-white shadow-md border-b gap-2 z-10">
//           <button
//             onClick={handleBack}
//             className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap"
//           >
//             <IconArrowLeft size={18} />
//             Back
//           </button>

//           <div className="flex flex-col items-center text-center max-w-[60%]">
//             <div className="text-xs text-slate-500 uppercase tracking-wide hidden sm:block">
//               Recorded Session
//             </div>
//             <div className="text-sm sm:text-lg font-bold text-slate-800 truncate">
//               {activeSession.course}
//             </div>
//             <div className="text-xs text-slate-600 truncate">
//               {activeSession.topic}
//             </div>
//           </div>

//           <button
//             onClick={handleBack} // Uses back to save progress implicitly
//             className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 whitespace-nowrap"
//           >
//             Save & Exit
//           </button>
//         </header>

//         {/* CONTENT AREA - Responsive layout */}
//         <main className="flex-1 flex flex-col items-center p-4 gap-5 overflow-y-auto">

//           {/* Mobile Text Reminder - "recoreded vedio" */}
//           <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider lg:hidden">
//             Recorded Video / Slides
//           </div>

//           {/* PLAYER CONTAINER */}
//           <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-5">

//             {/* VIDEO/SLIDE PREVIEW - Responsive vertical space for mobile */}
//             <div className="w-full lg:w-3/4 aspect-video lg:aspect-auto bg-slate-900 rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden flex-shrink-0
//                         h-auto lg:h-[70vh] min-h-[40vh] md:min-h-[50vh] lg:min-h-0">
              
//               {/* Status Tags */}
//               <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-semibold bg-indigo-500 text-white z-10">
//                 Playing Offline
//               </div>
//               <div className="absolute top-3 right-3 text-xs text-slate-200 bg-slate-800/70 px-2 py-1 rounded-full z-10">
//                 {activeSession.time}
//               </div>

//               {/* Central Content */}
//               <div className="text-center px-4">
//                 <IconMonitor size={48} className="text-indigo-400 mx-auto mb-3" />
//                 <div className="text-white text-base sm:text-2xl font-bold mb-1">
//                   {activeSession.topic}
//                 </div>
//                 <div className="text-slate-200 text-sm">
//                   Slide Show Content Here
//                 </div>
//               </div>

//               {/* Pause Overlay */}
//               {!playing && (
//                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer" onClick={() => setPlaying(true)}>
//                   <button className="p-4 rounded-full bg-white/90 shadow-lg text-indigo-600 hover:bg-white transition">
//                     <IconPlay size={30} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* PLAYBACK CONTROLS & PROGRESS - Takes full width on mobile, and right column on desktop */}
//             <div className="w-full lg:w-1/4 flex flex-col gap-5 p-4 bg-white rounded-xl shadow-lg border border-slate-200">
                
//                 {/* Audio and Play/Pause */}
//                 <div className="flex flex-col gap-3">
//                     <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Controls</h3>
//                     <div className="flex items-center justify-between">
//                         {/* Audio (Mute/Unmute) */}
//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={() => setMuted((m) => !m)}
//                                 className="p-2 rounded-full bg-slate-50 border border-slate-200 shadow-sm hover:bg-slate-100 text-slate-700"
//                             >
//                                 {muted ? <IconVolumeX size={20} /> : <IconVolume2 size={20} />}
//                             </button>
//                             <div className="text-sm text-slate-600">
//                                 {muted ? "Muted" : "Unmuted (Speech)"}
//                             </div>
//                         </div>

//                         {/* Play/Pause */}
//                         <button
//                             onClick={() => setPlaying((p) => !p)}
//                             className="text-sm px-4 py-2 rounded-full border border-slate-200 bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition whitespace-nowrap shadow-sm"
//                         >
//                             {playing ? <IconPause size={16} className="inline mr-1" /> : <IconPlay size={16} className="inline mr-1" />}
//                             {playing ? "Pause" : "Play"}
//                         </button>
//                     </div>
//                 </div>


//                 {/* Progress Slider (Pause/Scroll) */}
//                 <div className="flex flex-col gap-3 pt-4 border-t">
//                     <div className="flex items-center justify-between text-sm text-slate-600">
//                         <span className="font-semibold">Current Progress (Scroll)</span>
//                         <span className="font-bold text-indigo-600">
//                             {Math.round(tempProgress)}%
//                         </span>
//                     </div>

//                     <input
//                         type="range"
//                         min={0}
//                         max={100}
//                         value={tempProgress}
//                         onChange={(e) => setTempProgress(Number(e.target.value))}
//                         className="w-full accent-indigo-600"
//                     />
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col gap-2 pt-4 border-t">
//                     <button
//                         onClick={handleBack}
//                         className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-md"
//                     >
//                         Back to List (Save Progress)
//                     </button>
//                 </div>
//             </div> {/* End Controls & Progress */}

//           </div> {/* End Player Container */}

//         </main>
//       </div>
//     );
//   }

//   // LIST VIEW
//   return (
//     <div className="min-h-full w-full bg-gray-50 px-4 md:px-0 py-2">
//       <header className="mb-6">
//         <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
//           Recorded Sessions
//         </h1>
//         <p className="text-slate-600 text-sm sm:text-base mt-1">
//           Access and review video and slide recordings of past classes.
//         </p>
//       </header>

//       <section className="space-y-4">
//         {sessions.map((session) => (
//           <div
//             key={session.id}
//             className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between transition-all hover:shadow-lg"
//           >
//             <div className="space-y-1 w-full md:w-3/5">
//               <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
//                 {session.course}
//               </div>
//               <div className="text-lg font-bold text-slate-900">
//                 {session.topic}
//               </div>
//               <div className="text-sm text-slate-700">
//                 <span className="font-medium text-slate-500">Duration:</span> {session.time}
//               </div>

//               {/* Progress bar */}
//               <div className="mt-2 pt-1">
//                 <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
//                   <span>Progress</span>
//                   <span className={`font-semibold ${session.progress === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
//                     {session.progress}% {session.progress === 100 && '(Completed)'}
//                   </span>
//                 </div>
//                 <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
//                   <div
//                     className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
//                     style={{ width: `${session.progress}%` }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex-shrink-0 flex gap-2 w-full md:w-auto">
//               {session.isDownloaded ? (
//                 <button
//                   onClick={() => handleOpen(session)}
//                   className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md transition"
//                 >
//                   <IconMonitor size={18} /> View
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleDownload(session.id)}
//                   className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-indigo-600 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
//                 >
//                   <IconDownload size={18} /> Download
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}

//         {sessions.length === 0 && (
//           <div className="text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-6">
//             No recorded sessions are available right now.
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }



import React, { useState, useMemo } from "react";
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
      prev.map((s) =>
        s.id === sessionId ? { ...s, downloaded: true } : s
      )
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

  if (activeSession) {
    const currentSlide =
      activeSession.slides[currentSlideIndex] || null;

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
              <span className="text-[11px]">
                {Math.round(progress)}%
              </span>
            </div>

          </div>
        </main>

        {/* MOBILE */}
        <div className="md:hidden flex flex-col flex-1">

          <div className="px-4 pt-4 pb-2">
            <div className="text-xs uppercase text-slate-500">Recorded Video</div>
            <div className="font-semibold text-base text-slate-900">{activeSession.course}</div>
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
              <span className="text-xs font-medium text-slate-700 shrink-0">Scroll</span>
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
          Access your recorded classes, download them, and watch the Static PPT Dashboard with audio controls.
        </p>

        <div className="hidden md:block mt-6 rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Course</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Time</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b last:border-b-0">

                  <td className="px-4 py-3 text-slate-800">{session.course}</td>
                  <td className="px-4 py-3 text-slate-700">{session.title}</td>
                  <td className="px-4 py-3 text-slate-500">{session.duration}</td>

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

              <div className="font-semibold text-slate-900">{session.course}</div>

              <div className="text-sm text-slate-700">{session.title}</div>

              <div className="text-xs text-slate-500 mt-1">Time: {session.duration}</div>

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
