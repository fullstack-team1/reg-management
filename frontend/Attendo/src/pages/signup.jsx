import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

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
        name,
        student_id: studentId,
        course,
        password
      })
    });

    if (response.ok) {
      alert("Signup successful! Please log in.");
      navigate("/");
    } else {
      alert("Signup failed. Try again.");
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
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
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

        <p className="mt-6 text-center text-sm">Already registered? <a href="/" className="text-blue-500 hover:underline text-blue-600">Log in</a></p>
        
      </form>
    </div>
  );
}
