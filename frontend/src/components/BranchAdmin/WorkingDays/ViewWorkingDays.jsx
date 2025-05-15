import React, { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";

const ViewAndUpdateWorkingDays = () => {
  const { branchdet } = useContext(mycon);
  const [workingDays, setWorkingDays] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedWorkingDays, setUpdatedWorkingDays] = useState({});
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");
  const [acid, setAcid] = useState("");

  const curracad = async (bid) => {
    try {
      const response = await fetch(Allapi.getAcademicYears.url(bid), {
        method: Allapi.getAcademicYears.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch academic years");

      const res = await response.json();
      if (res.success && res.data.length > 0) {
        const latestAcademicYear = res.data
          .sort((a, b) => {
            const [startA, endA] = a.year.split("-").map(Number);
            const [startB, endB] = b.year.split("-").map(Number);
            return startB - startA || endB - endA;
          })[0];

        setAcid(latestAcademicYear._id);
        setCurrentAcademicYear(latestAcademicYear.year);
      }
    } catch (error) {
      toast.error("Failed to fetch academic year");
    }
  };

  const fetchWorkingDays = async (branchId, academicId) => {
    try {
      const response = await fetch(
        Allapi.getWorkingDays.url(branchId, academicId),
        {
          method: Allapi.getWorkingDays.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setWorkingDays(result.data);
        setUpdatedWorkingDays(result.data.months);
      } else {
        toast.error("Failed to fetch working days");
      }
    } catch (error) {
      toast.error("An error occurred while fetching working days");
    }
  };

  const handleInputChange = (month, value) => {
    const numValue = Math.min(Math.max(Number(value), 0), 30); // Ensure value is between 0 and 30
    setUpdatedWorkingDays((prev) => ({
      ...prev,
      [month]: numValue,
    }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        months: updatedWorkingDays,
      };

      const response = await fetch(
        Allapi.updateWorkingDays.url(branchdet._id, acid),
        {
          method: Allapi.updateWorkingDays.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Working days updated successfully");
        setWorkingDays(result.data);
        setIsEditing(false);
      } else {
        toast.error(result.message || "Failed to update working days");
      }
    } catch (error) {
      toast.error("An error occurred while updating working days");
    }
  };

  useEffect(() => {
    if (branchdet?._id) {
      curracad(branchdet._id);
    }
  }, [branchdet]);

  useEffect(() => {
    if (branchdet?._id && acid) {
      fetchWorkingDays(branchdet._id, acid);
    }
  }, [branchdet, acid]);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          View and Update Working Days
        </h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <input
            type="text"
            value={currentAcademicYear}
            disabled
            className="w-full p-3 text-gray-700 border rounded bg-gray-50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                  Month
                </th>
                <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
                  Working Days
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(workingDays?.months || {}).map((month) => (
                <tr key={month}>
                  <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </td>
                  <td className="p-4 border-r border-gray-300 text-black">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={updatedWorkingDays[month] || ""}
                        onChange={(e) => handleInputChange(month, e.target.value)}
                        className="w-full p-3 text-black bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                        workingDays?.months?.[month] || "Not set" 
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEditing ? (
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 mt-6 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit Working Days
          </button>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default ViewAndUpdateWorkingDays;
