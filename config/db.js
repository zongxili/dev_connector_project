const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI'); // get any value from the JSON file

const connectDB = async () => { // when async, we should use try/catch
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
}
sadfsd
module.exports = connectDB;