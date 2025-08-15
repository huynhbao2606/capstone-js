
import { loadProduct } from "../../../home/controller/productController.js";
import { cartController } from "../../../home/controller/cartController.js";


document.addEventListener("includes:ready", () => {
    if (window.initFlowbite) window.initFlowbite();
    cartController.init();
    loadProduct();
    JOS.init({
        threshold: 0.15,
        rootMargin: "0% 0% -10% 0%"
    });
});




