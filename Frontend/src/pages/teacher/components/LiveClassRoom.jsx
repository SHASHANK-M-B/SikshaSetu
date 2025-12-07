import { useEffect, useState, useRef } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMic,
  FiStopCircle,
  FiUpload,
  FiPlay,
  FiFileText,
  FiCheckCircle,
  FiPaperclip,
  FiThumbsUp,
} from "react-icons/fi";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker&url";
import { time } from "framer-motion";
import { scheduleLiveClass } from "@/api/teacher";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// --- Helper Functions ---
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, f) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : f;
  } catch {
    return f;
  }
};
const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

function parseTextSlides(text) {
  // Simple text-based slide parser: split on \n\n or --- lines
  const parts = text
    .split(/\n\s*\n|\r\n\s*\r\n|^---$/m)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return null;
  return parts.map((p, i) => ({
    id: uid("s"),
    title: p.split("\n")[0].slice(0, 60) || `Slide ${i + 1}`,
    text: p,
  }));
}

// Convert a PDF File -> slides with imageUrl
async function pdfFileToSlides(file) {
  const url = URL.createObjectURL(file);
  const pdf = await pdfjsLib.getDocument(url).promise;

  const slides = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const imageUrl = canvas.toDataURL("image/png");
    slides.push({
      id: uid("s"),
      imageUrl,
      title: `Slide ${pageNum}`,
      text: "",
    });
  }

  URL.revokeObjectURL(url);
  return slides;
}

// --- Course Data for Selection ---
const availableCourses = [
  "Select a Course",
  "CS101: Introduction to Programming",
  "MATH205: Calculus II",
  "LIT300: Shakespearean Tragedy",
  "SCI150: General Physics",
];
// ---------------------------------

