import React, { useState } from "react";
import { FiX, FiCheck, FiXCircle } from "react-icons/fi";

const ApprovalModal = ({
  isOpen,
  onClose,
  item,
  type,
  onApprove,
  onReject,
}) => {
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(item.id);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    setLoading(true);
    try {
      await onReject(item.id, reason);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {type === "organization"
            ? "Organization"
            : type === "teacher"
            ? "Teacher"
            : "Student"}{" "}
          Approval
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs text-gray-500">Name</p>
          <p className="text-sm font-semibold text-gray-800">
            {item.orgName || item.name || item.studentName}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm font-semibold text-gray-800">{item.email}</p>
        </div>
        {type === "organization" && (
          <>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-semibold text-gray-800">
                {item.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-semibold text-gray-800">
                {item.city}, {item.state}
              </p>
            </div>
          </>
        )}
        {(type === "teacher" || type === "student") && (
          <>
            <div>
              <p className="text-xs text-gray-500">Organization Code</p>
              <p className="text-sm font-semibold text-gray-800">
                {item.orgCode}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Subject</p>
              <p className="text-sm font-semibold text-gray-800">
                {item.subject}
              </p>
            </div>
          </>
        )}
      </div>

      {!action && (
        <div className="flex gap-3">
          <button
            onClick={() => setAction("approve")}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          >
            <FiCheck className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => setAction("reject")}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          >
            <FiXCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}

      {action === "approve" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            System will generate credentials and send email notification.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Processing..." : "Confirm Approval"}
            </button>
            <button
              onClick={() => setAction(null)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {action === "reject" && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Rejection Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rejection"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Processing..." : "Confirm Rejection"}
            </button>
            <button
              onClick={() => setAction(null)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalModal;
