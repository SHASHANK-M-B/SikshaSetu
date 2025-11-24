// import React, { useEffect, useState, useCallback } from "react";
// import { FiTrash2, FiEdit3, FiDownload, FiEye, FiCheckCircle, FiAlertCircle, FiX, FiFileText, FiImage, FiVideo,FiUpload } from "react-icons/fi";

// // Utility functions (using localStorage for persistence)
// const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// const load = (k, f) => {
//     try {
//         const raw = localStorage.getItem(k);
//         return raw ? JSON.parse(raw) : f;
//     } catch {
//         console.error("Error loading state from localStorage.");
//         return f;
//     }
// };
// const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);

// // Enhanced prettySize utility
// const prettySize = (bytes) => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const units = ["B", "KB", "MB", "GB", "TB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + units[i];
// };

// // --- Custom Modal Component ---
// const Modal = ({ isOpen, title, children, onClose, footer }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
//             <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg shadow-2xl scale-100 transition-transform">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
//                     <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
//                         <FiX size={20} />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="p-6 text-gray-700 dark:text-gray-300">
//                     {children}
//                 </div>

//                 {/* Footer */}
//                 {footer && (
//                     <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
//                         {footer}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // --- Main Component ---
// export default function ContentUpload() {
//     const [file, setFile] = useState(null);
//     const [progress, setProgress] = useState(0);
//     const [uploads, setUploads] = useState(() => load("edu_uploads_v2", []));
    
//     // Edit state
//     const [editingId, setEditingId] = useState(null);
//     const [newName, setNewName] = useState("");

//     // Modal state for View/Confirm/Alert
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalContent, setModalContent] = useState(null); // {type: 'view'|'confirm_delete'|'alert', item: {}, message: ''}

//     // Success/Error message state for the upload form
//     const [uploadMessage, setUploadMessage] = useState(null);

//     // Save uploads to localStorage on change
//     useEffect(() => save("edu_uploads_v2", uploads), [uploads]);

//     // Compression simulation logic (moved outside render for stability)
//     const simulateCompression = (file) => {
//         const original = file.size;
//         let compressed = original;
//         let compressionRatio = 0.5; // Default 50%

//         if (file.type.startsWith("image/")) {
//             compressionRatio = 0.35; // 65% reduction
//         } else if (file.type.startsWith("audio/")) {
//             compressionRatio = 0.18; // 82% reduction
//         } else if (file.type.startsWith("video/")) {
//             compressionRatio = 0.10; // 90% reduction (max 8MB for large videos)
//         } else if (file.name.match(/\.(pdf|ppt|pptx|doc|docx|xls|xlsx|csv)$/i)) {
//             compressionRatio = 0.6; // 40% reduction for documents
//         }

//         compressed = Math.round(original * compressionRatio);

//         // Enforce max size limits for media simulation
//         if (file.type.startsWith("video/")) {
//             compressed = Math.min(compressed, 8 * 1024 * 1024); // Max 8MB compressed video
//         } else if (file.type.startsWith("image/")) {
//              compressed = Math.min(compressed, 1 * 1024 * 1024); // Max 1MB compressed image
//         }
        
//         // Ensure minimum size for compressed files
//         compressed = Math.max(1024 * 32, compressed); 

//         return { original, compressed, ratio: (1 - compressed / original) * 100 };
//     };

//     const startUpload = (e) => {
//         e.preventDefault();
//         if (!file) {
//             setUploadMessage({ type: 'error', text: 'Please select a file to upload.' });
//             return;
//         }
//         setUploadMessage(null);
//         setProgress(5);

//         const { original, compressed, ratio } = simulateCompression(file);

//         let p = 5;
//         const id = setInterval(() => {
//             p += Math.random() * 15;
//             setProgress(Math.min(100, Math.floor(p)));

//             if (p >= 100) {
//                 clearInterval(id);

//                 const item = {
//                     id: uid("u_"),
//                     name: file.name,
//                     original,
//                     compressed,
//                     type: file.type,
//                     at: new Date().toISOString(),
//                     ratio: ratio.toFixed(1),
//                 };

