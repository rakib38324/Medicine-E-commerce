import { model, Schema, Types } from 'mongoose';
import { TProducts } from './products.interface';

const ProductSchema = new Schema<TProducts>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    photos: [{ type: String }],
    description: { type: String, required: true },
    metaKey: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stockStatus: { type: Boolean, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'categorie',
        required: true,
      },
    ],
    variants: [{ type: Types.ObjectId, ref: 'variant' }], // Optional array of variant IDs
  },
  { timestamps: true },
);

export const Product = model<TProducts>('Product', ProductSchema);
