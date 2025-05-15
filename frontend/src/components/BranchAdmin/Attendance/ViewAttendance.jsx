import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Allapi from "../../../common/index";
import { mycon } from "../../../store/Mycontext";
import { toast, ToastContainer } from 'react-toastify';

const ViewAttendance = () => {
  const { acid } = useParams();
  const { branchdet } = useContext(mycon);
  const [viewType, setViewType] = useState("daily"); // 'daily' or 'monthly'
  const [classes, setClasses] = useState([]); 
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [loading, setLoading] = useState(false);
  const [absentees, setAbsentees] = useState([]);
  const [monthlyAbsents, setMonthlyAbsents] = useState({});
  const [hasAttendanceData, setHasAttendanceData] = useState(false);


  //new
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAbsentees, setSelectedAbsentees] = useState([]);

  // Fetch Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(Allapi.getClasses.url(acid), {
          method: Allapi.getClasses.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setClasses(data.data || []);
        } else {
          console.error("Failed to fetch classes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [acid]);

  // Fetch Sections
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(Allapi.getSections.url(selectedClass), {
          method: Allapi.getSections.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setSections(data.data || []);
        } else {
          console.error("Failed to fetch sections:", data.message);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [selectedClass]);

  // Fetch Daily Attendance
  const fetchDailyAttendance = async () => {
    if (!selectedClass || !selectedSection || !selectedDate) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${Allapi.getAbsentees.url}?branchId=${branchdet._id}&academicId=${acid}&classId=${selectedClass}&sectionId=${selectedSection}&date=${selectedDate}`,
        {
          method: Allapi.getAbsentees.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Check if attendance data exists for this day
        setHasAttendanceData(data.data && data.data.length > 0);
        setAbsentees(data.data[0]?.absentees || []);
      }
    } catch (error) {
      console.error("Error fetching daily attendance:", error);
      setHasAttendanceData(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Monthly Attendance
  const fetchMonthlyAttendance = async () => {
    if (!selectedClass || !selectedSection || !selectedMonth) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const monthNumber = new Date(selectedMonth + "-01").getMonth() + 1;
      const response = await fetch(
        `${Allapi.getMonthlyAbsents.url}/${branchdet._id}/${acid}/${selectedClass}/${selectedSection}/${monthNumber}`,
        {
          method: Allapi.getMonthlyAbsents.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Check if any attendance data exists for this month
        setHasAttendanceData(data.data && data.data.length > 0);
        const absentsMap = {};
        data.data.forEach(item => {
          absentsMap[item.studentId] = item.absentCount;
        });
        setMonthlyAbsents(absentsMap);
      }
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
      setHasAttendanceData(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Students
  useEffect(() => {
    if (!selectedSection) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          Allapi.getStudentsBySection.url(selectedSection),
          {
            method: Allapi.getStudentsBySection.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          const sortedStudents = (data.data || []).sort(
            (a, b) => a.idNo - b.idNo
          );
          setStudents(sortedStudents);

          // Fetch attendance data based on view type
          if (viewType === 'daily') {
            fetchDailyAttendance();
          } else {
            fetchMonthlyAttendance();
          }
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedSection, selectedDate, selectedMonth, viewType]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedSection("");
    setStudents([]);
    setAbsentees([]);
    setMonthlyAbsents({});
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
    setAbsentees([]);
    setMonthlyAbsents({});
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
    setAbsentees([]);
    setMonthlyAbsents({});
    setHasAttendanceData(false);
  };

  const handleUpdateAttendance = async () => {
    if (!selectedClass || !selectedSection || !selectedDate) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.updateAbsentees.url, {
        method: Allapi.updateAbsentees.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          branchId: branchdet._id,
          academicId: acid,
          classId: selectedClass,
          sectionId: selectedSection,
          date: selectedDate,
          absentees: selectedAbsentees
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsEditing(false);
        fetchDailyAttendance(); // Refresh the attendance data
        toast.success("Attendance updated successfully!");
      } else {
        toast.error("Failed to update attendance: " + data.message);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Error updating attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedAbsentees(absentees.map(student => student._id));
  }, [absentees]);

  const handleCheckboxChange = (studentId) => {
    setSelectedAbsentees(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
    <ToastContainer/>
      <h1 className="mb-6 text-2xl font-bold text-black">View Attendance</h1>

      {/* View Type Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => handleViewTypeChange("daily")}
            className={`px-4 py-2 rounded ${viewType === "daily"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
              }`}
          >
            Daily View
          </button>
          <button
            onClick={() => handleViewTypeChange("monthly")}
            className={`px-4 py-2 rounded ${viewType === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
              }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        {/* Date/Month Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            {viewType === "daily" ? "Select Date" : "Select Month"}
          </label>
          <input
            type={viewType === "daily" ? "date" : "month"}
            value={viewType === "daily" ? selectedDate : selectedMonth}
            onChange={(e) =>
              viewType === "daily"
                ? setSelectedDate(e.target.value)
                : setSelectedMonth(e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Class Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Select Class
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedClass}
            onChange={handleClassChange}
          >
            <option value="">-- Select a Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Select Section
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedSection}
            onChange={handleSectionChange}
            disabled={!selectedClass}
          >
            <option value="">-- Select a Section --</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : students.length > 0 ? (
        hasAttendanceData ? (
          <div>
            <div className="overflow-x-auto text-black">
              <table className="min-w-full bg-white rounded shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">S.No</th>
                    <th className="px-4 py-2 text-left">ID No</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    {viewType === "daily" ? (
                      <th className="px-4 py-2 text-center">Absent</th>
                    ) : (
                      <th className="px-4 py-2 text-center">Absent Days</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{student.idNo}</td>
                      <td className="px-4 py-2">{`${student.name} ${student.surname || ""}`}</td>
                      {viewType === "daily" ? (
                        <td className="px-4 py-2 text-center">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={selectedAbsentees.includes(student._id)}
                              onChange={() => handleCheckboxChange(student._id)}
                              className="w-4 h-4"
                            />
                          ) : (
                            absentees.some((a) => a._id === student._id) ? "Yes" : "No"
                          )}
                        </td>
                      ) : (
                        <td className="px-4 py-2 text-center">
                          {monthlyAbsents[student._id] || 0}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {viewType === "daily" && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleUpdateAttendance();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className={`px-6 py-2 rounded ${
                    isEditing ? "bg-green-500" : "bg-blue-500"
                  } text-white`}
                >
                  {isEditing ? "Save Changes" : "Edit Attendance"}
                </button>
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedAbsentees(absentees.map(student => student._id));
                    }}
                    className="px-6 py-2 ml-4 text-white bg-gray-500 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">
              No attendance data found for the selected {viewType === "daily" ? "date" : "month"}
            </p>
          </div>
        )
      ) : selectedSection ? (
        <div className="text-center text-gray-600">
          No students found in this section
        </div>
      ) : null}
    </div>
  );
};

export default ViewAttendance;