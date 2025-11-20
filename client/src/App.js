import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import icons
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import RecipeDetails from './components/RecipeDetails';
import EditRecipe from './components/EditRecipe';
import AdminPanel from './components/AdminPanel';
import MealPlanningCalendar from './components/MealPlanningCalendar';
import ShoppingListManager from './components/ShoppingListManager';
import AIChatbot from './components/AIChatbot';
function App() {

  return (
    <Router>
      <div className="min-vh-100 bg-light text-dark">
        {/* Modern Navbar */}
        <nav className="navbar navbar-expand-lg fixed-top" style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1.5rem'
            }}>
              🍳 Recipe Haven
            </Link>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/recipes">
                    <i className="bi bi-collection me-1"></i>Recipes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/meal-planning">
                    <i className="bi bi-calendar-week me-1"></i>Meal Planning
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/shopping-lists">
                    <i className="bi bi-cart-check me-1"></i>Shopping Lists
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/add-recipe">
                    <i className="bi bi-plus-circle me-1"></i>Add Recipe
                  </Link>
                </li>
               
              </ul>
              
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    <i className="bi bi-gear me-1"></i>Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container" style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
          
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/meal-planning" element={<MealPlanningCalendar />} />
            <Route path="/shopping-lists" element={<ShoppingListManager />} />
          </Routes>
        </div>
        
        {/* AI Chatbot - Available on all pages */}
        <AIChatbot />
      </div>
    </Router>
  );
}

export default App;