//                 setUploads([item, ...uploads]);
//                 setFile(null);
//                 setProgress(0);
//                 setUploadMessage({ type: 'success', text: `Upload complete! Compressed ${item.ratio}% (Final size: ${prettySize(compressed)})` });
//             }
//         }, 200);
//     };
    
//     // Edit/Delete Handlers
//     const handleDeleteStart = (item) => {
//         setModalContent({ 
//             type: 'confirm_delete', 
//             itemId: item.id, 
//             itemName: item.name 
//         });
//         setIsModalOpen(true);
//     };

//     const handleDeleteConfirm = useCallback(() => {
//         const id = modalContent.itemId;
//         setUploads(uploads.filter(u => u.id !== id));
//         setIsModalOpen(false);
//         setModalContent(null);
//         setUploadMessage({ type: 'info', text: `File "${modalContent.itemName}" has been deleted.` });
//     }, [uploads, modalContent]);
    
//     const handleEditStart = (item) => {
//         setEditingId(item.id);
//         setNewName(item.name);
//     };

//     const handleEditSave = (id) => {
//         if (!newName.trim()) return;
//         const updatedUploads = uploads.map(u =>
//             u.id === id ? { ...u, name: newName } : u
//         );
//         setUploads(updatedUploads);
//         setEditingId(null);
//         setNewName("");
//         setUploadMessage({ type: 'info', text: `File name updated to "${newName}".` });
//     };

//     // View/Download Handlers
//     const handleView = (item) => {
//         setModalContent({ type: 'view', item });
//         setIsModalOpen(true);
//     };

//     const handleDownload = (item) => {
//         // Simulating the download process
//         console.log(`Simulating download for: ${item.name} (Compressed Size: ${prettySize(item.compressed)})`);
//         setUploadMessage({ type: 'success', text: `Simulated download started for "${item.name}"!` });
//     };

//     const getFileIcon = (mimeType) => {
//         if (mimeType.startsWith('image/')) return <FiImage className="text-blue-500" />;
//         if (mimeType.startsWith('video/')) return <FiVideo className="text-red-500" />;
//         if (mimeType.startsWith('audio/')) return <FiFileText className="text-green-500" />;
//         if (mimeType.includes('pdf')) return <FiFileText className="text-red-500" />;
//         if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FiFileText className="text-green-600" />;
//         if (mimeType.includes('document') || mimeType.includes('word')) return <FiFileText className="text-blue-600" />;
//         return <FiFileText className="text-gray-500" />;
//     };

//     // Render Modal Content
//     const renderModalContent = () => {
//         if (!modalContent) return null;

//         if (modalContent.type === 'confirm_delete') {
//             return (
//                 <>
//                     <div className="flex items-start gap-3">
//                         <FiAlertCircle size={24} className="text-red-500 mt-1 flex-shrink-0" />
//                         <p>
//                             Are you sure you want to delete the file: <span className="font-semibold text-red-400">{modalContent.itemName}</span>? This action cannot be undone.
//                         </p>
//                     </div>
//                 </>
//             );
//         }

//         if (modalContent.type === 'view') {
//             const item = modalContent.item;
//             const compressionSavings = prettySize(item.original - item.compressed);
            
//             return (
//                 <div className="space-y-4">
//                     <h4 className="text-xl font-bold text-indigo-400 border-b pb-2 dark:border-gray-700">Compression Report</h4>
                    
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Original Size</p>
//                             <p className="font-semibold text-lg">{prettySize(item.original)}</p>
//                         </div>
//                         <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Compressed Size</p>
//                             <p className="font-semibold text-lg text-green-500">{prettySize(item.compressed)}</p>
//                         </div>
//                         <div className="p-3 col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600">
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Storage Savings</p>
//                             <p className="font-bold text-lg text-green-600 dark:text-green-400">{compressionSavings} ({item.ratio}%)</p>
//                         </div>
//                     </div>

