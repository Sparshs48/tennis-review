import express from 'express';
import {
  addReview,
  getReviewsByCourt,
  updateReview,
  deleteReview
} from '../controllers/reviewController';

const router = express.Router();

// POST /api/courts/:courtId/reviews - Add review to court
router.post('/:courtId/reviews', addReview);

// GET /api/courts/:courtId/reviews - Get all reviews for a court
router.get('/:courtId/reviews', getReviewsByCourt);

// PUT /api/courts/reviews/:reviewId - Update review
router.put('/reviews/:reviewId', updateReview);

// DELETE /api/courts/reviews/:reviewId - Delete review
router.delete('/reviews/:reviewId', deleteReview);

export default router;
