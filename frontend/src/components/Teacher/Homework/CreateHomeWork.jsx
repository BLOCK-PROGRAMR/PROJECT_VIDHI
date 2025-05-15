import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import Allapi from '../../../common';

const CreateHomeWork = () => {
  const token = localStorage.getItem("token");
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [teacherAssignment, setTeacherAssignment] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    className: '',
    sectionName: '',
    date: '',
    homework: ''
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
      if (!formData.className) return;
      
      const selectedClass = classes.find(c => c.name === formData.className);
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
  }, [formData.className, classes, token]);

  const getAvailableClassSections = () => {
    if (!teacherAssignment || !formData.subject) return [];
    
    const classSections = [];
    
    teacherAssignment.classAssignments.forEach(classAssignment => {
      classAssignment.sections.forEach(section => {
        if (section.subject.toLowerCase() === formData.subject.toLowerCase()) {
          classSections.push({
            className: classAssignment.className,
            sectionName: section.sectionName
          });
        }
      });
    });
    return classSections;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Find the classId based on className
      const selectedClass = classes.find(c => c.name === formData.className);
      if (!selectedClass) {
        toast.error('Class not found');
        return;
      }

      // Find the sectionId based on sectionName
      const selectedSection = sections.find(s => s.name === formData.sectionName);
      if (!selectedSection) {
        toast.error('Section not found');
        return;
      }

      // Create an object with the form data
      const formDataToSend = {
        subject: formData.subject,
        classId: selectedClass._id, // Use the actual classId
        sectionId: selectedSection._id, // Use the actual sectionId
        date: formData.date,
        homeWork: formData.homework,
        fileLink: formData.file ? formData.file.name : null,
        branchId: decoded.teacherData.branchId
      };
  
      console.log("Form data to send:", formDataToSend);
  
      const response = await fetch(Allapi.createHomeWork.url, {
        method: Allapi.createHomeWork.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataToSend),
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast.success('Homework created successfully!');
        setFormData({
          subject: '',
          className: '',
          sectionName: '',
          date: '',
          homework: '',
          file: null,
        });
      } else {
        toast.error(result.message || 'Failed to create homework');
      }
    } catch (error) {
      console.error('Error creating homework:', error);
      toast.error('Error creating homework. Please try again.');
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-3xl px-4 mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Homework</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({
                  ...formData,
                  subject: e.target.value,
                  className: '',
                  sectionName: ''
                })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
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
            {formData.subject && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Class & Section
                </label>
                <select
                  value={`${formData.className}-${formData.sectionName}`}
                  onChange={(e) => {
                    const [className, sectionName] = e.target.value.split('-');
                    setFormData({ ...formData, className, sectionName });
                  }}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
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
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Homework Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Homework
              </label>
              <textarea
                value={formData.homework}
                onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                rows={4}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Enter homework details..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Attachment (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Homework
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHomeWork;