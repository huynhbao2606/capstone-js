import productService from "../services/productService.js";
import Product from "../model/product.js";

let allProduct = [];
let isEditing = false;
let editId = null;

const modal = document.getElementById('productModal');

const $ = (id) => document.getElementById(id);

export function loadProduct() {
    productService.getAll()
        .then(res => {
            allProduct = res.data.map(p => new Product(
                p.id, p.name, p.price, p.screen, p.backCamera,
                p.frontCamera, p.image, p.description, p.type
            ));
            renderProduct(allProduct);
        })
        .catch(err => {
            console.error("Lỗi load sản phẩm", err);
            document.getElementById('list-product').innerHTML = `
        <div class="text-center p-6 text-center">
          <p class="text-gray-600">Không tải được sản phẩm. Vui lòng thử lại.</p>
          <button id="retryLoad" class="mt-3 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 cursor-pointer">
            Thử lại
          </button>
        </div>
      `;
            document.getElementById('retryLoad')?.addEventListener('click', loadProduct);
        });
}

function renderProduct(products) {
    let contentProduct = "";
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        contentProduct += `
      <tr class="border-b border-[#E5E7EB] hover:bg-gray-100">
        <!-- Cột tên + ảnh -->
        <th scope="row"
            class="px-3 sm:px-4 py-3 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white z-10">
          <div class="flex items-center mr-3">
            <img src="${p.image}" alt="${p.name}" class="h-8 w-8 mr-3 rounded object-cover">
            <span class="truncate max-w-[160px] sm:max-w-[240px]">${p.name}</span>
          </div>
        </th>

        <!-- Cột loại -->
        <td class="px-3 sm:px-4 py-3">
          <span class="bg-gray-100 text-gray-800 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded">${p.type}</span>
        </td>

        <!-- Cột giá -->
        <td class="px-3 sm:px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
          ${Number(p.price).toLocaleString("vi-VN")} ₫
        </td>

        <!-- Cột màn hình / cam sau / cam trước -->
        <td class="px-3 sm:px-4 py-3">${p.screen}</td>
        <td class="px-3 sm:px-4 py-3">${p.backCamera}</td>
        <td class="px-3 sm:px-4 py-3">${p.frontCamera}</td>

        <!-- Cột hành động -->
        <td class="px-3 sm:px-4 py-3 sticky right-0 bg-white z-10 space-x-2">
          <button type="button"
                  data-modal-target="productModal"
                  data-modal-toggle="productModal"
                  onclick="editProduct('${p.id}')"
                  class="h-9 sm:h-10 py-2 px-3 inline-flex items-center justify-center text-xs sm:text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button"
                  onclick="deleteProduct('${p.id}')"
                  class="h-9 sm:h-10 py-2 px-3 inline-flex items-center justify-center text-xs sm:text-sm font-medium text-red-700 border border-red-700 rounded-lg hover:bg-red-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>`;
    }
    document.getElementById("list-product").innerHTML = contentProduct;
    if (window.initFlowbite) window.initFlowbite();
}



function getFormData() {
    return {
        id: $('id').value,
        name: $('name').value.trim(),
        price: parseFloat($('price').value),
        screen: $('screen').value.trim(),
        backCamera: $('backCamera').value.trim(),
        frontCamera: $('frontCamera').value.trim(),
        image: $('image').value.trim(),
        description: $('description').value.trim(),
        type: $('type').value.trim()
    };
}

function fillFormData(product) {
    $('id').value = product.id ?? "";
    $('name').value = product.name ?? "";
    $('price').value = product.price ?? "";
    $('screen').value = product.screen ?? "";
    $('backCamera').value = product.backCamera ?? "";
    $('frontCamera').value = product.frontCamera ?? "";
    $('image').value = product.image ?? "";
    $('description').value = product.description ?? "";
    $('type').value = product.type ?? "";
}

function editProduct(id) {
    const product = allProduct.find(p => p.id === id);
    if (product) {
        clearAllValidation();
        fillFormData(product);
        isEditing = true;
        editId = id;
        $('productModalTitle').innerText = "Edit Product";
        $('btnSaveProduct').innerText = "Update";
    }
}
window.editProduct = editProduct;

function deleteProduct(id) {
    Swal.fire({
        title: 'Bạn có chắc xoá không?',
        text: "Điều này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý'
    }).then((result) => {
        if (result.isConfirmed) {
            productService.delete(id)
                .then(() => {
                    loadProduct();
                    Swal.fire('Đã xoá!', 'Sản phẩm đã được xoá.', 'success');
                })
                .catch(err => console.error(err));
        }
    });
}
window.deleteProduct = deleteProduct;

