import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";

import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaMoneyBill,
  FaSchool,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
} from "react-icons/fa";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [c_user, setc_user] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setc_user(decoded); // Set decoded user only once
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
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
            <h2 className="text-2xl font-semibold">
              Welcome, {c_user ? c_user.name : "....loading"}
            </h2>
            <p className="text-gray-600">
              Here's a quick overview of the school.
            </p>
          </div>

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Total Students</h3>
              <p className="text-3xl mt-2">1,200</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Total Teachers</h3>
              <p className="text-3xl mt-2">75</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Total Branches</h3>
              <p className="text-3xl mt-2">4</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Fees Collected</h3>
              <p className="text-3xl mt-2">₹ 50,00,000</p>
            </div>
          </div>

          {/* Graphs & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Student Performance
              </h3>
              {/* Insert Chart Component */}
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Attendance Rates</h3>
              {/* Insert Chart Component */}
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Announcements/Notifications */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold mb-4">Announcements</h3>
            <ul>
              <li className="mb-3">New exam schedule has been released.</li>
              <li className="mb-3">
                Parent-teacher meetings will be held next week.
              </li>
              <li className="mb-3">
                School will be closed on national holidays.
              </li>
            </ul>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 shadow text-center">
          <p className="text-gray-600">
            &copy; 2024 Vidya Nidhi School. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
