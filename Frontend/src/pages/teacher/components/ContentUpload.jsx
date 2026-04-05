import { uploadResources } from "@/api/teacher";
import { FastForward } from "lucide-react";
import React, { useState } from "react";
import { FiFileText, FiLink, FiImage, FiTrash2, FiEye } from "react-icons/fi";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function CourseResources() {
  const [resources, setResources] = useState([]);
  const [viewItem, setViewItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    resourceType: "PDF Notes",
    title: "",
    link: "",
    file: null,
  });

  const addResource = async () => {
    if (!form.title.trim()) return alert("Enter a title");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("resourceType", form.resourceType);
      formData.append("link", form.link || "");

      if (form.file) {
        formData.append("file", form.file); // Correct file upload
      }

      const response = await uploadResources(formData);
      setLoading(false);

      // Optional: use response returned from backend instead of local id
      const newResource = {
        id: response.data?.id || Date.now(), // fallback if backend doesn't return id
        title: form.title,
        type: form.type,
        link: form.link,
        file: form.file,
      };

      setResources([newResource, ...resources]);

      // Reset form
      setForm({
        type: "PDF Notes",
        title: "",
        link: "",
        file: null,
      });

      alert("Resource added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed!");
    }
  };

  const remove = (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    setResources(resources.filter((r) => r.id !== id));
  };

  const icon = (t) => {
    if (t === "External Reference Links") return <FiLink size={22} />;
    if (t === "Images/Diagrams") return <FiImage size={22} />;
    return <FiFileText size={22} />;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-5">
      {loading && <LoadingScreen message="Uploading Resource..." />}
      {/* UPLOAD */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border mb-6">
        <h2 className="text-2xl font-bold mb-6">Upload Resource</h2>

        <select
          className="w-full border rounded-xl p-3 mb-3"
          value={form.resourceType}
          onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
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
          onChange={(e) => setForm({ ...form, title: e.target.value })}
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
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        )}

        <button
          onClick={addResource}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl w-full font-semibold shadow cursor-pointer"
        >
          {loading ? "Uploading" : "Upload"}
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

            <p>
              <b>Category:</b> {viewItem.type}
            </p>

            {/* PDF Viewer */}
            {viewItem.file && viewItem.file.type === "application/pdf" && (
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
            {viewItem.file && viewItem.file.type.includes("image") && (
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
