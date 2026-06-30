// Load environment variables from .env FIRST — before any other require()
// because other modules (like db.js) read process.env immediately on import
require('dotenv').config();

const connectDB = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB first, then start listening.
// If the DB connection fails, we log a clear error and exit instead of
// starting a server that can't do anything useful.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB. Server not started.');
    console.error(err.message);
    process.exit(1); // exit with a non-zero code so the OS / Docker / Render knows it crashed
  });
