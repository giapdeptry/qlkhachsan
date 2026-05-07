const mongoose = require('mongoose');
require('dotenv').config();
const Payment = require('./src/models/payment.model');

(async () => {
  try {
    await mongoose.connect(process.env.CONNECT_DB, { useNewUrlParser: true, useUnifiedTopology: true });
    const count = await Payment.countDocuments();
    const one = await Payment.findOne().lean();
    console.log('count', count);
    console.log('one', JSON.stringify(one, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
