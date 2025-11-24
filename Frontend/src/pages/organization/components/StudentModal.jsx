// import React from "react";
// import { FiX } from "react-icons/fi";
// import InfoCard from "./ui/InfoCard";

// export default function StudentModal({ student, onClose }) {
//     if (!student) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//             <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg overflow-hidden">

//                 {/* Header */}
//                 <div className="flex items-center justify-between p-4 border-b">
//                     <h3 className="font-semibold text-lg">
//                         Student - {student.name}
//                     </h3>
//                     <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
//                         <FiX />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="p-6 space-y-6">

//                     <div className="flex items-center justify-between">
//                         <div>
//                             <div className="text-lg font-semibold">{student.name}</div>
//                             <div className="text-sm text-gray-500">{student.email}</div>
//                             <div className="text-sm mt-1">
//                                 Courses: <span className="font-semibold">{student.enrolled}</span>
//                             </div>
//                         </div>

//                         <div className="text-right">
//                             <div className="text-sm text-gray-500">Attendance</div>
//                             <div className="text-2xl font-bold">{student.attendance}%</div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                         <InfoCard title="Recent Quiz Scores">
//                             <ul className="text-sm space-y-1">
//                                 {student.quizzes.map((q, i) => (
//                                     <li key={i}>
//                                         {q.title}:{" "}
//                                         <span className="font-semibold">{q.score}%</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </InfoCard>

//                         <InfoCard title="Streaks & Badges">
//                             <p>
//                                 Streak:{" "}
//                                 <span className="font-bold">{student.streak} days</span>
//                             </p>

//                             <div className="mt-2 flex gap-2">
//                                 {student.badges.map((b, i) => (
//                                     <span
//                                         key={i}
//                                         className="px-2 py-1 bg-yellow-100 rounded-full text-xs"
//                                     >
//                                         {b}
//                                     </span>
//                                 ))}
//                             </div>
//                         </InfoCard>

//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }


import React from "react";
import { FiX } from "react-icons/fi";
import InfoCard from "./ui/InfoCard";

export default function StudentModal({ student, onClose }) {
    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">
                        Student - {student.name}
                    </h3>
                    {/* The FiX button calls the passed-in onClose function */}
                    <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <FiX />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-lg font-semibold">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                            <div className="text-sm mt-1">
                                Courses: <span className="font-semibold">{student.enrolled}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-gray-500">Attendance</div>
                            <div className="text-2xl font-bold">{student.attendance}%</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <InfoCard title="Recent Quiz Scores">
                            <ul className="text-sm space-y-1">
                                {student.quizzes.map((q, i) => (
                                    <li key={i}>
                                        {q.title}:{" "}
                                        <span className="font-semibold">{q.score}%</span>
                                    </li>
                                ))}
                            </ul>
                        </InfoCard>

                        <InfoCard title="Streaks & Badges">
                            <p>
                                Streak:{" "}
                                <span className="font-bold">{student.streak} days</span>
                            </p>

                            <div className="mt-2 flex gap-2">
                                {student.badges.map((b, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-yellow-100 rounded-full text-xs"
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>
                        </InfoCard>

                    </div>
                </div>

            </div>
        </div>
    );
}