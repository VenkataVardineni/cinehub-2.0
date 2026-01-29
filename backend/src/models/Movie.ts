import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number; // in minutes
  releaseDate: Date;
  rating: number;
  posterUrl: string;
  trailerUrl?: string;
  cast?: string[];
  director?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    trailerUrl: {
      type: String,
    },
    cast: {
      type: [String],
    },
    director: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMovie>('Movie', MovieSchema);

