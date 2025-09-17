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

function App() {

  return (
    <Router>
      <div className="min-vh-100 bg-light text-dark">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">Recipe App</Link>
            <ul className="navbar-nav ms-auto d-flex flex-row gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
