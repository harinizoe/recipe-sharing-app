import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images from the assets folder
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';

const Home = () => {
  return (
    <div className="container mt-4">
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