//                     <div className="pt-2">
//                         <p className="font-semibold text-gray-900 dark:text-white">Simulated Preview:</p>
//                         <div className="mt-2 p-4 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-700">
//                             <div className="text-xl flex flex-col items-center">
//                                 {getFileIcon(item.type)}
//                                 <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                                     {item.type.startsWith('image/') ? 'Image Preview (Simulated)' : 
//                                      item.type.startsWith('video/') ? 'Video Playback (Simulated)' : 
//                                      'Document Content View (Simulated)'}
//                                 </span>
//                             </div>
//                             <p className="mt-1 font-medium text-gray-800 dark:text-white truncate">{item.name}</p>
//                         </div>
//                     </div>
//                 </div>
//             );
//         }

//         return null;
//     };

//     const renderModalFooter = () => {
//         if (!modalContent) return null;

//         if (modalContent.type === 'confirm_delete') {
//             return (
//                 <>
//                     <button
//                         onClick={() => setIsModalOpen(false)}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleDeleteConfirm}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//                     >
//                         Yes, Delete
//                     </button>
//                 </>
//             );
//         }

//         if (modalContent.type === 'view') {
//             return (
//                 <button
//                     onClick={() => setIsModalOpen(false)}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//                 >
//                     Close
//                 </button>
//             );
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-900 min-h-screen font-inter text-white">
//             <h1 className="text-3xl font-extrabold mb-6 text-indigo-400">Content Optimization Dashboard</h1>

//             {/* Upload Section */}
//             <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
//                 <h3 className="font-bold text-xl mb-4 text-gray-200">Upload Content for Compression</h3>

//                 {uploadMessage && (
//                     <div className={`p-3 mb-4 rounded-lg flex items-center gap-2 ${uploadMessage.type === 'success' ? 'bg-green-600/20 text-green-300 border-green-500' : 'bg-red-600/20 text-red-300 border-red-500'} border`}>
//                         {uploadMessage.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
//                         <p className="text-sm">{uploadMessage.text}</p>
//                     </div>
//                 )}

//                 <form onSubmit={startUpload} className="space-y-4">
//                     <label className="block">
//                         <span className="sr-only">Choose File</span>
//                         <input 
//                             type="file" 
//                             onChange={(e) => {
//                                 setFile(e.target.files?.[0] ?? null);
//                                 setUploadMessage(null);
//                             }} 
//                             // Accept a wide range of common educational media and documents
//                             accept="image/*,video/*,audio/*,.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv"
//                             className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
//                         />
//                     </label>

//                     <div className="flex gap-3 pt-2">
//                         <button 
//                             className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2" 
//                             disabled={!file || progress > 0}
//                         >
//                             <FiUpload size={18} /> Start Upload & Compress
//                         </button>

//                         <button 
//                             type="button" 
//                             onClick={() => { setFile(null); setProgress(0); setUploadMessage(null); }} 
//                             className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition disabled:opacity-50"
//                             disabled={progress > 0}
//                         >
//                             Clear Selection
//                         </button>
//                     </div>

//                     {progress > 0 && (
//                         <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mt-4">
//                             <div 
//                                 style={{ width: `${progress}%` }} 
//                                 className="h-3 bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-300 ease-out" 
//                             />
//                             <p className="text-xs text-center mt-1 text-gray-400">{progress}% Complete</p>
//                         </div>
//                     )}
//                 </form>
//             </div>

//             {/* Uploaded Files List */}
//             <div className="mt-8">
//                 <h4 className="font-bold text-2xl mb-4 text-gray-200 border-b border-gray-700 pb-2">Recent Compressed Files ({uploads.length})</h4>

//                 <ul className="space-y-4">
//                     {uploads.length === 0 && <div className="text-slate-500 p-4 text-center bg-gray-800 rounded-xl">No files uploaded yet. Start optimizing your content!</div>}

//                     {uploads.map((u) => (
//                         <li
//                             key={u.id}
//                             className={`p-4 bg-gray-800 rounded-xl flex justify-between items-center transition duration-200 border ${editingId === u.id ? 'border-indigo-400 shadow-lg' : 'border-gray-700 hover:border-indigo-500/50'}`}
//                         >
                            
