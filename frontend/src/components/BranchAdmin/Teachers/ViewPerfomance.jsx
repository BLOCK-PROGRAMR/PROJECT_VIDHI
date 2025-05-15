import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';

const ViewPerformance = () => {
    const { branchdet } = useContext(mycon);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [assignedTeachers, setAssignedTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [showPerformanceView, setShowPerformanceView] = useState(false);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignmentDetails, setAssignmentDetails] = useState(null);

    // Helper function to normalize subjects (convert to lowercase and remove duplicates)
    const normalizeSubjects = (subjectList) => {
        const uniqueSubjects = new Set(
            subjectList.map(subject => subject.toLowerCase())
        );
        return Array.from(uniqueSubjects).sort();
    };

    useEffect(() => {
        if (branchdet?.academicYears?.[0]) {
            fetchSubjects();
        }
    }, [branchdet]);

    useEffect(() => {
        if (selectedSubject) {
            fetchAssignedTeachers();
        } else {
            setAssignedTeachers([]);
            setSelectedTeacher('');
        }
    }, [selectedSubject]);

    useEffect(() => {
        if (selectedTeacher) {
            const details = assignedTeachers.find(t => t.teacherId === selectedTeacher);
            setAssignmentDetails(details);
        } else {
            setAssignmentDetails(null);
        }
    }, [selectedTeacher, assignedTeachers]);

    const fetchSubjects = async () => {
        try {
            const response = await fetch(
                Allapi.getClasses.url(branchdet.academicYears[0]),
                {
                    method: Allapi.getClasses.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const result = await response.json();
            if (result.success) {
                const allSubjects = [];
                result.data.forEach(cls => {
                    if (cls.subjects) {
                        if (cls.subjects.mainSubjects) {
                            allSubjects.push(...cls.subjects.mainSubjects);
                        }
                        if (cls.subjects.additionalSubjects) {
                            allSubjects.push(...cls.subjects.additionalSubjects);
                        }
                    }
                });
                // Normalize subjects to lowercase and remove duplicates
                const normalizedSubjects = normalizeSubjects(allSubjects);
                setSubjects(normalizedSubjects);
            }
        } catch (error) {
            toast.error('Error fetching subjects');
        }
    };

    const fetchAssignedTeachers = async () => {
        try {
            const response = await fetch(
                Allapi.getTeacherAssignments.url(branchdet.academicYears[0]),
                {
                    method: Allapi.getTeacherAssignments.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const result = await response.json();
            if (result.success) {
                const teachersForSubject = [];
                result.data.forEach(assignment => {
                    assignment.classAssignments.forEach(ca => {
                        ca.sections.forEach(section => {
                            // Case-insensitive comparison for subject matching
                            if (section.subject.toLowerCase() === selectedSubject.toLowerCase()) {
                                teachersForSubject.push({
                                    teacherId: assignment.teacherId,
                                    teacherName: assignment.name,
                                    className: ca.className,
                                    sectionName: section.sectionName
                                });
                            }
                        });
                    });
                });
                setAssignedTeachers(teachersForSubject);
            }
        } catch (error) {
            toast.error('Error fetching assigned teachers');
        }
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setSelectedTeacher('');
        setShowPerformanceView(false);
        setSelectedExam('');
        setPerformanceData(null);
        setAssignmentDetails(null);
    };

    const handleTeacherSelect = (teacherId) => {
        setSelectedTeacher(teacherId);
        setShowPerformanceView(false);
        setSelectedExam('');
        setPerformanceData(null);
    };

    const handleViewPerformance = () => {
        if (!selectedSubject || !selectedTeacher) {
            toast.error('Please select both subject and teacher');
            return;
        }
        setShowPerformanceView(true);
        fetchExams();
    };

    const fetchExams = async () => {
        if (!assignmentDetails) return;

        try {
            const classData = await fetch(
                Allapi.getClasses.url(branchdet.academicYears[0]),
                {
                    method: Allapi.getClasses.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const classResult = await classData.json();
            const selectedClass = classResult.data.find(c => c.name === assignmentDetails.className);

            if (selectedClass) {
                const sectionResponse = await fetch(
                    Allapi.getSectionsByClass.url(assignmentDetails.className, branchdet.academicYears[0]),
                    {
                        method: Allapi.getSectionsByClass.method,
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const sectionResult = await sectionResponse.json();
                const selectedSection = sectionResult.data.find(s => s.name === assignmentDetails.sectionName);

                if (selectedSection) {
                    const examsResponse = await fetch(
                        Allapi.getAllExams.url(selectedClass._id, selectedSection._id, branchdet._id),
                        {
                            method: Allapi.getAllExams.method,
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    const examsResult = await examsResponse.json();
                    if (examsResult.success) {
                        setExams(examsResult.data);
                    }
                }
            }
        } catch (error) {
            toast.error('Error fetching exams');
        }
    };

    const processPerformanceData = (data) => {
        if (!data || !selectedSubject) return null;

        const passingMarks = 35;
        const allStudents = [...data.passStudents, ...data.failStudents];

        const processedStudents = allStudents.map(student => {
            // Case-insensitive comparison for finding subject marks
            const subjectMarks = student.subjects.find(
                s => s.name.toLowerCase() === selectedSubject.toLowerCase()
            )?.marks || 0;
            return {
                ...student,
                subjectMarks
            };
        }).sort((a, b) => b.subjectMarks - a.subjectMarks);

        processedStudents.forEach((student, index) => {
            student.rank = index + 1;
        });

        const passStudents = processedStudents.filter(s => s.subjectMarks >= passingMarks);
        const failStudents = processedStudents.filter(s => s.subjectMarks < passingMarks);

        return {
            passStudents,
            failStudents,
            totalStudents: processedStudents.length,
            passPercentage: Math.round((passStudents.length / processedStudents.length) * 100)
        };
    };

    const fetchPerformanceData = async () => {
        if (!selectedExam || !assignmentDetails) {
            toast.error('Please select an exam');
            return;
        }

        setLoading(true);
        try {
            const classData = await fetch(
                Allapi.getClasses.url(branchdet.academicYears[0]),
                {
                    method: Allapi.getClasses.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const classResult = await classData.json();
            const selectedClass = classResult.data.find(c => c.name === assignmentDetails.className);

            const sectionResponse = await fetch(
                Allapi.getSectionsByClass.url(assignmentDetails.className, branchdet.academicYears[0]),
                {
                    method: Allapi.getSectionsByClass.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const sectionResult = await sectionResponse.json();
            const selectedSection = sectionResult.data.find(s => s.name === assignmentDetails.sectionName);

            const response = await fetch(
                Allapi.getMarksReport.url(selectedExam, selectedClass._id, selectedSection._id, branchdet._id),
                {
                    method: Allapi.getMarksReport.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const result = await response.json();
            if (result.success) {
                const processedData = processPerformanceData(result.data);
                setPerformanceData(processedData);
            } else {
                toast.error(result.message || 'Failed to fetch performance data');
            }
        } catch (error) {
            toast.error('Error fetching performance data');
        } finally {
            setLoading(false);
        }
    };

    const renderStudentTable = (students, type) => (
        <div className={`bg-white rounded-lg shadow overflow-hidden`}>
            <div className={`${type === 'pass' ? 'bg-green-50' : 'bg-red-50'} px-6 py-4 border-b ${type === 'pass' ? 'border-green-200' : 'border-red-200'}`}>
                <h3 className={`text-lg font-semibold ${type === 'pass' ? 'text-green-800' : 'text-red-800'}`}>
                    {type === 'pass' ? 'Pass' : 'Fail'} Students ({students.length})
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rank}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${type === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                    {student.subjectMarks}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">View Performance</h1>

                    {!showPerformanceView ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => handleSubjectSelect(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedSubject && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
                                    <select
                                        value={selectedTeacher}
                                        onChange={(e) => handleTeacherSelect(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select Teacher</option>
                                        {assignedTeachers.map((teacher) => (
                                            <option key={teacher.teacherId} value={teacher.teacherId}>
                                                {teacher.teacherName} - {teacher.className} {teacher.sectionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {assignmentDetails && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <p className="text-gray-600">Subject: {selectedSubject}</p>
                                        <p className="text-gray-600">Teacher: {assignmentDetails.teacherName}</p>
                                        <p className="text-gray-600">Class: {assignmentDetails.className}</p>
                                        <p className="text-gray-600">Section: {assignmentDetails.sectionName}</p>
                                    </div>
                                    <button
                                        onClick={handleViewPerformance}
                                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        View Performance
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setShowPerformanceView(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    ← Back
                                </button>
                                <h2 className="text-xl font-semibold text-gray-800">Performance Details</h2>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="text-gray-600">Subject: {selectedSubject}</p>
                                    <p className="text-gray-600">Teacher: {assignmentDetails?.teacherName}</p>
                                    <p className="text-gray-600">Class: {assignmentDetails?.className}</p>
                                    <p className="text-gray-600">Section: {assignmentDetails?.sectionName}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
                                <select
                                    value={selectedExam}
                                    onChange={(e) => setSelectedExam(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select Exam</option>
                                    {exams.map((exam) => (
                                        <option key={exam._id} value={exam._id}>{exam.examName}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={fetchPerformanceData}
                                    disabled={!selectedExam || loading}
                                    className={`mt-4 w-full px-4 py-2 rounded-md text-white font-medium ${!selectedExam || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? 'Loading...' : 'View Performance'}
                                </button>
                            </div>

                            {performanceData && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                            <h3 className="text-lg font-semibold text-green-800 mb-2">Pass Count</h3>
                                            <p className="text-3xl font-bold text-green-600">
                                                {performanceData.passStudents.length}
                                            </p>
                                        </div>

                                        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                            <h3 className="text-lg font-semibold text-red-800 mb-2">Fail Count</h3>
                                            <p className="text-3xl font-bold text-red-600">
                                                {performanceData.failStudents.length}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Pass Percentage</h3>
                                            <p className="text-3xl font-bold text-blue-600">
                                                {performanceData.passPercentage}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {performanceData.passStudents.length > 0 && renderStudentTable(performanceData.passStudents, 'pass')}
                                        {performanceData.failStudents.length > 0 && renderStudentTable(performanceData.failStudents, 'fail')}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewPerformance;