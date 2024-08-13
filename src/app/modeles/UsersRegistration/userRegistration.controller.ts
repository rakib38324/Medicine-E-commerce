import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { UserServices } from './userRegistration.service';

const createUsers = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.file, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration completed successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User information retrieved successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User information retrieved successfully',
    data: result,
  });
});

const updateUsers = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserFromDB(id, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

export const userControllers = {
  createUsers,
  getSingleUser,
  getAllUsers,
  updateUsers,
};
