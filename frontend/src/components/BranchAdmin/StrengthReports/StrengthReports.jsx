import React, { useState, useEffect, useContext } from "react";
import { mycon } from "../../../store/Mycontext";
import Allapi from "../../../common";

const StrengthReports = () => {
  const { branchdet } = useContext(mycon);
  const [viewType, setViewType] = useState("class");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [strengthData, setStrengthData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (branchdet?.academicYears?.[0]) {
      fetchClasses();
    }
  }, [branchdet]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        Allapi.getClasses.url(branchdet.academicYears[0]),
        {
          method: Allapi.getClasses.method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch classes");

      const result = await response.json();
      if (result.success) {
        setClasses(result.data);
        if (viewType === "class") {
          fetchStrengthData(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStrengthData = async (classList) => {
    try {
      setLoading(true);
      const strengthPromises = classList.map(async (cls) => {
        const sectionsResponse = await fetch(
          Allapi.getSectionsByClass.url(cls.name, branchdet.academicYears[0]),
          {
            method: Allapi.getSectionsByClass.method,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!sectionsResponse.ok) throw new Error("Failed to fetch sections");

        const sectionsResult = await sectionsResponse.json();
        const sections = sectionsResult.data || [];

        const studentsPromises = sections.map(async (section) => {
          const studentsResponse = await fetch(
            Allapi.getStudentsBySection.url(section._id),
            {
              method: Allapi.getStudentsBySection.method,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!studentsResponse.ok) throw new Error("Failed to fetch students");

          const studentsResult = await studentsResponse.json();
          return {
            section,
            students: studentsResult.data || [],
          };
        });

        const sectionsWithStudents = await Promise.all(studentsPromises);

        const classTotals = sectionsWithStudents.reduce(
          (acc, { students }) => {
            const transport = students.filter((s) => s.transport).length;
            const hostel = students.filter((s) => s.hostel).length;
            const others = students.filter(
              (s) => !s.transport && !s.hostel
            ).length;

            return {
              transport: acc.transport + transport,
              hostel: acc.hostel + hostel,
              others: acc.others + others,
              total: acc.total + students.length,
            };
          },
          { transport: 0, hostel: 0, others: 0, total: 0 }
        );

        return {
          class: cls,
          ...classTotals,
          sections: sectionsWithStudents,
        };
      });

      const strengthData = await Promise.all(strengthPromises);
      setStrengthData(strengthData);
    } catch (error) {
      console.error("Error fetching strength data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
    setSelectedClass("");
    if (type === "class") {
      fetchStrengthData(classes);
    } else {
      setStrengthData([]);
    }
  };

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    if (!classId) {
      setStrengthData([]);
      return;
    }

    const selectedClassData = classes.find((c) => c._id === classId);
    if (selectedClassData) {
      fetchStrengthData([selectedClassData]);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Strength Report
        </h1>

        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => handleViewTypeChange("class")}
              className={`px-4 py-2 rounded-lg ${
                viewType === "class"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Class-wise Report
            </button>
            <button
              onClick={() => handleViewTypeChange("section")}
              className={`px-4 py-2 rounded-lg ${
                viewType === "section"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Section-wise Report
            </button>
          </div>
        </div>

        {viewType === "section" && (
          <div className="mb-6">
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full md:w-64 p-2 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && strengthData.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {viewType === "class" ? "Class" : "Section"}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transport
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hostlers
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Others
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {strengthData.map((data, index) =>
                  viewType === "class" ? (
                    <tr key={data.class._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.class.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.transport}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.hostel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.others}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.total}
                      </td>
                    </tr>
                  ) : (
                    data.sections.map((sectionData, sIndex) => (
                      <tr
                        key={sectionData.section._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sIndex + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sectionData.section.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {
                            sectionData.students.filter((s) => s.transport)
                              .length
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sectionData.students.filter((s) => s.hostel).length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {
                            sectionData.students.filter(
                              (s) => !s.transport && !s.hostel
                            ).length
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sectionData.students.length}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    colSpan="2"
                  >
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {strengthData.reduce(
                      (acc, data) =>
                        acc +
                        (viewType === "class"
                          ? data.transport
                          : data.sections.reduce(
                              (secAcc, sec) =>
                                secAcc +
                                sec.students.filter((s) => s.transport).length,
                              0
                            )),
                      0
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {strengthData.reduce(
                      (acc, data) =>
                        acc +
                        (viewType === "class"
                          ? data.hostel
                          : data.sections.reduce(
                              (secAcc, sec) =>
                                secAcc +
                                sec.students.filter((s) => s.hostel).length,
                              0
                            )),
                      0
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {strengthData.reduce(
                      (acc, data) =>
                        acc +
                        (viewType === "class"
                          ? data.others
                          : data.sections.reduce(
                              (secAcc, sec) =>
                                secAcc +
                                sec.students.filter(
                                  (s) => !s.transport && !s.hostel
                                ).length,
                              0
                            )),
                      0
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {strengthData.reduce(
                      (acc, data) =>
                        acc +
                        (viewType === "class"
                          ? data.total
                          : data.sections.reduce(
                              (secAcc, sec) => secAcc + sec.students.length,
                              0
                            )),
                      0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {!loading && strengthData.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrengthReports;
