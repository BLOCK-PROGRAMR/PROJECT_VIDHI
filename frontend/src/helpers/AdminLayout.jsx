import React, { useState } from "react";
import ReactDOM from "react-dom";

// import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
const AdminLayout = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex bg-red-500  fixed left-0 top-0">
      <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default AdminLayout;
