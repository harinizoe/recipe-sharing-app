import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReviewSection({ recipeId, theme }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId"); // current logged user

  // Load reviews
  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`http://localhost:5000/api/reviews/${recipeId}`);
      console.log('Fetched reviews:', res.data);
      console.log('Current userId:', userId);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // Add new review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Please log in to add a review");
      return;
    }
    if (newReview.rating < 1 || newReview.rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }
    if (!newReview.comment.trim()) {
      setError("Comment is required");
      return;
    }
    try {
      setError("");
      await axios.post(`http://localhost:5000/api/reviews/${recipeId}`, {
        ...newReview,
        recipe: recipeId,
        user: userId,
      });
      setNewReview({ rating: 0, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      setError("Failed to add review");
    }
  };

  // Edit review
  const handleEditReview = async (id) => {
    console.log('Editing review:', id, newReview);
    if (newReview.rating < 1 || newReview.rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }
    if (!newReview.comment.trim()) {
      setError("Comment is required");
      return;
    }
    try {
      setError("");
      const response = await axios.put(`http://localhost:5000/api/reviews/${id}`, {
        rating: newReview.rating,
        comment: newReview.comment,
      });
      console.log('Edit response:', response.data);
      setEditingId(null);
      setNewReview({ rating: 0, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error('Edit error:', err);
      setError("Failed to update review");
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    console.log('Deleting review:', id);
    try {
      setError("");
      const response = await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      console.log('Delete response:', response.data);
      fetchReviews();
    } catch (err) {
      console.error('Delete error:', err);
      setError("Failed to delete review");
    }
  };

  return (
    <div className="review-section mt-4">
      <div className="d-flex align-items-center mb-4">
        <h3 className="mb-0">
          <i className="bi bi-star-fill text-warning me-2"></i>
          Reviews
        </h3>
        <span className="badge bg-primary ms-2">{reviews.length}</span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="loading-spinner mb-3"></div>
          <p className="text-muted">Loading reviews...</p>
        </div>
      )}

      {/* Review List */}
      {!loading && reviews.length === 0 && (
        <div className="text-center py-4">
          <i className="bi bi-chat-dots display-1 text-muted mb-3"></i>
          <h5 className="mb-2">No reviews yet</h5>
          <p className="text-muted">Be the first to share your thoughts!</p>
        </div>
      )}
      
      {reviews.map((rev) => (
        <div
          key={rev._id}
          className="card mb-3 border-0 shadow-sm"
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <div className="me-3">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < rev.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                      ></i>
                    ))}
                  </div>
                  <span className="badge bg-primary">{rev.rating}/5</span>
                </div>
                <p className="mb-2">{rev.comment}</p>
                <small className="text-muted">
                  <i className="bi bi-person-circle me-1"></i>
                  By: {rev.user.username || 'Unknown User'}
                </small>
              </div>
              {(rev.user._id === userId || rev.user === userId) && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setEditingId(rev._id);
                      setNewReview({ rating: rev.rating, comment: rev.comment });
                    }}
                    title="Edit Review"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteReview(rev._id)}
                    title="Delete Review"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add/Edit Form */}
      {userId ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="bi bi-pencil-square me-2"></i>
              {editingId ? 'Edit Review' : 'Add Your Review'}
            </h5>
            
            <form
              onSubmit={
                editingId
                  ? (e) => {
                      e.preventDefault();
                      handleEditReview(editingId);
                    }
                  : handleAddReview
              }
            >
              <div className="mb-3">
                <label className="form-label fw-bold">Rating</label>
                <div className="d-flex align-items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`btn btn-lg ${newReview.rating >= star ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <i className="bi bi-star-fill"></i>
                    </button>
                  ))}
                  <span className="ms-2 text-muted">({newReview.rating}/5)</span>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Comment</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share your thoughts about this recipe..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle me-2"></i>
                  {editingId ? "Update Review" : "Submit Review"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingId(null);
                      setNewReview({ rating: 0, comment: "" });
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <i className="bi bi-lock display-4 text-muted mb-3"></i>
              <h5 className="mb-2">Login Required</h5>
              <p className="text-muted mb-3">Please log in to share your review</p>
              <button className="btn btn-primary">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
