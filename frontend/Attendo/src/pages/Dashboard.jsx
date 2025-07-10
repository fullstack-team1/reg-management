import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dash() {
    const [units, setUnits] = useState([]);
    const [userCourse, setUserCourse] = useState("");
    const [attendanceHist, setAttendanceHist] = useState([]);
    const navigate = useNavigate();

    return (
    <>
        <div>
            <h1>Welcome Student</h1>
        </div>
    </>
)
};

    