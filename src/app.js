import express from 'express';
//  A logging library
import logger from '#configs/logger.js';
// A security middleware
import helmet from 'helmet';
// An HTTP request logger middleware
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.get('/', (req, res) => {
  logger.info('Hello world');

  res.status(200).send('Hello, World!');
});

export default app;
