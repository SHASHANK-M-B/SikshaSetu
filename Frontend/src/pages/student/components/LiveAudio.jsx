import React, { useEffect, useState } from "react";
import {
    FiThumbsUp, FiHelpCircle, FiSend, FiHeadphones,
    FiVolume2, FiVolumeX
} from "react-icons/fi";

export default function LiveAudio() {

    const [joined, setJoined] = useState(false);
    const [session, setSession] = useState(null);
    const [slideIndex, setSlideIndex] = useState(null);
    const [micOn, setMicOn] = useState(false);

    const [msg, setMsg] = useState("");

    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        window.addEventListener("edu_teacher_schedule", e => setSession(e.detail));
        window.addEventListener("edu_push_present", e => setSlideIndex(e.detail.slideIndex));
    }, []);

    const sendMsg = () =>{
        if(!msg.trim()) return;

        window.dispatchEvent(new CustomEvent("edu_discussion", {
            detail:{ text: msg, by: "student" }
        }));

        setMsg("");
    };


    /* 📱 MOBILE LIVE */
    if(joined && isMobile){

        return(
            <div className="fixed top-0 left-0 w-full h-full bg-black text-white flex flex-col">

                {/* TOP */}
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold">LIVE</span>
                    <span className="font-semibold">{session?.title}</span>
                    <span />
                </div>


                {/* SLIDE */}
                <div className="flex-1 flex items-center justify-center">
                    {slideIndex !== null ?
                        <h1 className="text-4xl font-bold opacity-80">Slide {slideIndex+1}</h1> :
                        <p className="opacity-50">Waiting…</p>
                    }
                </div>


                {/* CONTROLS */}
                <div className="flex justify-center gap-6 pb-3">

                    <button onClick={()=>setMicOn(!micOn)} className="bg-gray-800 p-4 rounded-full">
                        {micOn? <FiVolume2/>:<FiVolumeX/>}
                    </button>

                    <button className="bg-gray-800 p-4 rounded-full"
                        onClick={()=>window.dispatchEvent(new CustomEvent("edu_reaction",{detail:{type:"understood"}}))}
                    >
                        <FiThumbsUp/>
                    </button>

                    <button className="bg-gray-800 p-4 rounded-full"
                        onClick={()=>{
                            const q = prompt("Your Doubt?");
                            if(q)
                                window.dispatchEvent(new CustomEvent("edu_reaction",{detail:{type:"doubt",message:q}}));
                        }}
                    >
                        <FiHelpCircle/>
                    </button>

                    <button className="bg-red-600 p-4 rounded-full" onClick={()=>setJoined(false)}>
                        Exit
                    </button>

                </div>


                {/* INPUT */}
                <div className="flex gap-2 p-3 border-t border-gray-700">
                    <input
                        value={msg}
                        onChange={e=>setMsg(e.target.value)}
                        className="flex-1 bg-gray-800 rounded-lg px-3 py-2 outline-none text-sm"
                        placeholder="Ask me something..."
                    />
                    <button onClick={sendMsg} className="bg-indigo-600 px-5 rounded-lg font-semibold"><FiSend/></button>
                </div>

            </div>
        );
    }





    /* 🖥 DESKTOP PREMIUM LIGHT */
    if(joined && !isMobile){

        return(
            <div className="min-h-screen w-full bg-white flex flex-col">

                {/* TOP */}
                <div className="flex items-center justify-between py-5 px-10 bg-white">

                    <span className="bg-red-600 px-5 py-2 rounded-lg text-sm font-bold text-white flex items-center justify-center">
                        LIVE
                    </span>

                    <span className="font-semibold text-xl text-gray-800 tracking-wide flex-1 text-center">
                        {session?.title}
                    </span>

                    <button
                        onClick={()=> setJoined(false)}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold flex items-center justify-center"
                    >
                        Exit
                    </button>
                </div>



                <div className="flex flex-col items-center gap-10 px-8 py-10">

                    {/* SLIDE */}
                    <div className="w-full max-w-4xl h-[380px] rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center shadow-md">

                        {slideIndex !== null ?
                            <h1 className="text-5xl font-bold text-gray-800 opacity-80">Slide {slideIndex+1}</h1>
                        :
                            <span className="opacity-40 text-gray-500">Waiting…</span>
                        }

                    </div>

                    {/* CONTROLS */}
                    <div className="flex gap-5">

                        <button
                            onClick={() => setMicOn(!micOn)}
                            className="p-4 rounded-full border bg-gray-100 hover:bg-gray-200 shadow flex items-center justify-center"
                        >
                            {micOn ? <FiVolume2 size={24}/> : <FiVolumeX size={24}/> }
                        </button>

                        <button
                            onClick={()=>window.dispatchEvent(new CustomEvent("edu_reaction",{detail:{type:"understood"}}))}
                            className="px-6 py-3 rounded-xl border bg-gray-100 hover:bg-gray-200 font-semibold shadow"
                        >
                            👍 Understood
                        </button>

                    </div>

                    {/* INPUT */}
                    <div className="flex gap-2 w-full max-w-4xl">

                        <input value={msg}
                            onChange={e=>setMsg(e.target.value)}
                            className="flex-1 border rounded-lg px-4 py-2 outline-none text-gray-700 bg-white shadow"
                            placeholder="Ask me something..."
                        />

                        <button onClick={sendMsg} className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-lg font-semibold flex items-center justify-center text-white shadow-lg">
                            <FiSend/>
                        </button>

                    </div>

                </div>

            </div>
        );
    }




    /* BEFORE JOIN */
    return(
        <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-6 text-center px-6">

            <h1 className="text-4xl font-bold text-gray-900">Live Class</h1>

            {session ? (
                <div className="text-gray-600 text-lg leading-relaxed">
                    {session.title}<br/>
                    {session.date} — {session.time}
                </div>
            ) : (
                <p className="text-gray-400">Waiting for scheduled session…</p>
            )}

            <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-14 rounded-full text-xl font-semibold"
                onClick={()=> setJoined(true)}
            >
                <FiHeadphones className="inline-block mr-2"/>
                Join Class
            </button>

        </div>
    );
}
