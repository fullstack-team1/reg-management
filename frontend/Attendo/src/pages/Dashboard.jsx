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
        <div>
            <h1>Welcome Student</h1>
        </div>
    </>
)
};

    