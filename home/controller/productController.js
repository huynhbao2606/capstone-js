import productService from "../services/productService.js";
import Product from "../model/product.js";


export function loadProudct() {
    productService.getAll()
        .then(res => {
            const listProduct = res.data.map(p => new Product(
                p.id, p.name, p.price, p.screen, p.backCamera,
                p.frontCamera, p.image, p.description, p.type
            ));
            renderProduct(listProduct);
        })
        .catch(err => console.error("Lỗi load sản phẩm", err));
}


function renderProduct(products) {
    let contentProduct = '';

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const price = Number(p.price || 0).toLocaleString('vi-VN');

        contentProduct += `
      <div class="product-card border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition p-3 flex flex-col h-full">

        <!-- Ảnh sản phẩm -->
        <div class="rounded-md flex items-center justify-center p-2 overflow-hidden">
          <img src="${p.image}" alt="${p.name}"
               class="h-40 object-contain transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer" />
        </div>

        <!-- Tên + mô tả -->
        <h3 class="mt-2 text-lg font-semibold text-gray-900 truncate">${p.name}</h3>
        <p class="text-sm text-gray-500 line-clamp-1">${p.description || ''}</p>

        <!-- Thông tin sản phẩm -->
        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-700 mt-1">
          <p><span class="font-semibold">Màn hình:</span> ${p.screen}</p>
          <p><span class="font-semibold">Loại:</span> ${p.type}</p>
          <p><span class="font-semibold">Cam sau:</span> ${p.backCamera}</p>
          <p><span class="font-semibold">Cam trước:</span> ${p.frontCamera}</p>
        </div>

        <!-- Giá + counter + giỏ -->
        <div class="mt-auto pt-2 border-t border-gray-100 flex items-center gap-1 min-w-0">
          <!-- Giá -->
          <span class="price flex items-center gap-1 text-rose-600 font-bold text-[12px]
                       min-w-0 flex-1 whitespace-nowrap overflow-hidden text-ellipsis
                       max-w-[6.5rem] sm:max-w-[8rem]">
            <i class="fa-solid fa-tags text-[12px]"></i> ${price}₫
          </span>

          <!-- Counter + nút giỏ -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <!-- Counter -->
            <div class="counter relative flex items-center">
              <button type="button" data-input-counter-decrement="qty-${i}"
                      class="h-7 w-7 grid place-items-center border border-gray-300 rounded-l bg-gray-100 hover:bg-gray-200 cursor-pointer">
                <i class="fa-solid fa-minus text-[10px]"></i>
              </button>
              <input id="qty-${i}" value="1" inputmode="numeric"
                     data-input-counter data-input-counter-min="1" data-input-counter-max="99"
                     class="h-7 w-8 text-[11px] text-center border-y border-gray-300 bg-gray-50"/>
              <button type="button" data-input-counter-increment="qty-${i}"
                      class="h-7 w-7 grid place-items-center border border-gray-300 rounded-r bg-gray-100 hover:bg-gray-200 cursor-pointer">
                <i class="fa-solid fa-plus text-[10px]"></i>
              </button>
            </div>

            <!-- Nút giỏ hàng -->
            <button class="cart-btn group relative h-8 w-8 grid place-items-center rounded-md bg-gray-700 text-white hover:bg-gray-800 focus:outline-none cursor-pointer">
              <i class="fa-solid fa-cart-plus fa-beat text-[11px]"></i>
              <span class="tip flex absolute -top-2 translate-y-[-100%] left-1/2 -translate-x-1/2
                           px-2 py-0.5 rounded text-[10px] text-white bg-gray-900/95 opacity-0
                           group-hover:opacity-100 pointer-events-none duration-150">
                Thêm vào giỏ
              </span>
            </button>
          </div>
        </div>
      </div>
    `;
    }

    document.getElementById('product-list').innerHTML = contentProduct;

    if (typeof window.initFlowbite === 'function') {
        window.initFlowbite();
    }
}