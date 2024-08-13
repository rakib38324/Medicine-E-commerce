import { z } from 'zod';
import {
  ObjectIdSchema,
  ObjectIdSchemaOpotional,
} from '../Orders/order.validation';

// Define the Zod schema for validation
export const createVariantValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    price: z.number().min(1, { message: 'Price is required' }),
    productId: ObjectIdSchema,
  }),
});

// Define the Zod schema for validation
export const updateVariantValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    price: z.number().min(1, { message: 'Price is required' }).optional(),
    productId: ObjectIdSchemaOpotional,
  }),
});

export const variantValidations = {
  createVariantValidationSchema,
  updateVariantValidationSchema,
};
