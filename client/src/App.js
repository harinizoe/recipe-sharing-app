import React, { useEffect, useState } from 'react';
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
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Router>
      <div className={`min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        {/* Navbar */}
        <nav className={`navbar navbar-expand-lg ${theme === 'light' ? 'navbar-light bg-light' : 'navbar-dark bg-dark'} mb-4`}>
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
                <button onClick={toggleTheme} className="btn btn-outline-secondary btn-sm">
                  {theme === 'light' ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container">
          {/* Pass theme to child components */}
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/register" element={<Register theme={theme} />} />
            <Route path="/login" element={<Login theme={theme} />} />
            <Route path="/recipes" element={<RecipeList theme={theme} />} />
  <Route path="/add-recipe" element={<AddRecipe theme={theme} />} />
  <Route path="/recipes/:id" element={<RecipeDetails theme={theme} />} />
<Route path="/edit/:id" element={<EditRecipe theme={theme} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
