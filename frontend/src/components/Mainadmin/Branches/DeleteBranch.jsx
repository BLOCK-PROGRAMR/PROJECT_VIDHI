import React from "react";

const DeleteBranch = ({ branchId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    const response = await fetch(`/api/branches/${branchId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      onDeleteSuccess();
    }
  };

  return (
    <div>
      <button className="bg-red-500 text-white p-2" onClick={handleDelete}>
        Delete Branch
      </button>
    </div>
  );
};

export default DeleteBranch;
