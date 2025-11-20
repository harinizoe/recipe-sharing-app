import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from "react-router-dom";
function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/api/users/login', form);
      alert(res.data.message || "Login successful");
      localStorage.setItem('userId', res.data.userId);
      navigate("/recipes");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="glass-card p-5 fade-in">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="bi bi-person-circle display-4 text-gradient-primary"></i>
                </div>
                <h2 className="display-6 fw-bold gradient-text mb-2">Welcome Back</h2>
                <p className="text-muted">Sign in to your Recipe Haven account</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted">Email Address</label>
                  <div className="position-relative">
                    <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      className="form-control ps-5 py-3"
                      style={{borderRadius: 'var(--radius-lg)', border: '2px solid var(--gray-200)', fontSize: '1rem'}}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted">Password</label>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      className="form-control ps-5 py-3"
                      style={{borderRadius: 'var(--radius-lg)', border: '2px solid var(--gray-200)', fontSize: '1rem'}}
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <button className="btn btn-primary w-100 py-3 mb-4 fw-bold" type="submit">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </button>
                
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account? 
                    <button 
                      type="button" 
                      className="btn btn-link p-0 ms-1 text-decoration-none fw-semibold"
                      onClick={() => navigate('/register')}
                    >
                      Create one here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
