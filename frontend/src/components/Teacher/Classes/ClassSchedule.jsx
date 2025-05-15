import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const ClassSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  // TODO: Fetch actual schedule from your API
  useEffect(() => {
    // Simulated schedule data
    const mockSchedule = daysOfWeek.map(day => ({
      day,
      classes: periods.map(period => ({
        period,
        subject: Math.random() > 0.3 ? 'Mathematics' : null,
        class: Math.random() > 0.3 ? '10th A' : null,
      }))
    }));
    setSchedule(mockSchedule);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day/Period
              </th>
              {periods.map(period => (
                <th 
                  key={period}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedule.map(({ day, classes }) => (
              <tr key={day}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {day}
                </td>
                {classes.map((classInfo, index) => (
                  <td 
                    key={index}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {classInfo.subject && classInfo.class ? (
                      <div>
                        <div className="font-medium text-gray-900">{classInfo.subject}</div>
                        <div className="text-gray-500">{classInfo.class}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSchedule;