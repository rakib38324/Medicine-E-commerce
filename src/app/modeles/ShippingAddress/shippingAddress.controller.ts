import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { shippingAddressServices } from './shippingAddress.service';

const createshippingAddress = catchAsync(async (req, res) => {
  const result = await shippingAddressServices.createShippingAddressIntoDB(
    req.user,
    req.body,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Address created successfully',
    data: result,
  });
});

const getShippingAddress = catchAsync(async (req, res) => {
  const result = await shippingAddressServices.getShippingAddressIntoDB(
    req.user,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Address find successfully',
    data: result,
  });
});

const updateShippingAddress = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await shippingAddressServices.updateShippingAddressIntoDB(
    req.user,
    id,
    req.body,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Address updated successfully',
    data: result,
  });
});

const deleteShippingAddress = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await shippingAddressServices.deleteShippingAddressIntoDB(
    req.user,
    id,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Address deleted successfully',
    data: result,
  });
});

export const shippingAddressControllers = {
  createshippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
