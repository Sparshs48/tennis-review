import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  name: string;
  rating: number;
  date: string;
  text: string;
}

const ReviewSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  date: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.model<IReviewDocument>('Review', ReviewSchema);