//                             {editingId === u.id ? (
//                                 // EDITING VIEW
//                                 <div className="flex-1 space-y-2 pr-4">
//                                     <div className="flex items-center gap-2">
//                                         {getFileIcon(u.type)}
//                                         <input
//                                             type="text"
//                                             value={newName}
//                                             onChange={(e) => setNewName(e.target.value)}
//                                             className="w-full p-2 border border-gray-600 bg-gray-900 rounded-lg text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500"
//                                             placeholder="Enter new file name"
//                                             onKeyDown={(e) => {
//                                                 if (e.key === 'Enter') handleEditSave(u.id);
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="flex gap-2 text-sm">
//                                         <button
//                                             onClick={() => handleEditSave(u.id)}
//                                             className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
//                                             disabled={!newName.trim()}
//                                         >
//                                             Save Name
//                                         </button>
//                                         <button
//                                             onClick={() => setEditingId(null)}
//                                             className="px-3 py-1 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
//                                         >
//                                             Cancel
//                                         </button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 // DEFAULT VIEW
//                                 <div className="flex-1 pr-4">
//                                     <div className="flex items-center gap-2 text-lg font-semibold text-gray-100">
//                                         {getFileIcon(u.type)}
//                                         <span className="truncate">{u.name}</span>
//                                     </div>
//                                     <div className="text-xs text-slate-400 mt-1">
//                                         <span className="font-bold text-yellow-300">{u.ratio}% Savings</span>
//                                         <span className="mx-2">•</span>
//                                         Original: {prettySize(u.original)}
//                                         <span className="mx-2">→</span>
//                                         Compressed: <span className="text-green-400">{prettySize(u.compressed)}</span>
//                                     </div>
//                                     <div className="text-xs text-slate-500 mt-1">
//                                         Uploaded: {new Date(u.at).toLocaleString()}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Action Buttons */}
//                             <div className="flex items-center gap-2 ml-4 flex-shrink-0">
//                                 <button
//                                     onClick={() => handleView(u)}
//                                     className="p-3 text-white bg-indigo-500/10 hover:bg-indigo-500/20 rounded-full transition"
//                                     title="View Compression Details"
//                                     disabled={editingId !== null}
//                                 >
//                                     <FiEye size={18} />
//                                 </button>
//                                 <button
//                                     onClick={() => handleDownload(u)}
//                                     className="p-3 text-white bg-green-500/10 hover:bg-green-500/20 rounded-full transition"
//                                     title="Download Compressed File"
//                                     disabled={editingId !== null}
//                                 >
//                                     <FiDownload size={18} />
//                                 </button>
//                                 <button
//                                     onClick={() => handleEditStart(u)}
//                                     className="p-3 text-white bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition"
//                                     title="Edit File Name"
//                                     disabled={editingId !== null}
//                                 >
//                                     <FiEdit3 size={18} />
//                                 </button>
//                                 <button
//                                     onClick={() => handleDeleteStart(u)}
//                                     className="p-3 text-white bg-red-500/10 hover:bg-red-500/20 rounded-full transition"
//                                     title="Delete Upload"
//                                     disabled={editingId !== null}
//                                 >
//                                     <FiTrash2 size={18} />
//                                 </button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Render Custom Modal */}
//             <Modal
//                 isOpen={isModalOpen}
//                 title={modalContent?.type === 'view' ? `File Details: ${modalContent.item.name}` : 'Confirm Deletion'}
//                 onClose={() => setIsModalOpen(false)}
//                 footer={renderModalFooter()}
//             >
//                 {renderModalContent()}
//             </Modal>
//         </div>
//     );
// }





// import React, { useState } from "react";
// import { FiFileText, FiLink, FiImage, FiTrash2 } from "react-icons/fi";

// export default function CourseResources() {

//     const [resources, setResources] = useState([
//         { id:1, title:"Lecture Notes", type:"PDF Notes", desc:"Week 1 Outline" },
//         { id:2, title:"Assignment", type:"Assignment Sheets", desc:"Imperialism Essay" },
//         { id:3, title:"Sample Question Paper", type:"Sample Question Papers", desc:"Midterm Preparation" },
//         { id:4, title:"Renewable Energy Case Study", type:"External Link", desc:"External Link" },
//         { id:5, title:"Illustration 1: Wind Turbine", type:"Images/Diagrams", desc:"Diagram" },
//     ]);

//     const [form, setForm] = useState({
//         type:"PDF Notes",
//         title:"",
//     });

