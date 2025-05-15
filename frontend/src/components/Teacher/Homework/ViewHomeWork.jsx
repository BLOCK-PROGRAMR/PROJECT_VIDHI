import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import Allapi from '../../../common';

const ViewHomeWorks = () => {
  const token = localStorage.getItem("token");
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [teacherAssignment, setTeacherAssignment] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    className: '',
    sectionName: '',
    date: ''
  });
  
  const decoded = jwtDecode(token);

  // Fetch classes when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(Allapi.getClasses.url(decoded.teacherData.academic_id), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result.success) {
          setClasses(result.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Error loading classes");
      }
    };
    
    if (token) {
      fetchClasses();
    }
  }, [token, decoded.teacherData.academic_id]);

  useEffect(() => {
    if (token) {
      try {
        if (decoded.teacherData?.teachingSubjects) {
          setTeacherSubjects(decoded.teacherData.teachingSubjects);
        }
        fetchTeacherAssignments(decoded.teacherData._id);
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Error loading teacher data");
      }
    }
  }, [token]);

  const fetchTeacherAssignments = async (teacherId) => {
    try {
      const response = await fetch(Allapi.getTeacherAssignments.url(decoded.teacherData.academic_id), {
        method: Allapi.getTeacherAssignments.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        const currentTeacherAssignment = result.data.find(
          (assignment) => assignment.teacherId === teacherId
        );
        setTeacherAssignment(currentTeacherAssignment);
      }
    } catch (error) {
      console.error("Error fetching teacher assignments:", error);
      toast.error("Error loading assignments");
    }
  };

  // Fetch sections when a class is selected
  useEffect(() => {
    const fetchSections = async () => {
      if (!filters.className) return;
      
      const selectedClass = classes.find(c => c.name === filters.className);
      if (!selectedClass) return;

      try {
        const response = await fetch(Allapi.getSections.url(selectedClass._id), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result.success) {
          setSections(result.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error("Error loading sections");
      }
    };

    fetchSections();
  }, [filters.className, classes, token]);

  const getAvailableClassSections = () => {
    if (!teacherAssignment || !filters.subject) return [];
    
    const classSections = [];
    
    teacherAssignment.classAssignments.forEach(classAssignment => {
      classAssignment.sections.forEach(section => {
        if (section.subject.toLowerCase() === filters.subject.toLowerCase()) {
          classSections.push({
            className: classAssignment.className,
            sectionName: section.sectionName
          });
        }
      });
    });
    return classSections;
  };

  const fetchHomeworks = async () => {
    try {
      const selectedClass = classes.find(c => c.name === filters.className);
      const selectedSection = sections.find(s => s.name === filters.sectionName);

      if (!selectedClass || !selectedSection) return;

      const queryParams = new URLSearchParams({
        branchId: decoded.teacherData.branchId,
        classId: selectedClass._id,
        sectionId: selectedSection._id,
        ...(filters.date && { date: filters.date })
      });

      const response = await fetch(`${Allapi.getHomeworks.url}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        setHomeworks(result.data);
      }
    } catch (error) {
      console.error("Error fetching homeworks:", error);
      toast.error("Error loading homeworks");
    }
  };

  useEffect(() => {
    if (filters.subject && filters.className && filters.sectionName) {
      fetchHomeworks();
    }
  }, [filters]);

  const handleDeleteHomework = async (id) => {
    if (!window.confirm('Are you sure you want to delete this homework?')) return;

    try {
      const response = await fetch(`${Allapi.deleteHomework.url}/${id}`, {
        method: Allapi.deleteHomework.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Homework deleted successfully');
        fetchHomeworks(); // Refresh the list
      } else {
        toast.error(result.message || 'Failed to delete homework');
      }
    } catch (error) {
      console.error("Error deleting homework:", error);
      toast.error("Error deleting homework");
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">View Homeworks</h1>
          
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
            {/* Subject Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({
                  ...filters,
                  subject: e.target.value,
                  className: '',
                  sectionName: ''
                })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
                {teacherSubjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class & Section Selection */}
            {filters.subject && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Class & Section
                </label>
                <select
                  value={`${filters.className}-${filters.sectionName}`}
                  onChange={(e) => {
                    const [className, sectionName] = e.target.value.split('-');
                    setFilters({ ...filters, className, sectionName });
                  }}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Class & Section</option>
                  {getAvailableClassSections().map((cs, index) => (
                    <option 
                      key={index} 
                      value={`${cs.className}-${cs.sectionName}`}
                    >
                      {cs.className} - {cs.sectionName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date (Optional)
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Homeworks List */}
          <div className="mt-6">
            {homeworks.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Homework
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {homeworks.map((homework) => (
                      <tr key={homework._id}>
                        <td className="px-6 py-4 text-black whitespace-nowrap">
                          {homework.subject}
                        </td>
                        <td className="px-6 py-4 text-black whitespace-nowrap">
                          {new Date(homework.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{homework.homeWork}</div>
                          {homework.fileLink && (
                            <a 
                              href={homework.fileLink} 
                              className="text-sm text-blue-600 hover:text-blue-800"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View Attachment
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteHomework(homework._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                {filters.subject && filters.className && filters.sectionName 
                  ? "No homeworks found for the selected criteria"
                  : "Select subject, class, and section to view homeworks"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHomeWorks;