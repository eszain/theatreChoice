import mongoose, { Document, Schema } from 'mongoose';

export interface ITheatre extends Document {
  name: string;
}

const TheatreSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Theatre || mongoose.model<ITheatre>('Theatre', TheatreSchema);