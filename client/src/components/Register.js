import React, { useState } from 'react';
import axios from 'axios';

function Register({theme}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', form);
      alert(res.data.message || "User registered successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form className="p-4 bg-white shadow rounded" onSubmit={handleSubmit} className={`p-4 shadow rounded ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white text-dark'}`}
      >
      
      <input className="form-control mb-3" type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input className="form-control mb-3" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="form-control mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input className="form-control mb-3" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        <button className="btn btn-primary w-100">Register</button>
        </form>
    </div>
  );
}

export default Register;
