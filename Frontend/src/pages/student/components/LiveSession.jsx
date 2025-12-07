import React, { useEffect, useState, useRef } from "react";
import {
  FiThumbsUp,
  FiHelpCircle,
  FiSend,
  FiVolume2,
  FiVolumeX,
  FiDownload,
  FiMic,
  FiMicOff,
  FiArrowLeft,
  FiMessageSquare,
  FiCalendar,
  FiClock
} from "react-icons/fi";
import { io } from "socket.io-client";
import { 
  getStudentLiveSessions, 
  joinSessionAPI, 
  getSessionChat, 
  sendChatMessage, 
  markUnderstood,
  getSessionMaterials
} from "@/api/student";

export default function LiveSession() {
  const [joined, setJoined] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  
  // Real-time State
  const [slideIndex, setSlideIndex] = useState(0); 
  const [chatMessages, setChatMessages] = useState([]);
  const [msg, setMsg] = useState("");
  
  // Audio State
  const [isMuted, setIsMuted] = useState(true);
  const mediaStreamRef = useRef(null);
  const socketRef = useRef(null);

  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [materials, setMaterials] = useState([]);

  const isMobile = window.innerWidth < 768;

  // ==========================================
  // 1. DEFINE AUDIO FUNCTIONS FIRST
  // ==========================================

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setIsMuted(false);
      console.log("Microphone started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
      setIsMuted(true);
    }
  };

  const stopMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsMuted(true);
  };

  const toggleMute = () => {
    if (isMuted) {
      startMicrophone();
    } else {
      stopMicrophone();
    }
  };

  // ==========================================
  // 2. USE EFFECTS
  // ==========================================

  // --- Load Sessions on Mount ---
  useEffect(() => {
    // Defined INSIDE the effect to fix linter error
    const fetchSessions = async () => {
      try {
        const { data } = await getStudentLiveSessions();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error("Failed to load sessions", error);
      }
    };

    fetchSessions();
  }, []);

  // --- Socket Connection ---
  useEffect(() => {
    if (joined && activeClass) {
      // Initialize Socket
      socketRef.current = io("http://localhost:8928/live-session", {
        withCredentials: true
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Student Connected to Socket");
        socket.emit("join-session", {
          sessionId: activeClass.sessionId,
          userId: "STUDENT_ID_HERE", // Ideally from Auth Context
          userName: "Student", // Ideally from Auth Context
          role: "student"
        });
      });

      // Listen for chat
      socket.on("chat-message", (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });

      // Listen for slide changes
      socket.on("slide-change", (data) => {
        setSlideIndex(data.slideIndex);
      });

      // Listen for new materials
      socket.on("new-material", (material) => {
        setMaterials(prev => [...prev, material]);
        alert("New material uploaded by teacher!");
      });

      return () => {
        if (socket) socket.disconnect();
        stopMicrophone(); // Now safe to call because it's defined above
      };
    }
  }, [joined, activeClass]);

  // ==========================================
  // 3. OTHER HANDLERS
  // ==========================================

  const handleJoinSession = async (session) => {
    try {
      // 1. Call API to verify join
      await joinSessionAPI(session.sessionId);
      
      // 2. Fetch initial chat & materials
      const [chatRes, matRes] = await Promise.all([
        getSessionChat(session.sessionId),
        getSessionMaterials(session.sessionId)
      ]);

      setChatMessages(chatRes.data.chat || []);
      setMaterials(matRes.data.materials || []);
      setActiveClass(session);
      setJoined(true);

    } catch (error) {
      console.error("Join failed", error);
      alert("Failed to join session. It might not be active yet.");
    }
  };

  const sendMsg = async () => {
    if (!msg.trim() || !activeClass) return;

    try {
      await sendChatMessage(activeClass.sessionId, { messageText: msg });
      setMsg("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleUnderstood = async () => {
    try {
      await markUnderstood(activeClass.sessionId);
      const btn = document.getElementById("btn-understood");
      if(btn) {
        btn.classList.add("bg-green-700", "scale-105");
        setTimeout(() => btn.classList.remove("bg-green-700", "scale-105"), 200);
      }
    } catch (error) {
      console.error("Reaction failed", error);
    }
  };

  const downloadMaterial = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.click();
  };

  // =======================================================
  //                      RENDER
  // =======================================================

  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Live Classes</h1>
          
          {sessions.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500">No active sessions found.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {sessions.map((cls) => (
                <div key={cls.sessionId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${cls.isActive ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-600"}`}>
                        {cls.isActive ? "LIVE NOW" : "Scheduled"}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FiCalendar /> {new Date(cls.scheduledDate).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FiClock /> {cls.scheduledTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{cls.sessionTitle}</h2>
                    <p className="text-gray-600 mt-1">{cls.course?.courseName || "General Course"}</p>
                  </div>

                  <button
                    onClick={() => handleJoinSession(cls)}
                    disabled={!cls.isActive}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition ${
                      cls.isActive 
                        ? "bg-indigo-600 hover:bg-indigo-700 hover:scale-105" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {cls.isActive ? "Join Class" : "Wait to Start"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LIVE CLASSROOM UI ---
  return (
    <div className={`fixed inset-0 bg-white flex flex-col ${isMobile ? "" : "md:flex-row"}`}>
      
      {/* 1. MAIN STAGE */}
      <div className="flex-1 bg-gray-100 relative flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent text-white z-10 flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg shadow-black drop-shadow-md">{activeClass?.sessionTitle}</h2>
            <p className="text-xs opacity-90">{activeClass?.course?.courseName}</p>
          </div>
          <button 
            onClick={() => { setJoined(false); stopMicrophone(); }}
            className="bg-red-600/90 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold backdrop-blur-md"
          >
            Leave
          </button>
        </div>

        {/* Slide Display */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-400">
            <h1 className="text-6xl font-bold opacity-20">Slide {slideIndex + 1}</h1>
            <p className="mt-4 text-sm">Teacher's Screen</p>
          </div>
        </div>

        {/* Bottom Controls (Mobile Only) */}
        {isMobile && (
          <div className="bg-white p-3 border-t flex justify-around items-center">
             <button onClick={toggleMute} className={`p-3 rounded-full ${!isMuted ? "bg-indigo-100 text-indigo-600" : "bg-gray-100"}`}>
               {isMuted ? <FiMicOff /> : <FiMic />}
             </button>
             <button id="btn-understood" onClick={handleUnderstood} className="p-3 rounded-full bg-green-100 text-green-700 transition-transform">
               <FiThumbsUp />
             </button>
             <button onClick={() => setShowDownloadPopup(true)} className="p-3 rounded-full bg-blue-100 text-blue-600">
               <FiDownload />
             </button>
          </div>
        )}
      </div>

      {/* 2. SIDEBAR (Chat & Controls) - Desktop/Tablet */}
      <div className={`bg-white border-l w-full md:w-96 flex flex-col ${isMobile ? "h-[40vh]" : "h-full"}`}>
        
        {/* Tabs / Header */}
        <div className="p-4 border-b bg-gray-50 flex items-center gap-2 font-semibold text-gray-700">
          <FiMessageSquare /> Live Chat
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-10">Say hello to the class! 👋</p>
          ) : (
            chatMessages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'student' && m.userId === 'STUDENT_ID_HERE' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
                  m.role === 'teacher' 
                    ? "bg-indigo-50 text-indigo-900 border border-indigo-100" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  <span className="text-xs font-bold block mb-1 opacity-70">{m.userName}</span>
                  {m.message}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Controls Area */}
        {!isMobile && (
          <div className="p-4 bg-gray-50 border-t space-y-4">
            <div className="flex justify-between gap-2">
              <button 
                onClick={toggleMute}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition ${
                  !isMuted ? "bg-red-100 text-red-600" : "bg-white border hover:bg-gray-50"
                }`}
              >
                {isMuted ? <><FiMicOff /> Unmute</> : <><FiMic /> Mute</>}
              </button>
              
              <button 
                id="btn-understood-d"
                onClick={handleUnderstood}
                className="flex-1 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition flex items-center justify-center gap-2"
              >
                <FiThumbsUp /> Understood
              </button>
            </div>

            <button 
              onClick={() => setShowDownloadPopup(true)}
              className="w-full py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium flex items-center justify-center gap-2"
            >
              <FiDownload /> Class Materials ({materials.length})
            </button>
          </div>
        )}

        {/* Chat Input */}
        <div className="p-3 border-t flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
            placeholder="Type a doubt..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={sendMsg}
            disabled={!msg.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FiSend />
          </button>
        </div>
      </div>

      {/* DOWNLOAD MODAL */}
      {showDownloadPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold mb-4">Class Materials</h3>
            
            {materials.length === 0 ? (
              <p className="text-gray-500 text-sm mb-6">No materials uploaded by teacher yet.</p>
            ) : (
              <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                {materials.map((mat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm truncate max-w-[70%]">{mat.fileName || `File ${idx + 1}`}</span>
                    <button 
                      onClick={() => downloadMaterial(mat.url, mat.fileName)}
                      className="text-blue-600 hover:underline text-xs font-semibold"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => setShowDownloadPopup(false)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}