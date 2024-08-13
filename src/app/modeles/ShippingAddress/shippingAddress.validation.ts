import { z } from 'zod';

// Define the Zod schema for the product
const shippingAddressSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    division: z.string().min(1, { message: 'Division is required' }),
    district: z.string().min(1, { message: 'District is required' }),
    subDistrict: z.string().min(1, { message: 'Sub-district is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
  }),
});

const shippingAddressUpdatedSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    division: z.string().min(1, { message: 'Division is required' }).optional(),
    district: z.string().min(1, { message: 'District is required' }).optional(),
    subDistrict: z
      .string()
      .min(1, { message: 'Sub-district is required' })
      .optional(),
    address: z.string().min(1, { message: 'Address is required' }).optional(),
    phone: z
      .string()
      .min(1, { message: 'Phone number is required' })
      .optional(),
  }),
});

export const shippingAddressValidations = {
  shippingAddressSchema,
  shippingAddressUpdatedSchema,
};
