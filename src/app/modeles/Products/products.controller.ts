import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { productServices } from './products.service';

const createProduct = catchAsync(async (req, res) => {
  const result = await productServices.createProductIntoDB(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const result = await productServices.getAllProductFromDB(req.query);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Product retrieved successfully',
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.totalData,
    },
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.getSingleProductFromDB(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Product retrieved successfully',
    data: result,
  });
});

const updateSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.updateSingleProductFromDB(
    id,
    req.body,
    req.files,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Updated successfully',
    data: result,
  });
});

const deleteSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.deleteSingleProductFromDB(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const deleteProductPicture = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.deletepictureFromLocal(id, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result?.message ? result?.message : 'Picture deleted successfully',
    data: result?.message,
  });
});

export const productControllers = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  deleteProductPicture,
};
