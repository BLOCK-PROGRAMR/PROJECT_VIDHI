import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';

const CreateTimeTable = () => {
  const { branchdet } = useContext(mycon);
  const [acid, setAcid] = useState('');
  const [wholeData, setWholeData] = useState([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState('');

  // Form states
  const [examName, setExamName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]); // New state for filtered subjects

  // Schedule states
  const [schedule, setSchedule] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [passMarks, setPassMarks] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const curracad = async (bid) => {
    try {
      const response = await fetch(Allapi.getAcademicYears.url(bid), {
        method: Allapi.getAcademicYears.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch academic years");
      }

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

  const fetchWholedata = async () => {
    try {
      const response = await fetch(Allapi.getClasses.url(acid), {
        method: Allapi.getClasses.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setWholeData(result.data);
      } else {
        toast.error(result.message || "Failed to fetch class data");
      }
    } catch (error) {
      toast.error("Error fetching class data");
    }
  };

  const fetchSections = async (classId) => {
    try {
      const selectedClass = wholeData.find(cls => cls._id === classId);
      if (!selectedClass) {
        toast.error("Class not found");
        return;
      }

      const response = await fetch(Allapi.getSectionsByClass.url(selectedClass.name, acid), {
        method: Allapi.getSectionsByClass.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setSections(result.data);
      } else {
        toast.error("Failed to fetch sections");
      }
    } catch (error) {
      toast.error("Error fetching sections");
      console.error("Error fetching sections:", error);
    }
  };

  const fetchSubjects = async (classId) => {
    const selectedClassData = wholeData.find(c => c._id === classId);
    if (selectedClassData?.subjects) {
      const allSubjects = [
        ...(selectedClassData.subjects.mainSubjects || []),
        ...(selectedClassData.subjects.additionalSubjects || [])
      ];
      setSubjects(allSubjects);
      setAvailableSubjects(allSubjects); // Initialize available subjects
    }
  };

  useEffect(() => {
    if (branchdet?._id) {
      curracad(branchdet._id);
    }
  }, [branchdet]);

  useEffect(() => {
    if (acid) {
      fetchWholedata();
    }
  }, [acid]);

  useEffect(() => {
    if (selectedClass) {
      fetchSections(selectedClass);
      fetchSubjects(selectedClass);
    }
  }, [selectedClass]);

  // Update available subjects whenever schedule changes
  useEffect(() => {
    const scheduledSubjects = schedule.map(item => item.name);
    const filteredSubjects = subjects.filter(subject => !scheduledSubjects.includes(subject));
    setAvailableSubjects(filteredSubjects);
  }, [schedule, subjects]);

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedSection('');
    setSubjects([]);
    setSchedule([]); // Clear schedule when class changes
  };

  const addSchedule = () => {
    if (!selectedSubject || !totalMarks || !passMarks || !date || !time) {
      toast.error("Please fill all schedule fields");
      return;
    }

    const newSchedule = {
      name: selectedSubject,
      marks: parseInt(totalMarks),
      passMarks: parseInt(passMarks),
      date: date,
      time: time
    };

    if (editingIndex !== null) {
      const updatedSchedule = [...schedule];
      updatedSchedule[editingIndex] = newSchedule;
      setSchedule(updatedSchedule);
      setEditingIndex(null);
    } else {
      setSchedule([...schedule, newSchedule]);
    }

    // Reset form
    setSelectedSubject('');
    setTotalMarks('');
    setPassMarks('');
    setDate('');
    setTime('');
  };

  const editSchedule = (index) => {
    const item = schedule[index];
    setSelectedSubject(item.name);
    setTotalMarks(item.marks.toString());
    setPassMarks(item.passMarks.toString());
    setDate(item.date);
    setTime(item.time);
    setEditingIndex(index);
  };

  const deleteSchedule = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!examName || !selectedClass || !selectedSection || schedule.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const examData = {
      branchId: branchdet._id,
      examName,
      classId: selectedClass,
      sectionId: selectedSection,
      academicId: acid,
      subjects: schedule
    };

    try {
      const response = await fetch(Allapi.addExam.url, {
        method: Allapi.addExam.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData)
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Exam timetable created successfully");
        // Reset form
        setExamName('');
        setSelectedClass('');
        setSelectedSection('');
        setSchedule([]);
      } else {
        toast.error(result.message || "Failed to create exam timetable");
      }
    } catch (error) {
      toast.error("Error creating exam timetable");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-indigo-700">Create Exam TimeTable</h2>

        {/* Academic Year Display */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <input
            type="text"
            value={currentAcademicYear}
            disabled
            className="w-full p-3 text-gray-900 bg-gray-100 border rounded focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Basic Details */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Exam Name
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter exam name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Class</option>
              {wholeData.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              disabled={!selectedClass}
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="p-6 mt-6 border rounded-lg bg-gray-50">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Add Schedule</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Subject</option>
                {availableSubjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter total marks"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Pass Marks
              </label>
              <input
                type="number"
                value={passMarks}
                onChange={(e) => setPassMarks(e.target.value)}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter pass marks"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={addSchedule}
            className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
          >
            {editingIndex !== null ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </div>

        {/* Schedule List */}
        {schedule.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Schedule List</h3>
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden bg-white border-collapse rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Subject</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Total Marks</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Pass Marks</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Date</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Time</th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedule.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.marks}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.passMarks}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.time}</td>
                      <td className="px-6 py-4 space-x-2 text-sm">
                        <button
                          onClick={() => editSchedule(index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => deleteSchedule(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 mt-6 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
        >
          Create TimeTable
        </button>

        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateTimeTable;