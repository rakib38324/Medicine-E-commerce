import { z } from 'zod';

// Define the Zod schema for categories
const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// Define the Zod schema for the product
const createProductSchema = z.object({
  body: z.object({
    name: z.string(),
    slug: z.string().min(1),
    photos: z.array(z.string().url()), // Assuming photos are URLs
    description: z.string(),
    metaKey: z.string().optional(),
    price: z.number().positive(),
    discount: z.number().nonnegative(),
    stockStatus: z.boolean(),
    status: z.enum(['active', 'inactive']),
    categories: z.array(ObjectIdSchema),
    variants: z.array(ObjectIdSchema).optional(),
  }), // Optional array of variant IDs
});

const picturePayload = z.object({
  body: z.object({ photos: z.array(z.string().url()) }),
});

export const productValidations = {
  createProductSchema,
  picturePayload,
};
