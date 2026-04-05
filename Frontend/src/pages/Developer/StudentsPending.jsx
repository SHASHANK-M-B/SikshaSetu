import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { getPendingStudents, approveStudent, rejectStudent } from "../../api/admin";
import ApprovalModal from "./ApprovalModal";

const StudentsPending = () => {
  const [students, setStudents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchStudents = async (orgId) => {
    if (!orgId) return;
    setLoading(true);
    try {
      const response = await getPendingStudents(orgId);
      if (response.data.success) {
        setStudents(response.data.students || []);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dummyOrgs = [
      { id: "org1", name: "Presidency University" },
      { id: "org2", name: "Jain University" },
      { id: "org3", name: "Rural Polytechnic College" },
    ];
    setOrganizations(dummyOrgs);
  }, []);

  const handleApprove = async (studentId) => {
    await approveStudent(studentId);
    alert("Student approved successfully!");
    fetchStudents(selectedOrgId);
  };

  const handleReject = async (studentId, reason) => {
    await rejectStudent(studentId, reason);
    alert("Student rejected successfully!");
    fetchStudents(selectedOrgId);
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending Students</h2>
        <button
          onClick={() => fetchStudents(selectedOrgId)}
          disabled={!selectedOrgId}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 transition"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Organization
        </label>
        <select
          value={selectedOrgId}
          onChange={(e) => {
            setSelectedOrgId(e.target.value);
            fetchStudents(e.target.value);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Select Organization --</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : !selectedOrgId ? (
        <div className="text-center py-12 text-gray-500">Select an organization to view pending students</div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No pending students</div>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{student.studentName}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {student.subject} • Org Code: {student.orgCode}
                  </p>
                </div>
                <button
                  onClick={() => openModal(student)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ApprovalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedStudent}
        type="student"
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default StudentsPending;