// import React from "react";
// import { FiUsers, FiTrash2 } from "react-icons/fi";

// export default function StudentManagement({
//     students,
//     removeStudent,
//     viewStudentDetails,
//     openInvite,
// }) {
//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
//                     <FiUsers /> Manage Students ({students.length})
//                 </h2>

//                 <button
//                     onClick={() => openInvite("student")}
//                     className="px-3 py-2 bg-indigo-600 text-white rounded"
//                 >
//                     Invite
//                 </button>
//             </div>

//             {/* Table */}
//             <div className="overflow-auto">
//                 <table className="min-w-full bg-white border rounded">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="p-3 text-left">ID</th>
//                             <th className="p-3 text-left">Name</th>
//                             <th className="p-3 text-left">Email</th>
//                             <th className="p-3 text-left">Courses</th>
//                             <th className="p-3 text-right">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {students.map((student) => (
//                             <tr
//                                 key={student.id}
//                                 className="border-b hover:bg-gray-50"
//                             >
//                                 <td className="p-3">{student.id}</td>
//                                 <td className="p-3">{student.name}</td>
//                                 <td className="p-3">{student.email}</td>
//                                 <td className="p-3">{student.enrolled}</td>

//                                 <td className="p-3 text-right">
//                                     <div className="flex items-center justify-end gap-2">

//                                         <button
//                                             onClick={() =>
//                                                 viewStudentDetails(student)
//                                             }
//                                             className="px-3 py-1 bg-white border rounded"
//                                         >
//                                             View
//                                         </button>

//                                         <button
//                                             onClick={() =>
//                                                 removeStudent(student.id)
//                                             }
//                                             className="p-2 bg-red-100 text-red-600 rounded-full"
//                                         >
//                                             <FiTrash2 />
//                                         </button>

//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

import React from "react";
import { FiUsers } from "react-icons/fi"; // FiTrash2 removed

export default function StudentManagement({
    students,
    removeStudent, // Still passed, but not used in UI
    viewStudentDetails,
    openInvite, // Still passed, but not used in UI
}) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                    <FiUsers /> Manage Students ({students.length})
                </h2>

                {/* Original 'Invite' button replaced with 'View Students' placeholder and logic removed */}
                <button
                    onClick={() => alert("Already viewing students")}
                    className="px-3 py-2 bg-indigo-600 text-white rounded"
                >
                    View Students
                </button>
            </div>

            {/* Table */}
            <div className="overflow-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Courses</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-3">{student.id}</td>
                                <td className="p-3">{student.name}</td>
                                <td className="p-3">{student.email}</td>
                                <td className="p-3">{student.enrolled}</td>

                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-2">

                                        <button
                                            onClick={() =>
                                                viewStudentDetails(student)
                                            }
                                            className="px-3 py-1 bg-white border rounded"
                                        >
                                            View
                                        </button>

                                        {/* Delete button (FiTrash2) removed */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}