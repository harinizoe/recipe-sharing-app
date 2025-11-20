import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeRating = ({ recipeId, currentRating = 0, totalRatings = 0, onRatingUpdate }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(currentRating);
  const [ratingsCount, setRatingsCount] = useState(totalRatings);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserRating();
  }, [recipeId]);

  const fetchUserRating = async () => {
    if (!userId || !recipeId) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}/rating/${userId}`);
      if (response.data.rating) {
        setUserRating(response.data.rating);
      }
    } catch (error) {
      // User hasn't rated this recipe yet
      console.log('No existing rating found');
    }
  };

  const handleRating = async (rating) => {
    if (!userId) {
      alert('Please log in to rate recipes');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/recipes/${recipeId}/rate`, {
        userId,
        rating
      });

      setUserRating(rating);
      setAverageRating(response.data.averageRating);
      setRatingsCount(response.data.totalRatings);
      
      if (onRatingUpdate) {
        onRatingUpdate(response.data.averageRating, response.data.totalRatings);
      }
    } catch (error) {
      console.error('Error rating recipe:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      const halfFilled = rating > i - 1 && rating < i;
      
      stars.push(
        <i
          key={i}
          className={`bi ${
            filled ? 'bi-star-fill' : halfFilled ? 'bi-star-half' : 'bi-star'
          } ${interactive ? 'cursor-pointer' : ''}`}
          style={{
            color: filled || halfFilled ? '#ffc107' : '#e9ecef',
            fontSize: interactive ? '1.5rem' : '1rem',
            transition: 'all 0.2s ease',
            cursor: interactive ? 'pointer' : 'default'
          }}
          onClick={interactive ? () => handleRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      );
    }
    return stars;
  };

  return (
    <div className="recipe-rating">
      {/* Display Average Rating */}
      <div className="d-flex align-items-center mb-3">
        <div className="me-3">
          <div className="d-flex align-items-center">
            {renderStars(averageRating)}
            <span className="ms-2 fw-semibold">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
            </span>
          </div>
          <small className="text-muted">
            {ratingsCount} {ratingsCount === 1 ? 'rating' : 'ratings'}
          </small>
        </div>
      </div>

      {/* User Rating Interface */}
      {userId && (
        <div className="glass-card p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="fw-bold mb-1">Rate this recipe</h6>
              <small className="text-muted">
                {userRating > 0 ? 'You rated this recipe' : 'Share your experience'}
              </small>
            </div>
            <div className="d-flex align-items-center">
              {loading ? (
                <div className="spinner-border spinner-border-sm me-2" />
              ) : (
                <div className="d-flex">
                  {renderStars(hoveredRating || userRating, true)}
                </div>
              )}
            </div>
          </div>
          
          {userRating > 0 && (
            <div className="mt-2">
              <small className="text-success">
                <i className="bi bi-check-circle me-1"></i>
                Thank you for your rating!
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeRating;