function searchAndSort() {
    const searchInput = (document.getElementById('search-input')?.value || "").toLowerCase();
    const sortSelect = (document.getElementById('sort-select')?.value || "");

    let result = [...allProduct];

    if (searchInput) {
        result = result.filter(p => (p.name || "").toLowerCase().includes(searchInput));
    }

    if (sortSelect === "price-asc") {
        result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortSelect === "price-desc") {
        result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortSelect === "name-asc") {
        result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    } else if (sortSelect === "name-desc") {
        result.sort((a, b) => String(b.name || "").localeCompare(String(a.name || "")));
    }

    if (result.length > 0) {
        renderProduct(result);
    } else {
        document.getElementById("list-product").innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-gray-600">
          Không tìm thấy sẩn phẩm.
        </td>
      </tr>
    `;
    }
}
window.searchAndSort = searchAndSort;

document.getElementById('search-input')?.addEventListener('input', searchAndSort);
document.getElementById('sort-select')?.addEventListener('change', searchAndSort);

const baseValidation    = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5";
const errorValidation   = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5";
const successValidation = "bg-green-50 border border-green-500 text-green-900 placeholder-green-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5";

const regex = {
    nameType: /^[\w\s\-]{2,100}$/,
    price: /^[0-9]+$/,
};

const fields = ["name","price","type","screen","backCamera","frontCamera","image"];

function setError(input, msg) {
    input.className = errorValidation;
    const errEl = document.getElementById(`${input.id}-error`);
    const successEl = document.getElementById(`${input.id}-success`);
    if (successEl) successEl.classList.add("hidden");
    if (errEl) { errEl.textContent = msg || "Invalid input!"; errEl.classList.remove("hidden"); }
}
function setSuccess(input, msg) {
    input.className = successValidation;
    const errEl = document.getElementById(`${input.id}-error`);
    const successEl = document.getElementById(`${input.id}-success`);
    if (errEl) errEl.classList.add("hidden");
    if (successEl) { successEl.textContent = msg || "Valid!"; successEl.classList.remove("hidden"); }
}
function clearValidation(input) {
    if (!input) return;
    input.className = baseValidation;
    document.getElementById(`${input.id}-error`)?.classList.add("hidden");
    document.getElementById(`${input.id}-success`)?.classList.add("hidden");
}
function clearAllValidation() {
    fields.forEach(id => clearValidation($(id)));
}

function validateField(input) {
    const value = (input.value || "").trim();
    switch (input.id) {
        case "name":
            if (!regex.nameType.test(value)) return setError(input, "Tên 2–100 ký tự (chữ/số/_/–/khoảng trắng)!"), false;
            return setSuccess(input, "Hợp lệ!"), true;
        case "price":
            if (!regex.price.test(value) || Number(value) <= 0) return setError(input, "Giá là số nguyên > 0"), false;
            return setSuccess(input, "Hợp lệ!"), true;
        case "type":
            if (!regex.nameType.test(value)) return setError(input, "Loại 2–100 ký tự"), false;
            return setSuccess(input, "Hợp lệ!"), true;
        case "screen":
            if (!value) return setError(input, "Vui lòng nhập màn hình!"), false;
            return setSuccess(input, "Hợp lệ!"), true;
        case "backCamera":
            if (!value) return setError(input, "Vui lòng nhập camera sau!"), false;
            return setSuccess(input, "Hợp lệ!"), true;
        case "frontCamera":
            if (!value) return setError(input, "Vui lòng nhập camera trước!"), false;
            return setSuccess(input, "Hợp lệ!"), true;
        case "image":
            if (!value) return setError(input, "Vui lòng thêm hình ảnh!"), false;
            return setSuccess(input, "Hợp lệ!"), true;
        default:
            return true;
    }
}

function validateForm() {
    let ok = true;
    fields.forEach(id => { const el = $(id); if (el && !validateField(el)) ok = false; });
    return ok;
}

(function bindLive() {
    fields.forEach(id => {
        const el = $(id);
        if (!el) return;
        el.addEventListener("input", () => validateField(el));
        el.addEventListener("blur",  () => validateField(el));
    });
})();

document.getElementById('btnAddProduct')?.addEventListener('click', () => {
    $('productForm')?.reset();
    clearAllValidation();
    isEditing = false;
    editId = null;
    $('productModalTitle').innerText = "Thêm Sản Phẩm";
    $('btnSaveProduct').innerText = "Thêm Mới";
});

document.getElementById('btnSaveProduct')?.addEventListener('click', () => {
    if (!validateForm()) {
        const firstErrId = fields.find(id => !validateField($(id)));
        if (firstErrId) $(firstErrId)?.focus();
        return;
    }

    const product = getFormData();

    const request = isEditing
        ? productService.update({ ...product, id: editId || product.id })
        : productService.add(product);

    request.then(() => {
        loadProduct();
        document.querySelector('[data-modal-hide="productModal"]')?.click();
        modal?.classList.add('hidden');

        Swal.fire({
            icon: "success",
            title: isEditing ? "Cập Nhật Sản Phẩm Thành Công!!" : "Thêm Sản Phẩm Thành Công!!",
            showConfirmButton: false,
            timer: 1500
        });

        $('productForm')?.reset();
        clearAllValidation();
        isEditing = false;
        editId = null;
    }).catch(err => console.error(err));
});
