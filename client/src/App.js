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

function App() {

  return (
    <Router>
      <div className="min-vh-100 bg-light text-dark">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
          <div className="container">
            <Link className="navbar-brand fw-bold text-primary" to="/">
              <i className="bi bi-egg-fried me-2"></i>
              Recipe App
            </Link>
            <ul className="navbar-nav ms-auto d-flex flex-row gap-3 align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="bi bi-house me-1"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/recipes">
                  <i className="bi bi-collection me-1"></i>
                  Recipes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary btn-sm" to="/register">
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary btn-sm" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/edit/:id" element={<EditRecipe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
