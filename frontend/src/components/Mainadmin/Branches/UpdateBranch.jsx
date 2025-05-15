import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Allapi from "../../../common/index";
import { useParams } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";

const UpdateBranch = ({ data, onclose }) => {
  // Get branch ID from URL parameters
  const [branchData, setBranchData] = useState(data);
  const [loading, setLoading] = useState(false);
  const branchId = data._id;

  // Fetch branch data (optional, uncomment if needed)
  // useEffect(() => {
  //   const fetchBranch = async () => {
  //     try {
  //       const response = await fetch(`${Allapi.getBranchById.url}/${branchId}`);
  //       const data = await response.json();
  //       if (data.success) setBranchData(data.branch);
  //     } catch (error) {
  //       toast.error("Error fetching branch data");
  //     }
  //   };
  //   fetchBranch();
  // }, [branchId]);

  // Update branch data
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${Allapi.updateBranch.url}/${branchId}`, {
        method: Allapi.updateBranch.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(branchData),
      });

      if (response.ok) {
        toast.success("Branch updated successfully!");
        onclose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update branch.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center h-screen bg-slate-500 bg-opacity-35">
      <div className="relative bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
          Edit Branch
        </h2>

        {/* Cross button to close the modal */}
        <IoMdCloseCircle
          className="absolute right-4 top-4 text-2xl bg-red-900 text-red-200 rounded-full cursor-pointer"
          onClick={() => onclose()}
        />

        <div className="grid md:grid-cols-2 gap-5">
          <input
            className="border border-gray-300 rounded-full p-3 w-full"
            type="text"
            name="name"
            value={branchData.name}
            onChange={handleChange}
            placeholder="Branch Name"
          />

          <input
            className="border border-gray-300 rounded-full p-3 w-full"
            type="text"
            name="street"
            value={branchData.street}
            onChange={handleChange}
            placeholder="Street"
          />

          <input
            className="border border-gray-300 rounded-full p-3 w-full"
            type="text"
            name="colony"
            value={branchData.colony}
            onChange={handleChange}
            placeholder="Colony"
          />

          <input
            className="border border-gray-300 rounded-full p-3 w-full"
            type="text"
            name="villageTown"
            value={branchData.villageTown}
            onChange={handleChange}
            placeholder="Village/Town"
          />

          <input
            className="border border-gray-300 rounded-full p-3 w-full"
            type="text"
            name="phone"
            value={branchData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <button
          className="mt-6 w-full bg-blue-950 text-white font-semibold p-3 rounded-full"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Branch"}
        </button>
      </div>
    </div>
  );
};

export default UpdateBranch;
