import { Types } from 'mongoose';

export type TProducts = {
  name: string;
  slug: string;
  photos: string[]; // Array of URLs or paths to product photos
  description: string;
  metaKey: string;
  price: number;
  discount: number;
  stockStatus: boolean; // true if in stock, false otherwise
  status: 'active' | 'inactive'; // Product status
  categories: [Types.ObjectId];
  variants?: [Types.ObjectId]; // Array of variants
};
