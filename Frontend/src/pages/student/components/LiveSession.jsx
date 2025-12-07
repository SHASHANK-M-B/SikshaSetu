import { joinLiveSession } from "@/api/student";
import React, { useEffect, useState } from "react";
import {
  FiThumbsUp,
  FiHelpCircle,
  FiSend,
  FiVolume2,
  FiVolumeX,
  FiDownload,
} from "react-icons/fi";

export default function LiveAudio() {
  const [joined, setJoined] = useState(false);
  const [activeClass, setActiveClass] = useState(null);
  const [slideIndex, setSlideIndex] = useState(null);
  const [micOn, setMicOn] = useState(false);
  const [msg, setMsg] = useState("");
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [liveClassess, SetLiveClasses] = useState([]);

  const isMobile = window.innerWidth < 768;

  /* ⭐ Dummy Upcoming Classes */
  const dummyClasses = [
    {
      id: 1,
      title: "AI – Introduction to Machine Learning",
      mentor: "Sanath",
      date: "29 Nov 2025",
      time: "10:00 AM",
      materialUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 2,
      title: "VLSI – CMOS Design Basics",
      mentor: "Pavan",
      date: "29 Nov 2025",
      time: "11:00 AM",
      materialUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 3,
      title: "DBMS – SQL Joins & Queries",
      mentor: "Rahul Kumar",
      date: "30 Nov 2025",
      time: "09:30 AM",
      materialUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];

  /* Listen to slide updates */
  useEffect(() => {
    window.addEventListener("edu_push_present", (e) =>
      setSlideIndex(e.detail.slideIndex)
    );
  }, []);

  const sendMsg = () => {
    if (!msg.trim()) return;

    window.dispatchEvent(
      new CustomEvent("edu_discussion", {
        detail: { text: msg, by: "student" },
      })
    );

    setMsg("");
  };

  /* -----------------------------------------------------
            DOWNLOAD MATERIAL
    ------------------------------------------------------ */

  const downloadNow = async () => {
    setShowDownloadPopup(false);

    const url = activeClass.materialUrl;
    const response = await fetch(url);
    const blob = await response.blob();

    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${activeClass.title}-material.pdf`;
    link.click();

    alert("Material Downloaded Successfully!");
  };

  const downloadWhenOnline = () => {
    setShowDownloadPopup(false);
    alert("Download scheduled. It will start once network is available.");

    window.addEventListener(
      "online",
      () => {
        downloadNow();
      },
      { once: true }
    );
  };

  const joinLiveSessionDetails = async () => {
    try {
      const response = await joinLiveSession();
      SetLiveClasses(response.data.liveClasses);
    } catch (error) {}
  };

  useEffect(() => {
    joinLiveSessionDetails();
  }, []);
  /* -----------------------------------------------------
            MOBILE LIVE UI
    ------------------------------------------------------ */
  if (joined && isMobile) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black text-white flex flex-col">
        {/* TOP */}
        <div className="flex flex-col items-center py-4">
          <span className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold mb-2">
            LIVE
          </span>
          <span className="font-semibold text-lg">{activeClass?.title}</span>
          <span className="text-gray-300 text-sm mt-1">
            {activeClass?.date} • {activeClass?.time}
          </span>
        </div>

        {/* SLIDE */}
        <div className="flex-1 flex items-center justify-center">
          {slideIndex !== null ? (
            <h1 className="text-4xl font-bold opacity-80">
              Slide {slideIndex + 1}
            </h1>
          ) : (
            <p className="opacity-50">Waiting…</p>
          )}
        </div>

        {/* DOWNLOAD BUTTON */}
        <div className="p-3 text-center">
          <button
            onClick={() => setShowDownloadPopup(true)}
            className="bg-indigo-600 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto"
          >
            <FiDownload /> Download Material
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-6 pb-3">
          <button
            onClick={() => setMicOn(!micOn)}
            className="bg-gray-800 p-4 rounded-full"
          >
            {micOn ? <FiVolume2 /> : <FiVolumeX />}
          </button>

          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("edu_reaction", {
                  detail: { type: "understood" },
                })
              )
            }
            className="bg-gray-800 p-4 rounded-full"
          >
            <FiThumbsUp />
          </button>

          <button
            onClick={() => {
              const q = prompt("Your Doubt?");
              if (q)
                window.dispatchEvent(
                  new CustomEvent("edu_reaction", {
                    detail: { type: "doubt", message: q },
                  })
                );
            }}
            className="bg-gray-800 p-4 rounded-full"
          >
            <FiHelpCircle />
          </button>

          <button
            className="bg-red-600 p-4 rounded-full"
            onClick={() => setJoined(false)}
          >
            Exit
          </button>
        </div>

        {/* INPUT */}
        <div className="flex gap-2 p-3 border-t border-gray-700">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 bg-gray-800 rounded-lg px-3 py-2 outline-none text-sm"
            placeholder="Ask me something..."
          />
          <button
            onClick={sendMsg}
            className="bg-indigo-600 px-5 rounded-lg font-semibold"
          >
            <FiSend />
          </button>
        </div>

        {/* POPUP */}
        {showDownloadPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white text-black rounded-xl p-6 w-80 text-center space-y-4">
              <h2 className="text-xl font-bold">Download Material</h2>

              <button
                onClick={downloadNow}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold"
              >
                Download Now
              </button>

              <button
                onClick={downloadWhenOnline}
                className="w-full bg-gray-200 py-2 rounded-lg font-semibold"
              >
                Download When Network Available
              </button>

              <button
                onClick={() => setShowDownloadPopup(false)}
                className="text-red-600 font-semibold mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* -----------------------------------------------------
            DESKTOP LIVE UI
    ------------------------------------------------------ */
  if (joined && !isMobile) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        {/* TOP BAR */}
        <div className="flex flex-col items-center justify-center py-4 bg-white border-b">
          <span className="bg-red-600 px-4 py-1 rounded-lg text-sm font-bold text-white mb-1">
            LIVE
          </span>
          <span className="font-semibold text-2xl text-gray-800">
            {activeClass?.title}
          </span>

          {/* TIMING */}
          <span className="text-gray-500 mt-1">
            {activeClass?.date} • {activeClass?.time}
          </span>
        </div>

        {/* MAIN */}
        <div className="flex flex-col items-center gap-10 px-8 py-10">
          {/* Slide */}
          <div className="w-full max-w-4xl h-[380px] rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center shadow-md">
            {slideIndex !== null ? (
              <h1 className="text-5xl font-bold text-gray-800 opacity-80">
                Slide {slideIndex + 1}
              </h1>
            ) : (
              <span className="opacity-40 text-gray-500">Waiting…</span>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={() => setShowDownloadPopup(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md"
          >
            <FiDownload size={20} /> Download Material
          </button>

          {/* Controls */}
          <div className="flex gap-5">
            <button
              onClick={() => setMicOn(!micOn)}
              className="p-4 rounded-full border bg-gray-100 hover:bg-gray-200 shadow"
            >
              {micOn ? <FiVolume2 size={24} /> : <FiVolumeX size={24} />}
            </button>

            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("edu_reaction", {
                    detail: { type: "understood" },
                  })
                )
              }
              className="px-6 py-3 rounded-xl border bg-gray-100 hover:bg-gray-200 font-semibold shadow"
            >
              👍 Understood
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-2 w-full max-w-4xl">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 outline-none text-gray-700 bg-white shadow"
              placeholder="Ask me something..."
            />

            <button
              onClick={sendMsg}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-lg font-semibold text-white shadow-lg"
            >
              <FiSend />
            </button>
          </div>
        </div>

        {/* POPUP */}
        {showDownloadPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white text-black rounded-xl p-6 w-96 text-center space-y-4">
              <h2 className="text-2xl font-bold">Download Material</h2>

              <button
                onClick={downloadNow}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
              >
                Download Now
              </button>

              <button
                onClick={downloadWhenOnline}
                className="w-full bg-gray-200 py-3 rounded-lg font-semibold"
              >
                Download When Network Available
              </button>

              <button
                onClick={() => setShowDownloadPopup(false)}
                className="text-red-600 font-semibold mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* -----------------------------------------------------
        BEFORE JOIN — CLEAN MODERN UI + TIMINGS
    ------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Live Classes
      </h1>

      <div className="hidden md:flex flex-col gap-6 w-full max-w-4xl">
        {dummyClasses.map((cls) => {
          const classTimestamp = new Date(`${cls.date} ${cls.time}`).getTime();
          const materialAvailable =
            Date.now() >= classTimestamp - 24 * 60 * 60 * 1000;

          return (
            <div
              key={cls.id}
              className="flex items-center justify-between bg-[#f4f4f8] rounded-2xl p-6 shadow border border-gray-200"
            >
              {/* LEFT TEXT */}
              <div className="flex flex-col">
                <p className="text-2xl font-bold text-gray-900">{cls.title}</p>
                <p className="text-gray-600 text-lg">{cls.mentor}</p>

                {/* TIMINGS */}
                <p className="text-gray-500 text-sm mt-1">
                  🕒 {cls.date} • {cls.time}
                </p>
              </div>

              {/* RIGHT BUTTONS */}
              <div className="flex items-center gap-4">
                {/* Download Material */}
                {materialAvailable && (
                  <button
                    onClick={() => {
                      setActiveClass(cls);
                      setShowDownloadPopup(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md"
                  >
                    <FiDownload /> Download Material
                  </button>
                )}

                {/* Join Session */}
                <button
                  onClick={() => {
                    setActiveClass(cls);
                    setJoined(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
                >
                  Join Session
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup for Before Join */}
      {showDownloadPopup && activeClass && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white text-black rounded-xl p-6 w-96 text-center space-y-4">
            <h2 className="text-2xl font-bold">Download Material</h2>

            <button
              onClick={downloadNow}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              Download Now
            </button>

            <button
              onClick={downloadWhenOnline}
              className="w-full bg-gray-200 py-3 rounded-lg font-semibold"
            >
              Download When Network Available
            </button>

            <button
              onClick={() => setShowDownloadPopup(false)}
              className="text-red-600 font-semibold mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