//     const addResource = () => {
//         if(!form.title.trim()) return;

//         setResources([
//             { id:Date.now(), title: form.title, type: form.type },
//             ...resources
//         ]);

//         setForm({ type:"PDF Notes", title:"" });
//     }

//     const remove = (id) => {
//         setResources(resources.filter(x => x.id !== id));
//     }

//     const icon = (t) => {
//         if(t === "External Link") return <FiLink size={24}/>;
//         if(t === "Images/Diagrams") return <FiImage size={24}/>;
//         return <FiFileText size={24}/>
//     }

//     return (
//         <div className="w-full max-w-3xl mx-auto p-6">

//             {/* TITLE */}
//             <h1 className="text-4xl font-bold">Course Resources</h1>
//             <p className="text-gray-500 mt-1 mb-6">General Study Materials / Attachments</p>


//             {/* LIST */}
//             <div className="space-y-4 mb-10">
//                 {resources.map(r => (
//                     <div key={r.id} className="border rounded-xl p-4 flex items-center gap-4 bg-white hover:shadow-md transition">

//                         <div className="p-3 bg-gray-100 rounded-lg">
//                             {icon(r.type)}
//                         </div>

//                         <div className="flex-1">
//                             <h3 className="font-bold text-lg">{r.title}</h3>
//                             <p className="text-gray-500 text-sm">{r.desc}</p>
//                         </div>

//                     </div>
//                 ))}
//             </div>


//             {/* UPLOAD / TABLE SECTION */}
            
//             <h2 className="font-bold text-xl mb-4">Upload Resource</h2>

//             <div className="border p-5 rounded-xl bg-white mb-8">

//                 <select 
//                     className="border p-2 rounded w-full mb-3"
//                     value={form.type}
//                     onChange={e=>setForm({...form,type:e.target.value})}
//                 >
//                     <option>PDF Notes</option>
//                     <option>Assignment Sheets</option>
//                     <option>Sample Question Papers</option>
//                     <option>External Reference Links</option>
//                     <option>Images/Diagrams</option>
//                     <option>AI Generated Summary Notes</option>

//                 </select>

//                 <input 
//                     placeholder="Title"
//                     className="border p-2 rounded w-full mb-3"
//                     value={form.title}
//                     onChange={e=>setForm({...form,title:e.target.value})}
//                 />

//                 <button 
//                     className="bg-black text-white px-5 py-2 rounded"
//                     onClick={addResource}
//                 >
//                     Upload
//                 </button>
//             </div>


//             <h2 className="font-bold text-xl mb-2">Course Resources</h2>

//             <table className="w-full border bg-white rounded overflow-hidden">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         <th className="p-3 text-left">Title</th>
//                         <th className="p-3 text-left">Type</th>
//                         <th className="w-12"></th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {resources.map(r=>(
//                         <tr key={r.id} className="border-b">
//                             <td className="p-3">{r.title}</td>
//                             <td className="p-3">{r.type}</td>
//                             <td className="p-3">
//                                 <button onClick={()=>remove(r.id)}>
//                                     <FiTrash2 className="text-red-500"/>
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>

//             </table>

//         </div>
//     )
// }


// import React, { useState } from "react";
// import { FiFileText, FiLink, FiImage, FiTrash2, FiEye } from "react-icons/fi";

// export default function CourseResources() {

//     const [resources, setResources] = useState([
//         { id:1, title:"Lecture Notes", type:"PDF Notes", desc:"Week 1 Outline" },
//         { id:2, title:"Assignment", type:"Assignment Sheets", desc:"Imperialism Essay" },
//         { id:3, title:"Sample Question Paper", type:"Sample Question Papers", desc:"Midterm Preparation" },
//         { id:4, title:"Renewable Energy Case Study", type:"External Link", desc:"External Link" },
//         { id:5, title:"Illustration 1: Wind Turbine", type:"Images/Diagrams", desc:"Diagram" },
//     ]);

//     const [form, setForm] = useState({
//         type:"PDF Notes",
//         title:"",
//     });

//     const [viewItem, setViewItem] = useState(null);

//     const addResource = () => {
//         if(!form.title.trim()) return;

