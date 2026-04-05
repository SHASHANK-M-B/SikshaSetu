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
import {
  deleteRecordedLecture,
  getListOfRecordedLecture,
  scheduleLiveClass,
  updateRecordedLecture,
  uploadRecordedLecture,
} from "@/api/teacher";

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
// HELPER: dataURL -> Blob
// =============================
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(",");
  const meta = parts[0].match(/:(.*?);/);
  const mime = meta ? meta[1] : "image/png";
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
// =============================
// HELPER: Merge multiple Audio Blobs into one WAV Blob
// =============================
async function mergeAudioBlobs(blobs) {
  if (!blobs || blobs.length === 0) return null;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffers = [];

  // 1. Decode all blobs into AudioBuffers
  for (const blob of blobs) {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBuffers.push(audioBuffer);
  }

  // 2. Calculate total length
  const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.length, 0);

  // 3. Create a new buffer for the merged audio
  const resultBuffer = audioContext.createBuffer(
    audioBuffers[0].numberOfChannels,
    totalLength,
    audioBuffers[0].sampleRate
  );

  // 4. Copy data into the new buffer
  let offset = 0;
  for (const buf of audioBuffers) {
    for (let channel = 0; channel < buf.numberOfChannels; channel++) {
      resultBuffer
        .getChannelData(channel)
        .set(buf.getChannelData(channel), offset);
    }
    offset += buf.length;
  }

  // 5. Convert AudioBuffer to WAV Blob
  return bufferToWav(resultBuffer);
}

