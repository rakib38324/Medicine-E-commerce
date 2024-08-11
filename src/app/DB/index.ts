import config from '../config/config';
import { USER_ROLE } from '../modeles/UsersRegistration/user.constent';
import { User } from '../modeles/UsersRegistration/userRegistration.model';

const superUser = {
  name: 'You are Supper Admin',
  email: 'rakib38324@gmail.com',
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  verified: true,
  img: 'https://',
};

const seedSuperAdmin = async () => {
  // when database is connected, we will check is there any user who is super admin
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
