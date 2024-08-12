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
  categories: [
    { primaryCategory: Types.ObjectId }, // Reference to the Primary Category
    { secondaryCategory: Types.ObjectId }, // Reference to the Secondary Category
    { tertiaryCategory: Types.ObjectId }, // Reference to the Tertiary Category
  ];
  variants?: [Types.ObjectId]; // Array of variants
};
