const Dashboard = () => (
  <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md w-full md:w-1/2">
      <p className="text-lg">Total Classes: 10</p>
      <p className="text-lg">Status: Active</p>
    </div>
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-md w-full md:w-1/2">
      <p className="text-lg">Total Classes: Assign Classes</p>
      <p className="text-lg">Status: Active</p>
    </div>
  </div>
);
export default Dashboard;
