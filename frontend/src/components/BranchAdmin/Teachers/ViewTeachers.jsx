import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';

const ViewTeachers = () => {
    const { branchdet } = useContext(mycon);
    const [teachers, setTeachers] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [teacherAssignments, setTeacherAssignments] = useState({});
    const [editFormData, setEditFormData] = useState({
        username: '',
        password: '',
        phone: '',
        address: {
            doorNo: '',
            street: '',
            city: '',
            pincode: '',
        },
        qualification: '',
        experience: '',
        teachingSubjects: [],
        joiningDate: ''
    });

    const normalizeSubjects = (subjectList) => {
        const uniqueSubjects = new Set(
            subjectList.map(subject => subject.toLowerCase())
        );
        return Array.from(uniqueSubjects).sort();
    };

    useEffect(() => {
        if (branchdet?.academicYears?.[0]) {
            fetchTeachers();
            fetchTeacherAssignments();
        }
    }, [branchdet]);

    useEffect(() => {
        if (selectedSubject) {
            const filtered = teachers.filter(teacher =>
                teacher.teachingSubjects.some(subject =>
                    subject.name.toLowerCase() === selectedSubject.toLowerCase()
                )
            );
            setFilteredTeachers(filtered);
        } else {
            setFilteredTeachers([]);
        }
    }, [selectedSubject, teachers]);

    const fetchTeacherAssignments = async () => {
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
                const assignmentMap = {};
                result.data.forEach(assignment => {
                    assignmentMap[assignment.teacherId] = assignment;
                });
                setTeacherAssignments(assignmentMap);
            }
        } catch (error) {
            toast.error('Error fetching teacher assignments');
        }
    };

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
                const allSubjects = [];
                result.data.forEach(teacher => {
                    teacher.teachingSubjects.forEach(subject => {
                        allSubjects.push(subject.name);
                    });
                });
                const normalizedSubjects = normalizeSubjects(allSubjects);
                setAvailableSubjects(normalizedSubjects);
            }
        } catch (error) {
            toast.error('Error fetching teachers');
        }
    };

    const isTeacherAssigned = (teacherId, subjectName) => {
        const assignment = teacherAssignments[teacherId];
        if (!assignment) return false;

        return assignment.classAssignments.some(classAssign =>
            classAssign.sections.some(section =>
                section.subject.toLowerCase() === subjectName.toLowerCase()
            )
        );
    };

    const handleDeleteTeacher = async (teacherId) => {
        const teacher = teachers.find(t => t._id === teacherId);
        if (!teacher) return;

        if (teacher.teachingSubjects.length > 0) {
            toast.error('Cannot delete teacher. Please remove all subjects first.');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${teacher.name}?`)) return;

        try {
            const response = await fetch(
                Allapi.deleteTeacher.url(teacherId),
                {
                    method: Allapi.deleteTeacher.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = await response.json();
            if (result.success) {
                toast.success('Teacher deleted successfully');
                fetchTeachers();
            } else {
                toast.error(result.message || 'Failed to delete teacher');
            }
        } catch (error) {
            toast.error('Error deleting teacher');
        }
    };

    const handleDelete = async (teacherId, subjectToRemove) => {
        const teacher = teachers.find(t => t._id === teacherId);
        if (!teacher) return;

        if (isTeacherAssigned(teacherId, subjectToRemove)) {
            toast.error('Cannot remove subject. Teacher is currently assigned to teach this subject. Please remove class assignments first.');
            return;
        }

        if (!window.confirm(`Are you sure you want to remove ${subjectToRemove} from this teacher's subjects?`)) return;

        try {
            const updatedSubjects = teacher.teachingSubjects.filter(
                subject => subject.name.toLowerCase() !== subjectToRemove.toLowerCase()
            );

            const response = await fetch(
                Allapi.updateTeacher.url(teacherId),
                {
                    method: Allapi.updateTeacher.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...teacher,
                        teachingSubjects: updatedSubjects,
                        academic_id: branchdet.academicYears[0]
                    })
                }
            );

            const result = await response.json();
            if (result.success) {
                toast.success(`Subject ${subjectToRemove} removed successfully`);
                fetchTeachers();
            } else {
                toast.error(result.message || 'Failed to remove subject');
            }
        } catch (error) {
            toast.error('Error removing subject');
        }
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setEditFormData({
            username: teacher.username || '',
            password: '',
            phone: teacher.phone,
            address: { ...teacher.address },
            qualification: teacher.qualification,
            experience: teacher.experience,
            teachingSubjects: [...teacher.teachingSubjects],
            joiningDate: teacher.joiningDate ? teacher.joiningDate.split('T')[0] : ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                ...editFormData,
                academic_id: branchdet.academicYears[0],
                teachingSubjects: editingTeacher.teachingSubjects
            };

            // Remove empty fields
            if (!updateData.password) {
                delete updateData.password;
            }
            if (!updateData.username) {
                delete updateData.username;
            }

            // Ensure all required fields are present
            if (!updateData.qualification || !updateData.experience) {
                toast.error('Please fill in all required fields');
                return;
            }

            const response = await fetch(
                Allapi.updateTeacher.url(editingTeacher._id),
                {
                    method: Allapi.updateTeacher.method,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                }
            );

            const result = await response.json();
            if (result.success) {
                toast.success('Teacher updated successfully');
                setIsEditModalOpen(false);
                fetchTeachers();
            } else {
                toast.error(result.message || 'Failed to update teacher');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Error updating teacher. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setEditFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">View Teachers</h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Subject
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Subject</option>
                            {availableSubjects.map((subject, index) => (
                                <option key={index} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>

                    {selectedSubject && (
                        <div className="space-y-4">
                            {filteredTeachers.map((teacher) => (
                                <div key={teacher._id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg text-black">{teacher.name}</h3>
                                            <p className="text-gray-600">Phone: {teacher.phone}</p>
                                            <p className="text-gray-600">Qualification: {teacher.qualification}</p>
                                            <p className="text-gray-600">Experience: {teacher.experience} years</p>
                                            <div className="mt-2">
                                                <p className="text-sm font-medium">Teaching Subjects:</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {teacher.teachingSubjects.map((subject, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                                                        >
                                                            {subject.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(teacher)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher._id, selectedSubject)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            >
                                                Remove Subject
                                            </button>
                                            {teacher.teachingSubjects.length === 0 && (
                                                <button
                                                    onClick={() => handleDeleteTeacher(teacher._id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                >
                                                    Delete Teacher
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isEditModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <h3 className="text-xl font-bold mb-4">Edit Teacher</h3>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name (Non-editable)</label>
                                            <input
                                                type="text"
                                                value={editingTeacher?.name || ''}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={editFormData.username}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                New Password (leave blank to keep current)
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={editFormData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Non-editable)</label>
                                            <input
                                                type="text"
                                                value={editFormData.phone}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                            <input
                                                type="text"
                                                name="qualification"
                                                value={editFormData.qualification}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                            <input
                                                type="number"
                                                name="experience"
                                                value={editFormData.experience}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="address.doorNo"
                                                value={editFormData.address.doorNo}
                                                onChange={handleInputChange}
                                                placeholder="Door No"
                                                className="px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={editFormData.address.street}
                                                onChange={handleInputChange}
                                                placeholder="Street"
                                                className="px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={editFormData.address.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                className="px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="text"
                                                name="address.pincode"
                                                value={editFormData.address.pincode}
                                                onChange={handleInputChange}
                                                placeholder="Pincode"
                                                className="px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewTeachers;