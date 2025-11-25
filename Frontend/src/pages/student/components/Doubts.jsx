import React, { useState } from "react";

export default function Doubts({ doubtItems, handleSubmitDoubt }) {

    const [text, setText] = useState("");

    const sendDoubt = () => {
        if (!text.trim()) return;
        handleSubmitDoubt(text);
        setText("");
    };

    return (
        <div className="flex flex-col h-[70vh] md:h-[80vh] lg:h-[85vh] p-2 md:p-4">

            {/* messages list */}
            <div className="
                flex-1 overflow-y-auto
                p-3 md:p-4
                space-y-4
                bg-gray-50
                rounded-xl
                border
                shadow-inner
                flex flex-col
            ">
                {doubtItems.map(d => (
                    <div
                        key={d.id}
                        className={`w-fit max-w-[85%] md:max-w-[60%] lg:max-w-[50%] px-4 py-3 rounded-xl shadow text-sm
                            ${d.status === "answered"
                                ? "bg-blue-100 self-start"
                                : "bg-green-100 self-end"
                            }
                        `}
                    >
                        <p className="font-medium text-gray-800 break-words">{d.text}</p>

                        <p className="text-xs text-gray-600 mt-1">{d.time}</p>

                        {d.reply && (
                            <p className="mt-2 p-2 bg-white rounded-lg text-gray-700 shadow break-words">
                                <b>Teacher:</b> {d.reply}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* input + button */}
            <div
                className="
                    mt-4 
                    flex 
                    flex-wrap 
                    gap-2 md:gap-3 
                    items-center
                "
            >
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your doubt…"
                    className="
                        flex-1 
                        min-w-[60%]
                        p-2 md:p-3 
                        rounded-xl 
                        border 
                        shadow-sm 
                        focus:ring-indigo-400 
                        focus:border-indigo-400
                        text-sm md:text-base
                    "
                    onKeyDown={(e) => e.key === "Enter" && sendDoubt()}
                />

                <button
                    onClick={sendDoubt}
                    className="
                        px-4 md:px-6 
                        py-2
                        bg-indigo-600
                        text-white
                        rounded-xl
                        font-semibold
                        hover:bg-indigo-700
                        text-sm md:text-base
                        w-auto
                    "
                >
                    Send
                </button>
            </div>
        </div>
    );
}



// import React, { useState, useRef, useEffect } from "react";

// export default function Doubts({ doubtItems, handleSubmitDoubt }) {

//     const [text, setText] = useState("");
//     const scrollRef = useRef(null);

//     const sendDoubt = () => {
//         if (!text.trim()) return;

//         handleSubmitDoubt(text);
//         setText("");
//     };

//     // Auto-scroll to bottom on new message
//     useEffect(() => {
//         scrollRef.current?.scrollTo({
//             top: scrollRef.current.scrollHeight,
//             behavior: "smooth",
//         });
//     }, [doubtItems]);

//     return (
//         <div className="flex flex-col w-full h-[80vh] max-h-[100vh] 
//                         bg-white sm:bg-gray-50
//                         rounded-none sm:rounded-xl
//                         sm:border sm:shadow-sm">

//             {/* CHAT AREA */}
//             <div
//                 ref={scrollRef}
//                 className="flex-1 overflow-y-auto 
//                            p-3 sm:p-4 
//                            space-y-3 
//                            bg-gradient-to-b from-gray-50 to-white
//                            rounded-none sm:rounded-xl"
//             >
//                 {doubtItems.map((d) => (
//                     <div
//                         key={d.id}
//                         className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm 
//                                     flex flex-col
//                             ${d.sender === "teacher"
//                                 ? "bg-indigo-200 self-start"
//                                 : "bg-emerald-200 self-end"
//                             }`}
//                     >
//                         <p className="font-medium text-gray-900">{d.text}</p>

//                         <p className="text-[11px] text-gray-600 mt-1">{d.time}</p>
//                     </div>
//                 ))}
//             </div>

//             {/* INPUT BAR */}
//             <div className="p-3 sm:p-4 w-full flex gap-3 bg-white border-t">

//                 <input
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     placeholder="Write your message..."
//                     onKeyDown={(e) => e.key === "Enter" && sendDoubt()}
//                     className="flex-1 p-3 rounded-xl border bg-white text-sm
//                                shadow focus:ring-indigo-400 focus:border-indigo-400 outline-none"
//                 />

//                 <button
//                     onClick={sendDoubt}
//                     className="px-6 py-3 rounded-xl text-sm font-semibold
//                                bg-gradient-to-r from-indigo-600 to-blue-600 text-white
//                                hover:opacity-90 active:scale-95 transition-all"
//                 >
//                     Send
//                 </button>

//             </div>

//         </div>
//     );
// }
