import { Types } from 'mongoose';

export type TVariant = {
  name: string;
  price: number;
  productId: Types.ObjectId;
  createdBy: string;
};
