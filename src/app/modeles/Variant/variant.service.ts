import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TVariant } from './variant.interface';
import { Variant } from './variant.model';
import { Product } from '../Products/products.model';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../UsersRegistration/user.constent';

const createVariantIntoDB = async (user: JwtPayload, payload: TVariant) => {
  const { name } = payload;
  const variantExists = await Variant.findOne({ name: name });

  if (variantExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Variant already exists! Duplicate name.',
    );
  }

  const productExists = await Product.findById({ _id: payload?.productId });

  if (!productExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid Product ID. Product not found.',
    );
  }

  const createdData = {
    ...payload,
    createdBy: user?.email,
  };

  const result = await Variant.create(createdData);

  const variants = productExists?.variants;

  if (result?._id) {
    variants?.push(result?._id);
  }

  const updateData = {
    variants,
  };

  await Product.findByIdAndUpdate({ _id: payload?.productId }, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const updateVariantFromDB = async (
  user: JwtPayload,
  _id: string,
  payload: Partial<TVariant>,
) => {
  const variantExists = await Variant.findById({ _id });

  if (!variantExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Variant not found.');
  }

  if (
    variantExists?.createdBy !== user?.email &&
    user?.role !== USER_ROLE.superAdmin
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are not variant owner.');
  }

  if (payload.productId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can not update Product ID. If you feel this is wrong Product ID then please delete this variant and create again new variant.',
    );
  }

  const result = await Variant.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteVariantFromDB = async (user: JwtPayload, _id: string) => {
  const variantExists = await Variant.findById({ _id });

  if (!variantExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Variant not found.');
  }

  if (
    variantExists?.createdBy !== user?.email &&
    user?.role !== USER_ROLE.superAdmin
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are not variant owner.');
  }

  const productExists = await Product.findById({
    _id: variantExists?.productId,
  });

  if (productExists) {
    const variants = productExists?.variants?.filter(
      (obj) => obj.toString() !== _id.toString(),
    );

    const updateData = {
      variants,
    };

    await Product.findByIdAndUpdate({ _id: productExists?._id }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  await Variant.findByIdAndDelete({ _id });

  return null;
};

export const productServices = {
  createVariantIntoDB,
  updateVariantFromDB,
  deleteVariantFromDB,
};
