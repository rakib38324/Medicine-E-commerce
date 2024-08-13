import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { orderServices } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const result = await orderServices.createOrderIntoDB(req.user, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order Placed successfully',
    data: result,
  });
});

const getAllOrder = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrderFromDB(req.query);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const getsingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await orderServices.getSingleOrderFromDB(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateVariant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await orderServices.updateVariantFromDB(
    req.user,
    id,
    req.body,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

export const orderControllers = {
  createOrder,
  getAllOrder,
  updateVariant,
  getsingleOrder,
};
