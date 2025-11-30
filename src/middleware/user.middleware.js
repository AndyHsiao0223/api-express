import { cookies } from '#utils/cookies.js';
import logger from '#configs/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  const token =
    cookies.get(req, 'token') || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is missing or invalid',
    });
  }

  try {
    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (e) {
    logger.error('Error authenticating token:', e);
    return res.status(401).json({
      success: false,
      message: 'Access token is missing or invalid',
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'User does not have the required role',
      });
    }

    next();
  };
};

/**
 * 統一授權 middleware
 * @param {Object} options - 授權選項
 * @param {string[]} options.roles - 允許的角色列表
 * @param {boolean} options.allowSelf - 是否只允許本人操作（根據 req.params.id）
 *
 * @example
 * // 只有 admin 可以存取
 * authorize({ roles: ['admin'] })
 *
 * // 本人或 admin 可以存取
 * authorize({ roles: ['admin'], allowSelf: true })
 *
 * // 只有本人可以存取
 * authorize({ allowSelf: true })
 */
export const authorize = (options = {}) => {
  const { allowRoles = [], allowSelf = false } = options;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const currentUserId = String(req.user.id);
    const targetUserId = req.params.id;
    const userRole = req.user.role;

    const hasRole = allowRoles.length > 0 && allowRoles.includes(userRole);

    const isSelf = allowSelf && targetUserId && currentUserId === targetUserId;

    if (hasRole || isSelf) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access this resource',
    });
  };
};
