import { Types } from 'mongoose';

export type TOrder = {
  productPrice: number;
  itemNumber: number;
  status: 'pendding' | 'confirm' | 'shipping' | 'delivered';
  date: string;
  userId: Types.ObjectId;
  shippingAddress: Types.ObjectId;
  productId: [Types.ObjectId];
};
