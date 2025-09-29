import { Request, Response } from 'express';
import TennisCourt from '../models/TennisCourt';
import Review from '../models/Review';

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    const { name, rating, text } = req.body;
    
    // Validate input
    if (!name || !rating || !text) {
      res.status(400).json({
        success: false,
        message: 'Name, rating, and text are required'
      });
      return;
    }
    
    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
      return;
    }
    
    // Find the court
    const court = await TennisCourt.findOne({ id: parseInt(courtId) });
    if (!court) {
      res.status(404).json({
        success: false,
        message: 'Court not found'
      });
      return;
    }
    
    // Create new review
    const review = new Review({
      name,
      rating,
      text,
      date: new Date().toISOString().split('T')[0]
    });
    
    await review.save();
    
    // Add review to court and update rating
    court.reviews.push(review._id as any);
    court.reviewCount += 1;
    
    // Calculate new average rating
    const totalRating = court.rating * (court.reviewCount - 1) + rating;
    court.rating = Math.round((totalRating / court.reviewCount) * 10) / 10;
    
    await court.save();
    
    // Populate the review for response
    await court.populate('reviews');
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        court: court,
        newReview: review
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getReviewsByCourt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId } = req.params;
    
    const court = await TennisCourt.findOne({ id: parseInt(courtId) })
      .populate('reviews');
    
    if (!court) {
      res.status(404).json({
        success: false,
        message: 'Court not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: court.reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { name, rating, text } = req.body;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      });
      return;
    }
    
    // Update review
    review.name = name || review.name;
    review.rating = rating || review.rating;
    review.text = text || review.text;
    
    await review.save();
    
    // Update court rating if rating changed
    if (rating && rating !== review.rating) {
      const court = await TennisCourt.findOne({ reviews: reviewId });
      if (court) {
        // Recalculate average rating
        const reviews = await Review.find({ _id: { $in: court.reviews } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        court.rating = Math.round((totalRating / reviews.length) * 10) / 10;
        await court.save();
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      });
      return;
    }
    
    // Find and update the court
    const court = await TennisCourt.findOne({ reviews: reviewId });
    if (court) {
      // Remove review from court
      court.reviews = court.reviews.filter(id => id.toString() !== reviewId);
      court.reviewCount -= 1;
      
      // Recalculate average rating
      if (court.reviewCount > 0) {
        const reviews = await Review.find({ _id: { $in: court.reviews } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        court.rating = Math.round((totalRating / reviews.length) * 10) / 10;
      } else {
        court.rating = 0;
      }
      
      await court.save();
    }
    
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
