import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images from the assets folder
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Modern Hero Section */}
      <div className="hero-section text-center">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-lg-10">
              <div className={`fade-in ${isVisible ? 'visible' : ''}`}>
                <div className="mb-4">
                  <span className="badge glass-card px-4 py-2 mb-4" style={{color: '#1e293b', textShadow: '1px 1px 2px rgba(255,255,255,0.8)', fontWeight: '600'}}>
                    <i className="bi bi-star-fill me-2"></i>
                    Welcome to Recipe Haven
                  </span>
                </div>
                
                <h1 className="display-2 fw-bold mb-4" style={{color: '#1e293b', textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
                  Discover Amazing
                  <span className="d-block" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Culinary Adventures</span>
                </h1>
                
                <p className="lead mb-5 fs-4 mx-auto" style={{maxWidth: '600px', color: '#334155', textShadow: '1px 1px 2px rgba(255,255,255,0.6)'}}>
                  Join our community of passionate food lovers. Find, share, and create 
                  delicious recipes from around the world.
                </p>
                
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-4 mb-5">
                  <button 
                    className="btn btn-light btn-lg px-5 py-3 fw-bold bounce-in"
                    onClick={() => navigate('/recipes')}
                    style={{'--stagger': 1}}
                  >
                    <i className="bi bi-collection me-2"></i> 
                    Explore Recipes
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-lg px-5 py-3 fw-bold bounce-in"
                    onClick={() => navigate('/add-recipe')}
                    style={{'--stagger': 2}}
                  >
                    <i className="bi bi-plus-circle me-2"></i> 
                    Share Your Recipe
                  </button>
                </div>
                
                {/* Stats Section */}
                <div className="row g-4 mt-5">
                  <div className="col-md-4">
                    <div className="glass-card p-4 bounce-in" style={{'--stagger': 3, color: '#1e293b', textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
                      <i className="bi bi-people display-6 mb-3" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}></i>
                      <h3 className="h4 fw-bold">Growing Community</h3>
                      <p className="mb-0" style={{color: '#475569'}}>Join thousands of food enthusiasts</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="glass-card p-4 bounce-in" style={{'--stagger': 4, color: '#1e293b', textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
                      <i className="bi bi-heart display-6 mb-3" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}></i>
                      <h3 className="h4 fw-bold">Curated Recipes</h3>
                      <p className="mb-0" style={{color: '#475569'}}>Handpicked delicious recipes</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="glass-card p-4 bounce-in" style={{'--stagger': 5, color: '#1e293b', textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
                      <i className="bi bi-award display-6 mb-3" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}></i>
                      <h3 className="h4 fw-bold">Easy to Follow</h3>
                      <p className="mb-0" style={{color: '#475569'}}>Step-by-step instructions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container py-5 my-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-4 fw-bold mb-4 gradient-text">Why Choose Recipe Haven?</h2>
            <p className="lead text-muted">Experience the joy of cooking with our comprehensive recipe platform</p>
          </div>
        </div>
        
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="feature-card text-center h-100">
              <div className="mb-4">
                <i className="bi bi-search display-4 text-gradient-primary"></i>
              </div>
              <h3 className="h4 fw-bold mb-3">Smart Search</h3>
              <p className="text-muted mb-4">Find recipes by ingredients, cuisine, dietary preferences, or cooking time. Our intelligent search makes discovery effortless.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/recipes')}>
                Try Search <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="feature-card text-center h-100">
              <div className="mb-4">
                <i className="bi bi-camera display-4 text-gradient-primary"></i>
              </div>
              <h3 className="h4 fw-bold mb-3">Visual Recipes</h3>
              <p className="text-muted mb-4">Beautiful photos and step-by-step visual guides make cooking easier and more enjoyable for everyone.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/add-recipe')}>
                Share Photos <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="feature-card text-center h-100">
              <div className="mb-4">
                <i className="bi bi-chat-heart display-4 text-gradient-primary"></i>
              </div>
              <h3 className="h4 fw-bold mb-3">Community Reviews</h3>
              <p className="text-muted mb-4">Read honest reviews, tips, and variations from fellow home cooks to perfect every dish you make.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/recipes')}>
                Read Reviews <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Carousel Section */}
      <div className="container mb-5">
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8 text-center">
            <h2 className="display-5 fw-bold mb-3 gradient-text">Featured Recipes</h2>
            <p className="lead text-muted">Get inspired by these amazing dishes from our community</p>
          </div>
        </div>
        
        <div id="recipeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={img1} className="d-block w-100" 
                   style={{ height: "500px", objectFit: "cover" }}
                   alt="Featured Recipe 1" />
              <div className="carousel-caption d-none d-md-block">
                <div className="glass-card p-4">
                  <h5 className="fw-bold text-white">Delicious Homemade Pasta</h5>
                  <p className="text-white-50">Learn to make authentic Italian pasta from scratch</p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src={img2} className="d-block w-100" 
                   style={{ height: "500px", objectFit: "cover" }}
                   alt="Featured Recipe 2" />
              <div className="carousel-caption d-none d-md-block">
                <div className="glass-card p-4">
                  <h5 className="fw-bold text-white">Fresh Garden Salad</h5>
                  <p className="text-white-50">Healthy and colorful salad with seasonal vegetables</p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src={img3} className="d-block w-100" 
                   style={{ height: "500px", objectFit: "cover" }}
                   alt="Featured Recipe 3" />
              <div className="carousel-caption d-none d-md-block">
                <div className="glass-card p-4">
                  <h5 className="fw-bold text-white">Artisan Bread</h5>
                  <p className="text-white-50">Crusty bread with perfect texture and flavor</p>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#recipeCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#recipeCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="py-5" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="glass-card p-5">
                <i className="bi bi-heart-fill display-4 text-gradient-primary mb-4"></i>
                <h2 className="display-5 fw-bold mb-4 gradient-text">Ready to Start Cooking?</h2>
                <p className="lead text-muted mb-4">
                  Join our community today and discover your next favorite recipe. 
                  Whether you're a beginner or a seasoned chef, there's something for everyone.
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button 
                    className="btn btn-primary btn-lg px-5"
                    onClick={() => navigate('/register')}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Join Now
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-lg px-5"
                    onClick={() => navigate('/recipes')}
                  >
                    <i className="bi bi-eye me-2"></i>
                    Browse Recipes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;