import productService from "../services/productService.js";
import cartService from "../services/cartService.js";
import {cartController} from "./cartController.js";
import Product from "../model/product.js";


let allProducts = [];
let listProduct = [];

export function loadProduct() {
    showLoading();
    productService.getAll()
        .then(res => {
            allProducts = res.data.map(p => new Product(
                p.id, p.name, p.price, p.screen, p.backCamera,
                p.frontCamera, p.image, p.description, p.type
            ));
            listProduct = [...allProducts];
            renderProduct(listProduct);
            bindAddToCart(listProduct);
            bindTypeFilterAndSearch()
        })
        .catch(err => {
            console.error("Lỗi load sản phẩm", err);
            document.getElementById('product-list').innerHTML = `
                <div class="col-span-full text-center p-6">
                    <p class="text-gray-600">Không tải được sản phẩm. Vui lòng thử lại.</p>
                    <button id="retryLoad" class="mt-3 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 cursor-pointer">
                        Thử lại
                    </button>
                </div>
            `;
            document.getElementById('retryLoad')?.addEventListener('click', loadProduct);
        })
        .finally(() => {
            hideLoading();
        });
}


function typeFilterAndSearch(e) {
    if (e?.preventDefault) e.preventDefault();

    const filter   = document.getElementById('typeFilter')?.value || 'all';
    const keyword  = document.getElementById('searchFilter')?.value || '';

    let result = (filter === 'all')
        ? [...allProducts]
        : allProducts.filter(item =>
            String(item.type).toLowerCase() === String(filter).toLowerCase()
        );

    const kw = normalize(keyword);
    if (kw.length > 0) {
        result = result.filter(item => {
            const name = normalize(item.name);
            const desc = normalize(item.description || "");
            return name.includes(kw) || desc.includes(kw);
        });
    }

    if (result.length === 0) {
        const wrap = document.getElementById('product-list');
        if (wrap) {
            wrap.innerHTML = `
        <div class="col-span-full text-center p-6 text-gray-600">
          Không tìm thấy sản phẩm phù hợp.
        </div>`;
        }

        listProduct = [];
        if (window.JOS?.refresh) JOS.refresh(); else if (window.JOS) JOS.init();
        return;
    }

    listProduct = result;
    renderProduct(listProduct);
    bindAddToCart(listProduct);

    if (window.JOS?.refresh) JOS.refresh(); else if (window.JOS) JOS.init();
}


function bindTypeFilterAndSearch() {
    const typeSelect  = document.getElementById('typeFilter');
    const searchBtn   = document.getElementById('btnSearch');
    const searchInput = document.getElementById('searchFilter');

    if (typeSelect) typeSelect.addEventListener('change', typeFilterAndSearch);
    if (searchBtn)  searchBtn.addEventListener('click', typeFilterAndSearch);

    // Tìm khi gõ (debounce)
    if (searchInput) {
        let t;
        searchInput.addEventListener('input', () => {
            clearTimeout(t);
            t = setTimeout(typeFilterAndSearch, 200);
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') typeFilterAndSearch(e);
        });
    }
}


