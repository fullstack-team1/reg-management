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

    return (
    <>
        <div>
            <h1>Welcome Student</h1>
        </div>
    </>
)
};

    