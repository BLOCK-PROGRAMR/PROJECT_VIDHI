import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { mycon } from '../../../store/Mycontext';
import Allapi from '../../../common';
import 'react-toastify/dist/ReactToastify.css';

const AddTeacher = () => {
    const { branchdet } = useContext(mycon);
    const [classes, setClasses] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    const [formData, setFormData] = useState({
        name: '',
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
        joiningDate: '',
        aadharNumber: '',
        academic_id: '',
        role: 'Teacher',
        branchId:branchdet._id
    });

    useEffect(() => {
        if (branchdet?.academicYears?.[0]) {
            setFormData(prev => ({
                ...prev,
                academic_id: branchdet.academicYears[0]
            }));
            fetchClasses();
        }
    }, [branchdet]);

    const fetchClasses = async () => {
        try {
            const response = await fetch(Allapi.getClasses.url(branchdet.academicYears[0]), {
                method: Allapi.getClasses.method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                setClasses(result.data);
                const subjectsSet = new Set();
                result.data.forEach(cls => {
                    if (cls.subjects) {
                        cls.subjects.mainSubjects?.forEach(subject =>
                            subjectsSet.add(subject.toLowerCase())
                        );
                        cls.subjects.additionalSubjects?.forEach(subject =>
                            subjectsSet.add(subject.toLowerCase())
                        );
                    }
                });
                const sortedSubjects = Array.from(subjectsSet).sort();
                setAvailableSubjects(sortedSubjects);
            }
        } catch (error) {
            toast.error('Error fetching subjects');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddSubject = () => {
        if (!selectedSubject) {
            toast.error('Please select a subject');
            return;
        }

        if (formData.teachingSubjects.some(subject =>
            subject.name.toLowerCase() === selectedSubject.toLowerCase()
        )) {
            toast.error('Subject already added');
            return;
        }

        setFormData(prev => ({
            ...prev,
            teachingSubjects: [...prev.teachingSubjects, { name: selectedSubject }]
        }));
        setSelectedSubject('');
    };

    const handleRemoveSubject = (index) => {
        setFormData(prev => ({
            ...prev,
            teachingSubjects: prev.teachingSubjects.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return false;
        }
        if (!formData.username.trim()) {
            toast.error('Username is required');
            return false;
        }

        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.address.pincode.trim() || !/^\d{6}$/.test(formData.address.pincode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return false;
        }
        if (!formData.aadharNumber.trim() || !/^\d{12}$/.test(formData.aadharNumber)) {
            console.log("aadhar num: ",formData.aadharNumber)
            toast.error('Please enter a valid 12-digit Aadhar number');
            return false;
        }
        if (!formData.teachingSubjects.length) {
            toast.error('Please add at least one teaching subject');
            return false;
        }
        if (!formData.academic_id) {
            toast.error('Academic year not available');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(Allapi.addTeacher.url, {
                method: Allapi.addTeacher.method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Teacher added successfully!');
                setFormData({
                    name: '',
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
                    joiningDate: '',
                    aadharNumber: '',
                    academic_id: branchdet.academicYears[0],
                    role: 'Teacher',
                    branchId: branchdet._id
                });
                setSelectedSubject('');
            } else {
                toast.error(result.message || 'Failed to add teacher');
            }
        } catch (error) {
            toast.error('Failed to add teacher. Please try again.');
            console.error('Error adding teacher:', error);
        }
    };

    if (!branchdet?.academicYears?.[0]) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-700">Loading academic year information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-100">
            <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Add Teacher</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter username"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Aadhar Number
                            </label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter aadhar"
                                maxLength={12}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="10-digit phone number"
                                maxLength={10}
                            />
                        </div>

                        
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                name="address.doorNo"
                                value={formData.address.doorNo}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Door No"
                            />
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Street"
                            />
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="City"
                            />
                            <input
                                type="text"
                                name="address.pincode"
                                value={formData.address.pincode}
                                onChange={handleInputChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Pincode"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Qualification
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter qualification"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Experience (years)
                            </label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Years of experience"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Joining Date
                            </label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Teaching Subjects */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Teaching Subjects
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Subject</option>
                                {availableSubjects.map((subject, index) => (
                                    <option key={index} value={subject}>{subject}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAddSubject}
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Subject
                            </button>
                        </div>

                        {/* Subject Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.teachingSubjects.map((subject, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full"
                                >
                                    <span className="text-blue-800">{subject.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSubject(index)}
                                        className="text-blue-800 hover:text-blue-900 focus:outline-none"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add Teacher
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTeacher;