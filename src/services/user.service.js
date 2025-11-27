import logger from '#configs/logger.js';
import { db } from '#configs/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting all users:', e);
    throw e;
  }
};

export const getUserById = async (id) => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(users.id.equals(id))
      .first();
  } catch (e) {
    logger.error('Error getting user by ID:', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  const ALLOWED_UPDATE_FIELDS = ['name', 'email', 'role'];

  // Sanitize updates to only include allowed fields
  const sanitizedUpdates = Object.keys(updates)
    .filter((key) => ALLOWED_UPDATE_FIELDS.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  if (Object.keys(sanitizedUpdates).length === 0) {
    throw new Error('No valid fields to update');
  }

  try {
    return await db
      .update(users)
      .set({ ...sanitizedUpdates, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });
  } catch (e) {
    logger.error('Error updating user:', e);
    throw e;
  }
};

export const deleteUser = async (id) => {
  try {
    const result = await db.delete(users).where(eq(users.id, id)).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at,
    });

    if (result.length === 0) {
      throw new Error('User not found');
    }

    return result[0];
  } catch (e) {
    logger.error('Error deleting user:', e);
    throw e;
  }
};
