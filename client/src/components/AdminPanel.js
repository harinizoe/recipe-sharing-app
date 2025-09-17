import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminRecipes from './AdminRecipes';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsers />;
      case 'recipes':
        return <AdminRecipes />;
      default:
        return (
          <div className="glass-card p-5 text-center">
            <i className="bi bi-speedometer2 display-4 text-gradient-primary mb-4"></i>
            <h2 className="display-5 fw-bold gradient-text mb-4">Admin Dashboard</h2>
            <p className="lead text-muted mb-4">Welcome to the Recipe Haven Admin Panel</p>
            
            <div className="row g-4 mt-4">
              <div className="col-md-6">
                <div className="feature-card p-4 h-100" onClick={() => setActiveTab('users')} style={{cursor: 'pointer'}}>
                  <i className="bi bi-people display-4 text-gradient-primary mb-3"></i>
                  <h4 className="fw-bold mb-3">Manage Users</h4>
                  <p className="text-muted">View, edit, and manage user accounts</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="feature-card p-4 h-100" onClick={() => setActiveTab('recipes')} style={{cursor: 'pointer'}}>
                  <i className="bi bi-collection display-4 text-gradient-primary mb-3"></i>
                  <h4 className="fw-bold mb-3">Manage Recipes</h4>
                  <p className="text-muted">View, edit, and manage recipes</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-2 col-md-3 p-0">
            <div className="glass-card h-100" style={{minHeight: '100vh', borderRadius: '0'}}>
              <div className="p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-shield-check display-5 text-gradient-primary mb-2"></i>
                  <h4 className="fw-bold gradient-text">Admin Panel</h4>
                </div>
                
                <nav className="nav flex-column">
                  <button
                    className={`nav-link btn text-start mb-2 ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </button>
                  <button
                    className={`nav-link btn text-start mb-2 ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <i className="bi bi-people me-2"></i>
                    Users
                  </button>
                  <button
                    className={`nav-link btn text-start mb-2 ${activeTab === 'recipes' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('recipes')}
                  >
                    <i className="bi bi-collection me-2"></i>
                    Recipes
                  </button>
                  
                  <hr className="my-3" />
                  
                  <button
                    className="nav-link btn btn-outline-secondary text-start"
                    onClick={() => navigate('/')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Site
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-lg-10 col-md-9 p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
