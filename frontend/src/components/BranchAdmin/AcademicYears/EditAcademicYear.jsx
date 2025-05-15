import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa"; // Icon for closing the modal
import Allapi from "../../../common"; // Import your API endpoint definitions
import { toast } from "react-toastify";

const EditAcademicYearModal = ({ isOpen, onClose, academicYear, setAcademicYears }) => {
  const [year, setYear] = useState(academicYear.year);
  const [startDate, setStartDate] = useState(academicYear.startDate);
  const [endDate, setEndDate] = useState(academicYear.endDate);

  useEffect(() => {
    setYear(academicYear.year);
    setStartDate(academicYear.startDate);
    setEndDate(academicYear.endDate);
  }, [academicYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedYear = { year, startDate, endDate };

    try {
      const response = await fetch(Allapi.editAcademicYear.url(academicYear._id), {
        method: Allapi.editAcademicYear.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedYear),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Academic year updated successfully");
        setAcademicYears((prevYears) =>
          prevYears.map((year) => (year._id === academicYear._id ? data.academicYear : year))
        ); // Update the local state
      } else {
        toast.error(data.message || "Failed to update academic year");
      }
    } catch (error) {
      console.error("Error updating academic year:", error);
      toast.error("An error occurred while updating the academic year");
    }

    onClose(); // Close modal after submission
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Academic Year</h2>
            <button onClick={onClose}>
              <FaTimes className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Academic Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate.split("T")[0]} // Format the date for input
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate.split("T")[0]} // Format the date for input
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default EditAcademicYearModal;
