import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation(); // Used to detect current path and highlight
  const [activeMenu, setActiveMenu] = useState(""); // State to manage which submenu to display
  const [activeSubmenu, setActiveSubmenu] = useState(""); // State to manage which submenu item is active
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("userData");

    toast.error("Logged out Succesfully");
    navigate("/login");
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setActiveSubmenu(""); // Reset submenu when clicking main menu
  };

  const handleSubmenuDisplay = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(""); // Reset active menu if already selected
    } else {
      setActiveMenu(menu);
    }
  };

  const handleSubmenuClick = (submenu) => {
    setActiveSubmenu(submenu); // Set active submenu item
  };

  return (
    <aside className="hidden  sidebar min-w-[260px] h-[112vh] bg-blue-950 text-white flex-col gap-2 items-center justify-start md:flex">
      <div className="flex items-center justify-center h-20 border-b border-blue-700">
        <img
          src="/path-to-logo.png"
          alt="Vidya Nidhi"
          className="h-12 w-12 rounded-full mr-2"
        />
        <span className="text-xl font-semibold">Vidya Nidhi</span>
      </div>

      <nav className="flex-1 px-4 py-6">
        {/* Dashboard Link */}
        <Link
          to="/admin"
          className={`flex items-center w-full p-2 my-4 rounded ${
            activeMenu === "dashboard"
              ? "bg-blue-700"
              : "bg-red-400 text-white hover:bg-blue-700"
          }`}
          onClick={() => handleMenuClick("dashboard")}
        >
          <FaHome className="mr-3" />
          Dashboard
        </Link>

        {/* Branch Management */}
        <div className="relative">
          <button
            className={`flex items-center w-full p-2 my-4 rounded ${
              activeMenu === "branch"
                ? "bg-blue-700"
                : "bg-red-400 text-white hover:bg-blue-700"
            }`}
            onClick={() => handleSubmenuDisplay("branch")}
          >
            <FaUserGraduate className="mr-3" />
            Branch Management
          </button>
          {activeMenu === "branch" && (
            <div className="flex flex-col  gap-5 ml-2 ">
              <Link
                to={"/admin/branch/create"}
                className={` text-white  p-3 hover:text-black  flex items-start hover:bg-slate-500  ${
                  activeSubmenu === "create"
                    ? " bg-slate-300 rounded text-black p-3"
                    : ""
                }`}
                onClick={() => handleSubmenuClick("create")}
              >
                Create Branch
              </Link>

              <Link
                to={"/admin/branch/view"}
                className={` text-white p-3 hover:text-black  flex items-start  hover:bg-slate-500  ${
                  activeSubmenu === "view-all"
                    ? "bg-slate-300 rounded text-black p-3"
                    : ""
                }`}
                onClick={() => handleSubmenuClick("view-all")}
              >
                View All Branches
              </Link>
            </div>
          )}
        </div>

        {/* Academic Year Management */}
        <div className="relative">
          <button
            className={`flex items-center w-full p-2 my-4 rounded ${
              activeMenu === "academic"
                ? "bg-blue-700"
                : "bg-red-400 text-white hover:bg-blue-700"
            }`}
            onClick={() => handleSubmenuDisplay("academic")}
          >
            <FaChalkboardTeacher className="mr-3" />
            Branch Admin
          </button>
          {activeMenu === "academic" && (
            <div className="flex flex-col  ml-2 gap-5">
              <Link
                to="/admin/admins/view-all-admins"
                className={`text-white p-3 hover:text-white flex  items-start   hover:bg-slate-700  ${
                  activeSubmenu === "academic-view-all"
                    ? " rounded text-black p-3"
                    : ""
                }`}
                onClick={() => handleSubmenuClick("academic-view-all")}
              >
                View All Branch Admins
              </Link>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          className="flex items-center p-2 my-4 bg-red-400 text-white hover:bg-red-700 rounded"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-3" />
          <p>Logout</p>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
