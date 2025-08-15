import cartService from "../services/cartService.js";

class CartController {
    constructor() {
        this.$cartItems = null;
        this.$subTotal = null;
        this.$discount = null;
        this.$shipping = null;
        this.$total = null;
        this.$coupon = null;
        this.$applyCoupon = null;
        this.$badge = null;
        this.$couponHelp = null
        this.$clearCart = null
        this.$pay = null;

    }

    init(retry = 0) {
        this.$cartItems = document.getElementById("cartItems");
        this.$subTotal = document.getElementById("subTotal");
        this.$discount = document.getElementById("discount");
        this.$shipping = document.getElementById("shipping");
        this.$total = document.getElementById("total");
        this.$coupon = document.getElementById("coupon");
        this.$applyCoupon = document.getElementById("applyCoupon");
        this.$badge = document.getElementById("cart-count");
        this.$couponHelp = document.getElementById('couponHelp');
        this.$clearCart = document.getElementById('clearCart');
        this.$pay = document.getElementById('btnPay');

        if (!this.$cartItems) {
            if (retry < 20) {
                setTimeout(() => this.init(retry + 1), 100);
            }
            return;
        }

        this.renderCart();
        this.events();
    }

    updateBadge() {
        if (this.$badge) {
            this.$badge.textContent = cartService.count();
        }
    }

    updateTotals(animated = false) {
        const { subTotal, discount, shipping, total, invalidCoupon, coupon } = cartService.totals();

        const money = (n) => `${Number(n || 0).toLocaleString("vi-VN")}đ`;

        const setText = (el, value) => {
            if (!el) return;
            if (animated) {
                el.classList.add("cart-animate-change");
                el.addEventListener("animationend", () => {
                    el.classList.remove("cart-animate-change");
                }, { once: true });
            }
            el.textContent = value;
        };


        setText(this.$subTotal, money(subTotal));
        setText(this.$discount, money(discount));
        setText(this.$shipping, shipping === 0 ? "Miễn phí" : money(shipping));
        setText(this.$total, money(total));

        if (this.$couponHelp) {
            this.$couponHelp.classList.remove("text-emerald-600", "text-rose-600", "text-gray-500");
            if (invalidCoupon) {
                this.$couponHelp.classList.add("text-rose-600");
                this.$couponHelp.textContent = "Mã giảm giá không hợp lệ hoặc đã hết hạn.";
            } else if (coupon) {
                this.$couponHelp.classList.add("text-emerald-600");
                this.$couponHelp.textContent = `Áp mã "${coupon.toUpperCase()}" thành công!`;
            } else {
                this.$couponHelp.classList.add("text-gray-500");
                this.$couponHelp.textContent = "";
            }
        }


        this.updateBadge();
    }

    renderCart() {
        const { cart } = cartService.totals();

        if (!cart.length) {
            this.$cartItems.innerHTML = '<p class="text-gray-500">Giỏ Hàng Trống.</p>';
            this.updateTotals();
            return;
        }



        this.$cartItems.innerHTML = cart.map(item => `
            <article data-id="${item.id}" class="flex gap-4 bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:shadow transition">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-contain rounded-lg"/>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <h3 class="font-semibold">${item.name}</h3>
                        <button data-remove-id="${item.id}" class="text-slate-500 hover:text-red-600 cursor-pointer">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                    <p class="text-sm text-slate-500">${item.description || ''}</p>

                    <div class="mt-2 flex justify-between items-center">
                        <div class="flex items-center bg-slate-50 rounded border border-gray-300 overflow-hidden">
                            <button type="button" data-input-counter-decrement="quantity-${item.id}" class="h-7 w-7 grid place-items-center border border-gray-300 rounded-l bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                <i class="fa-solid fa-minus text-[10px]"></i>
                            </button>
                            <input id="quantity-${item.id}" value="${item.quantity}" inputmode="numeric"
                                   data-input-counter data-input-counter-min="1" data-input-counter-max="99"
                                   class="h-7 w-8 text-[11px] text-center border-y border-gray-300 bg-gray-50"/>
                            <button type="button" data-input-counter-increment="quantity-${item.id}" class="h-7 w-7 grid place-items-center border border-gray-300 rounded-r bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                <i class="fa-solid fa-plus text-[10px]"></i>
                            </button>
                        </div>
                        <span class="font-bold text-lg text-gray-800">${Number(item.price).toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
            </article>
        `).join("");

        this.updateTotals();
    }


    events() {
        // Input
        this.$cartItems.addEventListener("change", (event) => {
            const input = event.target.closest("input[data-input-counter]");
            if (!input) return;
            const id = input.id.replace("quantity-", "");
            const quantity = Number(input.value);
            cartService.updateQuantity(id, quantity);
            this.updateTotals(true);
        });

        // + -
        this.$cartItems.addEventListener("click", (e) => {
            const inc = e.target.closest("[data-input-counter-increment]");
            const dec = e.target.closest("[data-input-counter-decrement]");
            if (!inc && !dec) return;

            const article = e.target.closest("article[data-id]");
            if (!article) return;

            const input = article.querySelector("input[data-input-counter]");
            if (!input) return;

            let qty = Number(input.value) || 1;
            qty = inc ? Math.min(99, qty + 1) : Math.max(1, qty - 1);

            input.value = qty; // cập nhật UI
            const id = article.dataset.id;
            cartService.updateQuantity(id, qty);
            this.updateTotals(true);
        });


        // Xóa
        this.$cartItems.addEventListener("click", (event) => {
            const removeBtn = event.target.closest("[data-remove-id]");
            if (removeBtn) {
                const id = removeBtn.dataset.removeId;
                cartService.removeProduct(id);
                this.renderCart();
            }
        });

        // Giảm giá
        this.$applyCoupon.addEventListener("click", () => {
            const code = this.$coupon.value.trim();
            cartService.applyCoupon(code);
            this.updateTotalsUI(true);
        });

        // Clear cart
        this.$clearCart.addEventListener("click", () => {
            if(!cartService.read().length) {
                Swal.fire({
                    icon: "error",
                    title: "Giỏ hàng đang trống",
                    text: "Vui lòng thêm sản phẩm.",
                    timer: 1500,
                    showConfirmButton: false
                })
            }else{
                Swal.fire({
                    title: "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
                    text: "Hành động này sẽ không thể hoàn tác!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Hủy"
                }).then((result) => {
                    if (result.isConfirmed) {
                        cartService.clear();
                        document.querySelector('[data-modal-hide="cartModal"]')?.click();
                        this.renderCart();
                        Swal.fire({
                            icon: "success",
                            title: "Đã xóa giỏ hàng!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        });


        //Pay cart
        this.$pay.addEventListener("click", () => {
            console.log(cartService.read())
            if(!cartService.read().length){
                Swal.fire({
                    icon: "error",
                    title: "Giỏ hàng đang trống",
                    text: "Vui lòng thêm sản phẩm trước khi thanh toán.",
                    timer: 1500,
                    showConfirmButton: false
                })
            }else{
                cartService.clear();
                document.querySelector('[data-modal-hide="cartModal"]')?.click();
                Swal.fire({
                    icon: "success",
                    title: `Thanh Toán Thành Công!!` ,
                    showConfirmButton: false,
                    timer: 1500
                });
                this.renderCart();
                this.updateTotals();
            }

        })

    }
}

export const cartController = new CartController();
