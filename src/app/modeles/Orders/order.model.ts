import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

// Define the Mongoose schema
const orderSchema = new Schema<TOrder>(
  {
    productPrice: { type: Number, required: true },
    itemNumber: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pendding', 'Confirm', 'Shipping', 'Delivered'],
    },
    date: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: 'ShippingAddress',
      required: true,
    },
    productId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  { timestamps: true }, // Automatically add createdAt and updatedAt fields
);

// Create and export the model
export const Order = model<TOrder>('Order', orderSchema);
