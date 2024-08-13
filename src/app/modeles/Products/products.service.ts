import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TProducts } from './products.interface';
import { Product } from './products.model';
import { deleteImage } from '../../utiles/sendImagetoLocalFile';
import mongoose from 'mongoose';
import fs from 'fs';
import { Variant } from '../Variant/variant.model';

const createProductIntoDB = async (payload: TProducts) => {
  const { name } = payload;
  const categoryExists = await Product.findOne({ name: name });

  if (categoryExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Product already exists! Duplicate name.',
    );
  }

  const result = await Product.create(payload);

  return result;
};

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };

  const allData = Product.find();

  // Filtering
  const excludeFields = [
    'name',
    'slug',
    'metaKey',
    'maxPrice',
    'minPrice',
    'discount',
    'sortBy',
    'limit',
    'categories',
    'type',
    'page',
  ];

  excludeFields.forEach((el) => delete queryObj[el]);

  //===========================================> sorting and filtering <===========================================>
  const sortBy = query.sortBy === 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const sort: any = { [sortBy as any]: sortOrder };

  const filterQuery = allData.find(queryObj).sort(sort);

  //==================================================> min max query <===============================================
  const minPrice = query.minPrice
    ? parseFloat(query.minPrice as string)
    : undefined;
  const maxPrice = query.maxPrice
    ? parseFloat(query.maxPrice as string)
    : undefined;

  const filter: any = {};

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
  }

  if (minPrice !== undefined) {
    filter.price.$gte = minPrice;
  }

  if (maxPrice !== undefined) {
    filter.price.$lte = maxPrice;
  }

  const MinMaxQuery = filterQuery.find({ ...filter });

  //==================================> categories query <=====================================
  const categoriesName = query.categories;

  const baseQuery: any = {};

  if (categoriesName !== undefined) {
    baseQuery['categories'] = categoriesName;
  }

  const tagQuery = MinMaxQuery.find(baseQuery);

  //===================================> stock status  <===============================
  const stockStatus: any = query.stockStatus;

  let stockStatusFilter: any = {};

  if (stockStatus !== undefined) {
    stockStatusFilter = { stockStatus: stockStatus };
  }

  const stockStatusFilterQuery = tagQuery.find({ ...stockStatusFilter });

  //===================================> status <===============================
  const status: any = query.status;

  let statusFilter: any = {};

  if (status !== undefined) {
    statusFilter = { status: status };
  }

  const statusFilterQuery = stockStatusFilterQuery.find({ ...statusFilter });

  // Create a separate query to get the total Data
  const totalData = await statusFilterQuery.clone().countDocuments();

  //<============================================> pagination <===========================================>
  let page = 1;
  let limit = 10;
  let skip = 0;

  if (query.limit) {
    limit = Number(query.limit);
  }

  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const paginateQuery = statusFilterQuery.skip(skip);
  const data = await paginateQuery
    .limit(limit)
    .populate({ path: 'categories' })
    .populate({ path: 'variants' });

  return { data, page, limit, totalData };

  // const result = await Product.find().populate({ path: 'categories' });
  // return result;
};

const getSingleProductFromDB = async (_id: string) => {
  const result = await Product.findById({ _id: _id }).populate({
    path: 'categories', // Populate categories
  });
  //   .populate({
  //     path: 'variants', // Populate variants
  //     model: 'Variant',
  //   });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
  }

  return result;
};

const updateSingleProductFromDB = async (
  _id: string,
  payload: Partial<TProducts>,
  files: any,
) => {
  const productExists = await Product.findById({ _id });
  if (!productExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
  }

  if (payload?.photos) {
    payload?.photos.push(...productExists.photos);
  }

  const newPayload: { photos: string[] } = {
    photos: [],
  };

  if (!payload && files) {
    // Extract file paths from the uploaded files
    const filePaths = (files as Express.Multer.File[]).map((file) => file.path);
    newPayload.photos = filePaths; // Assign the file paths to the photos field
  }

  const newCategory = payload?.categories;
  const previousCategory = productExists?.categories;
  const array1Strings = newCategory?.map((id) => id.toString());

  if (newCategory) {
    previousCategory.forEach((value) => {
      if (!array1Strings?.includes(value.toString())) {
        newCategory?.push(value);
      }
    });
  }

  const result = await Product.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSingleProductFromDB = async (_id: string) => {
  const productExists = await Product.findById({ _id });
  if (!productExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
  }

  if (productExists?.photos) {
    productExists?.photos?.map((photo) => deleteImage(photo));
  }

  if (productExists?.variants) {
    for (let i = 0; i < productExists?.variants?.length; i++) {
      await Variant.findByIdAndDelete(productExists?.variants[i]);
    }
  }

  await Product.findByIdAndDelete({ _id });

  return null;
};

const deletepictureFromLocal = async (
  _id: string,
  payload: { photos: [string] },
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const productExists = await Product.findById({ _id });

    if (!productExists) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
    }

    if (
      !fs.existsSync(payload?.photos[0]) ||
      !productExists?.photos?.includes(payload?.photos[0])
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Image not foundsss');
    }

    const updatedPhoto: { photos: string[] } = {
      photos: [],
    };

    const newphotos = payload?.photos;
    const previousPhotos = productExists?.photos;

    const remainingPreviousPhotos = previousPhotos.filter(
      (photo) => !newphotos.includes(photo),
    );

    updatedPhoto.photos.push(...remainingPreviousPhotos);

    // let photos = productExists?.photos.filter((item) => item !== payload.path);
    await Product.findByIdAndUpdate(_id, updatedPhoto, {
      new: true,
      runValidators: true,
      session,
    });

    const result = deleteImage(payload?.photos[0]);

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const productServices = {
  createProductIntoDB,
  getAllProductFromDB,
  getSingleProductFromDB,
  updateSingleProductFromDB,
  deleteSingleProductFromDB,
  deletepictureFromLocal,
};
