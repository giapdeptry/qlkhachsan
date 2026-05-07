const paymentService = require('../services/payment.service');
const { OK } = require('../core/success.response');

class DashboardController {
    async getDashboard(req, res) {
        const { timeFilter = 'month' } = req.query;

        const data = await paymentService.getDashboard(timeFilter);

        return new OK({
            message: 'Lấy dữ liệu dashboard thành công',
            metadata: data,
        }).send(res);
    }

    async getChartData(req, res) {
        const { type, timeFilter = 'month' } = req.query;

        let data = {};

        switch (type) {
            case 'revenue':
                data = await paymentService.getRevenueChartData(timeFilter);
                break;
            case 'occupancy':
                data = await paymentService.getOccupancyChartData();
                break;
            case 'roomType':
                data = await paymentService.getRoomTypeData();
                break;
            default:
                data = await paymentService.getRevenueChartData(timeFilter);
        }

        return new OK({
            message: 'Lấy dữ liệu biểu đồ thành công',
            metadata: data,
        }).send(res);
    }
}

module.exports = new DashboardController();

