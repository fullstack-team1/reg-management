import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [studentId, setStudentId] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, studentPassword })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } else {
            alert('Invalid credentials')
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">
            Student ID:
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            placeholder="Enter your student ID"
            required
          />
        </div>

        
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">
            Password:
          </label>
          <input
            type="password"
            value={studentPassword}
            onChange={(e) => setStudentPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            placeholder="Enter your password"
            required
          />
        </div>

        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm">
          Not registered? <a href="/signup" className="text-blue-500 hover:underline text-blue-600">Sign up</a>

        </p>
      </form>
    </div>

    )
};
