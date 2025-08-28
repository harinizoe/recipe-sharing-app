import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images from the assets folder
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';

const Home = () => {
  const navigate = useNavigate();

    return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="hero-section text-center py-5 mb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4 text-blue">
                Discover Amazing Recipes
              </h1>
              <p className="lead mb-5 text-primary-50 fs-4">
                Find, share, and create delicious recipes from around the world
              </p>
              
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <button 
                  className="btn btn-light btn-lg px-4 py-3 fw-bold"
                  onClick={() => navigate('/recipes')}
                >
                  <i className="bi bi-collection me-2"></i> Browse All Recipes
                </button>
                <button 
                  className="btn btn-success btn-lg px-4 py-3 fw-bold"
                  onClick={() => navigate('/add-recipe')}
                >
                  <i className="bi bi-plus-circle me-2"></i> Add Your Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="recipeCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner rounded shadow">
          <div className="carousel-item active">
            <img src={img1} className="d-block w-100" style={{ width: "600px", height: "500px", objectFit: "cover" }}
 alt="Image 1" />
          </div>
          <div className="carousel-item">
            <img src={img2} className="d-block w-100" style={{ width: "600px", height: "500px", objectFit: "cover" }}
 alt="Image 2" />
          </div>
          <div className="carousel-item">
            <img src={img3} className="d-block w-100" style={{ width: "600px", height: "500px", objectFit: "cover" }}
 alt="Image 3" />
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
  );
};

export default Home;