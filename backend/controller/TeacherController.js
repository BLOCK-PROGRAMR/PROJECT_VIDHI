// const Teacher = require('../models/Teachers');
// const bcrypt = require('bcryptjs');
// const mongoose = require('mongoose');

// exports.addTeacher = async (req, res) => {
//     try {
//         const { aadharNumber, name } = req.body;

//         // Check for existing teacher
//         const existingTeacher = await Teacher.findOne({ aadharNumber });
//         if (existingTeacher) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Teacher with this Aadhar number already exists',
//             });
//         }

//         // Create new teacher
//         const newTeacher = new Teacher(req.body);
//         await newTeacher.save();

//         // Create user account for teacher with correct role
//         const hashedPassword = await bcrypt.hash(aadharNumber, 10);
//         await mongoose.model('User').create({
//             name,
//             username: aadharNumber,
//             password: hashedPassword,
//             role: 'Teacher' // Updated to match User model enum
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Teacher added successfully',
//             data: newTeacher,
//         });
//     } catch (error) {
//         console.error('Error in addTeacher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error adding teacher',
//             error: error.message,
//         });
//     }
// };
// exports.getTeachers = async (req, res) => {
//     try {
//         const { academicId } = req.params;
//         const teachers = await Teacher.find({ academic_id: academicId });

//         res.status(200).json({
//             success: true,
//             data: teachers,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching teachers',
//             error: error.message,
//         });
//     }
// };

// exports.getTeacherById = async (req, res) => {
//     try {
//         const { teacherId } = req.params;
//         const teacher = await Teacher.findById(teacherId);

//         if (!teacher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Teacher not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: teacher,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching teacher',
//             error: error.message,
//         });
//     }
// };

// exports.updateTeacher = async (req, res) => {
//     try {
//         const { teacherId } = req.params;
//         const teacher = await Teacher.findByIdAndUpdate(
//             teacherId,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         if (!teacher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Teacher not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Teacher updated successfully',
//             data: teacher,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error updating teacher',
//             error: error.message,
//         });
//     }
// };

// exports.deleteTeacher = async (req, res) => {
//     try {
//         const { teacherId } = req.params;
//         const teacher = await Teacher.findByIdAndDelete(teacherId);

//         if (!teacher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Teacher not found',
//             });
//         }

//         // Delete associated user account
//         await mongoose.model('User').deleteOne({ username: teacher.aadharNumber });

//         res.status(200).json({
//             success: true,
//             message: 'Teacher deleted successfully',
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error deleting teacher',
//             error: error.message,
//         });
//     }
// };


const Teacher = require('../models/Teachers');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.addTeacher = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { username, aadharNumber, name , branchId} = req.body;

        // Check for existing teacher
        const existingTeacher = await Teacher.findOne({ aadharNumber }).session(session);
        if (existingTeacher) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Teacher with this Aadhar number already exists',
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ username }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
            });
        }

        // Create teacher record (excluding auth details)
        const teacherData = {
            name,
            username,
            phone: req.body.phone,
            address: req.body.address,
            qualification: req.body.qualification,
            experience: req.body.experience,
            teachingSubjects: req.body.teachingSubjects,
            joiningDate: req.body.joiningDate,
            aadharNumber,
            academic_id: req.body.academic_id,
            role: 'Teacher',
            branchId: branchId
        };

        const newTeacher = new Teacher(teacherData);
        await newTeacher.save({ session });

        // Create user account with provided username/password
        const hashedPassword = await bcrypt.hash(aadharNumber, 10);
        const userData = {
            name,
            username,
            password: hashedPassword,
            branch: branchId,
            role: 'Teacher'
        };

        const newUser = new User(userData);
        await newUser.save({ session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Teacher added successfully',
            data: newTeacher,
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error in addTeacher:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding teacher',
            error: error.message,
        });
    } finally {
        session.endSession();
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const { academicId } = req.params;
        const teachers = await Teacher.find({ academic_id: academicId });

        res.status(200).json({
            success: true,
            data: teachers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching teachers',
            error: error.message,
        });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found',
            });
        }

        res.status(200).json({
            success: true,
            data: teacher,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching teacher',
            error: error.message,
        });
    }
};
exports.updateTeacher = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { teacherId } = req.params;
        const { username, password, ...teacherData } = req.body;

        // Find the teacher first
        const teacher = await Teacher.findById(teacherId).session(session);
        if (!teacher) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Teacher not found',
            });
        }

        // Update teacher record with only allowed fields
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            {
                qualification: teacherData.qualification,
                experience: teacherData.experience,
                address: teacherData.address,
                academic_id: teacherData.academic_id,
                teachingSubjects: teacherData.teachingSubjects || teacher.teachingSubjects
            },
            { new: true, runValidators: true, session }
        );

        // Handle user account update if username or password is provided
        if (username || password) {
            // Find the associated user by teacher's name
            const user = await User.findOne({
                name: teacher.name,
                role: 'Teacher'
            }).session(session);

            if (user) {
                const userUpdateData = {};

                if (username) {
                    // Check if new username is already taken
                    const existingUser = await User.findOne({
                        username,
                        _id: { $ne: user._id }
                    }).session(session);

                    if (existingUser) {
                        await session.abortTransaction();
                        return res.status(400).json({
                            success: false,
                            message: 'Username already exists',
                        });
                    }
                    userUpdateData.username = username;
                }

                if (password) {
                    userUpdateData.password = await bcrypt.hash(password, 10);
                }

                await User.findByIdAndUpdate(
                    user._id,
                    userUpdateData,
                    { session }
                );
            }
        }

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Teacher updated successfully',
            data: updatedTeacher,
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating teacher',
            error: error.message,
        });
    } finally {
        session.endSession();
    }
};
exports.deleteTeacher = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findById(teacherId).session(session);

        if (!teacher) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Teacher not found',
            });
        }

        // Delete teacher record
        await Teacher.findByIdAndDelete(teacherId).session(session);

        // Delete associated user account
        await User.deleteOne({ username: teacher.username }).session(session);

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Teacher and associated user account deleted successfully',
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: 'Error deleting teacher',
            error: error.message,
        });
    } finally {
        session.endSession();
    }
};