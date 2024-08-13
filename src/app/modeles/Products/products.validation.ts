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
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().min(1).optional(),
    photos: z.array(z.string().url()).optional(), // Assuming photos are URLs
    description: z.string().optional(),
    metaKey: z.string().optional().optional(),
    price: z.number().positive().optional(),
    discount: z.number().nonnegative().optional(),
    stockStatus: z.boolean().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    categories: z.array(ObjectIdSchema).optional(),
    variants: z.array(ObjectIdSchema).optional().optional(),
  }),
});

const picturePayload = z.object({
  body: z.object({ photos: z.array(z.string().url()) }),
});

export const productValidations = {
  createProductSchema,
  picturePayload,
  updateProductSchema,
};
