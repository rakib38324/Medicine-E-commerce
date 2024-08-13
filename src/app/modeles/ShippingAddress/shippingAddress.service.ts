import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { TShippingAddress } from './shippingAddress.interface';
import { ShippingAddress } from './shippingAddress.model';

const createShippingAddressIntoDB = async (
  user: JwtPayload,
  payload: TShippingAddress,
) => {
  const createdData = {
    ...payload,
    createdBy: user?.email,
  };

  const result = await ShippingAddress.create(createdData);

  return result;
};

const getShippingAddressIntoDB = async (user: JwtPayload) => {
  const addressExists = await ShippingAddress.find({ createdBy: user?.email });

  if (!addressExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Address not found');
  }

  return addressExists;
};

const updateShippingAddressIntoDB = async (
  user: JwtPayload,
  _id: string,
  payload: Partial<TShippingAddress>,
) => {
  const addressExists = await ShippingAddress.findById({ _id });

  if (!addressExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Address not found');
  }

  if (user?.email !== addressExists.createdBy) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are not owen in this address.',
    );
  }

  if (payload.createdBy) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are able to chnage created By.',
    );
  }

  const result = await ShippingAddress.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteShippingAddressIntoDB = async (user: JwtPayload, _id: string) => {
  const addressExists = await ShippingAddress.findById({ _id });

  if (!addressExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Address not found');
  }

  if (
    user?.email !== addressExists.createdBy &&
    user?.role !== USER_ROLE.superAdmin
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are not owen in this address.',
    );
  }

  await ShippingAddress.findByIdAndDelete(_id);

  return null;
};

export const shippingAddressServices = {
  createShippingAddressIntoDB,
  getShippingAddressIntoDB,
  updateShippingAddressIntoDB,
  deleteShippingAddressIntoDB,
};
