const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const Payment = require('./src/models/payment.model');

(async () => {
  try {
    await mongoose.connect(process.env.CONNECT_DB);
    const count = await Payment.countDocuments();
    console.log('PAYMENT COUNT', count);
    const payments = await Payment.find().limit(2).lean();
    console.log(JSON.stringify(payments, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
