import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TProducts } from './products.interface';
import { Product } from './products.model';
import { deleteImage } from '../../utiles/sendImagetoLocalFile';
import mongoose from 'mongoose';
import fs from 'fs';

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

const getAllProductFromDB = async () => {
  const result = await Product.find().populate({ path: 'categories' });
  return result;
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
