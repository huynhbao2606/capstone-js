class ProductService {
    getAll() {
        return axios.get("https://68908c3c944bf437b59664d4.mockapi.io/api/product");
    }

    add(product) {
        return axios.post("https://68908c3c944bf437b59664d4.mockapi.io/api/product", product);
    }

    update(product) {
        return axios.put(
            `https://68908c3c944bf437b59664d4.mockapi.io/api/product/${product.id}`,
            product
        );
    }

    delete(id) {
        return axios.delete(
            `https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`
        );
    }

    getById(id) {
        return axios.get(
            `https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`
        );
    }
}

export default new ProductService();
