import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Allapi from '../../../common';
import { mycon } from '../../../store/Mycontext';

const HallTicket = () => {
    const { branchdet } = useContext(mycon);
    const [acid, setAcid] = useState('');
    const [currentAcademicYear, setCurrentAcademicYear] = useState('');

    // Form states
    const [examList, setExamList] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [uniqueClasses, setUniqueClasses] = useState([]);
    const [uniqueSections, setUniqueSections] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const curracad = async (bid) => {
        try {
            const response = await fetch(Allapi.getAcademicYears.url(bid), {
                method: Allapi.getAcademicYears.method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch academic years");

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

    const fetchAllExams = async () => {
        try {
            const response = await fetch(Allapi.getEveryExam.url(branchdet._id), {
                method: Allapi.getEveryExam.method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const result = await response.json();
            if (result.success) {
                setExamList(result.data);
                const classes = [...new Map(result.data.map(exam =>
                    [exam.classId._id, { id: exam.classId._id, name: exam.classId.name }]
                )).values()];
                setUniqueClasses(classes);
            } else {
                toast.error("Failed to fetch exams");
            }
        } catch (error) {
            toast.error("Error fetching exams");
        }
    };

    const fetchStudents = async (classId, sectionId) => {
        if (!classId || !sectionId) return;

        try {
            const response = await fetch(Allapi.getStudentsBySection.url(sectionId), {
                method: Allapi.getStudentsBySection.method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ classId })
            });

            const result = await response.json();
            if (result.success && result.data) {
                setStudents(result.data);
                console.log("students", result.data);
            }
        } catch (error) {
            toast.error("Error fetching students");
        }
    };

    useEffect(() => {
        if (branchdet?._id) {
            curracad(branchdet._id);
        }
    }, [branchdet]);

    useEffect(() => {
        if (acid) {
            fetchAllExams();
        }
    }, [acid]);

    useEffect(() => {
        if (selectedClass) {
            const sections = examList
                .filter(exam => exam.classId._id === selectedClass)
                .map(exam => ({
                    id: exam.sectionId._id,
                    name: exam.sectionId.name
                }));
            const uniqueSections = [...new Map(sections.map(section =>
                [section.id, section]
            )).values()];
            setUniqueSections(uniqueSections);
            setSelectedSection('');
            setSelectedExam(null);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass && selectedSection) {
            const exams = examList.filter(exam =>
                exam.classId._id === selectedClass &&
                exam.sectionId._id === selectedSection
            );
            setSelectedExam(null);
            fetchStudents(selectedClass, selectedSection);
        }
    }, [selectedClass, selectedSection]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-100">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Hall Ticket Generator</h2>

                    {/* Selection Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Select Class</option>
                                {uniqueClasses.map((cls) => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                disabled={!selectedClass}
                            >
                                <option value="">Select Section</option>
                                {uniqueSections.map((section) => (
                                    <option key={section.id} value={section.id}>{section.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                            <select
                                value={selectedStudent?._id || ''}
                                onChange={(e) => setSelectedStudent(students.find(s => s._id === e.target.value))}
                                className="w-full p-2 border rounded-md"
                                disabled={!selectedSection}
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student._id} value={student._id}>{student.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Print Button */}
                    <div className="text-center">
                        <button
                            onClick={handlePrint}
                            disabled={!selectedStudent}
                            className={`px-6 py-2 rounded-md ${selectedStudent
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Print Hall Ticket
                        </button>
                    </div>
                </div>

                {/* Hall Ticket Preview */}
                {selectedStudent && (
                    <div className="border-2 border-gray-300 p-8 rounded-lg print:border-black">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold mb-2 text-black">{branchdet?.name || 'School Name'}</h1>
                            <p className="text-lg font-semibold text-black">HALL TICKET</p>
                            <p className="text-md text-black">Academic Year: {currentAcademicYear}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p><span className="font-semibold text-black">Name:</span> {selectedStudent.name}</p>
                                <p><span className="font-semibold text-black">Class:</span> {uniqueClasses.find(c => c.id === selectedClass)?.name}</p>
                                <p><span className="font-semibold text-black">Section:</span> {uniqueSections.find(s => s.id === selectedSection)?.name}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold text-black">Roll No:</span> {selectedStudent.rollNo}</p>
                                <p><span className="font-semibold text-black">Admission No:</span> {selectedStudent.admissionNo}</p>
                            </div>
                        </div>

                        {/* Exam Schedule Table */}
                        <table className="w-full border-collapse border border-gray-300 mb-6">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2text-black text-black">Subject</th>
                                    <th className="border border-gray-300 p-2 text-black">Date</th>
                                    <th className="border border-gray-300 p-2 text-black">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedExam?.subjects.map((subject, index) => (
                                    <tr key={subject._id}>
                                        <td className="border border-gray-300 p-2 text-black">{subject.name}</td>
                                        <td className="border border-gray-300 p-2 text-black">__/__/____</td>
                                        <td className="border border-gray-300 p-2 text-black">__:__ - __:__</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Signatures */}
                        <div className="flex justify-between mt-12 pt-8">
                            <div className="text-center">
                                <div className="border-t border-black pt-2 text-black">Class Teacher</div>
                            </div>
                            <div className="text-center">
                                <div className="border-t border-black pt-2 text-black">Principal</div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mt-8 text-sm">
                            <h3 className="font-bold mb-2 text-black">Instructions:</h3>
                            <ol className="list-decimal list-inside space-y-1 text-black">
                                <li>Bring this hall ticket to every examination.</li>
                                <li>Reach the examination hall 15 minutes before the scheduled time.</li>
                                <li>Mobile phones and other electronic devices are strictly prohibited.</li>
                                <li>Follow all examination rules and regulations.</li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HallTicket;