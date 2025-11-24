// import React, { useState } from "react";
// import { FiUsers, FiPlusCircle, FiTrash2 } from "react-icons/fi";

// export default function TeacherManagement({
//     teachers,
//     setTeachers,
//     removeTeacher,
//     viewTeacherDetails,
//     openInvite,
// }) {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");

//     const addTeacher = (e) => {
//         e.preventDefault();

//         const newId = Math.max(0, ...teachers.map((t) => t.id)) + 1;

//         const newTeacher = {
//             id: newId,
//             name,
//             email,
//             status: "Active",
//             sessions: 0,
//             reactions: 0,
//             doubts: 0,
//         };

//         setTeachers((prev) => [newTeacher, ...prev]);

//         setName("");
//         setEmail("");
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
//                     <FiUsers /> Manage Teachers ({teachers.length})
//                 </h2>

//                 <button
//                     onClick={() => openInvite("teacher")}
//                     className="px-3 py-2 bg-pink-600 text-white rounded"
//                 >
//                     Invite
//                 </button>
//             </div>

//             {/* Add New Teacher */}
//             <form
//                 onSubmit={addTeacher}
//                 className="flex gap-3 flex-wrap items-end bg-white p-4 rounded border"
//             >
//                 <input
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Teacher Name"
//                     required
//                     className="p-2 border rounded flex-1 min-w-[180px]"
//                 />

//                 <input
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Teacher Email"
//                     required
//                     className="p-2 border rounded flex-1 min-w-[220px]"
//                 />

//                 <button
//                     type="submit"
//                     className="px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-1"
//                 >
//                     <FiPlusCircle /> Add
//                 </button>
//             </form>

//             {/* Teachers List */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {teachers.map((teacher) => (
//                     <div
//                         key={teacher.id}
//                         className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between"
//                     >
//                         <div>
//                             <div className="font-semibold">{teacher.name}</div>
//                             <div className="text-sm text-gray-500">
//                                 {teacher.email}
//                             </div>
//                             <div className="text-xs mt-1">
//                                 Sessions:{" "}
//                                 <span className="font-medium">
//                                     {teacher.sessions}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={() => viewTeacherDetails(teacher)}
//                                 className="px-3 py-2 bg-white border rounded"
//                             >
//                                 View
//                             </button>

//                             <button
//                                 onClick={() => removeTeacher(teacher.id)}
//                                 className="p-2 bg-red-100 text-red-600 rounded-full"
//                             >
//                                 <FiTrash2 />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }



import React, { useState } from "react";
import { FiUsers, FiPlusCircle, FiTrash2 } from "react-icons/fi";

export default function TeacherManagement({
    teachers,
    setTeachers,
    removeTeacher,
    viewTeacherDetails,
    openInvite,
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const addTeacher = (e) => {
        e.preventDefault();

        const newId = Math.max(0, ...teachers.map((t) => t.id)) + 1;

        const newTeacher = {
            id: newId,
            name,
            email,
            status: "Active",
            sessions: 0,
            reactions: 0,
            doubts: 0,
        };

        setTeachers((prev) => [newTeacher, ...prev]);

        setName("");
        setEmail("");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                    <FiUsers /> Manage Teachers ({teachers.length})
                </h2>

                <button
                    onClick={() => openInvite("teacher")}
                    className="px-3 py-2 bg-pink-600 text-white rounded"
                >
                    Invite
                </button>
            </div>

            {/* Add New Teacher */}
            <form
                onSubmit={addTeacher}
                className="flex gap-3 flex-wrap items-end bg-white p-4 rounded border"
            >
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Teacher Name"
                    required
                    className="p-2 border rounded flex-1 min-w-[180px]"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Teacher Email"
                    required
                    className="p-2 border rounded flex-1 min-w-[220px]"
                />

                <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-1"
                >
                    <FiPlusCircle /> Add
                </button>
            </form>

            {/* Teachers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between"
                    >
                        <div>
                            <div className="font-semibold">{teacher.name}</div>
                            <div className="text-sm text-gray-500">
                                {teacher.email}
                            </div>
                            <div className="text-xs mt-1">
                                Sessions:{" "}
                                <span className="font-medium">
                                    {teacher.sessions}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => viewTeacherDetails(teacher)}
                                className="px-3 py-2 bg-white border rounded"
                            >
                                View
                            </button>

                            <button
                                onClick={() => removeTeacher(teacher.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-full"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}