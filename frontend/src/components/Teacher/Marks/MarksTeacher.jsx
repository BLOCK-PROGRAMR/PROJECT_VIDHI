import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allapi from '../../../common';

const MarksTeacher = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  // Teacher data states
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [teacherAssignment, setTeacherAssignment] = useState(null);
  
  // Form selection states
  const [formData, setFormData] = useState({
    subject: '',
    className: '',
    sectionName: '',
  });

  // Exam and marks states
  const [examList, setExamList] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [marksIds, setMarksIds] = useState({});
  const [marksExist, setMarksExist] = useState(false);

  // Load teacher data
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

  // Fetch exams when class and section are selected
  useEffect(() => {
    const fetchExams = async () => {
      if (!formData.className || !formData.sectionName) return;

      try {
        const response = await fetch(Allapi.getEveryExam.url(decoded.teacherData.branchId), {
          method: Allapi.getEveryExam.method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success) {
          // Filter exams for selected class and section
          const filteredExams = result.data.filter(exam => 
            exam.classId.name === formData.className &&
            exam.sectionId.name === formData.sectionName
          );
          setExamList(filteredExams);
        }
      } catch (error) {
        toast.error("Error fetching exams");
      }
    };

    fetchExams();
  }, [formData.className, formData.sectionName]);

  const checkExistingMarks = async (examId, classId, sectionId) => {
    try {
      // First, get the exam details
      const examResponse = await fetch(Allapi.getExamById.url(examId, decoded.teacherData.branchId), {
        method: Allapi.getExamById.method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const examResult = await examResponse.json();
      if (!examResult.success) {
        toast.error("Failed to fetch exam details");
        return;
      }

      setSelectedExam(examResult.data);

      const response = await fetch(Allapi.getMarksReport.url(examId, classId, sectionId, decoded.teacherData.branchId), {
        method: Allapi.getMarksReport.method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (result.success && (result.data.passStudents.length > 0 || result.data.failStudents.length > 0)) {
        const allStudents = [...result.data.passStudents, ...result.data.failStudents];
        setStudents(allStudents);
        setMarksExist(true);
        
        const marksPromises = allStudents.map(student => 
          fetch(Allapi.getMarksByStudent.url(student.id, decoded.teacherData.branchId), {
            method: Allapi.getMarksByStudent.method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json())
        );

        const marksResults = await Promise.all(marksPromises);
        
        const marksObj = {};
        const marksIdMap = {};

        allStudents.forEach((student, index) => {
          const studentMarksResult = marksResults[index];
          
          if (!studentMarksResult.success || !Array.isArray(studentMarksResult.data)) {
            console.error('Invalid marks data for student:', student.id);
            return;
          }

          const studentMarks = studentMarksResult.data.find(
            mark => mark.examId._id === examId
          );
          
          if (studentMarks) {
            marksIdMap[student.id] = studentMarks._id;
            marksObj[student.id] = {};
            
            studentMarks.subjectMarks.forEach(mark => {
              const subject = examResult.data.subjects.find(s => s._id === mark.subjectId);
              if (subject) {
                marksObj[student.id][subject.name] = mark.marksObtained.toString();
              }
            });
          }
        });
        
        setMarksData(marksObj);
        setMarksIds(marksIdMap);
      } else {
        // No existing marks, fetch students for new marks entry
        await fetchStudentsForNewMarks(classId, sectionId);
        setMarksExist(false);
      }
    } catch (error) {
      console.error("Error checking existing marks:", error);
      toast.error("Failed to check marks");
    }
  };

  const fetchStudentsForNewMarks = async (classId, sectionId) => {
    try {
      const response = await fetch(Allapi.getStudentsBySection.url(sectionId), {
        method: Allapi.getStudentsBySection.method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ classId })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setStudents(result.data);

        if (selectedExam?.subjects) {
          const initialMarks = {};
          result.data.forEach(student => {
            initialMarks[student._id] = {};
            selectedExam.subjects.forEach(subject => {
              initialMarks[student._id][subject.name] = '';
            });
          });
          setMarksData(initialMarks);
        }
      }
    } catch (error) {
      if (!error.message.includes('aborted')) {
        toast.error("Error fetching students");
      }
    }
  };

  const handleMarksChange = (studentId, subject, value) => {
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= subject.marks)) {
      setMarksData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [subject.name]: value
        }
      }));
    }
  };

  const validateMarks = (isUpdate = false) => {
    let isValid = true;
    let hasChanges = false;

    Object.entries(marksData).forEach(([studentId, subjects]) => {
      Object.entries(subjects).forEach(([subjectName, mark]) => {
        if (mark !== '') {
          const subject = selectedExam.subjects.find(s => s.name === subjectName);
          const markValue = parseFloat(mark);
          if (isNaN(markValue) || markValue < 0 || markValue > subject.marks) {
            isValid = false;
          }
          
          if (isUpdate) {
            const student = students.find(s => s.id === studentId);
            const originalMark = student?.subjects.find(s => s.name === subjectName)?.marks.toString();
            if (mark !== originalMark) {
              hasChanges = true;
            }
          } else {
            hasChanges = true;
          }
        }
      });
    });

    if (isUpdate && !hasChanges) {
      toast.info("No changes detected");
      return false;
    }

    if (!hasChanges) {
      toast.error("Please enter marks for at least one student");
      return false;
    }

    if (!isValid) {
      toast.error("Please ensure all entered marks are valid");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateMarks(marksExist)) return;

      if (marksExist) {
        await handleUpdate();
      } else {
        await handleEnterMarks();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("An unexpected error occurred while processing marks");
    }
  };

  const handleEnterMarks = async () => {
    try {
      const submissionPromises = Object.entries(marksData)
        .filter(([_, subjects]) => Object.values(subjects).some(mark => mark !== ''))
        .map(async ([studentId, subjects]) => {
          const submission = {
            examId: selectedExam._id,
            academicId: decoded.teacherData.academic_id,
            classId: selectedExam.classId._id,
            sectionId: selectedExam.sectionId._id,
            studentId,
            subjectMarks: Object.entries(subjects)
              .filter(([_, mark]) => mark !== '')
              .map(([subjectName, mark]) => ({
                subjectId: selectedExam.subjects.find(s => s.name === subjectName)?._id,
                marksObtained: parseFloat(mark)
              }))
          };

          try {
            const response = await fetch(Allapi.addMarks.url(decoded.teacherData.branchId), {
              method: Allapi.addMarks.method,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(submission)
            });

            const result = await response.json();
            return { studentId, status: result.success ? 'success' : 'error', message: result.message };
          } catch (error) {
            return { studentId, status: 'error', message: error.message };
          }
        });

      const results = await Promise.all(submissionPromises);
      const successful = results.filter(r => r.status === 'success').length;
      const errors = results.filter(r => r.status === 'error').length;

      if (successful > 0) {
        toast.success(`Successfully added marks for ${successful} students`);
        await checkExistingMarks(selectedExam._id, selectedExam.classId._id, selectedExam.sectionId._id);
      }

      if (errors > 0) {
        toast.error(`Failed to add marks for ${errors} students`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while submitting marks");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatePromises = Object.entries(marksData)
        .map(async ([studentId, subjects]) => {
          const marksId = marksIds[studentId];
          if (!marksId) {
            return { studentId, status: 'error', message: 'Marks record not found' };
          }

          const subjectMarks = Object.entries(subjects).map(([subjectName, mark]) => {
            const subject = selectedExam.subjects.find(s => s.name === subjectName);
            return {
              subjectId: subject._id,
              marksObtained: parseFloat(mark)
            };
          });

          const submission = {
            branchId: decoded.teacherData.branchId,
            studentId,
            examId: selectedExam._id,
            academicId: decoded.teacherData.academic_id,
            classId: selectedExam.classId._id,
            sectionId: selectedExam.sectionId._id,
            subjectMarks
          };

          try {
            const response = await fetch(Allapi.updateMarks.url(marksId, decoded.teacherData.branchId), {
              method: Allapi.updateMarks.method,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(submission)
            });

            const result = await response.json();
            return { 
              studentId, 
              status: result.success ? 'success' : 'error',
              message: result.message 
            };
          } catch (error) {
            return { 
              studentId, 
              status: 'error', 
              message: error.message 
            };
          }
        });

      const results = await Promise.all(updatePromises);
      const successful = results.filter(r => r.status === 'success').length;
      const errors = results.filter(r => r.status === 'error').length;

      if (successful > 0) {
        toast.success(`Successfully updated marks for ${successful} students`);
        await checkExistingMarks(selectedExam._id, selectedExam.classId._id, selectedExam.sectionId._id);
      }

      if (errors > 0) {
        toast.error(`Failed to update marks for ${errors} students`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating marks");
    }
  };

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    if (!examId) {
      setSelectedExam(null);
      setMarksData({});
      setStudents([]);
      setMarksExist(false);
      return;
    }

    const exam = examList.find(ex => ex._id === examId);
    if (exam) {
      await checkExistingMarks(examId, exam.classId._id, exam.sectionId._id);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="p-8 mx-auto bg-white rounded-lg shadow-lg max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          {marksExist ? "Update Student Marks" : "Enter Student Marks"}
        </h2>

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
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
              className="w-full p-3 text-gray-700 bg-white border rounded"
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
                  setSelectedExam(null);
                  setMarksData({});
                  setStudents([]);
                }}
                className="w-full p-3 text-gray-700 bg-white border rounded"
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

          {/* Exam Selection */}
          {formData.className && formData.sectionName && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Exam
              </label>
              <select
                value={selectedExam?._id || ''}
                onChange={handleExamChange}
                className="w-full p-3 text-gray-700 bg-white border rounded"
              >
                <option value="">Select Exam</option>
                {examList.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Marks Table */}
{selectedExam && students.length > 0 && (
  <div className="mt-6 overflow-x-auto">
    {selectedExam.subjects.some(subject => subject.name === formData.subject) ? (
      <table className="w-full bg-white border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300">
              Student Name
            </th>
            {selectedExam.subjects
              .filter(subject => subject.name === formData.subject)
              .map(subject => (
                <th
                  key={subject._id}
                  className="p-4 font-semibold text-left text-gray-700 border-r border-gray-300"
                >
                  <div>{subject.name}</div>
                  <div className="text-xs text-gray-500">
                    Max: {subject.marks} | Pass: {subject.passMarks}
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr
              key={marksExist ? student.id : student._id}
              className={idx !== students.length - 1 ? 'border-b border-gray-300' : ''}
            >
              <td className="p-4 font-medium text-gray-700 border-r border-gray-300">
                {student.name}
              </td>
              {selectedExam.subjects
                .filter(subject => subject.name === formData.subject)
                .map(subject => (
                  <td
                    key={`${marksExist ? student.id : student._id}-${subject._id}`}
                    className="p-4 border-r border-gray-300"
                  >
                    <input
                      type="number"
                      value={
                        marksData[marksExist ? student.id : student._id]?.[subject.name] || ''
                      }
                      onChange={(e) =>
                        handleMarksChange(
                          marksExist ? student.id : student._id,
                          subject,
                          e.target.value
                        )
                      }
                      min="0"
                      max={subject.marks}
                      className="w-full text-center text-gray-700 bg-transparent border-none focus:outline-none"
                      placeholder="0"
                    />
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center text-gray-600">There is no such subject in this exam</div>
    )}
    <button
      onClick={handleSubmit}
      className="w-full px-6 py-3 mt-6 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
    >
      {marksExist ? "Update Marks" : "Submit Marks"}
    </button>
  </div>
)}


        <ToastContainer />
      </div>
    </div>
  );
};

export default MarksTeacher;