class ProductService {
    getAll() {
        return axios.get("https://68908c3c944bf437b59664d4.mockapi.io/api/product");
    }

    deleteById(id) {
        return axios.delete(`https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`);
    }

    add(newProduct) {
        return axios.post('https://68908c3c944bf437b59664d4.mockapi.io/api/product', newProduct);
    }

    update(id, updatedProduct) {
        return axios.put(`https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`, updatedProduct);
    }

    getById(id) {
        return axios.get(`https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`);
    }
}

export default new ProductService();