//         setResources([
//             { id:Date.now(), title: form.title, type: form.type, desc:"" },
//             ...resources
//         ]);

//         setForm({ type:"PDF Notes", title:"" });
//     }

//     const remove = (id) => {
//         setResources(resources.filter(x => x.id !== id));
//     }

//     const icon = (t) => {
//         if(t === "External Link") return <FiLink size={24}/>;
//         if(t === "Images/Diagrams") return <FiImage size={24}/>;
//         return <FiFileText size={24}/>
//     }

//     return (
//         <div className="w-full max-w-3xl mx-auto p-6">

//             {/* UPLOAD FIRST */}
//             <h2 className="font-bold text-2xl mb-4">Upload Resource</h2>

//             <div className="border p-5 rounded-xl bg-white mb-10">

//                 <select 
//                     className="border p-2 rounded w-full mb-3"
//                     value={form.type}
//                     onChange={e=>setForm({...form,type:e.target.value})}
//                 >
//                     <option>PDF Notes</option>
//                     <option>Assignment Sheets</option>
//                     <option>Sample Question Papers</option>
//                     <option>External Reference Links</option>
//                     <option>Images/Diagrams</option>
//                     <option>AI Generated Summary Notes</option>
//                 </select>

//                 <input 
//                     placeholder="Title"
//                     className="border p-2 rounded w-full mb-3"
//                     value={form.title}
//                     onChange={e=>setForm({...form,title:e.target.value})}
//                 />

//                 <button 
//                     className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
//                     onClick={addResource}
//                 >
//                     Upload
//                 </button>
//             </div>


//             {/* TITLE */}
//             <h1 className="text-4xl font-bold">Course Resources</h1>
//             <p className="text-gray-500 mt-1 mb-6">General Study Materials / Attachments</p>


//             {/* CARD LIST */}
//             <div className="space-y-4 mb-10">
//                 {resources.map(r => (
//                     <div key={r.id} className="border rounded-xl p-4 flex items-center gap-4 bg-white hover:shadow-md transition">

//                         {/* ICON */}
//                         <div className="p-3 bg-gray-100 rounded-lg">
//                             {icon(r.type)}
//                         </div>

//                         {/* TITLE + DESCRIPTION */}
//                         <div className="flex-1">
//                             <h3 className="font-bold text-lg">{r.title}</h3>
//                             <p className="text-gray-500 text-sm">{r.desc}</p>
//                         </div>

//                         {/* VIEW BUTTON (ICON ONLY) */}
//                         <button 
//                             className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
//                             onClick={() => setViewItem(r)}
//                         >
//                             <FiEye size={18}/>
//                         </button>

//                     </div>
//                 ))}
//             </div>


//             {/* TABLE */}
//             <h2 className="font-bold text-xl mb-2">Course Resources</h2>

//             <table className="w-full border bg-white rounded overflow-hidden">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         <th className="p-3 text-left">Title</th>
//                         <th className="p-3 text-left">Type</th>
//                         <th className="w-12"></th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {resources.map(r=>(
//                         <tr key={r.id} className="border-b">
//                             <td className="p-3">{r.title}</td>
//                             <td className="p-3">{r.type}</td>
//                             <td className="p-3">
//                                 <button onClick={()=>remove(r.id)}>
//                                     <FiTrash2 className="text-red-500"/>
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>

//             </table>



//             {/* MODAL */}
//             {viewItem && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

//                     <div className="bg-white rounded-xl p-6 w-96 shadow-lg">

//                         <h2 className="font-bold text-xl mb-3">{viewItem.title}</h2>

//                         <p><b>Type:</b> {viewItem.type}</p>
//                         <p><b>Description:</b> {viewItem.desc || "No description"}</p>

//                         <button 
//                             className="mt-6 px-4 py-2 bg-blue-600 text-white rounded w-full hover:bg-blue-700"
//                             onClick={()=>setViewItem(null)}
//                         >
//                             Close
//                         </button>
//                     </div>

//                 </div>
//             )}

//         </div>
//     )
// }
import React, { useState } from "react";
import { FiFileText, FiLink, FiImage, FiTrash2, FiEye } from "react-icons/fi";

