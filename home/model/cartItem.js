export default class CartItem{
    constructor(id, name, price, image, description, quantity = 1) {
        this.id = id;
        this.name = name;
        this.price = Number(price || 0);
        this.image = image;
        this.description = description;
        this.quantity = Number(quantity || 1)
    }
}