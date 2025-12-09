// LiveSession.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FiThumbsUp,
  FiSend,
  FiDownload,
  FiMic,
  FiMicOff,
  FiArrowLeft,
  FiMessageSquare,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { io } from "socket.io-client";
import {
  getStudentLiveSessions,
  getSessionChat,
  getSessionMaterials,
} from "@/api/student";

// --- DYNAMIC SOCKET URL ---
// --- CONSTANTS AND UTILS ---
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// FIX: Append '/live-session' to the end of BOTH URLs
const SOCKET_URL = isLocal 
  ? "http://localhost:8928/live-session" 
  : "https://sikshasetu-backend-856403064619.asia-south2.run.app/live-session";

const STUDENT_ID = "STUDENT_ID_HERE"; // Placeholder
const STUDENT_NAME = "Student Name"; // Placeholder

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

  // Annotation Canvas Refs
  const canvasRef = useRef(null);
  const canvasContextRef = useRef(null);
  const viewportContainerRef = useRef(null);

  const isMobile = window.innerWidth < 768;

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
  const resizeCanvas = useCallback(() => {
    if (canvasRef.current && viewportContainerRef.current) {
      const parent = viewportContainerRef.current;
      canvasRef.current.width = parent.clientWidth;
      canvasRef.current.height = parent.clientHeight;

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasContextRef.current = ctx;
    }
  }, []);

  useEffect(() => {
    if (joined && canvasRef.current) {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [joined, resizeCanvas]);

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

  // --- DRAWING ---
  const drawLine = useCallback(
    ({ fromX, fromY, toX, toY, color, lineWidth }) => {
      const ctx = canvasContextRef.current;
      if (!ctx) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      ctx.closePath();
    },
    []
  );

  // --- WEBRTC LOGIC ---
  const createPeerConnection = useCallback(
    async (teacherSocketId) => {
      if (peerConnectionRef.current) return peerConnectionRef.current;

      console.log("Creating PeerConnection to teacher:", teacherSocketId);
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      // Handle incoming audio
      pc.ontrack = (event) => {
        console.log("Received remote track from teacher", event.streams[0]);
        if (teacherAudioRef.current) {
          teacherAudioRef.current.srcObject = event.streams[0];
          teacherAudioRef.current.play().catch((e) => {
            console.warn("Autoplay blocked, adding user click handler", e);
            const playBtn = document.createElement("button");
            playBtn.textContent = "🔊 Click to Enable Audio";
            playBtn.style.cssText =
              "position:fixed; top:20px; right:20px; z-index:9999; padding:15px; background:red; color:white; font-weight:bold; border-radius:10px;";
            playBtn.onclick = () => {
              teacherAudioRef.current.play();
              playBtn.remove();
            };
            document.body.appendChild(playBtn);
          });
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("webrtc-ice-candidate", {
            sessionId: activeClass.sessionId,
            candidate: event.candidate,
            targetSocketId: teacherSocketId,
          });
        }
      };

      return pc;
    },
    [activeClass]
  );

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
    if (joined && activeClass) {
      console.log("Initializing Socket connection to:", SOCKET_URL);

      closePeerConnection();

      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("✅ Student Connected to Live Session Socket:", socket.id);

        socket.emit("join-session", {
          sessionId: activeClass.sessionId,
          userId: STUDENT_ID,
          userName: STUDENT_NAME,
          role: "student",
        });

        // Request stream immediately
        console.log("Requesting teacher stream...");
        socket.emit("request-teacher-stream", {
          sessionId: activeClass.sessionId,
        });
      });

      // Listeners
      socket.on("chat-message", (msg) =>
        setChatMessages((prev) => [...prev, msg])
      );

      socket.on("change-slide", (data) => {
        if (data.slideImage) setCurrentSlideImage(data.slideImage);
        if (canvasContextRef.current) {
          canvasContextRef.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      });

      socket.on("slide-changed", (data) => {
        console.log("Slide changed:", data);
        setCurrentSlideImage(data.slideImage);
        if (canvasContextRef.current) {
          canvasContextRef.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      });

      socket.on("new-material", (material) => {
        setMaterials((prev) => [...prev, material]);
        alert("New material uploaded!");
      });

      // WebRTC Offer
      socket.on("webrtc-offer", async ({ offer, fromSocketId }) => {
        console.log("Received WebRTC Offer from teacher");
        const pc = await createPeerConnection(fromSocketId);

        // FIX: Remove .sdp, pass full object
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
          sessionId: activeClass.sessionId,
          answer: pc.localDescription,
          targetSocketId: fromSocketId,
        });
      });

      socket.on("webrtc-ice-candidate", async ({ candidate }) => {
        const pc = peerConnectionRef.current;
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on("annotation-draw", (data) => drawLine(data.data));

      return () => {
        if (socket) socket.disconnect();
        closePeerConnection();
        stopMicrophone();
      };
    }
  }, [joined, activeClass, createPeerConnection, drawLine]);

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
      setJoined(true); // Triggers the socket useEffect

      setTimeout(resizeCanvas, 100);
    } catch (error) {
      console.error("Join failed", error);
      alert("Failed to join session.");
    }
  };

  const sendMsg = async () => {
    if (!msg.trim() || !activeClass || !socketRef.current) return;

    // 1. Send via Socket (Backend handles saving)
    socketRef.current.emit("send-chat-message", {
      sessionId: activeClass.sessionId,
      message: msg,
    });

    // 2. Clear input (Removed the failing API call)
    setMsg("");
  };

  const handleUnderstood = () => {
    if (socketRef.current && activeClass) {
      socketRef.current.emit("understood", {
        sessionId: activeClass.sessionId,
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

  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Live Classes</h1>
        <div className="w-full max-w-4xl grid gap-6">
          {sessions.map((cls) => (
            <div
              key={cls.sessionId}
              className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center"
            >
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    cls.isActive
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cls.isActive ? "LIVE NOW" : "Scheduled"}
                </span>
                <h2 className="text-xl font-bold mt-2">{cls.sessionTitle}</h2>
              </div>
              <button
                onClick={() => handleJoinSession(cls)}
                disabled={!cls.isActive}
                className={`px-8 py-3 rounded-xl font-bold text-white transition ${
                  cls.isActive
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300"
                }`}
              >
                {cls.isActive ? "Join Class" : "Wait"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-white flex flex-col ${
        isMobile ? "" : "md:flex-row"
      }`}
    >
      {/* 1. MAIN STAGE */}
      <div className="flex-1 bg-gray-100 relative flex flex-col">
        {/* Teacher Audio Stream */}
        <audio
          ref={teacherAudioRef}
          autoPlay
          playsInline
          controls={false}
          style={{ width: 0, height: 0, opacity: 0 }}
        />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-black/50 text-white z-20 flex justify-between">
          <h2 className="font-bold">{activeClass?.sessionTitle}</h2>
          <button
            onClick={() => {
              setJoined(false);
              closePeerConnection();
            }}
            className="bg-red-600 px-4 py-1 rounded"
          >
            Leave
          </button>
        </div>

        {/* Viewport */}
        <div
          ref={viewportContainerRef}
          className="flex-1 flex items-center justify-center bg-black/90 relative"
        >
          {currentSlideImage ? (
            <>
              <img
                src={currentSlideImage}
                className="max-w-full max-h-full object-contain"
                onLoad={resizeCanvas}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
                style={{ width: "100%", height: "100%" }}
              />
            </>
          ) : (
            <h1 className="text-white opacity-50">Waiting for slides...</h1>
          )}
        </div>
      </div>

      {/* 2. CHAT & CONTROLS */}
      <div className="w-full md:w-96 bg-white border-l flex flex-col h-full">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chatMessages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                m.role === "teacher" ? "bg-indigo-50 ml-auto" : "bg-gray-100"
              }`}
            >
              <span className="text-xs font-bold block">{m.userName}</span>
              {m.message}
            </div>
          ))}
        </div>

        <div className="p-4 border-t space-y-2">
          <div className="flex gap-2">
            <button onClick={toggleMute} className="flex-1 p-2 border rounded">
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <button
              onClick={handleUnderstood}
              className="flex-1 p-2 bg-green-100 rounded"
            >
              Understood
            </button>
          </div>
          <div className="flex gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMsg}
              className="bg-indigo-600 text-white p-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
