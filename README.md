# Capstone Cybersoft — E‑Commerce Frontend

[![Live Demo](https://img.shields.io/badge/demo-vercel-success)](https://capstone-cybersoft.vercel.app)
[![Built with TailwindCSS](https://img.shields.io/badge/TailwindCSS-CDN-blue)](https://tailwindcss.com/)
[![Flowbite](https://img.shields.io/badge/Flowbite-UI%20Components-0ea5e9)](https://flowbite.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

> Dự án web tĩnh mô phỏng **cửa hàng online** (Home + Cart + Admin CRUD đơn giản).  
> Ưu tiên **chạy nhanh** qua server tĩnh (Live Server / Vercel), không cần build phức tạp.

---

## ✨ Tính năng

- **Home**
  - Render danh sách sản phẩm từ API (MockAPI).
  - **Search** theo tên/mô tả (chuẩn hoá tiếng Việt cơ bản).
  - **Filter** theo loại (type).
  - **Cart** lưu `localStorage`, cập nhật số lượng, tính tổng, áp mã giảm (demo).
  - UI sử dụng **Tailwind + Flowbite**, hiệu ứng nhẹ, toast bằng **SweetAlert2**.
- **Admin** (đơn giản)
  - **Create / Update / Delete** sản phẩm qua MockAPI.
  - Modal quản trị, reload danh sách sau thao tác.

> Gợi ý học: chia code theo **model → services → controller → view** để mở rộng dễ dàng.

---

## 🧰 Tech Stack

- **HTML5**, **CSS3/SCSS**, **JavaScript (ES Modules)**
- **TailwindCSS (CDN)** + **Flowbite**
- **Axios** (HTTP) + **SweetAlert2** (thông báo)
- **MockAPI** cho dữ liệu demo sản phẩm

---

## 📁 Cấu trúc thư mục

```
capstone-cybersoft/
├─ index.html
├─ compoment/                 # Các mảnh UI tách rời (HTML/partial)
├─ css/                       # CSS đã build sẵn
├─ images/                    # Hình ảnh dùng cho UI
├─ js/                        # Script chính (ESM)
│  ├─ model/                  # Lớp dữ liệu: Product, CartItem, ...
│  ├─ services/               # productService, cartService (axios)
│  ├─ controller/             # productController, cartController
│  └─ app.js / router.js      # (tuỳ triển khai)
└─ README.md
```

> Tên thư mục `compoment` là theo repo hiện tại; nếu muốn, bạn có thể đổi thành `components` để chuẩn hoá.

---

## 🚀 Chạy nhanh

### Cách 1 — VS Code: Live Server
1. Mở thư mục dự án → chuột phải `index.html` → **Open with Live Server**  
2. Home: `http://localhost:<port>/`  
3. Admin (nếu đặt dưới thư mục `/admin`): `http://localhost:<port>/admin/`

### Cách 2 — Node một lệnh
```bash
npm i -g serve
serve .
# Mặc định: http://localhost:3000
```

### Cách 3 — Vercel (khuyến nghị cho static)
- Kết nối repo GitHub với Vercel, framework = **Other** (static).  
- Vercel sẽ deploy ra URL dạng `https://capstone-cybersoft.vercel.app`

> Lưu ý: nếu dùng **GitHub Pages** và repo nằm dưới path `/capstone-cybersoft/`, hãy dùng **đường dẫn tương đối** (`./css/...`, `./js/...`) hoặc thêm:
>
> ```html
> <base href="/capstone-cybersoft/">
> ```

---

## 🔌 Cấu hình API

Tách **API_BASE** để dễ thay đổi endpoint một lần duy nhất:

```js
// js/services/api.js
export const API_BASE = "https://68908c3c944bf437b59664d4.mockapi.io/api";

// js/services/productService.js
import { API_BASE } from "./api.js";
class ProductService {
  getAll()  { return axios.get(`${API_BASE}/product`); }
  add(p)    { return axios.post(`${API_BASE}/product`, p); }
  update(p) { return axios.put(`${API_BASE}/product/${p.id}`, p); }
  delete(id){ return axios.delete(`${API_BASE}/product/${id}`); }
}
export default new ProductService();
```

---

## 🧪 Kiểm thử nhanh (Checklist)

- [ ] Network trả về danh sách sản phẩm từ MockAPI.
- [ ] Thêm/Xoá/Cập nhật giỏ hàng → `localStorage` thay đổi.
- [ ] Admin CRUD hoạt động, trả về HTTP 200/201.
- [ ] Các component Flowbite hoạt động sau khi render/replace HTML (re-init nếu cần).

---

## 🤝 Quy ước commit & flow Git (tóm tắt)

- Tạo branch theo tính năng: `feature/header`, `fix/cart-update`…
- Commit message rõ ràng: `add header UI`, `fix responsive mobile`, `update login validation`.
- PR vào `main`, review nhanh trước khi merge.

> Xem chi tiết quy trình trong file README cũ (Git guide) nếu cần.

---

## 🗺️ Roadmap (gợi ý)

- [ ] Pagination & skeleton loading
- [ ] Xác thực (Auth) cơ bản cho Admin
- [ ] Unit test cho service
- [ ] CI đơn giản (lint/build) với GitHub Actions

---

## 📸 Screenshots

> Thêm ảnh/GIF demo UI tại đây (home, cart, admin). Ví dụ: `images/demo-home.png`

---

## 📜 License

MIT — tự do fork/sửa/dùng cho mục đích học tập và demo.

---

## 🙌 Tác giả

- **huynhbao2606** — chủ repo  
- Đóng góp PR/issue được chào đón!

---

### Ghi chú học tập
- Chọn **đường dẫn tương đối** để tránh lỗi mất CSS/ảnh khi base path thay đổi.
- Sau khi **inject/replace HTML**, nhớ **re-init Flowbite** (ví dụ `window.initFlowbite?.()`).
- Chia code theo **model → services → controller → view** tăng khả năng mở rộng.
