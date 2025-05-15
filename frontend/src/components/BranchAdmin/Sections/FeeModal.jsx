import React from "react";

const Modal = ({ isOpen, onClose, onSubmit, sectionId }) => {
  const [feeName, setFeeName] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ sectionId, feeName, amount }); // Pass sectionId along with fee details
    setFeeName("");
    setAmount("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Add Fee</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Fee Name</label>
            <input
              type="text"
              value={feeName}
              onChange={(e) => setFeeName(e.target.value)}
              required
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Fee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
