import mongoose, { Schema, Document } from 'mongoose';

export interface ISeatSelection {
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip';
  price: number;
}

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  show: mongoose.Types.ObjectId;
  seats: ISeatSelection[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SeatSelectionSchema: Schema = new Schema({
  row: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const BookingSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    seats: {
      type: [SeatSelectionSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ user: 1, bookingDate: -1 });
BookingSchema.index({ show: 1 });
BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IBooking>('Booking', BookingSchema);

