const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Payment = require('./src/models/payment.model');
const Cart = require('./src/models/cart.model');
const User = require('./src/models/users.model');

(async () => {
  try {
    await mongoose.connect(process.env.CONNECT_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const countPayments = await Payment.countDocuments();
    const countCarts = await Cart.countDocuments();
    const user = await User.findOne({ email: 'admin@test.com' });
    console.log('countPayments=', countPayments);
    console.log('countCarts=', countCarts);
    console.log('admin user=', user ? user._id.toString() : 'none');
    if (user) {
      console.log('payments for admin=', await Payment.countDocuments({ userId: user._id }));
      console.log('carts for admin=', await Cart.countDocuments({ userId: user._id }));
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
})();
