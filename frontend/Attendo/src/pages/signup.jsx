import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Fetch courses from backend API to populate dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses/", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch("/api/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        student_id: studentId,
        course: course, // course ID from dropdown
        password,
      }),
    });

    if (response.ok) {
      alert("Signup successful! Please log in.");
      navigate("/login");
    } else {
      const errorData = await response.json();
      alert(errorData.detail || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2 overflow-y-auto">
      <form
        onSubmit={handleSignup}
        className="bg-white px-4 py-6 rounded-md shadow w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">Sign Up</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Course:</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-6 text-center text-sm">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
