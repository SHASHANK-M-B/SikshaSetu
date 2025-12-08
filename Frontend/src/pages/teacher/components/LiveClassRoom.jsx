// LiveClassRoom.jsx

import React, { useEffect, useState, useRef } from "react";
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
  FiMicOff
} from "react-icons/fi";
import { io } from "socket.io-client";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker&url";
import { 
  scheduleLiveClass, 
  getLiveSessions, 
  startLiveSession, 
  endLiveSession, 
  uploadSessionMaterial,
  getUnderstoodCount,
  getSessionChat 
} from "@/api/teacher";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const fmt = (s) => new Date(s * 1000).toISOString().substr(11, 8);
const uid = () => Math.random().toString(36).slice(2, 9);

export default function LiveClassRoom() {
  // --- STATES ---
  const [mode, setMode] = useState("list");
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Socket & Media Refs
  const socketRef = useRef(null);
  const mediaStreamRef = useRef(null);

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

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await getLiveSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  };

  // --- SOCKET CONNECTION ---
  useEffect(() => {
    if ((mode === "prep" || mode === "live") && currentSession) {
      // socketRef.current = io("http://localhost:8928/live-session", {
      socketRef.current = io("https://sikshasetu-backend.onrender.com/live-session", {
        withCredentials: true
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected to Live Session Socket");
        socket.emit("join-session", {
          sessionId: currentSession.sessionId,
          userId: "TEACHER_ID_HERE", // Ideally fetch from AuthContext
          userName: "Teacher",
          role: "teacher"
        });
      });

      socket.on("chat-message", (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });

      socket.on("understood-count-updated", (data) => {
        setReactionCounts((prev) => ({ ...prev, understood: data.understoodCount }));
      });

      return () => {
        if (socket) socket.disconnect();
      };
    }
  }, [mode, currentSession]);

  // --- MICROPHONE LOGIC ---
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
    console.log("Microphone stopped");
  };

  const toggleMute = () => {
    if (isMuted) {
      startMicrophone();
    } else {
      stopMicrophone();
    }
  };

  // --- SLIDE NAVIGATION & SYNC ---
  const changeSlide = (newIndex) => {
    if (newIndex < 0 || newIndex >= slidesDeck.length) return;
    setSlideIndex(newIndex);

    // Emit slide change to students
    if (socketRef.current && isLive) {
      socketRef.current.emit("slide-change", {
        sessionId: currentSession.sessionId,
        slideIndex: newIndex,
        slideImage: slidesDeck[newIndex].imageUrl // Send image data for real-time sync
      });
    }
  };

  // --- CHAT LOGIC ---
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socketRef.current) return;

    socketRef.current.emit("send-chat-message", {
      sessionId: currentSession.sessionId,
      message: chatInput
    });

    setChatInput("");
  };

  // --- HANDLERS ---
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass null or a default value for courseId if backend requires it, or just omit
      await scheduleLiveClass({
        ...formData,
        courseId: null // Explicitly null as requested to remove field
      });
      alert("Class scheduled successfully!");
      setMode("list");
      fetchSessions();
      setFormData({
        sessionTitle: "",
        shortDescription: "",
        sessionHeading: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  const handleEnterSession = async (session) => {
    setCurrentSession(session);
    try {
      const [countRes, chatRes] = await Promise.all([
        getUnderstoodCount(session.sessionId),
        getSessionChat(session.sessionId)
      ]);
      setReactionCounts({ understood: countRes.data.understoodCount || 0 });
      setChatMessages(chatRes.data.chat || []);
    } catch (e) {
      console.error("Failed to load session data", e);
    }
    setMode("prep");
  };

  const handleStartLive = async () => {
    try {
      setLoading(true);
      await startLiveSession(currentSession.sessionId);
      setIsLive(true);
      setMode("live");
      startMicrophone(); 
    } catch (error) {
      console.error("Start live error:", error);
      alert("Failed to start session");
    } finally {
      setLoading(false);
    }
  };

  const handleEndLive = async () => {
    if (!window.confirm("Are you sure you want to end this session?")) return;
    try {
      setLoading(true);
      await endLiveSession(currentSession.sessionId);
      stopMicrophone();
      setIsLive(false);
      setMode("list");
      fetchSessions();
    } catch (error) {
      console.error("End live error:", error);
      alert("Failed to end session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentSession) return;

    if (file.type === "application/pdf") {
      renderPdfLocally(file);
    }

    const formData = new FormData();
    formData.append("files", file);

    setUploading(true);
    try {
      await uploadSessionMaterial(currentSession.sessionId, formData);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload material to server");
    } finally {
      setUploading(false);
    }
  };

  const renderPdfLocally = async (file) => {
    try {
      const url = URL.createObjectURL(file);
      const pdf = await pdfjsLib.getDocument(url).promise;
      const slides = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        
        slides.push({
          id: uid(),
          imageUrl: canvas.toDataURL("image/jpeg", 0.8),
          title: `Slide ${i}`
        });
      }
      setSlidesDeck(slides);
      setSlideIndex(0);
      
      // Emit first slide immediately if live
      if(isLive && socketRef.current && slides.length > 0) {
         socketRef.current.emit("slide-change", {
            sessionId: currentSession.sessionId,
            slideIndex: 0,
            slideImage: slides[0].imageUrl
         });
      }

    } catch (e) {
      console.error("PDF Render error", e);
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
            <p className="text-xs text-gray-500">Interactive streaming & presentation</p>
          </div>
        </div>
        
        {mode !== "list" && (
          <button onClick={() => { setMode("list"); stopMicrophone(); }} className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
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
            {sessions.map(session => (
              <div key={session.sessionId} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    session.isActive ? "bg-green-100 text-green-700 animate-pulse" : "bg-gray-100 text-gray-600"
                  }`}>
                    {session.isActive ? "Live Now" : "Scheduled"}
                  </span>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FiCalendar size={14} /> {new Date(session.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 justify-end">
                      <FiClock size={14} /> {session.scheduledTime}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{session.sessionTitle}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{session.shortDescription}</p>
                
                <button 
                  onClick={() => handleEnterSession(session)}
                  className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                >
                  {session.isActive ? "Re-join Session" : "Enter Classroom"}
                </button>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
              <input 
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                value={formData.sessionTitle}
                onChange={e => setFormData({...formData, sessionTitle: e.target.value})}
              />
            </div>

             <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heading / Topic</label>
                <input 
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                  value={formData.sessionHeading}
                  onChange={e => setFormData({...formData, sessionHeading: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date"
                  required
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black h-24"
                value={formData.shortDescription}
                onChange={e => setFormData({...formData, shortDescription: e.target.value})}
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
            {/* Viewport */}
            <div className="bg-black/5 rounded-2xl p-4 border border-gray-200 min-h-[500px] flex flex-col justify-center items-center relative overflow-hidden">
              {slidesDeck.length > 0 ? (
                <img 
                  src={slidesDeck[slideIndex].imageUrl} 
                  className="max-h-[500px] max-w-full object-contain shadow-2xl rounded-lg"
                  alt="Slide"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <FiFileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No slides uploaded yet.</p>
                  <p className="text-sm">Upload a PDF to begin presentation.</p>
                </div>
              )}

              {/* Slide Controls */}
              {slidesDeck.length > 0 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/70 p-2 rounded-full backdrop-blur-md">
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
                    onClick={() => changeSlide(Math.min(slidesDeck.length - 1, slideIndex + 1))}
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
                  <FiUpload />
                  {uploading ? "Uploading..." : "Upload Slides (PDF)"}
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>

              <div className="flex items-center gap-4">
                {mode === "prep" ? (
                  <button 
                    onClick={handleStartLive}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition"
                  >
                    <FiPlay /> Go Live
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-mono font-bold border border-red-100">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
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
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Audio Stream</h3>
                <button
                  onClick={toggleMute}
                  className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
                    isMuted ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {isMuted ? <FiMicOff /> : <FiMic />}
                  {isMuted ? "Unmute Mic" : "Mute Mic"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 p-2 rounded-xl border border-green-100 text-center">
                  <FiThumbsUp className="mx-auto text-green-600 mb-1" />
                  <span className="block text-xl font-bold text-gray-800">{reactionCounts.understood}</span>
                  <span className="text-[10px] text-green-700 font-medium">Understood</span>
                </div>
                <div className="bg-blue-50 p-2 rounded-xl border border-blue-100 text-center">
                  <FiCheckCircle className="mx-auto text-blue-600 mb-1" />
                  <span className="block text-xl font-bold text-gray-800">{isLive ? "ON" : "OFF"}</span>
                  <span className="text-[10px] text-blue-700 font-medium">Status</span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <FiMessageSquare className="text-gray-500" />
                <span className="font-bold text-gray-700 text-sm">Class Chat</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs mt-10">No messages yet</p>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`text-sm p-2 rounded-lg ${msg.role === 'teacher' ? 'bg-indigo-50 ml-auto max-w-[85%]' : 'bg-gray-100 mr-auto max-w-[85%]'}`}>
                      <p className="text-[10px] font-bold text-gray-500 mb-0.5">{msg.userName}</p>
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