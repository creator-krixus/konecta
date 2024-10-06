const mongoose = require('mongoose');

const connection = async (app) => {
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to the database');
    return;
  }

  try {
    await mongoose.connect(process.env.URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};

module.exports = connection;
