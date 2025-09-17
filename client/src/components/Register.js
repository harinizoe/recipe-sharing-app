import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleOAuth from './GoogleOAuth';

function Register() {
  const navigate = useNavigate();
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
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (userData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/google-auth', {
        googleId: userData.googleId,
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      });
      
      alert(res.data.message || "Google registration successful");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Google registration failed");
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error);
    alert('Google sign-in failed. Please try again.');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="glass-card p-5 fade-in">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="bi bi-person-plus-fill display-4 text-gradient-primary"></i>
                </div>
                <h2 className="display-6 fw-bold gradient-text mb-2">Join Recipe Haven</h2>
                <p className="text-muted">Create your account and start sharing amazing recipes</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted">Full Name</label>
                  <div className="position-relative">
                    <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      className="form-control ps-5 py-3"
                      style={{borderRadius: 'var(--radius-lg)', border: '2px solid var(--gray-200)', fontSize: '1rem'}}
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
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
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted">Password</label>
                      <div className="position-relative">
                        <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input
                          className="form-control ps-5 py-3"
                          style={{borderRadius: 'var(--radius-lg)', border: '2px solid var(--gray-200)', fontSize: '1rem'}}
                          type="password"
                          name="password"
                          placeholder="Create password"
                          value={form.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted">Confirm Password</label>
                      <div className="position-relative">
                        <i className="bi bi-shield-check position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input
                          className="form-control ps-5 py-3"
                          style={{borderRadius: 'var(--radius-lg)', border: '2px solid var(--gray-200)', fontSize: '1rem'}}
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="btn btn-primary w-100 py-3 mb-4 fw-bold" type="submit">
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </button>
              </form>
              
              {/* Google OAuth Section */}
              <GoogleOAuth 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              
              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Already have an account? 
                  <button 
                    type="button" 
                    className="btn btn-link p-0 ms-1 text-decoration-none fw-semibold"
                    onClick={() => navigate('/login')}
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
