import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dash() {
    const [units, setUnits] = useState([]);
    const [userCourse, setUserCourse] = useState("");
    const [attendanceHist, setAttendanceHist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user units and attendance history
        const fetchData = async () => {
            const res = await fetch("/api/dashboard") //from the backend
            const data = await res.json() //parse the data to json format

            setUnits(data.units); //fetch the units
            setAttendanceHist(data.attendanceHist); //fetch the attendance history
            setUserCourse(data.course); //fetch the course
        };
        fetchData();
    }, []);

    // Log out function 
    const handleLogout = () => {
        navigate('/login');
    };

    // Handle the attendance
    const handleAttendance = async (unitId) => {
        const res = await fetch("/api/attendance", {
            method: 'POST',
            body: JSON.stringify({unit_id : unitId}),
            headers: {'content-type' : 'application/json'}
        });

        if (res.ok) {
            alert("Attendance marked");
        };
    };

    return (
    <>
    <div className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Welcome, {userCourse}</h1>
                <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Mark Attendance</h2>
                <ul className="space-y-4">
                    {units.length === 0 ? (
                      <p className="text-gray-500">No units available yet.</p>
                    ) : (
                        units.map((unit) => (
                          <li
                            key={unit.id}
                            className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{unit.name}</p>
                              <p className="text-sm text-gray-600">
                                {unit.date} | {unit.start_time} - {unit.end_time}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAttendance(unit.id)}
                              disabled={new Date() < new Date(unit.date)}
                              className={`px-4 py-2 rounded text-sm font-medium transition ${
                                new Date() < new Date(unit.date)
                                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              Attend
                            </button>
                          </li>
                        ))
                    )
                    }
                </ul>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Attendance History</h2>

                <ul>
                    {attendanceHist.map((attendance) => (
                        <li key={attendance.id}>
                            {attendance.unit_name} - {attendance.marked_time}
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    </div>
    </>
    )
};

    