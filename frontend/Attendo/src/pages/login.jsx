import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, password: studentPassword })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2 overflow-y-auto">
      <form
        onSubmit={handleLogin}
        className="bg-white px-4 py-6 rounded-md shadow w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Log In</h2>


        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Enter your student ID"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={studentPassword}
            onChange={(e) => setStudentPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Enter your password"
            required
          />
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition"
        >
          Log In
        </button>

        <p className="mt-6 text-center text-sm">Not registered? <a href="/signup" className="text-blue-500 hover:underline text-blue-600">Sign up</a></p>
      </form>
    </div>
  );
}
