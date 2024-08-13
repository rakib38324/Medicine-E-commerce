import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../UsersRegistration/user.constent';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { PipelineStage } from 'mongoose';

const createOrderIntoDB = async (user: JwtPayload, payload: TOrder) => {
  const createdData = {
    ...payload,
    date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
  };

  const result = await Order.create(createdData);

  return result;
};

const getAllOrderFromDB = async (query: Record<string, unknown>) => {
  const { date } = query;

  // Check if a specific date is provided
  if (typeof date === 'string') {
    const aggregationPipeline: PipelineStage[] = [];
    // Convert the date format in the query from '13/8/2024' to '2024-08-13'
    const formattedDate = new Date(date.split('/').reverse().join('-'));

    aggregationPipeline.push({
      $match: {
        date: formattedDate.toISOString().split('T')[0],
      },
    });
    const orders = await Order.aggregate(aggregationPipeline);

    // Populate fields after aggregation
    const populatedOrders = await Order.populate(orders, [
      { path: 'userId', select: '-password' }, // Exclude the 'password' field from the populated 'userId'
      { path: 'productId' },
      { path: 'shippingAddress' },
    ]);

    return populatedOrders;
  }

  const result = await Order.find()
    .populate({
      path: 'userId',
      select: '-password', // Exclude the 'password' field
    })
    .populate({ path: 'productId' })
    .populate({ path: 'shippingAddress' });
  return result;
};

const getSingleOrderFromDB = async (_id: string) => {
  const result = await Order.findById({ _id })
    .populate({
      path: 'userId',
      select: '-password', // Exclude the 'password' field
    })
    .populate({ path: 'productId' })
    .populate({ path: 'shippingAddress' });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order not found');
  }
  return result;
};

const updateVariantFromDB = async (
  user: JwtPayload,
  _id: string,
  payload: Partial<TOrder>,
) => {
  const orderExists = await Order.findById({ _id });

  if (!orderExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order not found.');
  }

  if (user?.role === USER_ROLE.user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only admin or Super Admin can update Order.',
    );
  }

  if (payload?.date) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order date is not updateable.');
  }

  if (payload?.userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User Inforamtion is not updateable.',
    );
  }

  if (payload?.productId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Product Infor is not updateable.',
    );
  }

  const result = await Order.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const orderServices = {
  createOrderIntoDB,
  getAllOrderFromDB,
  updateVariantFromDB,
  getSingleOrderFromDB,
};
