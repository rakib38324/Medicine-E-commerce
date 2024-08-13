import { z } from 'zod';

// Define the Zod schema for categories
const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// Define the Zod schema for validation
export const createVariantValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    price: z.number().min(1, { message: 'Price is required' }),
    productId: ObjectIdSchema,
  }),
});

export const variantValidations = {
  createVariantValidationSchema,
};