export default function LiveClassRoom() {
  // --- SCHEDULE CLASS ---
  const [phase, setPhase] = useState("prep"); // prep, present
  const [scheduleclassLoading, setScheduleClassLoading] = useState(false);
  const initialFormData = {
    sessionTitle: "",
    shortDescription: "",
    courseId: "",
    sessionHeading: "",
    date: "",
    time: "",
  };

  const [scheduleClass, setScheduleClass] = useState(initialFormData);

  const handleScheduleClass = (e) => {
    const { name, value } = e.target;
    setScheduleClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handlescheduleLiveClass = async () => {
  //   e.preventDefault()
  //   setScheduleClassLoading(true);
  //   try {
  //     const response = await scheduleLiveClass(scheduleClass);
  //     console.log(response, "class scheduled");
  //     if (response.status === 200) {
  //       setScheduleClassLoading(false);
  //     }
  //   } catch (error) {}
  // };

  // slides: can be text-based or image-based
  const handlescheduleLiveClass = async (e) => {
  e.preventDefault();
  setScheduleClassLoading(true);

  try {
    const response = await scheduleLiveClass(scheduleClass);
    console.log(response, "class scheduled");
  } catch (error) {
    console.error(error);
  } finally {
    setScheduleClassLoading(false);
  }
};

  
  const defaultSlides = [
    {
      id: uid("s1"),
      title: "Welcome to LiveClass",
      text: "Use the Upload step to import your PPT/PDF or a plain text slide pack.",
      imageUrl: null,
    },
    {
      id: uid("s2"),
      title: "How this demo works",
      text: "The component creates slides from text files or shows placeholders for PPT.",
      imageUrl: null,
    },
  ];

  const [slidesDeck, setSlidesDeck] = useState(defaultSlides);
  const [slideIndex, setSlideIndex] = useState(0);

  // schedule form state
  const [courseTitle, setCourseTitle] = useState(availableCourses[0]);
  const [sectionTitle, setSectionTitle] = useState("State Management Basics");
  const [sessionDate, setSessionDate] = useState("2024-12-25");
  const [sessionTime, setSessionTime] = useState("10:00");

  const [showUploadSection, setShowUploadSection] = useState(false);
  const [sessionScheduled, setSessionScheduled] = useState(false);

  // upload
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState("");
  const [message, setMessage] = useState("");

  // session active state (for Start / End Session buttons)
  const [sessionActive, setSessionActive] = useState(false);

  // student doubts list (coming from student reactions)
  const [doubts, setDoubts] = useState([]);
  // teacher reply drafts per doubt
  const [replyDrafts, setReplyDrafts] = useState({});

  /* -----------------
     Slide navigation
  ------------------*/
  const pushSlide = (index) => {
    setSlideIndex(index);
    window.dispatchEvent(
      new CustomEvent("edu_slide_index", { detail: { index } })
    );
  };
  const next = () => pushSlide(Math.min(slidesDeck.length - 1, slideIndex + 1));
  const prev = () => pushSlide(Math.max(0, slideIndex - 1));

  /* -----------------
     Live audio
  ------------------*/
  const [isLive, setIsLive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let id;
    if (isLive) id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isLive]);
  const toggleAudio = () => {
    const nextLive = !isLive;
    setIsLive(nextLive);
    window.dispatchEvent(new Event("edu_audio_state"));
    if (!nextLive) setSeconds(0);
  };
  const fmt = (s) => new Date(s * 1000).toISOString().substr(11, 8);

  /* -----------------
     Live reactions
     - Students (in another module) dispatch:
       window.dispatchEvent(new CustomEvent("edu_reaction", {
         detail: { type: "understood" }
       }));
       window.dispatchEvent(new CustomEvent("edu_reaction", {
         detail: { type: "doubt", message: "What is gradient descent?", slideIndex: 2 }
       }));
  ------------------*/
  const [reactionCounts, setReactionCounts] = useState(() =>
    load("edu_reactions", { understood: 0, doubt: 0 })
  );

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail || {};
      const type = detail.type;
      const msg = detail.message;
      const sIndex =
        typeof detail.slideIndex === "number" ? detail.slideIndex : null;

      if (!type) return;

      // Update counts
      if (type === "understood") {
        setReactionCounts((c) => {
          const next = { ...c, understood: (c.understood || 0) + 1 };
          save("edu_reactions", next);
          return next;
        });
      } else if (type === "doubt") {
        setReactionCounts((c) => {
          const next = { ...c, doubt: (c.doubt || 0) + 1 };
          save("edu_reactions", next);
          return next;
        });

        // Store doubt with message
        if (typeof msg === "string" && msg.trim()) {
          setDoubts((prev) => [
            ...prev,
            {
              id: uid("d"),
              text: msg.trim(),
              slideIndex: sIndex,
              reply: "",
            },
          ]);
        }
      }
    };

    window.addEventListener("edu_reaction", handler);
    return () => window.removeEventListener("edu_reaction", handler);
  }, []);

  /* -----------------
     Upload handling
  ------------------*/
  const onFileSelect = (file) => {
    if (!file) return;
    setUploading(true);
    setUploadedName(file.name || "");
    setMessage("");

    const name = (file.name || "").toLowerCase();
    const mime = file.type || "";

    // 1) TEXT FILE => split into text slides
    const isText = /text|plain/.test(mime) || name.endsWith(".txt");

    if (isText) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target.result;
          const parsed = parseTextSlides(text);
          if (parsed) {
            // ensure each slide has imageUrl null
            const slides = parsed.map((s) => ({ ...s, imageUrl: null }));
            setSlidesDeck(slides);
            setMessage(`Imported ${slides.length} slides from text file.`);
          } else {
            setSlidesDeck(defaultSlides);
            setMessage(
              "Could not parse text into slides — using fallback slides."
            );
          }
          setSlideIndex(0);
        } catch (err) {
          console.error(err);
          setSlidesDeck(defaultSlides);
          setMessage("Error parsing text file — using fallback slides.");
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setUploading(false);
        setMessage("Failed to read file — using fallback slides.");
        setSlidesDeck(defaultSlides);
      };
      reader.readAsText(file);
      return;
    }

    // 2) PDF => real slide images
    if (name.endsWith(".pdf") || mime.includes("pdf")) {
      (async () => {
        try {
          const slides = await pdfFileToSlides(file);
          setSlidesDeck(slides);
          setSlideIndex(0);
          setMessage(`Loaded ${slides.length} pages as slides from PDF.`);
        } catch (err) {
          console.error("Error converting PDF:", err);
          setSlidesDeck(defaultSlides);
          setMessage("Error reading PDF — using fallback slides.");
        } finally {
          setUploading(false);
        }
      })();
      return;
    }

    // 3) PPT / PPTX => simulated slides
    if (name.endsWith(".ppt") || name.endsWith(".pptx")) {
      const simulated = [
        {
          id: uid("s"),
          title: `${file.name} — Slide 1`,
          text: "Simulated slide. Backend/PPT parser needed for real content.",
          imageUrl: null,
        },
        {
          id: uid("s"),
          title: `${file.name} — Slide 2`,
          text: "Simulated slide. Connect to backend for true PPT to image.",
          imageUrl: null,
        },
        {
          id: uid("s"),
          title: `${file.name} — Slide 3`,
          text: "Simulated slide. Example only.",
          imageUrl: null,
        },
      ];
      setSlidesDeck(simulated);
      setSlideIndex(0);
      setMessage(
        "PPT/PPTX support is simulated here. Use a backend or PPT parser for real slides."
      );
      setUploading(false);
      return;
    }

    // 4) UNKNOWN FILE => fallback
    setSlidesDeck(defaultSlides);
    setSlideIndex(0);
    setMessage(
      "Unsupported format for slide splitting — using fallback slides."
    );
    setUploading(false);
  };

  const handleFileInput = (e) => {
    const f = e.target.files && e.target.files[0];
    onFileSelect(f);
  };

  /* -----------------
     Prep actions
  ------------------*/
  const startLiveFlowNext = () => {
    // Show upload section + mark scheduled
    setShowUploadSection(true);
    setSessionScheduled(true);
  };

  const cancelToPrep = () => {
    setPhase("prep");
    setSlidesDeck(defaultSlides);
    setSlideIndex(0);
    setUploadedName("");
    setMessage("");
    setShowUploadSection(false);
    setSessionActive(false);
    setDoubts([]);
    setReplyDrafts({});
  };

  const pushToStudents = () => {
    // Emit the current slide index to students
    window.dispatchEvent(
      new CustomEvent("edu_push_present", { detail: { slideIndex } })
    );
    setMessage("Pushed current slide to students.");
  };

  const currentSlide = slidesDeck[slideIndex] || {
    title: "—",
    text: "No slide available.",
    imageUrl: null,
  };

  // handle teacher reply change
  const handleReplyChange = (id, value) => {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }));
  };

  // handle teacher reply send
  const handleReplySend = (id) => {
    const replyText = (replyDrafts[id] || "").trim();
    if (!replyText) return;
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              reply: replyText,
            }
          : d
      )
    );
    setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
    setMessage("Replied to student doubt.");
  };

  /* -----------------
     UI render
  ------------------*/
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center p-4 sm:p-6">
      {/* Header */}
      <header className="w-full max-w-6xl mb-6">
        <div className="rounded-2xl p-4 shadow-2xl bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-400 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="bg-white/20 p-3 rounded-full shadow-lg flex-shrink-0">
              <FiFileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight truncate">
                LiveClass — Premium Presenter
              </h1>
              <div className="text-sm opacity-90 truncate">
                Start, upload slides, and go live with audio + student
                reactions.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <div className="hidden sm:block text-sm font-medium bg-white bg-opacity-10 px-3 py-2 rounded-lg">
              Status:{" "}
              <span className="ml-2 font-semibold">{phase.toUpperCase()}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelToPrep}
                className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PREP STEP */}
      {phase === "prep" && (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          {/* Main Prep Section: Form, Schedule */}
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                Prepare your session
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Add a short description and set up the session time. Click Next
                to configure uploads and go live.
              </p>
              <form
                onSubmit={handlescheduleLiveClass}
                title="live_class_schedule"
              >
                {/* Session Details */}
                <div className="space-y-3">
                  <label className="block">
                    <div className="text-xs text-slate-500 mb-1">
                      Session Title
                    </div>
                    <input
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      defaultValue="My Live Class"
                      type="text"
                      name="sessionTitle"
                      value={scheduleClass.sessionTitle}
                      onChange={handleScheduleClass}
                    />
                  </label>

                  <label className="block">
                    <div className="text-xs text-slate-500 mb-1">
                      Short Description
                    </div>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 min-h-[72px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      name="shortDescription"
                      value={scheduleClass.shortDescription}
                      onChange={handleScheduleClass}
                      type="text"
                    />
                  </label>
                </div>

                {/* Session Scheduling */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                  <h3 className="text-base font-semibold text-yellow-800">
                    Session Scheduling
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Course Title (Select) */}
                    <label className="block">
                      <div className="text-xs text-yellow-700/80 mb-1">
                        Course Title
                      </div>
                      <select
                        name="sessionHeading"
                        value={scheduleClass.sessionHeading}
                        onChange={handleScheduleClass}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300"
                      >
                        {availableCourses.map((course, index) => (
                          <option key={index} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    </label>
                    {/* Section Title */}
                    <label className="block">
                      <div className="text-xs text-yellow-700/80 mb-1">
                        Section Title
                      </div>
                      <input
                        type="text"
                        name="courseId"
                        value={scheduleClass.courseId}
                        onChange={handleScheduleClass}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Date */}
                    <label className="block">
                      <div className="text-xs text-yellow-700/80 mb-1">
                        Date
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={scheduleClass.date}
                        onChange={handleScheduleClass}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300"
                      />
                    </label>
                    {/* Time */}
                    <label className="block">
                      <div className="text-xs text-yellow-700/80 mb-1">
                        Time
                      </div>
                      <input
                        type="time"
                        name="time"
                        value={scheduleClass.time}
                        onChange={handleScheduleClass}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300"
                      />
                    </label>
                  </div>

                  <p className="text-xs text-yellow-700/80">
                    *Note: Full scheduling and calendar integration logic goes
                    here, including options to repeat or invite specific groups.
                  </p>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg shadow font-semibold hover:scale-[1.01] transition-transform w-full sm:w-auto cursor-pointer"
                  >
                    {scheduleclassLoading
                      ? "Scheduling Live Class"
                      : "Schedule Live Class"}
                  </button>
                </div>
              </form>
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={startLiveFlowNext}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg shadow font-semibold hover:scale-[1.01] transition-transform w-full sm:w-auto cursor-pointer"
                >
                  Next
                </button>
              </div>

              {/* Upload Tip + Upload button (shown after Next) – before summary */}
              {showUploadSection && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <FiUpload />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Upload Tip</div>
                      <div className="text-xs text-indigo-700/80">
                        Upload a plain text (.txt) split by blank lines for
                        instant slide import, or upload a PDF for real slide
                        images. PPT/PPTX creates simulated slides here.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileInput}
                      accept=".txt,.pdf,.ppt,.pptx"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 border rounded-lg px-4 py-2 bg-white hover:bg-slate-50 text-sm font-medium w-full sm:w-auto"
                    >
                      <FiPaperclip />
                      Upload Slide Pack
                    </button>
                  </div>

                  {uploading && (
                    <div className="mt-3 text-sm text-slate-600">
                      Processing <strong>{uploadedName}</strong> ...
                    </div>
                  )}
                  {message && (
                    <div className="mt-2 text-xs text-slate-700">{message}</div>
                  )}
                </div>
              )}

              {/* After scheduling: summary + Start Live inline (AFTER Upload Tip) */}
              {sessionScheduled && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                  <div className="text-sm text-indigo-900 font-medium truncate">
                    {courseTitle !== availableCourses[0]
                      ? courseTitle
                      : "Course not set"}{" "}
                    • {sessionDate || "Date not set"} at{" "}
                    {sessionTime || "Time not set"}
                  </div>
                  <button
                    onClick={() => setPhase("present")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                  >
                    <FiPlay className="w-4 h-4" />
                    Start Live
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRESENT STEP (Main presenter UI) */}
      {phase === "present" && (
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Document / Slide */}
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-slate-700">
                    Live Document View
                  </div>
                  <div className="text-xs text-slate-500">
                    Slide {slideIndex + 1} / {slidesDeck.length}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={pushToStudents}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg inline-flex items-center gap-2 text-sm"
                  >
                    <FiPlay />
                    <span className="hidden sm:inline">Push</span>
                  </button>
                  {/* Back button */}
                  <button
                    onClick={() => setPhase("prep")}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-2 flex flex-col justify-center items-center shadow-inner overflow-hidden">
                {/* Responsive height: smaller on narrow screens */}
                <div className="w-full h-[42vh] sm:h-96 flex items-center justify-center">
                  {currentSlide.imageUrl ? (
                    <img
                      src={currentSlide.imageUrl}
                      alt={currentSlide.title || "Slide"}
                      className="max-h-full max-w-full object-contain rounded-md"
                    />
                  ) : (
                    <div className="px-4 text-center">
                      <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-2">
                        {currentSlide.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                        {currentSlide.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={prev}
                  disabled={slideIndex === 0}
                  className="px-3 py-2 rounded-lg bg-white border disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>
                <div className="px-4 py-2 bg-white border text-sm">
                  {slideIndex + 1} / {slidesDeck.length}
                </div>
                <button
                  onClick={next}
                  disabled={slideIndex === slidesDeck.length - 1}
                  className="px-3 py-2 rounded-lg bg-white border disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              {/* Audio */}
              <div className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">Audio</div>
                  <div className="text-xs text-slate-500">
                    Live speaker status
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAudio}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm ${
                      isLive
                        ? "bg-red-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {isLive ? <FiStopCircle /> : <FiMic />}
                    <span className="hidden sm:inline">
                      {isLive ? "Mute" : "Unmute"}
                    </span>
                  </button>
                  {isLive && (
                    <div className="text-sm text-red-500 font-medium">
                      🔴 {fmt(seconds)}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick slide jump */}
              <div className="p-3 bg-white border rounded-lg flex flex-col gap-3">
                <div className="text-sm font-semibold">Quick Slide Jump</div>
                <div className="grid grid-cols-6 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {slidesDeck.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => pushSlide(i)}
                      className={`text-xs p-2 rounded ${
                        i === slideIndex
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-50"
                      }`}
                      title={s.title}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Info + Start / End Session */}
              <div className="p-3 bg-white border rounded-lg text-sm">
                <div className="font-semibold mb-2">Session Info</div>
                <div className="text-xs text-slate-600">
                  Course:{" "}
                  <strong>
                    {courseTitle !== availableCourses[0]
                      ? courseTitle
                      : "Not set"}
                  </strong>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Section: <strong>{sectionTitle || "Not set"}</strong>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Scheduled:{" "}
                  <strong>
                    {sessionDate || "—"} at {sessionTime || "—"}
                  </strong>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Deck: <strong>{uploadedName || "unspecified"}</strong>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setSessionActive(true)}
                    disabled={sessionActive}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white disabled:opacity-60 w-full"
                  >
                    Start Session
                  </button>
                  <button
                    onClick={() => setSessionActive(false)}
                    disabled={!sessionActive}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white disabled:opacity-60 w-full"
                  >
                    End Session
                  </button>
                </div>

                {sessionActive && (
                  <div className="mt-2 text-xs text-emerald-600 font-medium">
                    Session is live.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message + bottom reactions section (teacher console) */}
          <div className="mt-4 space-y-3">
            {message && (
              <div className="text-xs text-slate-500 text-center">
                {message}
              </div>
            )}

            <div className="w-full max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col gap-4">
              {/* Understood counter */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiThumbsUp className="text-green-600" />
                <span>
                  Understood reactions:{" "}
                  <span className="font-semibold">
                    {reactionCounts.understood || 0}
                  </span>
                </span>
              </div>

              {/* Doubts list */}
              <div className="border-t border-slate-200 pt-3">
                <div className="text-xs font-semibold text-slate-600 mb-2">
                  Student Doubts
                </div>

                {doubts.length === 0 ? (
                  <div className="text-xs text-slate-400">
                    No doubts yet from students.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-52 overflow-y-auto">
                    {doubts.map((d) => (
                      <div
                        key={d.id}
                        className="bg-white rounded-md border border-slate-200 p-3 text-xs flex flex-col gap-2"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div className="text-slate-800 break-words">
                            {d.text}
                            {typeof d.slideIndex === "number" && (
                              <span className="ml-2 text-[11px] text-slate-500">
                                (Slide {d.slideIndex + 1})
                              </span>
                            )}
                          </div>
                        </div>

                        {d.reply && (
                          <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-1">
                            <span className="font-semibold mr-1">Teacher:</span>
                            {d.reply}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 mt-1">
                          <input
                            type="text"
                            placeholder="Type reply..."
                            value={replyDrafts[d.id] ?? ""}
                            onChange={(e) =>
                              handleReplyChange(d.id, e.target.value)
                            }
                            className="flex-1 border rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-300 w-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplySend(d.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[11px] hover:bg-indigo-700 w-full sm:w-auto"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
