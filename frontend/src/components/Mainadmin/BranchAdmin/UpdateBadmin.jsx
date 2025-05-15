import React, { useState, useEffect } from "react";

const EditAdminModal = ({ isOpen, onClose, admin, onEdit }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setUsername(admin.username);
      setPassword("");
      setConfirmPassword("");
    }
  }, [admin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate password
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updatedAdmin = { ...admin, name, username, password };
    onEdit(updatedAdmin);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-2xl font-bold mb-6 text-blue-950">Edit  Branch Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4" >
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Leave blank if you don't want to change"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Leave blank if you don't want to change"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;
