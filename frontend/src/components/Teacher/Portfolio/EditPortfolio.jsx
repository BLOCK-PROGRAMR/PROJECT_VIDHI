import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Allapi from '../../../common';

const EditPortfolio = () => {
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [formData, setFormData] = useState({
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
    joiningDate: ''
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login again');
          return;
        }

        // Parse the token to get teacher ID
        const tokenData = parseJwt(token);
        if (!tokenData.teacherData?._id) {
          toast.error('Teacher data not found');
          return;
        }

        const response = await fetch(
          Allapi.getTeacherById.url(tokenData.teacherData._id),
          {
            method: Allapi.getTeacherById.method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const result = await response.json();
        if (result.success) {
          setTeacherData(result.data);
          setFormData({
            username: result.data.username || '',
            password: '',
            phone: result.data.phone || '',
            address: {
              doorNo: result.data.address?.doorNo || '',
              street: result.data.address?.street || '',
              city: result.data.address?.city || '',
              pincode: result.data.address?.pincode || '',
            },
            qualification: result.data.qualification || '',
            experience: result.data.experience || '',
            joiningDate: result.data.joiningDate ? result.data.joiningDate.split('T')[0] : ''
          });
        } else {
          toast.error(result.message || 'Failed to fetch teacher data');
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        toast.error('Error loading teacher data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
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

  const validateForm = () => {
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.address.pincode.trim() || !/^\d{6}$/.test(formData.address.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    if (!formData.qualification.trim()) {
      toast.error('Qualification is required');
      return false;
    }
    if (!formData.experience.toString().trim()) {
      toast.error('Experience is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updateData = {
        ...formData,
        academic_id: teacherData.academic_id,
        teachingSubjects: teacherData.teachingSubjects
      };

      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch(
        Allapi.updateTeacher.url(teacherData._id),
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
        toast.success('Profile updated successfully');
        if (updateData.password) {
          setFormData(prev => ({ ...prev, password: '' }));
        }
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Failed to load teacher data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Portfolio</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Non-editable)
                </label>
                <input
                  type="text"
                  value={teacherData.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

            {/* Address Fields */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.doorNo"
                  value={formData.address.doorNo}
                  onChange={handleInputChange}
                  placeholder="Door No"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Teaching Subjects (Read-only display) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teaching Subjects
              </label>
              <div className="flex flex-wrap gap-2">
                {teacherData.teachingSubjects.map((subject, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {subject.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolio;