import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.service.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('getting users ...');
    const allUsers = await getAllUsers();

    res.json({
      message: 'Users retrieved successfully',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    logger.info(`getting user by id: ${req.params.id} ...`);
    const user = await getUserById(req.params.id);
    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    logger.info(`updating user by id: ${req.params.id} ...`);
    const user = await updateUser(req.params.id, req.body);
    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    logger.info(`deleting user by id: ${req.params.id} ...`);
    const user = await deleteUser(req.params.id);
    res.json({
      message: 'User deleted successfully',
      user,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};
