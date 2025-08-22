import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
function Login({theme}) {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const navigate = useNavigate(); // ✅ define it

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      alert(res.data.message || "Login successful");
      localStorage.setItem('userId', res.data.userId);
      navigate("/recipes");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container mt-4">
      <form className="p-4 bg-white shadow rounded" onSubmit={handleSubmit} className={`p-4 shadow rounded ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white text-dark'}`}
      >
        <h2 className="text-center mb-4">Login</h2>

        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
