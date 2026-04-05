import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";
import {
  getPendingOrganizations,
  approveOrganization,
  rejectOrganization,
} from "../../api/admin";
import ApprovalModal from "./ApprovalModal";

const OrganizationsPending = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await getPendingOrganizations();
      if (response.data.success) {
        setOrganizations(response.data.organizations || []);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleApprove = async (orgId) => {
    await approveOrganization(orgId);
    alert("Organization approved successfully!");
    fetchOrganizations();
  };

  const handleReject = async (orgId, reason) => {
    await rejectOrganization(orgId, reason);
    alert("Organization rejected successfully!");
    fetchOrganizations();
  };

  const openModal = (org) => {
    setSelectedOrg(org);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Pending Organizations
        </h2>
        <button
          onClick={fetchOrganizations}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : organizations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No pending organizations
        </div>
      ) : (
        <div className="grid gap-4">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {org.orgName}
                  </h3>
                  <p className="text-sm text-gray-600">{org.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {org.city}, {org.state} • {org.phone}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{org.address}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(org)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ApprovalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedOrg}
        type="organization"
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default OrganizationsPending;
