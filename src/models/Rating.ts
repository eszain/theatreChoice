import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  movieId: number;
  theatreId: mongoose.Schema.Types.ObjectId;
  userId: string;
  rating: number;
}

const RatingSchema: Schema = new Schema({
  movieId: { type: Number, required: true },
  theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
}, { timestamps: true });

// Ensure a user can only rate a specific movie/theatre combo once
RatingSchema.index({ movieId: 1, theatreId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);