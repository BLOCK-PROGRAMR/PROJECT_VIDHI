import React, { useState, useEffect , useContext } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from "react-router-dom";
import Allapi from "../../../common/index";
import { mycon } from "../../../store/Mycontext";

const AddAttendance = () => {
  const { acid } = useParams();
  const {branchdet} = useContext(mycon)
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [absentees, setAbsentees] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

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

  // Fetch Sections when class is selected
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

  // Fetch Students when section is selected
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
        console.log("fetched students in addattendance: ", data)
        if (response.ok) {
          const sortedStudents = (data.data || []).sort(
            (a, b) => a.idNo - b.idNo
          );
          setStudents(sortedStudents);
        } else {
          console.error("Failed to fetch students:", data.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedSection]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedSection("");
    setStudents([]);
    setAbsentees([]);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
    setAbsentees([]);
  };

  const handleCheckboxChange = (studentId) => {
    setAbsentees(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSection || !date) {
      toast.error("Please select class, section and date");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(Allapi.addAttendance.url, {
        method: Allapi.addAttendance.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          academicId: acid,
          branchId: branchdet._id, 
          classId: selectedClass,
          sectionId: selectedSection,
          date: date,
          absentees: absentees
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Attendance marked successfully!");
        setAbsentees([]); // Reset absentees after successful submission
      } else {
        toast.error(data.message || "Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Error marking attendance");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 ">
    <ToastContainer/>
      <h1 className="mb-6 text-2xl font-bold">Mark Attendance</h1>

      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        {/* Date Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
        <div className="overflow-x-auto text-black">
          <table className="min-w-full bg-white rounded shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">ID No</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-center">Mark Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{student.idNo}</td>
                  <td className="px-4 py-2">{`${student.name} ${student.surname || ''}`}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={absentees.includes(student._id)}
                      onChange={() => handleCheckboxChange(student._id)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      ) : selectedSection ? (
        <div className="text-center text-gray-600">No students found in this section</div>
      ) : null}
    </div>
  );
};

export default AddAttendance;