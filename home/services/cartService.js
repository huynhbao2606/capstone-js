const CART = "cart";
const COUPON = "cart_coupon";

const read = () => {
    try {
        return JSON.parse(localStorage.getItem(CART) || "[]");
    } catch {
        return [];
    }
};
const write = (cart) => localStorage.setItem(CART, JSON.stringify(cart ?? []));

function count() {
    return read().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function addCart(product, quantity = 1) {
    const cart = read();
    const index = cart.findIndex(item => item.id === product.id);

    if (index > -1) {
        cart[index].quantity = Math.min(99, Number(cart[index].quantity || 0) + Number(quantity || 1));
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: Number(quantity || 1)
        });
    }
    write(cart);
    return cart;
}

function updateQuantity(id, quantity) {
    const cart = read();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, Math.min(99, Number(quantity || 1)));
        write(cart);
    }
    return read();
}

function removeProduct(id) {
    const remove = read().filter(item => item.id !== id);
    write(remove);
    return remove;
}

function clear() {
    write([]);
    localStorage.removeItem(COUPON);
}

function totals(coupon = (localStorage.getItem(COUPON) || "").toLowerCase()) {
    const cart = read();
    const subTotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

    let discount;
    let invalidCoupon = false;

    if (!coupon) {
        discount = 0;
    } else if (coupon === "bao") {
        discount = Math.round(subTotal * 0.50);
    } else {
        discount = 0;
        invalidCoupon = true;
    }

    let shipping = subTotal >= 10000000 ? 0 : (cart.length ? 30000 : 0);

    const total = Math.max(0, subTotal - discount + shipping);
    return { cart, subTotal, discount, shipping, total, coupon, invalidCoupon };
}

function applyCoupon(code) {
    const coupon = (code || "").trim().toLowerCase();
    localStorage.setItem(COUPON, coupon);
    return totals(coupon);
}

export default {
    read, write, count, addCart, updateQuantity, removeProduct, clear, totals, applyCoupon
};
