import React, { useState, useEffect } from 'react';
import api from '../api';

const FavoriteButton = ({ recipeId, size = 'md' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    checkFavoriteStatus();
  }, [recipeId]);

  const checkFavoriteStatus = async () => {
    if (!userId || !recipeId) return;
    
    try {
      const response = await api.get(`/api/users/${userId}/favorites`);
      const favorites = response.data.favorites || [];
      setIsFavorite(favorites.some(fav => fav._id === recipeId));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!userId) {
      alert('Please log in to save favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/api/users/${userId}/favorites/${recipeId}`);
        setIsFavorite(false);
      } else {
        await api.post(`/api/users/${userId}/favorites/${recipeId}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonSize = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const iconSize = size === 'sm' ? '0.9rem' : size === 'lg' ? '1.2rem' : '1rem';

  return (
    <button
      className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} ${buttonSize}`}
      onClick={toggleFavorite}
      disabled={loading}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" />
      ) : (
        <i 
          className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}
          style={{ fontSize: iconSize }}
        />
      )}
      {size === 'lg' && (
        <span className="ms-2">
          {isFavorite ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
