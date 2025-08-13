
import { loadProduct } from "../../../home/controller/productController.js";
import { cartController } from "../../../home/controller/cartController.js";

if (window.includesReady) {
    if (window.initFlowbite) window.initFlowbite();
    cartController.init();
    loadProduct();
} else {
    document.addEventListener("includes:ready", () => {
        if (window.initFlowbite) window.initFlowbite();
        cartController.init();
        loadProduct();
    });
}


