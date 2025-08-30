import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  movieId: number;
  userId: string;
  comment: string;
}

const CommentSchema: Schema = new Schema({
  movieId: { type: Number, required: true },
  userId: { type: String, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);