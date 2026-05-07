const userRouter = require('./users.routes');
const roomRouter = require('./room.routes');
const cartRouter = require('./cart.routes');
const couponRouter = require('./counpon.routes');
const paymentRouter = require('./payment.routes');
const previewRouter = require('./preview.routes');
const contactRouter = require('./contact.routes');
const blogRouter = require('./blog.routes');
const dashboardRouter = require('./dashboard.routes');
const roomWatchRouter = require('./roomWatch.routes');

function route(app) {
    app.use('/api/users', userRouter);
    app.use('/api/rooms', roomRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/coupon', couponRouter);
    app.use('/api/payment', paymentRouter);
    app.use('/api/preview', previewRouter);
    app.use('/api/contact', contactRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/dashboard', dashboardRouter);
    app.use('/api/room-watch', roomWatchRouter);
}

module.exports = route;
