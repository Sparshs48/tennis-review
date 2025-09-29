import { Request, Response } from 'express';
import TennisCourt from '../models/TennisCourt';
import Review from '../models/Review';
import { ITennisCourt, FilterOptions } from '../types';

export const getAllCourts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, surface, rating } = req.query;
    
    let query: any = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by surface
    if (surface) {
      query.surface = surface;
    }
    
    // Filter by rating
    if (rating) {
      const minRating = parseFloat(rating as string);
      query.rating = { $gte: minRating };
    }
    
    const courts = await TennisCourt.find(query)
      .populate('reviews')
      .sort({ rating: -1, reviewCount: -1 });
    
    res.status(200).json({
      success: true,
      count: courts.length,
      data: courts
    });
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCourtById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const court = await TennisCourt.findOne({ id: parseInt(id) })
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
      data: court
    });
  } catch (error) {
    console.error('Error fetching court:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching court',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCourt = async (req: Request, res: Response): Promise<void> => {
  try {
    const courtData: ITennisCourt = req.body;
    
    // Check if court with this ID already exists
    const existingCourt = await TennisCourt.findOne({ id: courtData.id });
    if (existingCourt) {
      res.status(400).json({
        success: false,
        message: 'Court with this ID already exists'
      });
      return;
    }
    
    const court = new TennisCourt(courtData);
    await court.save();
    
    res.status(201).json({
      success: true,
      data: court
    });
  } catch (error) {
    console.error('Error creating court:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating court',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCourt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const court = await TennisCourt.findOneAndUpdate(
      { id: parseInt(id) },
      updateData,
      { new: true, runValidators: true }
    ).populate('reviews');
    
    if (!court) {
      res.status(404).json({
        success: false,
        message: 'Court not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: court
    });
  } catch (error) {
    console.error('Error updating court:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating court',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCourt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const court = await TennisCourt.findOneAndDelete({ id: parseInt(id) });
    
    if (!court) {
      res.status(404).json({
        success: false,
        message: 'Court not found'
      });
      return;
    }
    
    // Delete associated reviews
    await Review.deleteMany({ _id: { $in: court.reviews } });
    
    res.status(200).json({
      success: true,
      message: 'Court deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting court:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting court',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
