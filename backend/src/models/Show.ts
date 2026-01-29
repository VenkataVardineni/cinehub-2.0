import mongoose, { Schema, Document } from 'mongoose';

export interface ISeat {
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip';
  price: number;
}

export interface IShow extends Document {
  movie: mongoose.Types.ObjectId;
  screen: string;
  showTime: Date;
  language: string;
  totalSeats: number;
  availableSeats: number;
  seatMap: ISeat[][];
  price: {
    regular: number;
    premium: number;
    vip: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema: Schema = new Schema({
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

const ShowSchema: Schema = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    screen: {
      type: String,
      required: true,
    },
    showTime: {
      type: Date,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    seatMap: {
      type: [[SeatSchema]],
      required: true,
    },
    price: {
      regular: {
        type: Number,
        required: true,
      },
      premium: {
        type: Number,
        required: true,
      },
      vip: {
        type: Number,
        required: true,
      },
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

ShowSchema.index({ movie: 1, showTime: 1 });
ShowSchema.index({ showTime: 1 });

export default mongoose.model<IShow>('Show', ShowSchema);

