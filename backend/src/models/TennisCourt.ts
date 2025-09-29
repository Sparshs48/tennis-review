import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITennisCourtDocument extends Document {
  id: number;
  name: string;
  location: string;
  address: string;
  surface: 'Hard' | 'Clay' | 'Grass';
  price: string;
  hours: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  description: string;
  reviews: Types.ObjectId[];
}

const TennisCourtSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  surface: {
    type: String,
    required: true,
    enum: ['Hard', 'Clay', 'Grass']
  },
  price: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  hours: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  amenities: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

// Index for better search performance
TennisCourtSchema.index({ name: 'text', location: 'text', description: 'text' });
TennisCourtSchema.index({ surface: 1 });
TennisCourtSchema.index({ rating: 1 });

export default mongoose.model<ITennisCourtDocument>('TennisCourt', TennisCourtSchema);
