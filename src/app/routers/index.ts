import { Router } from 'express';
import { loginRouters } from '../modeles/Auth/auth.router';
import { userRouter } from '../modeles/UsersRegistration/userRegistration.router';
import { categoryRouter } from '../modeles/Categories/categories.router';

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
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
