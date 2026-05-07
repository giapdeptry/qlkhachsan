const CartService = require('../services/cart.service');

const { OK } = require('../core/success.response');

class CartController {
    async createCart(req, res) {
        const { id } = req.user;
        const { roomId, checkInDate, checkOutDate, numberOfAdults, numberOfChildren } = req.body;
        const cart = await CartService.createCart(
            id,
            roomId,
            checkInDate,
            checkOutDate,
            numberOfAdults,
            numberOfChildren,
        );
        return new OK({ message: 'Create cart successfully', metadata: cart }).send(res);
    }

    async getCart(req, res) {
        const { id } = req.user;
        const cart = await CartService.getCart(id);
        return new OK({ message: 'Get cart successfully', metadata: cart }).send(res);
    }

    async updateCart(req, res) {
        const { id } = req.user;
        const data = req.body;
        const cart = await CartService.updateCart(id, data);
        return new OK({ message: 'Update cart successfully', metadata: cart }).send(res);
    }

    async deleteCartRoom(req, res) {
        const { idRoom } = req.params;
        const { id } = req.user;
        const cart = await CartService.deleteCartRoom(id, idRoom);
        return new OK({ message: 'Delete cart room successfully', metadata: cart }).send(res);
    }
}

module.exports = new CartController();
