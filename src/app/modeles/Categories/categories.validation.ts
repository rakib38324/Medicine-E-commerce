import { z } from 'zod';

const categoryCreateValidationSchema = z.object({
  body: z.object({
    type: z.enum(['Primary', 'Secondary', 'Tertiary']),
    name: z.string({ required_error: 'Name is required.' }).min(1),
    slug: z.string({ required_error: 'Slug is required.' }).min(1),
  }),
});

export const CategoryValidations = {
  categoryCreateValidationSchema,
};
