import React from "react";
import { FiWifiOff, FiImage, FiHeadphones, FiFileText } from "react-icons/fi";
import OfflineCard from "./ui/OfflineCard";

export default function OfflineMode({ downloadItems }) {

    const slides = downloadItems.filter(i => i.fileType === "pdf" || i.fileType === "doc").length;
    const audio = downloadItems.filter(i => i.fileType === "audio").length;
    const videos = downloadItems.filter(i => i.fileType === "video").length;

    const savedQuizHistory = 5;

    const isReady = slides + audio + videos > 0;

    return (
        <div className="space-y-10">

            <div
                className={`p-6 rounded-2xl border-l-4 shadow-md ${isReady ? "border-green-500 bg-green-50" : "border-yellow-500 bg-yellow-50"
                    }`}
            >
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <FiWifiOff className="text-indigo-600" />
                    Offline Learning Status
                </h3>

                <p className="text-gray-700 mt-1">
                    {isReady
                        ? `You have ${slides} slides, ${audio} audio files and ${videos} videos downloaded.`
                        : "No offline materials found. Download study bundles to get started."}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <OfflineCard icon={FiImage} label="Slides & Docs" count={slides} />
                <OfflineCard icon={FiHeadphones} label="Audio/Video Files" count={audio + videos} />
                <OfflineCard icon={FiFileText} label="Quiz History" count={savedQuizHistory} />
            </div>

            <button className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                Open Offline Library
            </button>
        </div>
    );
}
