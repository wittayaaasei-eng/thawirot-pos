export class CartSystem {
    constructor() {
        this.cart = [];
    }

    addItem(product) {
        if (product.stock <= 0) return false;

        product.stock -= 1;
        const existingCartItem = this.cart.find(item => item.barcode === product.barcode);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
            existingCartItem.totalPrice = existingCartItem.price * existingCartItem.quantity;
        } else {
            this.cart.push({
                id: Date.now(),
                barcode: product.barcode,
                name: product.name,
                price: product.price,
                quantity: 1,
                totalPrice: product.price
            });
        }
        return true;
    }

    removeItem(barcode, database) {
        const cartIndex = this.cart.findIndex(item => item.barcode === barcode);
        if (cartIndex > -1) {
            const itemToRemove = this.cart[cartIndex];
            const product = database.find(p => p.barcode === barcode);

            if (product) {
                product.stock += itemToRemove.quantity; // คืนสต็อก
            }
            this.cart.splice(cartIndex, 1);
        }
    }

    clear() {
        this.cart = [];
    }

    getItems() {
        return this.cart;
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    }
}