// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { FaTimes, FaTrash, FaPlusCircle } from "react-icons/fa";
// import Allapi from "../../../common";

// const EditClassModal = ({ classItem, onClose, onUpdate }) => {
//   const [className, setClassName] = useState(classItem.name);
//   const [mainSubjects, setMainSubjects] = useState(
//     classItem.subjects.mainSubjects || [""]
//   );
//   const [additionalSubjects, setAdditionalSubjects] = useState(
//     classItem.subjects.additionalSubjects || [""]
//   );

//   // Handle addition of new main subject
//   const handleAddMainSubject = () => {
//     setMainSubjects([...mainSubjects, ""]);
//   };

//   // Handle deletion of main subject
//   const handleDeleteMainSubject = (index) => {
//     const updatedMainSubjects = mainSubjects.filter((_, i) => i !== index);
//     setMainSubjects(updatedMainSubjects);
//   };

//   // Handle addition of new additional subject
//   const handleAddAdditionalSubject = () => {
//     setAdditionalSubjects([...additionalSubjects, ""]);
//   };

//   // Handle deletion of additional subject
//   const handleDeleteAdditionalSubject = (index) => {
//     const updatedAdditionalSubjects = additionalSubjects.filter(
//       (_, i) => i !== index
//     );
//     setAdditionalSubjects(updatedAdditionalSubjects);
//   };

//   // Handle subject changes
//   const handleMainSubjectsChange = (index, value) => {
//     const updatedMainSubjects = [...mainSubjects];
//     updatedMainSubjects[index] = value;
//     setMainSubjects(updatedMainSubjects);
//   };

//   const handleAdditionalSubjectsChange = (index, value) => {
//     const updatedAdditionalSubjects = [...additionalSubjects];
//     updatedAdditionalSubjects[index] = value;
//     setAdditionalSubjects(updatedAdditionalSubjects);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedClass = {
//       name: className,
//       subjects: {
//         mainSubjects,
//         additionalSubjects,
//       },
//     };

//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(Allapi.updateClass.url(classItem._id), {
//         method: Allapi.updateClass.method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedClass),
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast.success("Class updated successfully");
//         onClose(); // Close modal
//         onUpdate(); // Refresh classes
//       } else {
//         toast.error(result.message || "Failed to update class");
//       }
//     } catch (error) {
//       console.error("Error updating class:", error);
//       toast.error("Error updating class");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-2xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Edit Class</h2>
//           <button onClick={onClose} className="text-red-600 hover:text-red-800">
//             <FaTimes size={20} />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 font-semibold mb-2">
//               Class Name
//             </label>
//             <input
//               type="text"
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//               className="w-full p-4 border border-gray-300 rounded-lg"
//               required
//             />
//           </div>

//           {/* Main Subjects Section */}
//           <div>
//             <label className="block text-gray-700 font-semibold mb-2">
//               Main Subjects
//             </label>
//             {mainSubjects.map((subject, index) => (
//               <div key={index} className="flex space-x-2 items-center mb-2">
//                 <input
//                   type="text"
//                   value={subject}
//                   onChange={(e) =>
//                     handleMainSubjectsChange(index, e.target.value)
//                   }
//                   className="w-full p-4 border border-gray-300 rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleDeleteMainSubject(index)}
//                   className="bg-red-600 text-white p-2 rounded-md hover:bg-red-500 transition"
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={handleAddMainSubject}
//               className="flex items-center space-x-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition"
//             >
//               <FaPlusCircle />
//               <span>Add New Main Subject</span>
//             </button>
//           </div>

//           {/* Additional Subjects Section */}
//           <div>
//             <label className="block text-gray-700 font-semibold mb-2">
//               Additional Subjects
//             </label>
//             {additionalSubjects.map((subject, index) => (
//               <div key={index} className="flex space-x-2 items-center mb-2">
//                 <input
//                   type="text"
//                   value={subject}
//                   onChange={(e) =>
//                     handleAdditionalSubjectsChange(index, e.target.value)
//                   }
//                   className="w-full p-4 border border-gray-300 rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleDeleteAdditionalSubject(index)}
//                   className="bg-red-600 text-white p-2 rounded-md hover:bg-red-500 transition"
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={handleAddAdditionalSubject}
//               className="flex items-center space-x-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition"
//             >
//               <FaPlusCircle />
//               <span>Add New Additional Subject</span>
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-500 transition"
//           >
//             Update Class
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditClassModal;
import React, { useState } from "react";
import { FaPlusCircle, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Allapi from "../../../common/index";

const EditClass = ({ classItem, onClose, onUpdate }) => {
  const [className, setClassName] = useState(classItem.name || "");
  const [mainSubjects, setMainSubjects] = useState(
    classItem.subjects.mainSubjects || [""]
  );
  const [additionalSubjects, setAdditionalSubjects] = useState(
    classItem.subjects.additionalSubjects || [""]
  );

  const handleMainSubjectsChange = (index, value) => {
    const updatedMainSubjects = [...mainSubjects];
    updatedMainSubjects[index] = value;
    setMainSubjects(updatedMainSubjects);
  };

  const handleAdditionalSubjectsChange = (index, value) => {
    const updatedAdditionalSubjects = [...additionalSubjects];
    updatedAdditionalSubjects[index] = value;
    setAdditionalSubjects(updatedAdditionalSubjects);
  };

  const addMainSubjectField = () => setMainSubjects([...mainSubjects, ""]);
  const addAdditionalSubjectField = () =>
    setAdditionalSubjects([...additionalSubjects, ""]);

  const removeMainSubjectField = (index) => {
    setMainSubjects(mainSubjects.filter((_, i) => i !== index));
  };

  const removeAdditionalSubjectField = (index) => {
    setAdditionalSubjects(additionalSubjects.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const updatedClassData = {
      name: className,
      academicYear: classItem.academicYear,
      mainSubjects: mainSubjects,
      additionalSubjects: additionalSubjects,
    };

    try {
      const response = await fetch(Allapi.updateClass.url(classItem._id), {
        method: Allapi.updateClass.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedClassData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Class updated successfully");
        console.log("updated class is", result.data);
        onUpdate(); // Callback to refresh the class list
        onClose(); // Close the modal after successful update
      } else {
        toast.error(result.message || "Failed to update class");
      }
    } catch (error) {
      toast.error("Error updating class");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Class</h2>
          <button onClick={onClose} className="text-red-600 hover:text-red-800">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {/* Main Subjects Section */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Main Subjects
            </label>
            {mainSubjects.map((subject, index) => (
              <div key={index} className="flex space-x-2 items-center mb-2">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    handleMainSubjectsChange(index, e.target.value)
                  }
                  className="w-full p-4 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeMainSubjectField(index)}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-500 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMainSubjectField}
              className="flex items-center space-x-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition"
            >
              <FaPlusCircle />
              <span>Add New Main Subject</span>
            </button>
          </div>
          {/* Additional Subjects Section */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Additional Subjects
            </label>
            {additionalSubjects.map((subject, index) => (
              <div key={index} className="flex space-x-2 items-center mb-2">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    handleAdditionalSubjectsChange(index, e.target.value)
                  }
                  className="w-full p-4 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeAdditionalSubjectField(index)}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-500 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAdditionalSubjectField}
              className="flex items-center space-x-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition"
            >
              <FaPlusCircle />
              <span>Add New Additional Subject</span>
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-500 transition"
          >
            Update Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditClass;
