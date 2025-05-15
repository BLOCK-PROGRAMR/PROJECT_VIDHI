import React, { useEffect, useState } from "react";
import Allapi from "../../../common";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import EditAdminModal from "./UpdateBadmin"; // Import the Modal

const ViewBadmin = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(Allapi.getAllBranchAdmins.url, {
        method: Allapi.getAllBranchAdmins.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setAdmins(data.admins);
    } catch (error) {
      console.error("Error fetching branch admins:", error);
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setModalOpen(true);
  };

  const handleDelete = async (adminId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(Allapi.deleteBranchAdmin.url(adminId), {
        method: Allapi.deleteBranchAdmin.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Branch admin deleted successfully");
        fetchAdmins(); // Refresh the list after deletion
      } else {
        toast.error("Failed to delete branch admin");
      }
    } catch (error) {
      console.error("Error deleting branch admin:", error);
      toast.error("Error occurred while deleting admin");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleEditSubmit = async (updatedAdmin) => {
    try {
      const response = await fetch(Allapi.editBranchAdmin.url(updatedAdmin._id), {
        method: Allapi.editBranchAdmin.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAdmin),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Branch admin updated successfully");
        fetchAdmins(); // Refresh the list after update
        handleModalClose();
      } else {
        toast.error("Failed to update branch admin");
      }
    } catch (error) {
      console.error("Error updating branch admin:", error);
      toast.error("Error occurred while updating admin");
    }
  };

  return (
    <div className="relative container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <ToastContainer autoClose={2000} />
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        All Branch Admins
      </h2>
      <div className="absolute top-5 right-5">
        <Link
          to={"/admin/branch/create"}
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-700 hover:text-white"
        >
          Create Branch
        </Link>
      </div>
      <div className="absolute top-20 right-5">
        <Link
          to={"/admin/branch/view"}
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-700 hover:text-white"
        >
          View all Branches
        </Link>
      </div>

      {admins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <p className="text-xl font-semibold text-gray-800">
                {admin.name}
              </p>
              <p className="text-gray-600">Username: {admin.username}</p>
              <p className="text-gray-600">
                Branch: {admin.branch ? admin.branch.name : "Unassigned"}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(admin)}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <FiEdit className="mr-2" />
                </button>
                <button
                  onClick={() => handleDelete(admin._id)}
                  className="flex items-center text-red-500 hover:text-red-700"
                >
                  <FiTrash className="mr-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">
          No branch admins found.
        </p>
      )}

      <EditAdminModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        admin={selectedAdmin}
        onEdit={handleEditSubmit}
      />
    </div>
  );
};

export default ViewBadmin;
