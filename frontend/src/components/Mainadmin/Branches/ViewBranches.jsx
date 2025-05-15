import React, { useState, useEffect } from "react";
import Allapi from "../../../common";
import { FiEdit, FiTrash, FiUserPlus } from "react-icons/fi"; // React Icons for Edit, Delete, and Assign Admin
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateBranch from "./UpdateBranch";
import { Link } from "react-router-dom";
const ViewBranches = () => {
  const [branches, setBranches] = useState([]);
  const [edit, setedit] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchBranches();
  }, [branches,showAdminModal]);

  // Fetch branches from the API
  const fetchBranches = async () => {
    try {
      const response = await fetch(Allapi.getBranches.url, {
        method: Allapi.getBranches.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBranches(data.branches);
      } else {
        console.error("Failed to fetch branches");
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  function onclose() {
    setedit(null);
  }
  // Handle Delete operation
  const handleDelete = async (branchId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this branch?"
    );
    if (!confirmDelete) return;

    try {
      console.log("try executed");
      const response = await fetch(`${Allapi.deletebranch.url}/${branchId}`, {
        method: Allapi.deletebranch.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      console.log("response is", res);
      if (res.success) {
        // fetchBranches();
        console.log("deleted success");
        // alert("Branch deleted successfully");
        toast.success("branch deleted successfully");
      } else {
        toast.error(res.message);
        console.error("Failed to delete branch");
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };
  //handle admin details
  const handleAssignAdmin = (branch) => {
    setSelectedBranch(branch);
    setShowAdminModal(true);
  };

  const submitAdmin = async (branch) => {
    console.log("current branch  id is", branch._id);
    try {
      const response = await fetch(Allapi.assignAdmin.url, {
        method: Allapi.assignAdmin.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...adminDetails, branchId: branch._id }),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        toast.success("Branch admin assigned successfully!");
        setShowAdminModal(false);
        // fetchBranches(); // Refresh branches to show the updated admin
      } else {
        toast.error("Failed to assign admin");
      }
    } catch (error) {
      console.error("Error assigning admin:", error.message);
    }
  };

  return (
    <div className=" relative container mx-auto p-8 bg-gray-100">
      <ToastContainer autoClose={2000} />
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Branch Management
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
          to={"/admin/admins/view-all-admins"}
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-700 hover:text-white"
        >
          View all Branch Admins
        </Link>
      </div>
      {branches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text font-semibold text-gray-900">
                  <p className="text-md text-red-600">Branch name</p>
                  {branch.name}
                </h3>
                {!branch.branchAdmin ? (
                  <button onClick={() => handleAssignAdmin(branch)} className="flex gap-2">
                    <FiUserPlus /> Assign Admin
                  </button>
                ) : (
                  <div className="bg-green-950 text-white rounded p-3">
                    Assigned
                  </div>
                )}
              </div>
              {/* Assign Admin Modal */}
              {showAdminModal && (
                <div className="modal fixed inset-0 bg-slate-500 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="cont bg-white w-[400px] p-8 rounded-lg shadow-lg">
                    <div className="head bg-red-500 text-white text-xl font-semibold p-4 rounded-t-md">
                      Assign Admin for {selectedBranch.name}
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Name"
                          onChange={(e) =>
                            setAdminDetails({
                              ...adminDetails,
                              name: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Username"
                          onChange={(e) =>
                            setAdminDetails({
                              ...adminDetails,
                              username: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          placeholder="Password"
                          onChange={(e) =>
                            setAdminDetails({
                              ...adminDetails,
                              password: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 px-4 pb-4">
                      <button
                        onClick={() => setShowAdminModal(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitAdmin(selectedBranch)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Branch Details */}
              <div className="text-sm">
                <p className="text-gray-700 font-medium mb-2">
                  <span className="text-gray-900 font-semibold">Street: </span>
                  {branch.street}
                </p>
                <p className="text-gray-700 font-medium mb-2">
                  <span className="text-gray-900 font-semibold">Colony: </span>
                  {branch.colony}
                </p>
                <p className="text-gray-700 font-medium mb-2">
                  <span className="text-gray-900 font-semibold">
                    VillageTown:{" "}
                  </span>
                  {branch.villageTown}
                </p>
                <p className="text-gray-700 font-medium mb-2">
                  <span className="text-gray-900 font-semibold">Phone: </span>
                  {branch.phone}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    setedit(branch);
                  }}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <FiEdit className="mr-2" />
                  
                </button>

                <button
                  onClick={() => handleDelete(branch._id)}
                  className="flex items-center text-red-500 hover:text-red-700"
                >
                  <FiTrash className="mr-2" />
                  
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No branches found.</p>
      )}
      {edit && <UpdateBranch data={edit} onclose={onclose} />}
    </div>
  );
};

export default ViewBranches;
