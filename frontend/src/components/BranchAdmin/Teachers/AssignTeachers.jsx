import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';
import { ChevronDown, X, CheckCircle, RotateCcw } from 'lucide-react';

// TeacherDropdown Component
const TeacherDropdown = ({ subject, teachers, onAssign, onClose }) => {
    const eligibleTeachers = teachers.filter(teacher =>
        teacher.teachingSubjects.some(s => s.name === subject)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-[90vw]">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Assign Teacher for {subject}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {eligibleTeachers.length > 0 ? (
                        <div className="space-y-2">
                            {eligibleTeachers.map((teacher) => (
                                <button
                                    key={teacher._id}
                                    onClick={() => {
                                        onAssign(subject, teacher._id);
                                        onClose();
                                    }}
                                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border transition-colors flex justify-between items-center group"
                                >
                                    <div>
                                        <p className="font-medium">{teacher.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Experience: {teacher.experience} years
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Subjects: {teacher.teachingSubjects.map(s => s.name).join(', ')}
                                        </p>
                                    </div>
                                    <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Assign
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No eligible teachers found for this subject
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// SubjectsTable Component
const SubjectsTable = ({
    subjects,
    teachers,
    assignedTeachers,
    onAssign,
    viewMode,
    onOpenDropdown,
    loading,
    onUpdate,
    updatingSubject
}) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Teacher
                        </th>
                        {!viewMode && (
                            <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {subjects.map((subject) => (
                        <tr key={subject} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {assignedTeachers[subject] ? (
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-green-600 font-medium">
                                            {teachers.find(t => t._id === assignedTeachers[subject])?.name || 'Unknown'}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500">Not Assigned</span>
                                )}
                            </td>
                            {!viewMode && (
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => onOpenDropdown(subject)}
                                            disabled={loading || (assignedTeachers[subject] && subject !== updatingSubject)}
                                            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                                                ${assignedTeachers[subject] && subject !== updatingSubject
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                }`}
                                        >
                                            {assignedTeachers[subject] ? (
                                                'Assigned'
                                            ) : (
                                                <>
                                                    Assign
                                                    <ChevronDown size={16} className="ml-1" />
                                                </>
                                            )}
                                        </button>
                                        {assignedTeachers[subject] && (
                                            <button
                                                onClick={() => onUpdate(subject)}
                                                disabled={loading || subject === updatingSubject}
                                                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                            >
                                                <RotateCcw size={16} className="mr-1" />
                                                Update
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main AssignTeachers Component
const AssignTeachers = () => {
    const { branchdet } = useContext(mycon);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [sectionSubjects, setSectionSubjects] = useState([]);
    const [assignedTeachers, setAssignedTeachers] = useState({});
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [updatingSubject, setUpdatingSubject] = useState(null);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        if (branchdet?.academicYears?.[0]) {
            fetchTeachers();
            fetchClasses();
        }
    }, [branchdet]);

    useEffect(() => {
        if (selectedSection) {
            fetchSectionSubjects();
            fetchAssignments();
        }
    }, [selectedSection]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch(
                Allapi.getTeachers.url(branchdet.academicYears[0]),
                {
                    method: Allapi.getTeachers.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = await response.json();
            if (result.success) {
                setTeachers(result.data);
            }
        } catch (error) {
            toast.error('Error fetching teachers');
        }
    };

    const fetchClasses = async () => {
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
                setClasses(result.data);
            }
        } catch (error) {
            toast.error('Error fetching classes');
        }
    };

    const fetchSections = async (classId) => {
        try {
            const response = await fetch(
                Allapi.getSections.url(classId),
                {
                    method: Allapi.getSections.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = await response.json();
            if (result.success) {
                setSections(result.data);
            }
        } catch (error) {
            toast.error('Error fetching sections');
        }
    };

    const fetchSectionSubjects = async () => {
        const selectedClassData = classes.find(c => c._id === selectedClass);
        if (selectedClassData?.subjects) {
            const allSubjects = [
                ...(selectedClassData.subjects.mainSubjects || []),
                ...(selectedClassData.subjects.additionalSubjects || [])
            ];
            setSectionSubjects(allSubjects);
        }
    };

    const fetchAssignments = async () => {
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
                setAssignments(result.data);
                // Update assignedTeachers state based on assignments
                const assignedTeachersMap = {};
                result.data.forEach(assignment => {
                    assignment.classAssignments.forEach(ca => {
                        ca.sections.forEach(section => {
                            if (section.sectionName === sections.find(s => s._id === selectedSection)?.name) {
                                assignedTeachersMap[section.subject] = assignment.teacherId;
                            }
                        });
                    });
                });
                setAssignedTeachers(assignedTeachersMap);
            }
        } catch (error) {
            toast.error('Error fetching assignments');
        }
    };

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        setSelectedSection('');
        setSectionSubjects([]);
        setAssignedTeachers({});
        if (classId) {
            fetchSections(classId);
        } else {
            setSections([]);
        }
    };

    const handleTeacherAssignment = async (subject, teacherId) => {
        try {
            setLoading(true);

            // If updating, remove previous assignment
            if (updatingSubject) {
                const prevTeacherId = assignedTeachers[subject];
                if (prevTeacherId) {
                    await fetch(
                        Allapi.removeTeacherAssignment.url(prevTeacherId),
                        {
                            method: Allapi.removeTeacherAssignment.method,
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                subject,
                                className: classes.find(c => c._id === selectedClass)?.name,
                                sectionName: sections.find(s => s._id === selectedSection)?.name
                            })
                        }
                    );
                }
            }

            // Create new assignment
            const response = await fetch(
                Allapi.assignTeacher.url,
                {
                    method: Allapi.assignTeacher.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        teacherId,
                        subject,
                        className: classes.find(c => c._id === selectedClass)?.name,
                        sectionName: sections.find(s => s._id === selectedSection)?.name,
                        academicYear: branchdet.academicYears[0]
                    })
                }
            );

            const result = await response.json();
            if (result.success) {
                setAssignedTeachers(prev => ({
                    ...prev,
                    [subject]: teacherId
                }));
                toast.success('Teacher assigned successfully');
                setUpdatingSubject(null);
                await fetchAssignments();
            } else {
                toast.error(result.message || 'Failed to assign teacher');
            }
        } catch (error) {
            toast.error('Error assigning teacher');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (subject) => {
        setUpdatingSubject(subject);
        setActiveDropdown(subject);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {viewMode ? 'View Teacher Assignments' : 'Assign Teachers'}
                        </h1>
                        <button
                            onClick={() => setViewMode(!viewMode)}
                            className="px-4 py-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                            {viewMode ? 'Switch to Assign Mode' : 'Switch to View Mode'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={handleClassChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section
                            </label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                disabled={!selectedClass}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
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

                    {selectedSection && sectionSubjects.length > 0 && (
                        <>
                            <SubjectsTable
                                subjects={sectionSubjects}
                                teachers={teachers}
                                assignedTeachers={assignedTeachers}
                                onAssign={handleTeacherAssignment}
                                loading={loading}
                                viewMode={viewMode}
                                onOpenDropdown={setActiveDropdown}
                                onUpdate={handleUpdate}
                                updatingSubject={updatingSubject}
                            />

                            {activeDropdown && (
                                <TeacherDropdown
                                    subject={activeDropdown}
                                    teachers={teachers}
                                    onAssign={handleTeacherAssignment}
                                    onClose={() => {
                                        setActiveDropdown(null);
                                        setUpdatingSubject(null);
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignTeachers;