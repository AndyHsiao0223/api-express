import logger from '#configs/logger.js';
import { signupSchema, signInSchema } from '#validations/auth.validation.js';
import { formatValidationErrors } from '#utils/format.js';
import {
  createUser,
  getUserByEmail,
  verifyPassword,
} from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User registered successfully: ${email}`);
    return res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signup Error', e);

    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already in use' });
    }
  }
};

export const signin = async (req, res) => {
  try {
    // 1. 驗證輸入資料格式
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    // 2. 根據 email 取得使用者資料
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. 驗證密碼
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. 產生 JWT token
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. 設定 cookie
    cookies.set(res, 'token', token);

    // 6. 紀錄日誌並返回成功響應
    logger.info(`User signed in successfully: ${email}`);
    return res.status(200).json({
      message: 'Signin successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signin Error', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
