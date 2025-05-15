

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Allapi from "../../../common";
import { mycon } from "../../../store/Mycontext";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import EditAcademicYearModal from "./EditAcademicYear";
import "./animation.css";

const ViewAcademicYears = () => {
  const { c_branch, branchdet, setBranchdet, c_acad, setc_acad } =
    useContext(mycon);
  // console.log(c_branch, branchdet, setBranchdet, c_acad, setc_acad)
  const [academicYears, setAcademicYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
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
        console.log("branchdet in ADD JSX   is", branchdet);
        // console.log("Branch data fetched successfully:", res.data);
      } else {
        toast.error("Failed to fetch branch details");
      }
    } catch (error) {
      console.error("Error fetching branch by ID:", error);
      toast.error("Error occurred while fetching branch details");
    }
  };

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await fetch(Allapi.getAcademicYears.url(c_branch), {
          method: Allapi.getAcademicYears.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch academic years");
        }

        const res = await response.json();
        // Sort academic years to show the last added one at the top

        setAcademicYears(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching academic years:", error);
        toast.error("Failed to fetch academic years");
        setIsLoading(false);
      }
    };

    fetchAcademicYears();
  }, [c_branch, c_acad, selectedAcademicYear]);

  const handleDelete = async (id, bid) => {
    console.log("c_branch is now", bid);
    if (window.confirm("Are you sure you want to delete this academic year?")) {
      try {
        const response = await fetch(Allapi.deleteAcademicYear.url(bid, id), {
          method: Allapi.deleteAcademicYear.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Academic year deleted successfully");
          const updatedyears = data.sortedYears;
          setAcademicYears(updatedyears);
          fetchBranchById(bid);

          // const updatedyears = academicYears.filter((year) => year._id !== id);
          // setAcademicYears(updatedyears);
          updatedyears[0] ? setc_acad(updatedyears[0]) : "";
        } else {

          toast.error(data.message || "Failed to delete academic year");
        }
      } catch (error) {
        console.error("Error deleting academic year:", error);
        toast.error("An error occurred while deleting the academic year");
      }
    }
  };

  const openEditModal = (year) => {
    setSelectedAcademicYear(year);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedAcademicYear(null);
  };

  return (
    <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-7xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Academic Years for {branchdet ? branchdet.name : "Loading..."} Branch
      </h2>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className={`overflow-x-auto animate-slide-down`}>
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b-2 p-3 text-gray-800">#</th>
                <th className="border-b-2 p-3 text-gray-800">Academic Year</th>
                <th className="border-b-2 p-3 text-gray-800">Start Date</th>
                <th className="border-b-2 p-3 text-gray-800">End Date</th>
                <th className="border-b-2 p-3 text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.length > 0 ? (
                academicYears.map((year, index) => (
                  <tr
                    key={year._id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="border-b p-3 text-center text-gray-800">
                      {index + 1}
                    </td>
                    <td className="border-b p-3 text-gray-800">{year.year}</td>
                    <td className="border-b p-3 text-gray-800">
                      {new Date(year.startDate).toLocaleDateString()}
                    </td>
                    <td className="border-b p-3 text-gray-800">
                      {new Date(year.endDate).toLocaleDateString()}
                    </td>
                    <td className="border-b p-3 text-center">
                      {index === 0 ? (
                        <>
                          <Link
                            to={`/branch-admin/academic-year/add-class/${year._id}`}
                            className="text-white bg-green-500 p-2 rounded hover:text-green-700 mr-2"
                          >
                            Add classes
                          </Link>
                          <button
                            onClick={() => openEditModal(year)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(year._id, c_branch);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* <button
                            onClick={() => openEditModal(year)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            <FaEdit />
                          </button> */}
                          <button
                            onClick={() => handleDelete(year._id, c_branch)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3 text-gray-500">
                    No academic years found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {selectedAcademicYear && (
        <EditAcademicYearModal
          isOpen={isModalOpen}
          onClose={closeEditModal}
          academicYear={selectedAcademicYear}
          setAcademicYears={setAcademicYears}
        />
      )}
    </div>
  );
};

export default ViewAcademicYears;
