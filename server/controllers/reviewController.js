const Review = require('../models/Review');
// Comments-only: no rating aggregation is performed here

// ➕ Add Review
exports.addReview = async (req, res) => {
  try {
    const { comment, user } = req.body;
    const { recipeId } = req.params;

    const review = new Review({
      recipe: recipeId,
      user: user,
      comment,
    });

    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📖 Get Reviews for a Recipe
exports.getReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipe: recipeId })
      .populate("user", "name email");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Review
exports.updateReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const { id } = req.params;
    
    console.log('Updating review:', id, { comment });
    
    const updatedReview = await Review.findByIdAndUpdate(id, { comment }, { new: true });
    
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    console.log('Updated review:', updatedReview);

    res.json(updatedReview);
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting review:', id);
    
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    console.log('Deleted review:', deletedReview);

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: err.message });
  }
};
