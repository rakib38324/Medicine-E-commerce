import httpStatus from 'http-status';
import { TCategories } from './categories.interface';
import { Category } from './categories.model';
import AppError from '../../errors/appError';

const createCategoryIntoDB = async (payload: TCategories) => {
  const { name } = payload;
  const categoryExists = await Category.findOne({ name: name });

  if (categoryExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Category already exists! Duplicate name.',
    );
  }

  const result = await Category.create(payload);

  return result;
};

const getAllCategoryFromDB = async () => {
  // const categoryExists = await Category.find();

  // return categoryExists;
  const result = await Category.aggregate([
    {
      $group: {
        _id: '$type', // Group by type
        categories: {
          $push: {
            _id: '$_id',
            name: '$name',
            slug: '$slug',
            thumbnail: '$thumbnail',
          },
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id from the result
        type: '$_id', // Rename _id field to type
        categories: 1,
      },
    },
  ]);
  return result;
};

const getSingleCategoryFromDB = async (_id: string) => {
  const categoryExists = await Category.findById({ _id });

  if (!categoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category not found.');
  }

  return categoryExists;
};

const updateSingleCategoryFromDB = async (
  _id: string,
  payload: Partial<TCategories>,
) => {
  const categoryExists = await Category.findById({ _id });

  if (!categoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category not found.');
  }

  const result = await Category.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSingleCategoryFromDB = async (_id: string) => {
  const categoryExists = await Category.findById({ _id });

  if (!categoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category not found.');
  }

  await Category.findByIdAndDelete({ _id });

  return null;
};

export const categoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  updateSingleCategoryFromDB,
  deleteSingleCategoryFromDB,
};
