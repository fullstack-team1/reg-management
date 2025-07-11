import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dash() {
  const [units, setUnits] = useState([]);
  const [userCourse, setUserCourse] = useState("");
  const [attendanceHist, setAttendanceHist] = useState([]);
  const navigate = useNavigate();

  // Fetch units from /api/dashboard/
  const fetchUnits = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const res = await fetch("/api/dashboard/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setUnits(data);
      // Assuming course info is part of user data or fetched elsewhere
    } else {
      // Token might be invalid or expired
      navigate("/login");
    }
  };

  // Fetch attendance history from /api/attendance/history/
  const fetchAttendanceHistory = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const res = await fetch("/api/attendance/history/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setAttendanceHist(data);
    } else {
      navigate("/login");
    }
  };

  // Fetch user course info - optional, adjust as needed
  // You can add an endpoint for current user details if you want to show course
  // For now, we'll skip or set dummy text
  useEffect(() => {
    setUserCourse("Your Course"); // Replace or fetch from an API if available
    fetchUnits();
    fetchAttendanceHistory();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  // Mark attendance
  const handleAttendance = async (unitId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const res = await fetch("/api/attendance/mark/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ unit_id: unitId }),
    });

    if (res.ok) {
      alert("Attendance marked");
      fetchAttendanceHistory();
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Failed to mark attendance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Welcome, {userCourse}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Mark Attendance
          </h2>
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
                      Scheduled Time: {unit.scheduled_time}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAttendance(unit.id)}
                    className="px-4 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Attend
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Attendance History
          </h2>

          <ul>
            {attendanceHist.length === 0 ? (
              <p className="text-gray-500">No attendance history found.</p>
            ) : (
              attendanceHist.map((attendance) => (
                <li key={attendance.id}>
                  {attendance.unit_name} -{" "}
                  {new Date(attendance.timestamp).toLocaleString()}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