export default function CourseResources() {
    const [resources, setResources] = useState([]);
    const [viewItem, setViewItem] = useState(null);

    const [form, setForm] = useState({
        type: "PDF Notes",
        title: "",
        link: "",
        file: null
    });

    const addResource = () => {
        if (!form.title.trim()) return alert("Enter a title");

        const data = {
            id: Date.now(),
            title: form.title,
            type: form.type,
            link: form.link,
            file: form.file
        };

        setResources([data, ...resources]);
        setForm({ type: "PDF Notes", title: "", link: "", file: null });
    };

    const remove = (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        setResources(resources.filter(r => r.id !== id));
    };

    const icon = (t) => {
        if (t === "External Reference Links") return <FiLink size={22} />;
        if (t === "Images/Diagrams") return <FiImage size={22} />;
        return <FiFileText size={22} />;
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-5">

            {/* UPLOAD */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border mb-6">
                <h2 className="text-2xl font-bold mb-6">Upload Resource</h2>

                <select
                    className="w-full border rounded-xl p-3 mb-3"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                >
                    <option>PDF Notes</option>
                    <option>Assignment Sheets</option>
                    <option>Sample Question Papers</option>
                    <option>External Reference Links</option>
                    <option>Images/Diagrams</option>
                    <option>AI Generated Summary Notes</option>
                </select>

                <input
                    placeholder="Enter Title"
                    className="w-full border rounded-xl p-3 mb-3"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                />

                <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg"
                    className="w-full border rounded-xl p-3 mb-3"
                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                />

                {form.type === "External Reference Links" && (
                    <input
                        placeholder="Paste link here"
                        className="w-full border rounded-xl p-3 mb-3"
                        value={form.link}
                        onChange={e => setForm({ ...form, link: e.target.value })}
                    />
                )}

                <button
                    onClick={addResource}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl w-full font-semibold shadow"
                >
                    Upload
                </button>
            </div>

            {/* UPLOADED ITEMS */}
            {resources.length > 0 && (
                <>
                    <h1 className="text-xl font-bold mb-4">Uploaded Resources</h1>

                    <div className="space-y-4 mb-10">
                        {resources.map((r) => (
                            <div
                                key={r.id}
                                className="bg-white rounded-xl shadow border p-4 flex flex-wrap items-center gap-4 justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                        {icon(r.type)}
                                    </div>

                                    <div>
                                        <h3 className="font-bold">{r.title}</h3>
                                        <p className="text-xs text-gray-500">{r.type}</p>
                                        {r.file && (
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                {r.file.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        className="p-2 bg-indigo-100 rounded text-indigo-700"
                                        onClick={() => setViewItem(r)}
                                    >
                                        <FiEye />
                                    </button>

                                    <button
                                        className="p-2 bg-red-100 rounded text-red-600"
                                        onClick={() => remove(r.id)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* VIEW MODAL */}
            {viewItem && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-3 z-50">
                    <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl max-h-[90vh] overflow-auto">
                        <h2 className="text-xl font-bold mb-3">{viewItem.title}</h2>

                        <p><b>Category:</b> {viewItem.type}</p>

                        {/* PDF Viewer */}
                        {viewItem.file &&
                            viewItem.file.type === "application/pdf" && (
                                <object
                                    data={URL.createObjectURL(viewItem.file)}
                                    type="application/pdf"
                                    className="w-full h-[450px] border rounded mt-4"
                                >
                                    <p className="text-center text-sm mt-4 text-gray-500">
                                        Unable to display PDF. Please download and view.
                                    </p>
                                </object>
                        )}

                        {/* IMAGE */}
                        {viewItem.file &&
                            viewItem.file.type.includes("image") && (
                                <img
                                    src={URL.createObjectURL(viewItem.file)}
                                    className="w-full rounded mt-4"
                                    alt=""
                                />
                        )}

                        {/* LINK */}
                        {viewItem.link && (
                            <p className="mt-2 text-blue-600 underline">
                                <a href={viewItem.link} target="_blank">
                                    Open Link
                                </a>
                            </p>
                        )}

                        <button
                            onClick={() => setViewItem(null)}
                            className="mt-6 bg-indigo-600 text-white w-full py-3 rounded-xl"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
