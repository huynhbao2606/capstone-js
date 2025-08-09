class Api {
    getProduct(){
        return axios.get("https://68908c3c944bf437b59664d4.mockapi.io/api/product");
    }

    deleteProductApi(id){
        return axios.delete(`https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`)
    }

    addProduct(newProduct){
        return axios.post('https://68908c3c944bf437b59664d4.mockapi.io/api/product',newProduct)
    }

    updateProduct(id){
        return axios.put(`https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`);
    }

    getProductById(id){
        return axios.get(`https://68908c3c944bf437b59664d4.mockapi.io/api/product/${id}`);
    }
}

export default new Api();