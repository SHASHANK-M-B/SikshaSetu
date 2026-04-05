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
import LoadingScreen from "@/components/ui/LoadingScreen";

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
// HELPER: Voice Visualizer Component
// =============================
const VoiceVisualizer = ({ stream, isRecording }) => {
  const [volume, setVolume] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    if (!isRecording || !stream) {
      setVolume(0);
      return;
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
      setVolume(average);
      rafRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [stream, isRecording]);

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mt-2 relative">
      <motion.div
        className="h-full bg-gradient-to-r from-green-400 to-green-600"
        initial={{ width: "0%" }}
        animate={{ width: `${Math.min(volume * 1.5, 100)}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-600">
        RECOGNIZING VOICE...
      </div>
    </div>
  );
};

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
  console.log(viewLecture, "view");

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
  const [loading, setLoading] = useState(false);

  // Refs for Viewer Sync
  const viewerAudioRef = useRef(null);
  const isAutoSwitching = useRef(false);

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
    if (!title || slides.length === 0) {
      alert("Please provide a title and upload slides before publishing.");
      return false;
    }

    setIsUploading(true);
    setUploadProgress(2);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description || "");

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

      // Try multiple MIME types for better compatibility
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "",
      ];
      let selectedMime = "";
      for (const mime of mimeTypes) {
        if (mime === "" || MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      mediaRecorderRef.current = new MediaRecorder(
        stream,
        selectedMime ? { mimeType: selectedMime } : {}
      );
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
        `Recording for Slide ${selectedSlideIndex} saved. Start new recording for Slide ${
          selectedSlideIndex + 1
        }.`
      );
    }
    // Reload player in viewer if present
    const audioEl = document.getElementById("viewer-audio");
    if (audioEl) {
      audioEl.load();
    }
  }, [selectedSlideIndex]);

  // =================================
  // VIEWER SYNC LOGIC
  // =================================
  useEffect(() => {
    if (mode === "viewer" && viewLecture && viewerAudioRef.current) {
      const audio = viewerAudioRef.current;
      const mapping = viewLecture.slideAudioMapping || {};

      const handleTimeUpdate = () => {
        if (isAutoSwitching.current) return;

        const currentTime = audio.currentTime;
        const entries = Object.entries(mapping)
          .map(([idx, time]) => ({ idx: parseInt(idx), time }))
          .sort((a, b) => a.time - b.time);

        // Find the slide that should be active at this time
        let correctSlideIdx = 0;
        for (let i = entries.length - 1; i >= 0; i--) {
          if (currentTime >= entries[i].time) {
            correctSlideIdx = entries[i].idx;
            break;
          }
        }

        if (correctSlideIdx !== selectedSlideIndex) {
          isAutoSwitching.current = true;
          setSelectedSlideIndex(correctSlideIdx);
          // Reset flag after a small delay to prevent loops
          setTimeout(() => {
            isAutoSwitching.current = false;
          }, 100);
        }
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, [mode, viewLecture, selectedSlideIndex]);

  // Seek audio when slide is manually changed in viewer
  useEffect(() => {
    if (
      mode === "viewer" &&
      viewLecture &&
      viewerAudioRef.current &&
      !isAutoSwitching.current
    ) {
      const mapping = viewLecture.slideAudioMapping || {};
      const startTime = mapping[selectedSlideIndex];
      if (startTime !== undefined) {
        viewerAudioRef.current.currentTime = startTime;
      }
    }
  }, [selectedSlideIndex, mode, viewLecture]);

  const getListOfLectures = async () => {
    setLoading(true);
    try {
      const response = await getListOfRecordedLecture();
      setLectures(response.data.contents);
    } catch (error) {
      console.error("Failed to fetch recorded lectures:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatesRecordedLecture = async (id, data) => {
    try {
      await updateRecordedLecture(id, data);
    } catch (error) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this recorded lecture? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteRecordedLecture(id);
      await getListOfLectures();
      alert("Recorded lecture deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete the lecture. Please try again.");
    }
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
    } catch (err) {}
  };

  useEffect(() => {
    getListOfLectures();
  }, []);

  // =================================
  // MAIN RENDER
  // =================================
  return (
    <div className="min-h-screen">
      {loading && <LoadingScreen message="Fetching Recorded Lectures" />}
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
              // revoke created audio URLs to free memory
              Object.values(slideAudioURLs).forEach((u) =>
                URL.revokeObjectURL(u)
              );
              setSlideAudioURLs({});
              setSlideAudioBlobs({});
              setTitle("");
              setDescription("");
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
            required
            placeholder="Enter lecture title *"
            className="w-full mt-4 p-3 text-lg rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description (optional)"
            className="w-full mt-3 p-2 rounded-lg border border-purple-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* UPLOAD DROPZONE */}
          {slides.length === 0 && (
            <label className="mt-5 block">
              <div
                className={`${glass} p-10 text-center rounded-2xl cursor-pointer border-2 border-dashed border-purple-300 hover:border-purple-500 transition`}
              >
                <FiUpload className="text-4xl mx-auto text-purple-600 mb-3" />
                <p className="text-purple-700 text-lg">
                  Upload PDF / PPT / PPTX
                </p>
                <p className="text-xs mt-1 text-purple-400">
                  Supported: .pdf, .ppt, .pptx
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.mp3,.wav"
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
                    className={`rounded-xl p-1 mb-3 cursor-pointer border-2 ${
                      selectedSlideIndex === index
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
                      {slideAudioURLs[index] ? (
                        <span className="text-green-600 font-semibold">
                          🎤 Audio Added
                        </span>
                      ) : (
                        <span className="text-gray-400">No Audio</span>
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
                      disabled={isUploading}
                    >
                      <FiMic /> Start Recording
                    </button>
                  )}

                  {/* PAUSE / RESUME BUTTON */}
                  {isRecording && (
                    <button
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      className={`px-6 py-3 rounded-xl flex items-center gap-2 ${
                        isPaused
                          ? "bg-blue-600 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {isPaused ? <FiMic /> : <FiPause />}{" "}
                      {isPaused ? "Resume" : "Pause"}
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

                {/* VOICE VISUALIZER */}
                <div className="mt-2 max-w-sm mx-auto">
                  <VoiceVisualizer
                    stream={mediaStreamRef.current}
                    isRecording={isRecording}
                  />
                </div>

                {/* SLIDE AUDIO PLAYER */}
                {slideAudioURLs[selectedSlideIndex] && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-sm text-green-700 font-medium mb-2">
                      Review Audio:
                    </p>
                    <audio
                      controls
                      key={selectedSlideIndex}
                      className="w-full rounded-xl shadow-lg"
                    >
                      <source
                        src={slideAudioURLs[selectedSlideIndex]}
                        type="audio/webm"
                      />
                    </audio>
                    {/* Advanced Feature: Delete Audio Button */}
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this audio recording?"
                          )
                        ) {
                          URL.revokeObjectURL(
                            slideAudioURLs[selectedSlideIndex]
                          );
                          setSlideAudioURLs((prev) => {
                            const newAudio = { ...prev };
                            delete newAudio[selectedSlideIndex];
                            return newAudio;
                          });
                          setSlideAudioBlobs((prev) => {
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
                onClick={async () => {
                  // stop any active microphone stream
                  stopMediaStream(mediaStreamRef.current);

                  // Check audio count vs slides count
                  const slidesWithAudio = Object.keys(slideAudioBlobs).length;
                  if (
                    slidesWithAudio < slides.length &&
                    !window.confirm(
                      `Only ${slidesWithAudio} of ${slides.length} slides have audio. Publish anyway?`
                    )
                  ) {
                    return;
                  }

                  // Upload to server
                  if (isUploading) return;
                  const success = await uploadRecordedLectureData();
                  if (!success) return;

                  // UI reset handled inside uploadRecordedLectureData
                }}
                className={`${purpleButton} px-7 py-3 rounded-xl text-lg`}
                disabled={isUploading}
              >
                {viewLecture ? "Update Lecture" : "Publish Lecture"}
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
                // Reset studio state
                setSlides([]);
                Object.values(slideAudioURLs).forEach((u) =>
                  URL.revokeObjectURL(u)
                );
                setSlideAudioURLs({});
                setSlideAudioBlobs({});
                setTitle("");
                setDescription("");
                setSelectedSlideIndex(0);
                setUploadedMainFile(null);
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
                  src={lec.slides[0].url}
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

                  {/* Slide Count */}
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>{lec.slides?.length || 0}</strong> slides ·{" "}
                    <strong>
                      {Array.isArray(lec?.audio)
                        ? lec.audio.length
                        : lec?.audio
                        ? 1
                        : 0}
                    </strong>{" "}
                    voiced
                  </p>

                  {/* Slide List */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lec.slides?.map((slide, index) => (
                      <a
                        key={index}
                        href={slide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs hover:text-blue-800"
                      >
                        Slide {index + 1}
                      </a>
                    )) || <span className="text-gray-500">No slides</span>}
                  </div>

                  {/* Audio */}
                  <p className="text-sm text-gray-700 mt-1">
                    🎧{" "}
                    {lec.audio?.url ? (
                      <a
                        href={lec.audio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {lec.audio.filename || "Audio File"}
                      </a>
                    ) : (
                      "No audio"
                    )}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex justify-between mt-3 border-t pt-3 border-purple-200">
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        // Load existing data into studio states
                        setSlides(lec);
                        setSlideAudioURLs(lec.slideAudio || {});
                        // NOTE: We don't have blobs for local lectures (they came from localStorage).
                        // If user edits and records again, new blobs will be created for those slides.
                        setSlideAudioBlobs({});
                        setTitle(lec.title);
                        setDescription(lec.description || "");
                        setSelectedSlideIndex(0);

                        // Crucial: Set the lecture being edited for update logic
                        setViewLecture(lec);

                        // Switch mode to studio

                        handleEdit(lec);
                        setEditCourse(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <FiEdit size={16} /> Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(lec.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredLectures.length === 0 && (
              <p className="mt-8 text-purple-700 text-lg col-span-full">
                No lectures found. Create one!
              </p>
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

  {/* TITLE */}
  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent mb-3">
    {viewLecture.title}
  </h2>

  {/* DESCRIPTION */}
  {viewLecture.description && (
    <p className="text-gray-700 mb-6">{viewLecture.description}</p>
  )}

  {/* META INFO */}
  <div className="bg-white/70 p-4 rounded-xl shadow border text-sm text-gray-800 mb-6">
    <div><strong>ID:</strong> {viewLecture.id}</div>
    <div><strong>Content ID:</strong> {viewLecture.contentId}</div>
    <div><strong>Teacher ID:</strong> {viewLecture.teacherId}</div>
    <div><strong>Organization ID:</strong> {viewLecture.orgId}</div>

    {viewLecture.duration && (
      <div><strong>Duration:</strong> {viewLecture.duration} sec</div>
    )}

    {viewLecture.createdAt?._seconds && (
      <div>
        <strong>Created At:</strong>{" "}
        {new Date(viewLecture.createdAt._seconds * 1000).toLocaleString()}
      </div>
    )}

    {viewLecture.updatedAt?._seconds && (
      <div>
        <strong>Updated At:</strong>{" "}
        {new Date(viewLecture.updatedAt._seconds * 1000).toLocaleString()}
      </div>
    )}

    {/* Slide Count */}
    <div>
      <strong>Total Slides:</strong> {viewLecture.slides?.length || 0}
    </div>

    {/* Slides with audio count */}
    <div>
      <strong>Slides with Audio:</strong>{" "}
      {viewLecture.slideAudioMapping
        ? Object.keys(viewLecture.slideAudioMapping).length
        : 0}
    </div>

    {/* Audio Info */}
    {viewLecture.audio && (
      <>
        <div><strong>Audio Filename:</strong> {viewLecture.audio.filename}</div>
        <div>
          <strong>Size:</strong>{" "}
          {(viewLecture.audio.size / (1024 * 1024)).toFixed(2)} MB
        </div>
      </>
    )}
  </div>

  {/* SLIDE VIEWER */}
  <div className="bg-white/80 rounded-2xl p-6 shadow-2xl border border-white/90">
    <div className="flex items-center justify-between gap-4">

      {/* LEFT ARROW */}
      <button
        onClick={() => setSelectedSlideIndex((prev) => prev - 1)}
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
          setSelectedSlideIndex((prev) => prev + 1)
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
    {viewLecture.slideAudioMapping?.[selectedSlideIndex] !== undefined ? (
      <audio
        ref={viewerAudioRef}
        controls
        className="w-full mt-4 rounded-lg"
        id="viewer-audio"
      >
        <source src={viewLecture.audio?.url} type="audio/wav" />
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
      {editCourse && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">
            <h2 className="text-lg font-bold mb-3">Edit Course</h2>

            <label className="text-sm font-semibold">Lecture Title <span className="text-red-500">*</span></label>
            <input
              className="border rounded-lg w-full px-3 py-2 mb-3"
              value={lectureData?.title}
              onChange={(e) =>
                setLectureData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <label className="text-sm font-semibold">Short Description</label>
            <textarea
              className="border rounded-lg w-full px-3 py-2 mb-3"
              rows="3"
              value={lectureData?.description}
              onChange={(e) =>
                setLectureData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditCourse(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEdit(lectureData.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
