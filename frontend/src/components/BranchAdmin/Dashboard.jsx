import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Allapi from "../../common";
import { FaBell, FaSearch } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const BranchAdminDashboard = () => {
  const [branchdet, setBranchdet] = useState(null);
  const token = localStorage.getItem("token");
  const [c_user, setc_user] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setc_user(decoded);
        // Set decoded user only once
        fetchBranchById(decoded?.branch);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const fetchBranchById = async (id) => {
    try {
      const response = await fetch(Allapi.getBranchById.url(id), {
        method: Allapi.getBranchById.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      console.log("response is", res);
      if (res.success) {
        setBranchdet(res.data);
        console.log("branchdet is", branchdet);
        // console.log("Branch data fetched successfully:", res.data);
      } else {
        toast.error("Failed to fetch branch details");
      }
    } catch (error) {
      console.error("Error fetching branch by ID:", error);
      toast.error("Error occurred while fetching branch details");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <div className="flex items-center">
            <FaSearch className="text-gray-600 mr-4" />
            <input
              type="text"
              placeholder="Search..."
              className="border rounded p-2 outline-none"
            />
          </div>
          <div className="flex items-center">
            <FaBell className="text-gray-600 mr-6" />
            <img
              src="/path-to-profile-picture.jpg"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-semibold text-blue-800">
              Welcome, {c_user?.name} Sir!
            </h2>
            <p className="text-gray-600">
              Here's an overview of your branch's activities and statistics.
            </p>

            {/* Branch Details */}
            {branchdet && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Branch Details
                </h3>
                <p className="text-gray-800">
                  <strong>Branch Name:</strong> {branchdet.name}
                </p>
                <p className="text-gray-800">
                  <strong>Phone:</strong> {branchdet.phone}
                </p>
                <p className="text-gray-800">
                  <strong>Address:</strong>{" "}
                  {`${branchdet.street}, ${branchdet.colony}, ${branchdet.villageTown}`}
                </p>
              </div>
            )}
          </div>

          {/* Branch Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Total Students</h3>
              <p className="text-3xl mt-2">320</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Total Teachers</h3>
              <p className="text-3xl mt-2">20</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Total Classes</h3>
              <p className="text-3xl mt-2">10</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Fees Collected</h3>
              <p className="text-3xl mt-2">₹ 15,00,000</p>
            </div>
          </div>

          {/* Branch Activity & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Class Attendance</h3>
              <div className="h-64 bg-gray-200 rounded"></div>{" "}
              {/* Insert Attendance Chart */}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Student Grades Overview
              </h3>
              <div className="h-64 bg-gray-200 rounded"></div>{" "}
              {/* Insert Grades Chart */}
            </div>
          </div>

          {/* Announcements for Branch */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold mb-4">Announcements</h3>
            <ul>
              <li className="mb-3">Upcoming Parent-Teacher Meetings.</li>
              <li className="mb-3">
                Branch staff meeting scheduled for Friday.
              </li>
              <li className="mb-3">Student field trip scheduled next month.</li>
            </ul>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 shadow text-center">
          <p className="text-gray-600">
            &copy; 2024 Vidya Nidhi School -{" "}
            {branchdet ? branchdet.name : "Loading..."} Branch. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default BranchAdminDashboard;
