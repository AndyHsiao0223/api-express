import express from 'express';
//  A logging library
import logger from '#configs/logger.js';
// A security middleware
import helmet from 'helmet';
// An HTTP request logger middleware
import morgan from 'morgan';
import cors from 'cors';
// middleware to parse cookies from incoming requests
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
// security middleware
import sicurityMiddleware from '#middleware/sicurity.middleware.js';
// user CRUD routes
import userRoutes from '#routes/user.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(sicurityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello world');

  res.status(200).send('Hello, World!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;
