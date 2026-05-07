const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const Room = require('./src/models/room.model');

(async () => {
  try {
    await mongoose.connect(process.env.CONNECT_DB);
    const count = await Room.countDocuments();
    console.log('ROOM COUNT', count);
    const one = await Room.findOne().lean();
    console.log('SAMPLE', one);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