// =============================
// HELPER: Convert AudioBuffer to WAV Blob
// =============================
function bufferToWav(abuffer) {
  const numOfChan = abuffer.numberOfChannels;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this example)

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < abuffer.length) {
    for (i = 0; i < numOfChan; i++) {
      // clamp
      sample = Math.max(-1, Math.min(1, channels[i][pos]));
      // scale to 16-bit signed int
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(44 + offset, sample, true);
      offset += 2;
    }
    pos++;
  }

  return new Blob([buffer], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

// =============================
// HELPER: Get duration of audio blob (seconds)
// =============================
function getAudioDuration(blob) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = url;
    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration || 0;
      URL.revokeObjectURL(url);
      resolve(duration);
    });
    // Fallback if metadata fails
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      resolve(0);
    });
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
  const [editCourse, setEditCourse] = useState(null);
  const [lectureData, setLectureData] = useState(null);
  // Studio states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slides, setSlides] = useState([]); // data URLs (for UI & local storage)
  const [slideAudioURLs, setSlideAudioURLs] = useState({}); // { index: blobURL } for playback + local storage
  const [slideAudioBlobs, setSlideAudioBlobs] = useState({}); // { index: Blob } for upload
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  console.log(slides, "slide");
  // Uploaded main file (PDF/PPT) to also send with request
  const [uploadedMainFile, setUploadedMainFile] = useState(null);

  // Viewer states
  const [viewLecture, setViewLecture] = useState(null);
  useEffect(() => {
    console.log("VIEW LECTURE DATA 👉", viewLecture);
  }, [viewLecture]);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
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
    // Clean up old audio URLs when deleting a lecture
    if (lectures.length > list.length) {
      const deletedLecture = lectures.find(
        (lec) => !list.some((x) => x.id === lec.id)
      );
      if (deletedLecture) {
        Object.values(deletedLecture.slideAudio || {}).forEach((url) =>
          URL.revokeObjectURL(url)
        );
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
          Object.keys(b.slideAudio || {}).length -
          Object.keys(a.slideAudio || {}).length
        );
      return 0;
    });
    return list;
  }, [lectures, searchQuery, filterType]);

  // =================================
  // PDF & PPT UPLOAD HANDLER
  // =================================
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(5);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    setSlides([]);
    setSlideAudioURLs({});
    setSlideAudioBlobs({});
    setUploadedMainFile(null);

    const isAudio =
      file.type.startsWith("audio/") ||
      file.name.endsWith(".mp3") ||
      file.name.endsWith(".wav");

    // If it’s Audio file (main file), we store it as uploadedMainFile and return
    if (isAudio) {
      setUploadedMainFile(file);
      setUploadProgress(100);
      setIsUploading(false);
      e.target.value = null;
      return;
    }

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

      setSlides(imgs);
      setUploadedMainFile(processedFile);
      setUploadProgress(100);
    } catch (error) {
      console.error("Error processing PDF:", error);
    } finally {
      e.target.value = null;
      setTimeout(() => setIsUploading(false), 700);
    }
  };

  // =================================
  // UPLOAD HELPERS
  // =================================
  // Convert stored slides (data URLs) -> File objects
  const slidesDataURLsToFiles = (slidesArray) => {
    return slidesArray.map((dataUrl, i) => {
      const blob = dataURLToBlob(dataUrl);
      const ext = blob.type.split("/")[1] || "png";
      return new File([blob], `slide_${i + 1}.${ext}`, { type: blob.type });
    });
  };

  // Build audio files array and slideAudioMapping by computing durations
  const buildAudioFilesAndMapping = async (audioBlobsMap) => {
    const entries = Object.entries(audioBlobsMap)
      .map(([k, v]) => [Number(k), v])
      .sort((a, b) => a[0] - b[0]);

    const audioFiles = [];
    const mapping = {};
    let cumulative = 0;

    for (let i = 0; i < entries.length; i++) {
      const [index, blob] = entries[i];
      const duration = await getAudioDuration(blob); // seconds
      mapping[index] = Math.round(cumulative); // start time in seconds (rounded)
      cumulative += duration;
      const file = new File([blob], `audio_slide_${index}.webm`, {
        type: blob.type || "audio/webm",
      });
      audioFiles.push(file);
    }

    return { audioFiles, mapping };
  };

  // =================================
  // UPLOAD FUNCTION (Updated)
  // =================================
  const uploadRecordedLectureData = async () => {
    if (!title || !description || slides.length === 0) {
      alert("Please provide title, description and upload slides.");
      return false;
    }

    setIsUploading(true);
    setUploadProgress(2);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      // 1. Append Slides (Multiple Files)
      const slideFiles = slidesDataURLsToFiles(slides);
      slideFiles.forEach((f) => {
        formData.append("slides", f);
      });

      // 2. Prepare Audio (Merge into ONE file + Create Mapping)
      const hasAudio = Object.keys(slideAudioBlobs).length > 0;

      if (hasAudio) {
        setUploadProgress(10);

        // Sort audio blobs by slide index
        const sortedEntries = Object.entries(slideAudioBlobs)
          .map(([k, v]) => [Number(k), v])
          .sort((a, b) => a[0] - b[0]);

        const sortedBlobs = [];
        const mapping = {};
        let cumulativeTime = 0;

        // Calculate timestamps and collect blobs
        for (const [index, blob] of sortedEntries) {
          // We map the Slide Index to the Current Timestamp
          mapping[index] = Number(cumulativeTime.toFixed(2));

          const duration = await getAudioDuration(blob);
          cumulativeTime += duration;
          sortedBlobs.push(blob);
        }

        // MERGE blobs into single WAV file
        setUploadProgress(20);
        const mergedAudioBlob = await mergeAudioBlobs(sortedBlobs);
        const mergedAudioFile = new File(
          [mergedAudioBlob],
          "lecture_audio.wav",
          { type: "audio/wav" }
        );

        // Append Single Audio File
        formData.append("audio", mergedAudioFile);

        // Append Mapping JSON
        formData.append("slideAudioMapping", JSON.stringify(mapping));
      } else {
        // Handle case with no audio (if allowed by backend, though backend usually requires audio)
        // You might need a dummy empty audio file if backend validation is strict
        formData.append("slideAudioMapping", JSON.stringify({}));
      }

      setUploadProgress(50);

      // 3. Send Request
      const response = await uploadRecordedLecture(formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          // Scale progress from 50% to 100%
          const percent = Math.round((p.loaded / p.total) * 50) + 50;
          setUploadProgress(percent);
        },
      });

      // 4. Save to Local Storage (Optional Backup)
      const newLecture = {
        id: Date.now(),
        title,
        description,
        slides,
        slideAudio: { ...slideAudioURLs },
        created: Date.now(),
        remoteId: response?.data?.contentId ?? null, // Capture backend ID
      };

      const updated = [
        ...lectures.filter((lec) => lec.id !== viewLecture?.id),
        newLecture,
      ];
      saveLectures(updated);

      // 5. Reset UI
      setMode("list");
      setSlides([]);
      Object.values(slideAudioURLs).forEach((u) => URL.revokeObjectURL(u));
      setSlideAudioURLs({});
      setSlideAudioBlobs({});
      setTitle("");
      setDescription("");
      setSelectedSlideIndex(0);
      setViewLecture(null);
      setUploadedMainFile(null);

      setUploadProgress(100);
      setTimeout(() => setIsUploading(false), 600);
      return true;
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${err.response?.data?.message || err.message}`);
      setIsUploading(false);
      setUploadProgress(0);
      return false;
    }
  };

  // =================================
  // RECORDING HANDLERS
  // =================================
  const stopMediaStream = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);
    setIsPaused(false);
    mediaStreamRef.current = null;
  };

  const startRecording = async () => {
    try {
      // Revoke existing audio URL for the current slide before recording
      if (slideAudioURLs[selectedSlideIndex]) {
        URL.revokeObjectURL(slideAudioURLs[selectedSlideIndex]);
        setSlideAudioURLs((prev) => {
          const copy = { ...prev };
          delete copy[selectedSlideIndex];
          return copy;
        });
        setSlideAudioBlobs((prev) => {
          const copy = { ...prev };
          delete copy[selectedSlideIndex];
          return copy;
        });
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunks.current.length === 0) {
          stopMediaStream(stream);
          return;
        }
        const blob = new Blob(audioChunks.current, {
          type: mediaRecorderRef.current.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);

        // Store both Blob (for upload) and URL (for playback & local saving)
        setSlideAudioBlobs((prev) => ({
          ...prev,
          [selectedSlideIndex]: blob,
        }));

        setSlideAudioURLs((prev) => ({
          ...prev,
          [selectedSlideIndex]: url,
        }));

        stopMediaStream(stream);
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
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  // If user changes slide while recording, auto-stop current recording
  useEffect(() => {
    if (isRecording && mediaRecorderRef.current) {
      // stop current recording to save the chunk for previous slide
      stopRecording();
      alert(
        `Recording for Slide ${selectedSlideIndex} saved. Start new recording for Slide ${selectedSlideIndex + 1
        }.`
      );
    }
    // Reload player in viewer if present
    const audioEl = document.getElementById("viewer-audio");
    if (audioEl) {
      audioEl.load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlideIndex]);

  const getListOfLectures = async () => {
    try {
      const response = await getListOfRecordedLecture();
      setLectures(response.data.contents);
    } catch (error) { }
  };

  const updatesRecordedLecture = async (id, data) => {
    try {
      await updateRecordedLecture(id, data);
    } catch (error) { }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecordedLecture(id);
      await getListOfLectures();
    } catch (error) { }
  };

  const handleEdit = (lec) => {
    setLectureData({
      title: lec.title,
      description: lec.description,
      id: lec.id,
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateRecordedLecture(id, lectureData);
      await getListOfLectures();
      setEditCourse(false); // close popup
    } catch (err) { }
  };

  useEffect(() => {
    getListOfLectures();
  }, []);

  useEffect(() => {
    if (audioRef.current && viewLecture?.slideAudioMapping) {
      const time = viewLecture.slideAudioMapping[selectedSlideIndex];

      if (time !== undefined) {
        audioRef.current.currentTime = time;
        audioRef.current.play();
      }
    }
  }, [selectedSlideIndex, viewLecture]);
  // =================================
  // MAIN RENDER
  // =================================
  return (
    <div className="min-h-screen bg-slate-50">
      <GlobalStyle />

      {/* ================================
          LECTURE STUDIO (mode === "studio")
        ================================ */}
      {mode === "studio" && (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <button
            onClick={() => {
              stopMediaStream(mediaStreamRef.current);
              setMode("list");
              setSlides([]);
              Object.values(slideAudioURLs).forEach((u) => URL.revokeObjectURL(u));
              setSlideAudioURLs({});
              setSlideAudioBlobs({});
              setTitle("");
              setDescription("");
              setSelectedSlideIndex(0);
            }}
            className="flex items-center gap-2 text-purple-600 hover:text-indigo-700 transition-colors font-medium mb-6"
          >
            <FiArrowLeft /> Back to List
          </button>

          <header className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Lecture Studio
            </h2>
            <p className="text-slate-500 mt-2">Design and record your presentation</p>
          </header>

          {/* INPUT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-4">
              <input
                type="text"
                placeholder="Enter lecture title"
                className="w-full p-4 text-xl font-semibold rounded-2xl border border-purple-100 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Enter lecture description..."
                className="w-full p-4 rounded-2xl border border-purple-100 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* UPLOAD DROPZONE */}
            {slides.length === 0 && (
              <label className="block h-full">
                <div className="h-full flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-500 transition-all cursor-pointer group">
                  <div className="p-4 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform mb-4">
                    <FiUpload className="text-3xl text-purple-600" />
                  </div>
                  <p className="text-purple-900 font-bold text-lg">Upload Media</p>
                  <p className="text-xs text-purple-400 mt-1 uppercase tracking-wider">PDF, PPT, PPTX</p>
                </div>
                <input type="file" accept=".pdf,.ppt,.pptx,.mp3,.wav" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* UPLOAD PROGRESS */}
          {isUploading && (
            <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm border border-purple-100">
              <div className="flex justify-between text-xs font-bold text-purple-600 mb-2 uppercase tracking-widest">
                <span>Uploading Content</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                />
              </div>
            </div>
          )}

          {/* WORKSPACE GRID */}
          {slides.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* LEFT PANEL — SLIDE LIST */}
              <div className="w-full lg:w-64 order-2 lg:order-1">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white p-4 shadow-xl max-h-[600px] overflow-y-auto">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
                    Slides ({slides.length})
                  </h3>
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                    {slides.map((slide, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedSlideIndex(index)}
                        className={`relative group rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedSlideIndex === index ? "border-purple-600 ring-4 ring-purple-100" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                      >
                        <img src={slide} className="w-full aspect-video object-cover bg-white" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-1 text-[10px] text-white text-center">
                          {slideAudioURLs[index] ? "🎤 Recorded" : "No Audio"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL — PREVIEW + RECORDING */}
              <div className="flex-1 order-1 lg:order-2 space-y-6">
                <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-slate-900/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    {selectedSlideIndex + 1} / {slides.length}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedSlideIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      src={slides[selectedSlideIndex]}
                      className="w-full h-auto max-h-[500px] object-contain rounded-xl"
                    />
                  </AnimatePresence>

                  {/* RECORDING CONTROLS */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        disabled={isUploading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg shadow-purple-200 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <FiMic className="text-xl" /> Start Recording
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={isPaused ? resumeRecording : pauseRecording}
                          className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${isPaused ? "bg-blue-600 text-white shadow-blue-200 shadow-lg" : "bg-amber-500 text-white shadow-amber-200 shadow-lg"
                            }`}
                        >
                          {isPaused ? <FiMic /> : <FiPause />} {isPaused ? "Resume" : "Pause"}
                        </button>
                        <button
                          onClick={stopRecording}
                          className="bg-rose-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-rose-200 shadow-lg transition-all"
                        >
                          <FiStopCircle className="text-xl" /> Finish
                        </button>
                      </>
                    )}
                  </div>

                  {/* AUDIO PLAYER */}
                  {slideAudioURLs[selectedSlideIndex] && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">Review Slide Audio</span>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this recording?")) {
                              URL.revokeObjectURL(slideAudioURLs[selectedSlideIndex]);
                              setSlideAudioURLs((p) => { const n = { ...p }; delete n[selectedSlideIndex]; return n; });
                              setSlideAudioBlobs((p) => { const n = { ...p }; delete n[selectedSlideIndex]; return n; });
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                      <audio controls key={selectedSlideIndex} className="w-full h-10 accent-purple-600">
                        <source src={slideAudioURLs[selectedSlideIndex]} type="audio/webm" />
                      </audio>
                    </div>
                  )}
                </div>

                {/* PUBLISH SECTION */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={async () => {
                      stopMediaStream(mediaStreamRef.current);
                      const slidesWithAudio = Object.keys(slideAudioBlobs).length;
                      if (slidesWithAudio < slides.length && !window.confirm(`Only ${slidesWithAudio}/${slides.length} slides voiced. Publish?`)) return;
                      if (isUploading) return;
                      await uploadRecordedLectureData();
                    }}
                    disabled={isUploading}
                    className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl text-lg font-extrabold shadow-xl hover:shadow-purple-200 transition-all disabled:opacity-50"
                  >
                    {viewLecture ? "Update Lecture" : "Publish Lecture"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================
          LECTURE LIST PAGE (mode === "list")
        ================================ */}
      {mode === "list" && (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">My Lectures</h2>
              <p className="text-slate-500 mt-1">Manage and view your recorded content</p>
            </div>
            <button
              onClick={() => {
                setMode("studio");
                setViewLecture(null);
                setSlides([]);
                Object.values(slideAudioURLs).forEach((u) => URL.revokeObjectURL(u));
                setSlideAudioURLs({});
                setSlideAudioBlobs({});
                setTitle("");
                setDescription("");
                setSelectedSlideIndex(0);
                setUploadedMainFile(null);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
            >
              <FiPlus className="text-xl" /> Create New
            </button>
          </header>

          {/* SEARCH + FILTER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search by title..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="w-full px-4 py-3 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm font-medium text-slate-700"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="recent">Recently Created</option>
              <option value="az">A–Z Alphabetical</option>
              <option value="slides">Most Slides</option>
            </select>
          </div>

          {/* LECTURE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLectures.map((lec) => (
              <motion.div
                key={lec.id}
                layout
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={lec.slides[0] || "/no-preview.png"}
                    onClick={() => { setViewLecture(lec); setSelectedSlideIndex(0); setMode("viewer"); }}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-purple-600 shadow-sm uppercase tracking-wider">
                    {lec.slides?.length || 0} Slides
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1">{lec.title}</h3>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSlides(lec.slides);
                          setSlideAudioURLs(lec.slideAudio || {});
                          setSlideAudioBlobs({});
                          setTitle(lec.title);
                          setDescription(lec.description || "");
                          setSelectedSlideIndex(0);
                          setViewLecture(lec);
                          handleEdit(lec);
                          setEditCourse(true);
                        }}
                        className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lec.id)}
                        className="flex items-center gap-1.5 text-sm font-bold text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLectures.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No results match your search</p>
            </div>
          )}
        </div>
      )}

      {/* ================================
          FULL VIEWER (mode === "viewer")
        ================================ */}
      {mode === "viewer" && viewLecture && (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
          <nav className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
            <button onClick={() => setMode("list")} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <FiArrowLeft /> <span className="hidden md:inline">Exit Viewer</span>
            </button>
            <h2 className="font-bold truncate px-4">{viewLecture.title}</h2>
            <div className="text-xs font-mono text-slate-400">{selectedSlideIndex + 1} / {viewLecture.slides.length}</div>
          </nav>

          <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-10 gap-8">
            <button
              onClick={() => setSelectedSlideIndex((prev) => prev - 1)}
              disabled={selectedSlideIndex === 0}
              className="hidden md:flex p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-0 transition-all"
            >
              <FiChevronLeft size={32} />
            </button>

            <div className="flex-1 max-w-5xl w-full">
              <motion.img
                key={selectedSlideIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                src={
                  typeof viewLecture.slides?.[selectedSlideIndex] === "string"
                    ? viewLecture.slides[selectedSlideIndex]
                    : viewLecture.slides?.[selectedSlideIndex]?.url || ""
                }
                className="w-full h-auto max-h-[75vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
              />

              <div className="mt-8 max-w-2xl mx-auto">
                {(viewLecture.audio?.url || viewLecture.slideAudio?.[selectedSlideIndex]) ? (
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5">
                    <audio
                      ref={audioRef}
                      controls
                      className="w-full invert opacity-80"
                    >
                      <source
                        src={
                          viewLecture.audio?.url ||
                          viewLecture.slideAudio?.[selectedSlideIndex]
                        }
                        type="audio/wav"
                      />
                    </audio>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 italic py-4">
                    No audio for this slide
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedSlideIndex((prev) => prev + 1)}
              disabled={selectedSlideIndex === viewLecture.slides.length - 1}
              className="hidden md:flex p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-0 transition-all"
            >
              <FiChevronRight size={32} />
            </button>
          </main>

          <footer className="fixed bottom-0 left-0 w-full md:hidden grid grid-cols-2 p-4 gap-4 bg-slate-800 z-50">
            <button onClick={() => setSelectedSlideIndex(p => p - 1)} disabled={selectedSlideIndex === 0} className="py-3 rounded-xl bg-white/10 flex justify-center"><FiChevronLeft /></button>
            <button onClick={() => setSelectedSlideIndex(p => p + 1)} disabled={selectedSlideIndex === viewLecture.slides.length - 1} className="py-3 rounded-xl bg-white/10 flex justify-center"><FiChevronRight /></button>
          </footer>
        </div>
      )}

      {/* MODAL FOR EDIT COURSE */}
      {editCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Update Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-1 block">Course Name</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={lectureData?.title}
                  onChange={(e) => setLectureData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-1 block">Description</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  rows="4"
                  value={lectureData?.description}
                  onChange={(e) => setLectureData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditCourse(false)} className="flex-1 px-4 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => saveEdit(lectureData.id)} className="flex-1 px-4 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all">Save Changes</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};