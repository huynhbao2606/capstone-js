class ProductService {
    getAll() {
        return axios.get("https://68908c3c944bf437b59664d4.mockapi.io/api/product");
    }
}

export default new ProductService();