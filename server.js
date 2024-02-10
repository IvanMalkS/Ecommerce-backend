const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE_ECOMMERS.replace(
  '<USERNAME_DB>',
  process.env.USERNAME_DB,
)
  .replace('<PASSWORD_DB>', process.env.PASSWORD_DB)
  .replace('<SERVER_IP>', process.env.SERVER_IP)
  .replace('<DATABASE_PORT>', process.env.DATABASE_PORT);
console.log(`Connecting to ${DB}`);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
  });

const PORT = process.env.PORT || 3000;
console.log(`Server is running on http://localhost:${PORT}/`);

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Server is updated');
  }
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION shutting down');
  server.close(() => {
    process.exit(1);
  });
});
