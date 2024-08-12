import { model, Schema } from 'mongoose';
import { TCategories } from './categories.interface';

const userSchema = new Schema<TCategories>(
  {
    type: { type: String, enum: ['Primary', 'Secondary', 'Tertiary'] },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
export const Category = model<TCategories>('categorie', userSchema);