function normalize(str = "") {
    return String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


function showLoading() {
    document.getElementById('loadingScreen').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingScreen').classList.add('hidden');
}


function addToCart(product, quantity) {
    cartService.addCart(product, quantity);
    cartController.updateBadge();
}

function renderProduct(products) {
    const isDesktop = window.matchMedia("(min-width:1024px)").matches;
    const cols = isDesktop ? 4 : 2;
    let contentProduct = '';

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const price = Number(p.price || 0).toLocaleString('vi-VN');


        const delay = ((i % cols) * 0.06).toFixed(2);

        contentProduct += `
      <div class="product-card card-hover border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition p-3 flex flex-col h-full jos"
           data-jos_animation="fade-up"
           data-jos_delay="${delay}"
           data-jos_duration="0.7">
           
        <div class="rounded-md flex items-center justify-center p-2 overflow-hidden">
          <img src="${p.image}" alt="${p.name}"
               class="h-40 object-contain transform transition-transform duration-300 ease-in-out md:hover:scale-105 cursor-pointer" />
        </div>

        <h3 class="mt-2 text-lg font-semibold text-gray-900 truncate">${p.name}</h3>
        <p class="text-sm text-gray-500 line-clamp-1">${p.description || ''}</p>

        <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-700 mt-1">
          <p><span class="font-semibold">Màn hình:</span> ${p.screen}</p>
          <p><span class="font-semibold">Loại:</span> ${p.type}</p>
          <p><span class="font-semibold">Cam sau:</span> ${p.backCamera}</p>
          <p><span class="font-semibold">Cam trước:</span> ${p.frontCamera}</p>
        </div>

        <div class="mt-auto pt-2 border-t border-gray-100 flex items-center gap-1 min-w-0">
        
          <span class="price flex items-center gap-1 text-rose-600 font-bold md:text-xs sm:text-md
                       min-w-0 flex-1 whitespace-nowrap overflow-hidden text-ellipsis
                       max-w-[6.5rem] sm:max-w-[8rem]">
            <i class="fa-solid fa-tags text-[12px]"></i> ${price}₫
          </span>

         
          <div class="flex items-center gap-1 flex-shrink-0">
            <div class="counter relative flex items-center">
              <button type="button" data-input-counter-decrement="quantity-${p.id}"
                      class="h-7 w-7 grid place-items-center border border-gray-300 rounded-l bg-gray-100 hover:bg-gray-200 cursor-pointer">
                <i class="fa-solid fa-minus text-[10px]"></i>
              </button>
              <input id="quantity-${p.id}" value="1" inputmode="numeric"
                     data-input-counter data-input-counter-min="1" data-input-counter-max="99"
                     class="h-7 w-8 text-[11px] text-center border-y border-gray-300 bg-gray-50"/>
              <button type="button" data-input-counter-increment="quantity-${p.id}"
                      class="h-7 w-7 grid place-items-center border border-gray-300 rounded-r bg-gray-100 hover:bg-gray-200 cursor-pointer">
                <i class="fa-solid fa-plus text-[10px]"></i>
              </button>
            </div>

            
            <button data-product-id="${p.id}"
                    class="btnAddCart group relative h-8 w-8 grid place-items-center rounded-md bg-gray-700 text-white hover:bg-gray-800 focus:outline-none cursor-pointer">
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

    const list = document.getElementById('product-list');
    list.innerHTML = contentProduct;

    window.initFlowbite?.();

    if (JOS && typeof JOS.refresh === 'function') {
        JOS.refresh();
    } else {
        JOS.init();
    }
}

function flyToCart(imgEl, cartEl) {
    const b = document.getElementById('cart-count');

    if (!b) return;

    if (!imgEl || !cartEl) return;

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const clone = imgEl.cloneNode(true);
    clone.classList.add('flyer');
    clone.style.top = imgRect.top + 'px';
    clone.style.left = imgRect.left + 'px';
    clone.style.width = imgRect.width + 'px';
    clone.style.height = imgRect.height + 'px';
    document.body.appendChild(clone);

    const fromX = imgRect.left + imgRect.width / 2;
    const fromY = imgRect.top + imgRect.height / 2;
    const toX = cartRect.left + cartRect.width / 2;
    const toY = cartRect.top + cartRect.height / 2;


    const translateX = toX - fromX;
    const translateY = toY - fromY;


    requestAnimationFrame(() => {
        clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
        clone.style.opacity = '0.2';
    });


    setTimeout(() => {
        clone.remove();
        b.classList.remove('cart-badge-bump');
        void b.offsetWidth;
        cartEl.classList.remove('cart-bounce');
        void cartEl.offsetWidth;
        b.classList.add('cart-badge-bump');
        cartEl.classList.add('cart-bounce');
    }, 750);
}


function bindAddToCart(products) {
    const cartAnchor = document.getElementById('cartIcon'); // điểm đến

    document.querySelectorAll(".btnAddCart").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.productId;
            const product = products.find(p => p.id === id);
            const qtyInput = document.getElementById(`quantity-${id}`);
            const qty = Number(qtyInput.value) || 1;

            const card = btn.closest('.product-card');
            const imgEl = card?.querySelector('img');

            flyToCart(imgEl, cartAnchor);

            addToCart(product, qty);
            cartController.renderCart();
        });
    });
}

