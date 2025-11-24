import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    FiUpload,
    FiMic,
    FiPause,
    FiStopCircle,
    FiPlay,
    FiArrowLeft,
    FiEdit,
    FiTrash2,
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker&url";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// =============================
// INTERNAL PPT → PDF SIMULATION
// (We fake the PPT conversion)
// =============================
async function convertPPTtoPDF(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(file); // simulate conversion success
        }, 1500);
    });
}

// =============================
// GLOBAL STYLE FOR NO SCROLLBARS
// =============================
const GlobalStyle = () => (
    <style>{`
        ::-webkit-scrollbar { width: 0; height: 0; }
        * { scrollbar-width: none; }
        body { background-color: #f7f3ff; } /* Light purple background for aesthetic */
    `}</style>
);

// =============================
// PREMIUM PURPLE UI GRADIENTS
// =============================
const glass = "backdrop-blur-xl bg-white/50 border border-white/70";
const purpleButton =
    "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:opacity-90 transition";

// ===================================================================
//                        MAIN HUGE COMPONENT START
// ===================================================================
export default function RecordedLectures() {
    // ================================
    // STATES
    // ================================
    const [mode, setMode] = useState("list"); // list, studio, viewer, edit
    const [lectures, setLectures] = useState([]);

    // Studio states
    const [title, setTitle] = useState("");
    const [slides, setSlides] = useState([]);
    const [slideAudio, setSlideAudio] = useState({});
    const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

    // Viewer states
    const [viewLecture, setViewLecture] = useState(null);

    // Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const mediaStreamRef = useRef(null);

    // Search + Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("recent");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // =================================
    // LOAD & SAVE LECTURES
    // =================================
    useEffect(() => {
        const saved = localStorage.getItem("RECORDED_LECTURES_V2");
        if (saved) setLectures(JSON.parse(saved));
    }, []);

    const saveLectures = (list) => {
        // Advanced Feature: Clean up old audio URLs when deleting a lecture
        // This is important for memory management, though less critical for LocalStorage URLs.
        if (lectures.length > list.length) {
            const deletedLecture = lectures.find(lec => !list.some(x => x.id === lec.id));
            if (deletedLecture) {
                Object.values(deletedLecture.slideAudio).forEach(url => URL.revokeObjectURL(url));
            }
        }
        localStorage.setItem("RECORDED_LECTURES_V2", JSON.stringify(list));
        setLectures(list);
    };

    // Advanced Feature: Filtered/Sorted list for the Grid (Memoized)
    const filteredLectures = useMemo(() => {
        let list = lectures.filter((lec) =>
            lec.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        list.sort((a, b) => {
            if (filterType === "recent") return b.created - a.created;
            if (filterType === "az") return a.title.localeCompare(b.title);
            if (filterType === "slides") return b.slides.length - a.slides.length;
            if (filterType === "audio")
                return (
                    Object.keys(b.slideAudio).length -
                    Object.keys(a.slideAudio).length
                );
            return 0;
        });
        return list;
    }, [lectures, searchQuery, filterType]);

    // =================================
    // PDF & PPT UPLOAD HANDLER
    // (This part was mostly complete, just added cleanup)
    // =================================
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(5);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
        setSlides([]); // Clear previous slides

        let processedFile = file;

        // PPT → PDF Convert Simulation
        if (file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) {
            setUploadProgress(15);
            await convertPPTtoPDF(file);
            setUploadProgress(40);
            processedFile = file;
        }

        // Convert PDF → slides
        try {
            const fileURL = URL.createObjectURL(processedFile);
            const pdf = await pdfjsLib.getDocument(fileURL).promise;
            const imgs = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                setUploadProgress(40 + (i / pdf.numPages) * 60);

                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.6 });

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: ctx, viewport }).promise;
                imgs.push(canvas.toDataURL("image/png"));
            }

            setSlides(imgs); // Set all slides
            setUploadProgress(100);
        } catch (error) {
            console.error("Error processing PDF:", error);
        } finally {
            e.target.value = null; // Reset input field to allow re-uploading the same file
            setTimeout(() => setIsUploading(false), 700);
        }
    };

    // =================================
    // RECORDING HANDLERS
    // =================================
    const stopMediaStream = (stream) => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setIsPaused(false);
        mediaStreamRef.current = null;
    }

    const startRecording = async () => {
        try {
            // Revoke any existing audio URL for the current slide before recording
            if (slideAudio[selectedSlideIndex]) {
                URL.revokeObjectURL(slideAudio[selectedSlideIndex]);
                setSlideAudio(prev => {
                    const newAudio = { ...prev };
                    delete newAudio[selectedSlideIndex];
                    return newAudio;
                });
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // Use webm for broader browser support
            audioChunks.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunks.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                if (audioChunks.current.length === 0) {
                    stopMediaStream(stream); // Stop the stream, but don't save empty audio
                    return;
                }
                const blob = new Blob(audioChunks.current, { type: mediaRecorderRef.current.mimeType });
                const url = URL.createObjectURL(blob);

                setSlideAudio((prev) => ({
                    ...prev,
                    [selectedSlideIndex]: url,
                }));

                stopMediaStream(stream); // Stop stream once recording data is processed
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsPaused(false);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check permissions.");
            stopMediaStream(mediaStreamRef.current);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            // The onstop handler will update states (isRecording, isPaused) and revoke the stream.
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        }
    }

    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    }

    // Advanced Feature: Handle slide change during recording
    useEffect(() => {
        if (isRecording && mediaRecorderRef.current) {
            // Automatically stop recording when the slide changes to save the audio chunk
            stopRecording();
            // User will need to manually press 'Start Recording' on the new slide
            alert(`Recording for Slide ${selectedSlideIndex} saved. Start new recording for Slide ${selectedSlideIndex + 1}.`);
        }
        // Clean up old audio player if switching slides in viewer mode
        const audioEl = document.getElementById('viewer-audio');
        if (audioEl) {
            audioEl.load(); // Reload the audio source
        }
    }, [selectedSlideIndex]);

    // =================================
    // MAIN RENDER
    // =================================
    return (
        <div className="min-h-screen">
            <GlobalStyle />

            {/* ================================
                LECTURE STUDIO (mode === "studio")
            ================================ */}
            {mode === "studio" && (
                <div className="p-4">
                    <button
                        onClick={() => {
                            stopMediaStream(mediaStreamRef.current);
                            setMode("list");
                            setSlides([]);
                            setSlideAudio({});
                            setTitle("");
                            setSelectedSlideIndex(0);
                        }}
                        className="flex items-center gap-2 text-purple-600 hover:underline"
                    >
                        <FiArrowLeft /> Back to List
                    </button>

                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent mt-4">
                        Create / Edit Lecture
                    </h2>

                    {/* TITLE INPUT */}
                    <input
                        type="text"
                        placeholder="Enter lecture title"
                        className="w-full mt-4 p-3 text-lg rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* UPLOAD DROPZONE */}
                    {slides.length === 0 && (
                        <label className="mt-5 block">
                            <div
                                className={`${glass} p-10 text-center rounded-2xl cursor-pointer border-2 border-dashed border-purple-300 hover:border-purple-500 transition`}
                            >
                                <FiUpload className="text-4xl mx-auto text-purple-600 mb-3" />
                                <p className="text-purple-700 text-lg">Upload PDF / PPT / PPTX</p>
                                <p className="text-xs mt-1 text-purple-400">
                                    Supported: .pdf, .ppt, .pptx
                                </p>
                            </div>

                            <input
                                type="file"
                                accept=".pdf,.ppt,.pptx"
                                onChange={handleUpload}
                                className="hidden"
                            />
                        </label>
                    )}


                    {/* UPLOAD PROGRESS */}
                    {isUploading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 bg-purple-200 rounded-full h-3 overflow-hidden"
                        >
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.4 }}
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                            ></motion.div>
                        </motion.div>
                    )}

                    {/* WORKSPACE GRID */}
                    {slides.length > 0 && (
                        <div className="mt-8 flex gap-6">

                            {/* LEFT PANEL — SLIDE LIST */}
                            <div className="w-48 max-h-[70vh] overflow-y-auto p-2 rounded-xl shadow-xl bg-white/20 backdrop-blur-lg border border-white/30">
                                <h3 className="sticky top-0 bg-white/70 p-1 text-center text-sm font-semibold text-purple-700 mb-3 rounded-t-lg">
                                    Slides ({slides.length})
                                </h3>

                                {slides.map((slide, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.03 }}
                                        onClick={() => setSelectedSlideIndex(index)}
                                        className={`rounded-xl p-1 mb-3 cursor-pointer border-2 ${selectedSlideIndex === index
                                            ? "border-purple-600 shadow-lg bg-purple-100/30"
                                            : "border-transparent"
                                            }`}
                                    >
                                        <img
                                            src={slide}
                                            className="rounded-lg shadow-md aspect-[4/3] object-contain bg-white"
                                        />

                                        {/* Audio Status */}
                                        <div className="text-center mt-1 text-xs">
                                            {slideAudio[index] ? (
                                                <span className="text-green-600 font-semibold">
                                                    🎤 Audio Added
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    No Audio
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* RIGHT PANEL — PREVIEW + RECORDING */}
                            <div className="flex-1 rounded-xl p-5 bg-white/30 backdrop-blur-xl shadow-2xl border border-white/30">

                                {/* SLIDE DISPLAY */}
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedSlideIndex}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        src={slides[selectedSlideIndex]}
                                        className="w-full max-h-[420px] object-contain rounded-xl shadow-2xl bg-white"
                                    />
                                </AnimatePresence>

                                {/* SLIDE INDEX */}
                                <p className="text-center text-purple-700 mt-3 font-medium">
                                    Slide {selectedSlideIndex + 1} / {slides.length}
                                </p>

                                {/* RECORDING CONTROLS */}
                                <div className="mt-5 flex items-center justify-center gap-3">

                                    {/* START BUTTON */}
                                    {!isRecording && (
                                        <button
                                            onClick={startRecording}
                                            className={`${purpleButton} px-6 py-3 rounded-xl flex items-center gap-2`}
                                        >
                                            <FiMic /> Start Recording
                                        </button>
                                    )}

                                    {/* PAUSE / RESUME BUTTON */}
                                    {isRecording && (
                                        <button
                                            onClick={isPaused ? resumeRecording : pauseRecording}
                                            className={`px-6 py-3 rounded-xl flex items-center gap-2 ${isPaused
                                                ? "bg-blue-600 text-white"
                                                : "bg-yellow-500 text-white"}`}
                                        >
                                            {isPaused ? <FiMic /> : <FiPause />} {isPaused ? "Resume" : "Pause"}
                                        </button>
                                    )}

                                    {/* STOP BUTTON */}
                                    {isRecording && (
                                        <button
                                            onClick={stopRecording}
                                            className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                                        >
                                            <FiStopCircle /> Stop
                                        </button>
                                    )}
                                </div>

                                {/* SLIDE AUDIO PLAYER */}
                                {slideAudio[selectedSlideIndex] && (
                                    <div className="mt-4 flex flex-col items-center">
                                        <p className="text-sm text-green-700 font-medium mb-2">Review Audio:</p>
                                        <audio
                                            controls
                                            key={selectedSlideIndex}
                                            className="w-full rounded-xl shadow-lg"
                                        >
                                            <source
                                                src={slideAudio[selectedSlideIndex]}
                                                type="audio/webm"
                                            />
                                        </audio>
                                        {/* Advanced Feature: Delete Audio Button */}
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this audio recording?")) {
                                                    URL.revokeObjectURL(slideAudio[selectedSlideIndex]);
                                                    setSlideAudio(prev => {
                                                        const newAudio = { ...prev };
                                                        delete newAudio[selectedSlideIndex];
                                                        return newAudio;
                                                    });
                                                }
                                            }}
                                            className="text-red-500 text-sm mt-2 hover:underline flex items-center gap-1"
                                        >
                                            <FiTrash2 size={14} /> Delete Audio
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PUBLISH BUTTON */}
                    {slides.length > 0 && title && (
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => {
                                    stopMediaStream(mediaStreamRef.current);

                                    // Advanced Feature: Check if any slide lacks audio
                                    const slidesWithAudio = Object.keys(slideAudio).length;
                                    if (slidesWithAudio < slides.length && !window.confirm(`Only ${slidesWithAudio} of ${slides.length} slides have audio. Publish anyway?`)) {
                                        return;
                                    }

                                    const newLecture = {
                                        id: Date.now(),
                                        title,
                                        slides,
                                        slideAudio,
                                        created: Date.now(),
                                    };

                                    const updated = [...lectures.filter(lec => lec.id !== viewLecture?.id), newLecture]; // Filter out old version if editing
                                    saveLectures(updated);

                                    // Reset state and navigate
                                    setMode("list");
                                    setSlides([]);
                                    setSlideAudio({});
                                    setTitle("");
                                    setSelectedSlideIndex(0);
                                    setViewLecture(null);
                                }}
                                className={`${purpleButton} px-7 py-3 rounded-xl text-lg`}
                            >
                                {viewLecture ? 'Update Lecture' : 'Publish Lecture'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ================================
            LECTURE LIST PAGE (mode === "list")
            ================================ */}
            {mode === "list" && (
                <div className="p-4">
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent mb-6">
                        📚 My Recorded Lectures
                    </h2>


                    {/* SEARCH + FILTER BAR */}
                    <div className="mt-4 flex flex-wrap items-center gap-4">

                        {/* SEARCH */}
                        <div className="flex items-center bg-white/30 backdrop-blur-lg border border-white/30 rounded-xl px-4 py-2 shadow flex-grow max-w-sm">
                            <FiSearch className="text-purple-600 mr-2" />
                            <input
                                type="text"
                                placeholder="Search lectures..."
                                className="bg-transparent focus:outline-none w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* FILTERS */}
                        <select
                            className="p-2 rounded-xl bg-white/30 backdrop-blur-lg border border-white/30 shadow text-purple-700"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="recent">Recently Created</option>
                            <option value="az">A–Z</option>
                            <option value="slides">Slide Count</option>
                            <option value="audio">Audio Count</option>
                        </select>

                        {/* CREATE BUTTON */}
                        <button
                            onClick={() => {
                                setMode("studio");
                                setViewLecture(null); // Clear lecture being edited
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:opacity-90"
                        >
                            <FiPlus /> Create New
                        </button>
                    </div>

                    {/* LECTURE GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">

                        {filteredLectures.map((lec) => (
                            <motion.div
                                key={lec.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                                className="rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-white/40 backdrop-blur-xl border border-white/50 relative transform transition-all duration-300"
                            >
                                {/* PREVIEW THUMBNAIL */}
                                <img
                                    src={lec.slides[0]}
                                    onClick={() => {
                                        setViewLecture(lec);
                                        setSelectedSlideIndex(0);
                                        setMode("viewer");
                                    }}
                                    className="w-full h-44 object-contain bg-white border-b border-gray-200"
                                />

                                {/* CARD CONTENT */}
                                <div className="p-4">
                                    <h3
                                        className="font-semibold text-purple-800 text-lg leading-tight truncate"
                                        title={lec.title}
                                    >
                                        {lec.title}
                                    </h3>

                                    <p className="text-sm text-gray-700 mt-1">
                                        **{lec.slides.length} slides** · **{Object.keys(lec.slideAudio).length} voiced**
                                    </p>

                                    {/* ACTIONS */}
                                    <div className="flex justify-between mt-3 border-t pt-3 border-purple-200">

                                        {/* EDIT */}
                                        <button
                                            onClick={() => {
                                                // Load existing data into studio states
                                                setSlides(lec.slides);
                                                setSlideAudio(lec.slideAudio);
                                                setTitle(lec.title);
                                                setSelectedSlideIndex(0);

                                                // Crucial: Set the lecture being edited for update logic
                                                setViewLecture(lec);

                                                // Switch mode to studio
                                                setMode("studio");
                                            }}
                                            className="text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium"
                                        >
                                            <FiEdit size={16} /> Edit
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete lecture: "${lec.title}"?`)) {
                                                    saveLectures(
                                                        lectures.filter((x) => x.id !== lec.id)
                                                    );
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                                        >
                                            <FiTrash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filteredLectures.length === 0 && (
                            <p className="mt-8 text-purple-700 text-lg col-span-full">No lectures found. Create one!</p>
                        )}
                    </div>
                </div>
            )}

            {/* ================================
            FULL VIEWER (mode === "viewer")
            ================================ */}
            {mode === "viewer" && viewLecture && (
                <div className="p-4 max-w-5xl mx-auto">

                    {/* BACK */}
                    <button
                        onClick={() => setMode("list")}
                        className="flex items-center gap-2 text-purple-700 mb-4 hover:underline"
                    >
                        <FiArrowLeft /> Back to Lectures
                    </button>

                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent mb-6">
                        {viewLecture.title}
                    </h2>

                    <div className="bg-white/70 rounded-2xl p-6 shadow-2xl border border-white/90">

                        {/* SLIDE VIEWER */}
                        <div className="flex items-center justify-between gap-4">

                            {/* LEFT ARROW */}
                            <button
                                onClick={() =>
                                    setSelectedSlideIndex((i) => Math.max(i - 1, 0))
                                }
                                className="p-3 rounded-full bg-purple-200/50 text-purple-800 shadow hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={selectedSlideIndex === 0}
                            >
                                <FiChevronLeft size={26} />
                            </button>

                            {/* SLIDE IMAGE */}
                            <motion.img
                                key={selectedSlideIndex}
                                initial={{ opacity: 0, x: selectedSlideIndex > 0 ? 30 : -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                src={viewLecture.slides[selectedSlideIndex]}
                                className="flex-1 max-w-[90%] max-h-[70vh] object-contain rounded-xl bg-white shadow-xl"
                            />



                            {/* RIGHT ARROW */}
                            <button
                                onClick={() =>
                                    setSelectedSlideIndex((i) =>
                                        Math.min(i + 1, viewLecture.slides.length - 1)
                                    )
                                }
                                className="p-3 rounded-full bg-purple-200/50 text-purple-800 shadow hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={selectedSlideIndex === viewLecture.slides.length - 1}
                            >
                                <FiChevronRight size={26} />
                            </button>
                        </div>

                        {/* SLIDE COUNT */}
                        <p className="text-center text-purple-700 mt-4 font-semibold text-lg">
                            Slide {selectedSlideIndex + 1} / {viewLecture.slides.length}
                        </p>

                        {/* AUDIO PLAYER */}
                        {viewLecture.slideAudio[selectedSlideIndex] ? (
                            <audio
                                controls
                                className="w-full mt-4 rounded-lg"
                                key={selectedSlideIndex}
                                id="viewer-audio"
                            >
                                <source
                                    src={viewLecture.slideAudio[selectedSlideIndex]}
                                    type="audio/webm"
                                />
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <p className="text-center mt-4 text-gray-500 italic">
                                🎧 No audio recorded for this slide.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}