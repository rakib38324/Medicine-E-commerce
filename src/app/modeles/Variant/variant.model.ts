import { model, Schema } from 'mongoose';
import { TVariant } from './variant.interface';

// Define the Mongoose schema
const variantSchema = new Schema<TVariant>(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    createdBy: { type: String, required: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }, // Automatically add createdAt and updatedAt fields
);

// Create and export the model
export const Variant = model<TVariant>('variant', variantSchema);
