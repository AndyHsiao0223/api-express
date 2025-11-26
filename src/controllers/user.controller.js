import logger from "#config/logger.js";
import { getAllUsers } from "#services/users.service.js";

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info("getting users ...");
    const allUsers = await getAllUsers();

    res.json({
      message: "Users retrieved successfully",
      users: allUsers,
      count: allUsers.length,
    })
  } catch (e) {
    logger.error(e);
    next(e);
  }
}

export const fetchUserById = async (req, res, next) => {};

export const updateUserById = async (req, res, next) => {};

export const deleteUserById = async (req, res, next) => {};