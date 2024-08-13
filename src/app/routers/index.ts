import { Router } from 'express';
import { loginRouters } from '../modeles/Auth/auth.router';
import { userRouter } from '../modeles/UsersRegistration/userRegistration.router';
import { categoryRouter } from '../modeles/Categories/categories.router';
import { productRouter } from '../modeles/Products/products.router';
import { variantRouter } from '../modeles/Variant/variant.router';
import { shippinAddressRouter } from '../modeles/ShippingAddress/shippingAddress.router';
import { orderRouter } from '../modeles/Orders/order.router';

const router = Router();

const moduleRouters = [
  {
    path: '/register',
    route: userRouter,
  },
  {
    path: '/auth',
    route: loginRouters,
  },
  {
    path: '/category',
    route: categoryRouter,
  },
  {
    path: '/product',
    route: productRouter,
  },
  {
    path: '/variant',
    route: variantRouter,
  },
  {
    path: '/shipping-address',
    route: shippinAddressRouter,
  },
  {
    path: '/order',
    route: orderRouter,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
