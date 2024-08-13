import { z } from 'zod';

export const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');
export const ObjectIdSchemaOpotional = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
  .optional();

const createOrderValidationSchema = z.object({
  body: z.object({
    productPrice: z
      .number()
      .positive({ message: 'Product price must be a positive number' }),
    itemNumber: z
      .number()
      .int()
      .positive({ message: 'Item number must be a positive integer' }),
    status: z.enum(['Pendding', 'Confirm', 'Shipping', 'Delivered']),
    userId: ObjectIdSchema,
    shippingAddress: ObjectIdSchema,
    productId: z.array(ObjectIdSchema),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    productPrice: z
      .number()
      .positive({ message: 'Product price must be a positive number' })
      .optional(),
    itemNumber: z
      .number()
      .int()
      .positive({ message: 'Item number must be a positive integer' })
      .optional(),
    status: z.enum(['Pendding', 'Confirm', 'Shipping', 'Delivered']).optional(),
    userId: ObjectIdSchemaOpotional,
    shippingAddress: ObjectIdSchema,
    productId: z.array(ObjectIdSchema).optional(),
  }),
});

export const orderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
