import express from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/user.controller.js';
import { authenticateToken, authorize } from '#middleware/user.middleware.js';

const router = express.Router();

// 只有管理員可以取得所有用戶
router.get(
  '/',
  authenticateToken,
  authorize({ allowRoles: ['admin'] }),
  fetchAllUsers
);

// 本人或管理員可以查看用戶資料
router.get(
  '/:id',
  authenticateToken,
  authorize({ allowRoles: ['admin'], allowSelf: true }),
  fetchUserById
);

// 本人或管理員可以更新用戶資料
router.put(
  '/:id',
  authenticateToken,
  authorize({ allowRoles: ['admin'], allowSelf: true }),
  updateUserById
);

// 本人或管理員可以刪除用戶
router.delete(
  '/:id',
  authenticateToken,
  authorize({ allowRoles: ['admin'], allowSelf: true }),
  deleteUserById
);

export default router;
