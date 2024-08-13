import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { productServices } from './variant.service';

const createVariant = catchAsync(async (req, res) => {
  const result = await productServices.createVariantIntoDB(req.user, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant created successfully',
    data: result,
  });
});

const updateVariant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.updateVariantFromDB(
    req.user,
    id,
    req.body,
  );
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant update successfully',
    data: result,
  });
});

const deleteVariant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productServices.deleteVariantFromDB(req.user, id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant deleted successfully',
    data: result,
  });
});

export const variantControllers = {
  createVariant,
  updateVariant,
  deleteVariant,
};
