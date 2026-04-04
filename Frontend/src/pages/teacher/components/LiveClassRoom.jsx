// teacher/LiveClassRoom.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMic,
  FiStopCircle,
  FiUpload,
  FiPlay,
  FiFileText,
  FiCheckCircle,
  FiThumbsUp,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiMessageSquare,
  FiSend,
  FiMicOff,
  FiRotateCcw, // Undo Icon
  FiTrash2, // Clear Icon
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import {
  scheduleLiveClass,
  getLiveSessions,
  startLiveSession,
  endLiveSession,
  deleteLiveSession,
  uploadSessionMaterial,
  uploadSlides,
  getUnderstoodCount,
  getSessionChat,
} from "@/api/teacher";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// --- CONSTANTS AND UTILS ---
// Hardcoded for Production Deployment
const SOCKET_URL =
  "http://localhost:8928/live-session";
// const SOCKET_URL =
//   "https://sikshasetu-backend-1030932275340.asia-south1.run.app/live-session";

const fmt = (s) => new Date(s * 1000).toISOString().substr(11, 8);
const uid = () => Math.random().toString(36).slice(2, 9);
const TEACHER_ID = "TEACHER_ID_HERE";
const TEACHER_NAME = "Teacher";

// =============================
// HELPER: Voice Visualizer Component (Google Meet Style)
// =============================
const VoiceVisualizer = ({ stream, isActive }) => {
  const [level, setLevel] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    if (!isActive || !stream) {
      setLevel(0);
      return;
    }

    let audioContext;
    let analyser;
    let source;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        // Get average volume
        const average = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
        // Map 0-255 to 0-100, adding some sensitivity
        const normalized = Math.min((average / 128) * 100, 100);
        setLevel(normalized);
        rafRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.error("Audio visualizer error:", err);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [stream, isActive]);

  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3 relative">
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400"
        animate={{ 
          width: `${isActive ? level : 0}%`,
          opacity: isActive ? 1 : 0 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          opacity: { duration: 0.2 }
        }}
      />
      {isActive && level > 5 && (
        <motion.div 
          className="absolute inset-0 bg-white/20"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default function LiveClassRoom() {
  // --- STATES ---
  const [mode, setMode] = useState("list");
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Schedule Form
  const [formData, setFormData] = useState({
    sessionTitle: "",
    shortDescription: "",
    sessionHeading: "",
    date: "",
    time: "",
  });

  // Presenter State
  const [slidesDeck, setSlidesDeck] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [timer, setTimer] = useState(0);

  // Real-time Data
  const [reactionCounts, setReactionCounts] = useState({ understood: 0 });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // --- REFS ---
  const strokesRef = useRef([]);
  const socketRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const canvasRef = useRef(null);
  const canvasContextRef = useRef(null);

  // Annotation Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef(null);
  const drawingSettings = useRef({
    color: "#FF0000",
    lineWidth: 5,
  });

  // Latest state refs to avoid stale closures in socket listeners
  const slideIndexRef = useRef(0);
  const slidesDeckRef = useRef([]);
  useEffect(() => { slideIndexRef.current = slideIndex; }, [slideIndex]);
  useEffect(() => { slidesDeckRef.current = slidesDeck; }, [slidesDeck]);

  // History for Undo
  const currentStrokeRef = useRef([]); // Stores the stroke currently being drawn

  // --- INITIAL LOAD ---
  const fetchSessions = async () => {
    try {
      const { data } = await getLiveSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // --- CANVAS SETUP ---
  const resizeCanvas = useCallback(() => {
    if (canvasRef.current && canvasRef.current.parentElement) {
      // Set canvas size to match visual size for sharp drawing
      const parent = canvasRef.current.parentElement;
      canvasRef.current.width = parent.clientWidth;
      canvasRef.current.height = parent.clientHeight;

      canvasContextRef.current = canvasRef.current.getContext("2d");
      const ctx = canvasContextRef.current;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = drawingSettings.current.lineWidth;
      ctx.strokeStyle = drawingSettings.current.color;
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [mode, slidesDeck, slideIndex, resizeCanvas]);

  // --- TIMER EFFECT ---
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // --- WEBRTC AND SOCKET LOGIC ---
  const handleIceCandidate = useCallback(
    (candidate, targetSocketId) => {
      if (candidate) {
        socketRef.current.emit("webrtc-ice-candidate", {
          sessionId: currentSession.sessionId,
          candidate,
          targetSocketId,
        });
      }
    },
    [currentSession]
  );

  const createPeerConnection = useCallback(
    (studentSocketId) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        handleIceCandidate(event.candidate, studentSocketId);
      };

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) => pc.addTrack(track, mediaStreamRef.current));
      }

      peerConnectionsRef.current.set(studentSocketId, pc);
      return pc;
    },
    [handleIceCandidate]
  );

  // --- CORE SOCKET CONNECTION ---
  useEffect(() => {
    if ((mode === "prep" || mode === "live") && currentSession) {
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected to Live Session Socket");
        socket.emit("join-session", {
          sessionId: currentSession.sessionId,
          userId: TEACHER_ID,
          userName: TEACHER_NAME,
          role: "teacher",
        });
      });

      socket.on("chat-message", (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });

      socket.on("understood-count-updated", (data) => {
        setReactionCounts((prev) => ({
          ...prev,
          understood: data.understoodCount,
        }));
      });

      socket.on("student-requesting-stream", async ({ studentSocketId }) => {
        if (!isLive) return;
        const pc = createPeerConnection(studentSocketId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("webrtc-offer", {
          sessionId: currentSession.sessionId,
          offer: pc.localDescription,
          targetSocketId: studentSocketId,
        });
      });

      socket.on("webrtc-answer", async ({ answer, fromSocketId }) => {
        const pc = peerConnectionsRef.current.get(fromSocketId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("webrtc-ice-candidate", async ({ candidate, fromSocketId }) => {
        const pc = peerConnectionsRef.current.get(fromSocketId);
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      // FIX 4: When backend signals a student needs re-sync, 
      // re-broadcast the current slide to everyone in the room
      socket.on("request-slide-sync", (data) => {
        if (!isLive) return;
        console.log("[Sync] Received re-sync request from student:", data?.requestedBy);
        
        const currentIndex = slideIndexRef.current;
        const currentSlides = slidesDeckRef.current;

        if (currentSlides[currentIndex]) {
          console.log(`[Sync] Re-broadcasting slide ${currentIndex}`);
          socket.emit("change-slide", {
            sessionId: currentSession.sessionId,
            slideIndex: currentIndex,
            slideImage: currentSlides[currentIndex].imageUrl,
          });
        }
      });

      return () => {
        if (socket) socket.disconnect();
        peerConnectionsRef.current.forEach((pc) => pc.close());
        peerConnectionsRef.current.clear();
        stopMicrophone();
      };
    }
  }, [mode, currentSession, isLive, createPeerConnection]); // Removed slideIndex/slidesDeck to prevent reconnection on every slide change

  // --- MICROPHONE LOGIC ---
  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setIsMuted(false);

      peerConnectionsRef.current.forEach(async (pc, studentSocketId) => {
        stream.getTracks().forEach((track) => {
          const senders = pc.getSenders();
          const alreadyHasTrack = senders.some(
            (sender) => sender.track === track
          );
          if (!alreadyHasTrack) {
            pc.addTrack(track, stream);
          }
        });

        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          if (socketRef.current) {
            socketRef.current.emit("webrtc-offer", {
              sessionId: currentSession.sessionId,
              offer: pc.localDescription,
              targetSocketId: studentSocketId,
            });
          }
        } catch (err) {
          console.error("Renegotiation failed:", err);
        }
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone.");
      setIsMuted(true);
    }
  };

  const stopMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsMuted(true);
  };

  const toggleMute = () => {
    if (isMuted) startMicrophone();
    else stopMicrophone();
  };

  const changeSlide = (newIndex) => {
    if (newIndex < 0 || newIndex >= slidesDeck.length) return;
    setSlideIndex(newIndex);

    // Reset canvas and history on slide change
    strokesRef.current = [];
    if (canvasContextRef.current) {
      canvasContextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    if (socketRef.current && isLive && currentSession?.sessionId) {
      const sessionId = currentSession.sessionId;
      console.log(`[Sync] Emitting change-slide for index ${newIndex} (Session: ${sessionId})`);
      socketRef.current.emit("change-slide", {
        sessionId: sessionId,
        slideIndex: newIndex,
        slideImage: slidesDeck[newIndex].imageUrl,
      });
    }
  };

  // --- ANNOTATION DRAWING LOGIC (NORMALIZED) ---
  const getNormalizedCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    // Return percentage (0.0 to 1.0) instead of pixels
    return { x: x / canvas.width, y: y / canvas.height };
  };

  const drawLine = useCallback(
    ({ fromX, fromY, toX, toY, color, lineWidth }) => {
      const ctx = canvasContextRef.current;
      if (!ctx) return;

      const w = canvasRef.current.width;
      const h = canvasRef.current.height;

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      // Use absolute pixels for local drawing (Percent * Width)
      ctx.moveTo(fromX * w, fromY * h);
      ctx.lineTo(toX * w, toY * h);
      ctx.stroke();
      ctx.closePath();
    },
    []
  );

  const startDrawing = (e) => {
    if (!isLive) return;
    const { x, y } = getNormalizedCoords(e);
    setIsDrawing(true);
    lastPointRef.current = { x, y };

    // Start tracking new stroke
    currentStrokeRef.current = [];
    if (socketRef.current) {
      socketRef.current.emit("start-stroke", {
        sessionId: currentSession.sessionId,
        slideIndex,
      });
    }
  };

  const drawing = (e) => {
    if (!isDrawing || !isLive) return;
    const { x: newX, y: newY } = getNormalizedCoords(e);
    const { x: lastX, y: lastY } = lastPointRef.current;
    const { color, lineWidth } = drawingSettings.current;

    const segment = {
      fromX: lastX,
      fromY: lastY,
      toX: newX,
      toY: newY,
      color,
      lineWidth,
    };

    drawLine(segment); // Draw locally
    currentStrokeRef.current.push(segment); // Save to history

    // Emit normalized data
    socketRef.current.emit("draw-annotation", {
      sessionId: currentSession.sessionId,
      slideIndex,
      data: segment,
    });

    lastPointRef.current = { x: newX, y: newY };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;

    // Save completed stroke
    if (currentStrokeRef.current.length > 0) {
      strokesRef.current.push([...currentStrokeRef.current]);
    }

    if (socketRef.current) {
      socketRef.current.emit("end-stroke", {
        sessionId: currentSession.sessionId,
        slideIndex,
      });
    }
  };

  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop(); // Remove last stroke

    // Redraw everything
    const ctx = canvasContextRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    strokesRef.current.forEach((stroke) => {
      stroke.forEach((segment) => drawLine(segment));
    });

    if (socketRef.current) {
      socketRef.current.emit("undo-annotation", {
        sessionId: currentSession.sessionId,
        slideIndex,
      });
    }
  };

  const handleClearCanvas = () => {
    strokesRef.current = [];
    const ctx = canvasContextRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (socketRef.current) {
      socketRef.current.emit("clear-canvas", {
        sessionId: currentSession.sessionId,
        slideIndex,
      });
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socketRef.current) return;
    socketRef.current.emit("send-chat-message", {
      sessionId: currentSession.sessionId,
      message: chatInput,
    });
    setChatInput("");
  };

  // --- API HANDLERS ---
  // const handleScheduleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     await scheduleLiveClass({ ...formData, courseId: null });
  //     alert("Class scheduled successfully!");
  //     setMode("list");
  //     fetchSessions();
  //     setFormData({
  //       sessionTitle: "",
  //       shortDescription: "",
  //       sessionHeading: "",
  //       date: "",
  //       time: "",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to schedule class");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleScheduleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // 1. Create a clean payload without courseId for now
  const payload = {
    sessionTitle: formData.sessionTitle,
    shortDescription: formData.shortDescription,
    sessionHeading: formData.sessionHeading,
    date: formData.date,
    time: formData.time,
  };

  try {
    // 2. Call the API with the clean payload
    await scheduleLiveClass(payload);

    alert("Class scheduled successfully!");
    setMode("list");
    fetchSessions();

    // 3. Reset form
    setFormData({
      sessionTitle: "",
      shortDescription: "",
      sessionHeading: "",
      date: "",
      time: "",
    });
  } catch (error) {
    // 4. Enhanced Logging: This tells you exactly what the backend didn't like
    const errorMessage = error.response?.data?.message || "Failed to schedule class";
    console.error("Schedule Error Details:", error.response?.data || error.message);
    
    alert(`Error: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};

  const handleEnterSession = async (session) => {
    setCurrentSession(session);
    try {
      const [countRes, chatRes] = await Promise.all([
        getUnderstoodCount(session.sessionId),
        getSessionChat(session.sessionId),
      ]);
      setReactionCounts({ understood: countRes.data.understoodCount || 0 });
      setChatMessages(chatRes.data.chat || []);
    } catch (e) {
      console.error("Failed to load session data", e);
    }
    setMode("prep");
  };

  const handleStartLive = async () => {
    if (!currentSession) return;
    
    // PHASE 4: Check if slides are uploaded before going live
    if (!slidesDeck || slidesDeck.length === 0) {
      alert("Please upload slides (PDF) before going live.");
      return;
    }

    try {
      setLoading(true);
      
      // Ensure microphone is ready
      await startMicrophone();
      
      // OPTIMIZATION: Don't send the large slide image again here.
      // It was already uploaded and stored in Firestore via uploadSlides().
      // This prevents PayloadTooLargeError and server crashes.
      const response = await startLiveSession(currentSession.sessionId, {
        currentSlideIndex: 0,
      });
      console.log("Session start response:", response);

      setIsLive(true);
      setMode("live");

      // Once live, sync the first slide to the socket
      if (slidesDeck.length > 0 && socketRef.current) {
        socketRef.current.emit("change-slide", {
          sessionId: currentSession.sessionId,
          slideIndex: 0,
          slideImage: slidesDeck[0].imageUrl,
        });
      }
    } catch (error) {
      console.error("Start live error details:", error);
      const serverMsg = error.response?.data?.message || error.message;
      const debugInfo = error.response?.data?.error ? `\n\nDebug: ${error.response.data.error}` : "";
      alert(`Failed to start session: ${serverMsg}${debugInfo}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEndLive = async () => {
    if (!window.confirm("Are you sure you want to end this session?")) return;
    try {
      setLoading(true);
      await endLiveSession(currentSession.sessionId);
      
      // Notify students via socket
      if (socketRef.current) {
        socketRef.current.emit("end-session", { sessionId: currentSession.sessionId });
      }

      stopMicrophone();
      setIsLive(false);
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      setMode("list");
      fetchSessions();
    } catch (error) {
      console.error("End live error:", error);
      alert("Failed to end session");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLiveSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to permanently delete this session? This action cannot be undone.")) return;
    try {
      setLoading(true);
      const res = await deleteLiveSession(sessionId);
      alert("Session deleted successfully");
      fetchSessions();
    } catch (error) {
      console.error("Delete session error:", error);
      const serverMsg = error.response?.data?.message || error.message;
      alert(`Failed to delete session: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentSession) return;

    if (file.type === "application/pdf") {
      await renderPdfLocally(file);
    }

    const formData = new FormData();
    formData.append("files", file);

    setUploading(true);
    let uploadedMaterialUrl = null;
    try {
      const uploadRes = await uploadSessionMaterial(
        currentSession.sessionId,
        formData
      );
      uploadedMaterialUrl = uploadRes.data.url;
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload material");
    } finally {
      setUploading(false);
    }

    if (socketRef.current && uploadedMaterialUrl) {
      socketRef.current.emit("slide-uploaded", {
        sessionId: currentSession.sessionId,
        slideUrl: uploadedMaterialUrl,
        slideIndex: 0,
      });
    }
    e.target.value = null;
  };

  const renderPdfLocally = async (file) => {
    try {
      const url = URL.createObjectURL(file);
      const pdf = await pdfjsLib.getDocument(url).promise;
      const slides = [];

      // Optimize: Limit pages or lower scale for very large PDFs to prevent browser crash
      const totalPages = Math.min(pdf.numPages, 100); // Guard: limit to first 100 pages
      const scale = 1.2; // Fixed safe scale

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        slides.push({
          id: uid(),
          imageUrl: canvas.toDataURL("image/jpeg", 0.7), // Lower quality for memory efficiency
          title: `Slide ${i}`,
        });
      }
      setSlidesDeck(slides);
      setSlideIndex(0);
      URL.revokeObjectURL(url);

      // Persist slides to Firestore immediately in Prep mode to avoid race conditions
      if (slides.length > 0 && currentSession) {
        try {
          const slideMetadata = slides.map((s, i) => ({
            id: s.id,
            imageUrl: s.imageUrl,
            title: s.title || `Slide ${i + 1}`
          }));
          await uploadSlides(currentSession.sessionId, { slides: slideMetadata });
          console.log("Slides persisted to Firestore in Prep mode.");
        } catch (metadataError) {
          console.warn("Failed to persist slide metadata in Prep mode:", metadataError);
        }
      }

      if (isLive && socketRef.current && slides.length > 0) {
        socketRef.current.emit("change-slide", {
          sessionId: currentSession.sessionId,
          slideIndex: 0,
          slideImage: slides[0].imageUrl,
        });
      }
    } catch (e) {
      console.error("PDF Render error:", e);
      alert("Failed to render PDF slides. The file might be too large or corrupted.");
    } finally {
      // Ensure uploading state is cleared
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="w-full max-w-7xl mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <FiMic size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Live Classroom</h1>
            <p className="text-xs text-gray-500">
              Interactive streaming & presentation
            </p>
          </div>
        </div>
        {mode !== "list" && (
          <button
            onClick={() => {
              setMode("list");
              stopMicrophone();
            }}
            className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
          >
            <FiArrowLeft /> Back to List
          </button>
        )}
      </header>

      {mode === "list" && (
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Sessions</h2>
            <button
              onClick={() => setMode("schedule")}
              className="bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
            >
              + Schedule New Class
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      session.isActive
                        ? "bg-green-100 text-green-700 animate-pulse"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {session.isActive ? "Live Now" : "Scheduled"}
                  </span>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FiCalendar size={14} />{" "}
                      {new Date(session.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 justify-end">
                      <FiClock size={14} /> {session.scheduledTime}
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">
                  {session.sessionTitle}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {session.shortDescription}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEnterSession(session)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                  >
                    {session.isActive ? "Re-join Session" : "Enter Classroom"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Use id or sessionId, whichever is available
                      handleDeleteLiveSession(session.id || session.sessionId);
                    }}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition shadow-sm border border-red-100"
                    title="Delete Session"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "schedule" && (
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Schedule a Class</h2>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                value={formData.sessionTitle}
                onChange={(e) =>
                  setFormData({ ...formData, sessionTitle: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading / Topic <span className="text-red-500">*</span>
              </label>
              <input
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                value={formData.sessionHeading}
                onChange={(e) =>
                  setFormData({ ...formData, sessionHeading: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black resize-none"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule Class"}
            </button>
          </form>
        </div>
      )}

      {(mode === "prep" || mode === "live") && currentSession && (
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="bg-black/95 rounded-2xl p-2 border border-black flex flex-col justify-center items-center relative overflow-hidden group shadow-2xl" style={{ minHeight: "600px" }}>
              {slidesDeck.length > 0 ? (
                <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
                  {slidesDeck[slideIndex] ? (
                    <img
                      src={slidesDeck[slideIndex].imageUrl}
                      className="max-h-full max-w-full object-contain shadow-2xl transition-transform duration-300"
                      alt="Slide"
                      onLoad={resizeCanvas}
                      style={{ WebkitUserSelect: "none" }}
                    />
                  ) : (
                    <div className="text-white">Rendering slides...</div>
                  )}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-crosshair"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      touchAction: "none",
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={drawing}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={drawing}
                    onTouchEnd={stopDrawing}
                  />
                  {/* UNDO / CLEAR BUTTONS (Shows on Hover) */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                      onClick={handleUndo}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
                      title="Undo Last Stroke"
                    >
                      <FiRotateCcw size={20} />
                    </button>
                    <button
                      onClick={handleClearCanvas}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                      title="Clear Canvas"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <FiFileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No slides uploaded yet.</p>
                  <p className="text-sm">Upload a PDF to begin presentation.</p>
                </div>
              )}
              {slidesDeck.length > 0 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/70 p-2 rounded-full backdrop-blur-md z-10">
                  <button
                    onClick={() => changeSlide(Math.max(0, slideIndex - 1))}
                    className="p-2 text-white hover:bg-white/20 rounded-full"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <span className="text-white font-mono self-center px-2">
                    {slideIndex + 1} / {slidesDeck.length}
                  </span>
                  <button
                    onClick={() =>
                      changeSlide(
                        Math.min(slidesDeck.length - 1, slideIndex + 1)
                      )
                    }
                    className="p-2 text-white hover:bg-white/20 rounded-full"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition">
                  <FiUpload />{" "}
                  {uploading ? "Uploading..." : "Upload Slides (PDF)"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="flex items-center gap-4">
                {mode === "prep" ? (
                  <button
                    onClick={handleStartLive}
                    disabled={loading || slidesDeck.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition disabled:opacity-50"
                  >
                    <FiPlay /> Go Live
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-mono font-bold border border-red-100">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />{" "}
                      LIVE {fmt(timer)}
                    </div>
                    <button
                      onClick={handleEndLive}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition"
                    >
                      <FiStopCircle /> End Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex flex-col gap-4 h-[600px]">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Audio Stream
                </h3>
                <button
                  onClick={toggleMute}
                  className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
                    isMuted
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {isMuted ? <FiMicOff /> : <FiMic />}{" "}
                  {isMuted ? "Unmute Mic" : "Mute Mic"}
                </button>
                
                {/* Visualizer below the button */}
                <VoiceVisualizer 
                  stream={mediaStreamRef.current} 
                  isActive={!isMuted} 
                />
                {!isMuted && (
                  <p className="text-[9px] text-emerald-600 font-bold mt-1 text-center animate-pulse uppercase tracking-wider">
                    Mic is picking up audio
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 p-2 rounded-xl border border-green-100 text-center">
                  <FiThumbsUp className="mx-auto text-green-600 mb-1" />
                  <span className="block text-xl font-bold text-gray-800">
                    {reactionCounts.understood}
                  </span>
                  <span className="text-[10px] text-green-700 font-medium">
                    Understood
                  </span>
                </div>
                <div className="bg-blue-50 p-2 rounded-xl border border-blue-100 text-center">
                  <FiCheckCircle className="mx-auto text-blue-600 mb-1" />
                  <span className="block text-xl font-bold text-gray-800">
                    {isLive ? "ON" : "OFF"}
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">
                    Status
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <FiMessageSquare className="text-gray-500" />
                <span className="font-bold text-gray-700 text-sm">
                  Class Chat
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs mt-10">
                    No messages yet
                  </p>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`text-sm p-2 rounded-lg ${
                        msg.role === "teacher"
                          ? "bg-indigo-50 ml-auto max-w-[85%]"
                          : "bg-gray-100 mr-auto max-w-[85%]"
                      }`}
                    >
                      <p className="text-[10px] font-bold text-gray-500 mb-0.5">
                        {msg.userName}
                      </p>
                      <p className="text-gray-800">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-gray-100">
                {isLive ? (
                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      <FiSend />
                    </button>
                  </form>
                ) : (
                  <div className="text-xs text-center text-gray-400 py-2">
                    Go live to enable chat
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