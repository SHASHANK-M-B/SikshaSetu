// student/LiveSession.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FiThumbsUp,
  FiSend,
  FiDownload,
  FiMic,
  FiMicOff,
  FiArrowLeft,
  FiMessageSquare,
} from "react-icons/fi";
import { io } from "socket.io-client";
import {
  getStudentLiveSessions,
  getSessionChat,
  getSessionMaterials,
} from "@/api/student";

// --- CONSTANTS ---
const SOCKET_URL =
  "https://sikshasetu-backend-1030932275340.asia-south1.run.app/live-session";

const STUDENT_ID = "STUDENT_ID_HERE";
const STUDENT_NAME = "Student Name";

export default function LiveSession() {
  const [joined, setJoined] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeClass, setActiveClass] = useState(null);

  // Real-time State
  const [currentSlideImage, setCurrentSlideImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [msg, setMsg] = useState("");

  // Audio State
  const [isMuted, setIsMuted] = useState(true);
  const mediaStreamRef = useRef(null);
  const teacherAudioRef = useRef(null);

  // Socket & WebRTC Refs
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // UI State
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [materials, setMaterials] = useState([]);
  const chatContainerRef = useRef(null);

  // FIX #1: isMobile as reactive state, not a stale module-level variable.
  // Computed once on mount and updated on resize so PWA / window changes are
  // reflected correctly.
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Annotation Canvas Refs
  const canvasRef = useRef(null);
  const canvasContextRef = useRef(null);
  const viewportContainerRef = useRef(null);

  // FIX #2: Keep a ref to the slide <img> element so the canvas can be sized
  // and positioned to match the rendered image exactly (not the full container).
  const slideImgRef = useRef(null);

  // History for Undo (Synced with teacher)
  const strokesRef = useRef([]);
  const currentStrokeRef = useRef([]);

  // --- FETCH SESSIONS ---
  const fetchSessions = async () => {
    try {
      const { data } = await getStudentLiveSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // --- CHAT SCROLLING ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // --- CANVAS SETUP ---
  // FIX #2 (cont): Size the canvas to the actual rendered image rect so that
  // normalized annotation coordinates map 1:1 with the slide pixels the student sees.
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prefer sizing to the slide image when available; fall back to container.
    const target = slideImgRef.current || viewportContainerRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Position the canvas directly over the image.
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    // Reset position so it doesn't drift when the image changes size.
    canvas.style.position = "absolute";
    canvas.style.left = target.offsetLeft + "px";
    canvas.style.top = target.offsetTop + "px";
    canvas.style.transform = "none";

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    canvasContextRef.current = ctx;
  }, []);

  useEffect(() => {
    if (joined && canvasRef.current) {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [joined, resizeCanvas]);

  // --- DRAWING HELPER ---
  const drawSegment = (segment) => {
    const ctx = canvasContextRef.current;
    if (!ctx || !canvasRef.current) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    ctx.strokeStyle = segment.color;
    ctx.lineWidth = segment.lineWidth;
    ctx.beginPath();
    ctx.moveTo(segment.fromX * w, segment.fromY * h);
    ctx.lineTo(segment.toX * w, segment.toY * h);
    ctx.stroke();
    ctx.closePath();
  };

  // FIX #3: Guard redrawCanvas so it does nothing when the canvas context
  // hasn't been initialised yet (e.g. on early socket events before join).
  const redrawCanvas = useCallback(() => {
    const ctx = canvasContextRef.current;
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    strokesRef.current.forEach((stroke) => stroke.forEach(drawSegment));
    currentStrokeRef.current.forEach(drawSegment);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- AUDIO LOGIC ---
  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setIsMuted(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
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

  // --- WEBRTC LOGIC ---
  // FIX #4: Accept sessionId as a parameter instead of closing over activeClass.
  // This prevents stale-closure bugs when activeClass changes between renders.
  const createPeerConnection = useCallback(async (teacherSocketId, sessionId) => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    console.log("Creating PeerConnection to teacher:", teacherSocketId);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionRef.current = pc;

    pc.ontrack = (event) => {
      console.log("Received remote track from teacher", event.streams[0]);
      if (teacherAudioRef.current) {
        teacherAudioRef.current.srcObject = event.streams[0];
        teacherAudioRef.current.play().catch(() => {
          const btn = document.getElementById("audio-force-btn");
          if (btn) btn.style.display = "block";
        });
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("webrtc-ice-candidate", {
          sessionId,
          candidate: event.candidate,
          targetSocketId: teacherSocketId,
        });
      }
    };

    return pc;
  }, []);

  const closePeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (teacherAudioRef.current) {
      teacherAudioRef.current.srcObject = null;
    }
  };

  // --- SOCKET CONNECTION ---
  useEffect(() => {
    if (!joined || !activeClass) return;

    console.log("Initializing Socket connection to:", SOCKET_URL);
    closePeerConnection();

    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    const socket = socketRef.current;
    const { sessionId } = activeClass;

    socket.on("connect", () => {
      console.log("✅ Student Connected:", socket.id);

      socket.emit("join-session", {
        sessionId,
        userId: STUDENT_ID,
        userName: STUDENT_NAME,
        role: "student",
      });

      socket.emit("request-teacher-stream", { sessionId });
    });

    socket.on("chat-message", (msg) =>
      setChatMessages((prev) => [...prev, msg])
    );

    // FIX #7: Removed duplicate "change-slide" listener — only "slide-changed"
    // is kept to avoid double state updates.
    socket.on("slide-changed", (data) => {
      setCurrentSlideImage(data.slideImage);
      strokesRef.current = [];
      currentStrokeRef.current = [];
      // Guard: context may not exist yet if the slide arrives before canvas init.
      redrawCanvas();
    });

    socket.on("new-material", (material) => {
      setMaterials((prev) => [...prev, material]);
      alert("New material uploaded!");
    });

    // --- ANNOTATION SYNC ---
    socket.on("start-stroke", () => {
      currentStrokeRef.current = [];
    });

    socket.on("annotation-draw", (data) => {
      drawSegment(data.data);
      currentStrokeRef.current.push(data.data);
    });

    socket.on("end-stroke", () => {
      if (currentStrokeRef.current.length > 0) {
        strokesRef.current.push([...currentStrokeRef.current]);
        currentStrokeRef.current = [];
      }
    });

    socket.on("undo-annotation", () => {
      strokesRef.current.pop();
      redrawCanvas();
    });

    socket.on("clear-canvas", () => {
      strokesRef.current = [];
      currentStrokeRef.current = [];
      redrawCanvas();
    });

    // WebRTC Offer — pass sessionId explicitly (FIX #4)
    socket.on("webrtc-offer", async ({ offer, fromSocketId }) => {
      console.log("Received WebRTC Offer from teacher");
      const pc = await createPeerConnection(fromSocketId, sessionId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc-answer", {
        sessionId,
        answer: pc.localDescription,
        targetSocketId: fromSocketId,
      });
    });

    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      const pc = peerConnectionRef.current;
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.disconnect();
      closePeerConnection();
      stopMicrophone();
    };
  }, [joined, activeClass, createPeerConnection, redrawCanvas]);

  // --- HANDLERS ---
  const handleJoinSession = async (session) => {
    try {
      console.log("Joining session:", session.sessionId);
      setChatMessages([]);
      setMaterials([]);
      setJoined(false);

      const [chatRes, matRes] = await Promise.all([
        getSessionChat(session.sessionId),
        getSessionMaterials(session.sessionId),
      ]);

      setChatMessages(chatRes.data.chat || []);
      setMaterials(matRes.data.materials || []);
      setActiveClass(session);
      setJoined(true);

      setTimeout(resizeCanvas, 100);

      // FIX #6: Only run the AudioContext hack on actual mobile/touch devices,
      // now that isMobile is reactive and accurate.
      if (isMobile && "ontouchstart" in window) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          osc.connect(ctx.destination);
          osc.start(0);
          osc.stop(0.001);
        }
      }
    } catch (error) {
      console.error("Join failed", error);
      alert("Failed to join session.");
    }
  };

  const handleManualAudioStart = () => {
    if (teacherAudioRef.current) {
      teacherAudioRef.current.play();
      const btn = document.getElementById("audio-force-btn");
      if (btn) btn.style.display = "none";
    }
  };

  const sendMsg = () => {
    if (!msg.trim() || !activeClass || !socketRef.current) return;
    socketRef.current.emit("send-chat-message", {
      sessionId: activeClass.sessionId,
      message: msg,
    });
    setMsg("");
  };

  const handleUnderstood = () => {
    if (socketRef.current && activeClass) {
      socketRef.current.emit("understood", {
        sessionId: activeClass.sessionId,
      });
      ["btn-understood", "btn-understood-d"].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.classList.add("bg-green-700", "scale-110", "text-white");
          setTimeout(
            () =>
              btn.classList.remove("bg-green-700", "scale-110", "text-white"),
            500
          );
        }
      });
    }
  };

  const downloadMaterial = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "material";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // student/LiveSession.jsx (List View Section)

  if (!joined) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col items-center font-sans">
        {/* Header with RVS Studio / Zomato-style clean typography */}
        <div className="w-full max-w-4xl mb-12 mt-8 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            Live Classes
          </h1>
          <p className="text-slate-500 font-medium">Select an ongoing session to join the classroom</p>
        </div>

        <div className="w-full max-w-4xl grid gap-6">
          {sessions.map((cls) => {
            // Robust Date Parsing
            const rawDate = cls.sessionDate || cls.date;
            const dateObj = new Date(rawDate);
            const isValidDate = rawDate && !isNaN(dateObj.getTime());

            const formattedDate = isValidDate
              ? dateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })
              : "Date TBD";

            return (
              <div
                key={cls.sessionId}
                className="group bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 ease-out hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cls.isActive
                        ? "bg-rose-100 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                      }`}>
                      {cls.isActive && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                        </span>
                      )}
                      {cls.isActive ? "Live Now" : "Scheduled"}
                    </div>

                    {cls.isActive && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                        {cls.participantsCount || 0} Students Joined
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {cls.sessionTitle || cls.title}
                  </h2>

                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md mb-4">
                    {cls.description || "No description provided for this session."}
                  </p>

                  <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {formattedDate}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {cls.sessionTime || cls.time || "TBA"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 md:ml-8 w-full md:w-auto">
                  <button
                    onClick={() => handleJoinSession(cls)}
                    disabled={!cls.isActive}
                    className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${cls.isActive
                        ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                  >
                    {cls.isActive ? "Join Class" : "Class Starts Soon"}
                  </button>
                </div>
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                No sessions found at the moment
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  // student/LiveSession.jsx

  return (
    <div className={`fixed inset-0 bg-slate-50 flex flex-col font-sans ${isMobile ? "" : "md:flex-row"}`}>

      {/* 1. MAIN STAGE: Immersive Dark Viewport */}
      <div className="flex-1 relative flex flex-col bg-[#0b0e14] overflow-hidden group">
        <audio ref={teacherAudioRef} autoPlay playsInline className="hidden" />

        {/* Top Bar: Deep Gradient for visibility over slides */}
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-30 bg-gradient-to-b from-black/90 to-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/40">
              <FiMessageSquare className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm md:text-base leading-tight">
                {activeClass?.sessionTitle || activeClass?.title}
              </h2>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">
                {activeClass?.course?.courseName || "Live Lecture"}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setJoined(false); closePeerConnection(); stopMicrophone(); }}
            className="bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl text-xs font-black text-white transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20"
          >
            <FiArrowLeft /> Leave
          </button>
        </div>

        {/* Viewport: Matching the card-style container from your screenshots */}
        <div ref={viewportContainerRef} className="flex-1 flex items-center justify-center relative p-4">
          <button
            id="audio-force-btn"
            onClick={handleManualAudioStart}
            style={{ display: "none" }}
            className="absolute z-50 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold animate-pulse border border-indigo-400"
          >
            🔊 Tap to Join Audio
          </button>

          {currentSlideImage ? (
            <div className="relative w-full h-full flex items-center justify-center max-w-5xl">
              <img
                ref={slideImgRef}
                src={currentSlideImage}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/5 bg-white"
                onLoad={resizeCanvas}
              />
              <canvas ref={canvasRef} className="pointer-events-none absolute" />
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Waiting for Instructor...</p>
            </div>
          )}
        </div>

        {/* Floating Control Bar: Clean and Minimal */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl">
          <button onClick={toggleMute} className={`p-4 rounded-2xl transition-all ${!isMuted ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-white/5 text-white hover:bg-white/20"}`}>
            {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>
          <button id="btn-understood" onClick={handleUnderstood} className="p-4 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-transform active:scale-90">
            <FiThumbsUp size={20} />
          </button>
          <button onClick={() => setShowDownloadPopup(true)} className="p-4 rounded-2xl bg-white/5 text-white hover:bg-white/20">
            <FiDownload size={20} />
          </button>
        </div>
      </div>

      {/* 2. SIDEBAR: Matching the clean white list style */}
      <aside className={`bg-white border-l border-slate-200 flex flex-col ${isMobile ? "h-[45vh]" : "w-[380px] h-full"}`}>
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full" />
            Discussion
          </h3>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">Live Chat</span>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === "student" && m.userId === STUDENT_ID ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${m.role === "teacher"
                ? "bg-indigo-600 text-white rounded-tl-none"
                : "bg-slate-100 text-slate-700 rounded-tr-none border border-slate-200"
                }`}>
                <span className={`text-[10px] font-black uppercase mb-1 block opacity-60`}>{m.userName}</span>
                <p className="font-medium leading-relaxed">{m.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2 bg-slate-100 rounded-2xl p-1 border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-all">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              placeholder="Ask a doubt..."
              className="flex-1 bg-transparent px-4 py-2 text-sm font-semibold focus:outline-none"
            />
            <button
              onClick={sendMsg}
              disabled={!msg.trim()}
              className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-20 transition-all active:scale-95 shadow-md shadow-indigo-500/20"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </aside>

      {/* Material Download Modal: Styled like your "Publish" buttons */}
      {showDownloadPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-slate-900 mb-6">Class Materials</h3>
            <div className="space-y-3 mb-8">
              {materials.map((mat, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{mat.fileName || "Note"}</span>
                  <button
                    onClick={() => downloadMaterial(mat.url, mat.fileName)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowDownloadPopup(false)}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}