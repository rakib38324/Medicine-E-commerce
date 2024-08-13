import { model, Schema } from 'mongoose';
import { TShippingAddress } from './shippingAddress.interface';

const ShippingAddressSchema = new Schema<TShippingAddress>(
  {
    name: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    subDistrict: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    createdBy: { type: String, required: true }, // Adjust the reference model name as needed
  },
  { timestamps: true }, // Automatically add createdAt and updatedAt fields
);

export const ShippingAddress = model<TShippingAddress>(
  'ShippingAddress',
  ShippingAddressSchema,
);
