
# 🌐 Website Demo

🔗 [[https://capstone-cybersoft.vercel.app/](https://capstone-cybersoft.vercel.app/)]

---

# 📷 Tham khảo giao diện

![Giao diện mẫu](![Uploading image.png…]())

---

# 📎 Link Task Notion

👉 [Click để xem Notion Taskboard]([https://salty-payment-257.notion.site/2170b462417e80918ac0f262c4ad5b57?v=2170b462417e81aa81d3000c5b50db58](https://equable-hovercraft-bc8.notion.site/24a99b1fa17681519827d33512dc9e99?v=24a99b1fa17681fa9d90000cee2cf233))

---

# 🛠️ Công nghệ & Thư viện sử dụng

- **Ngôn ngữ & Kỹ thuật:**
  - HTML5, CSS3, JavaScript (ES6+)
  - Responsive Design

- **Framework & Thư viện chính:**
  - [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
  - [Flowbite](https://flowbite.com/) – UI components dựa trên Tailwind
  - [jQuery](https://jquery.com/) – Thư viện JS phổ biến
  - [Waypoints](http://imakewebthings.com/waypoints/) – Scroll-based event triggers
  - [JOS Animation](https://github.com/jos-studio/jos-animation) – Scroll animation nhẹ
  - [Google Fonts](https://fonts.google.com/) – Phông chữ web
  - [Axios] - Kết Nối API
---

# 🚀 Quy trình làm việc với Git

## 📌 Trước khi bắt đầu code

> **chỉ pull khi đã làm xong tính năng ở branch của mình, nếu chưa làm xong thì không cần mà cứ tiếp tục làm.**

```bash
git pull origin main
```

## 🌿 Tạo branch mới

```bash
git checkout -b <ten-branch>
```

**Ví dụ:**  
```bash
git checkout -b header
```

---

## 💻 Trong quá trình code

> Dù chưa xong vẫn **phải commit thường xuyên** để tránh mất dữ liệu.

```bash
git add .
git commit -m "Thông tin rõ ràng về nội dung commit"
```

❌ Tránh các nội dung commit không rõ ràng như:
- `asd`
- `123123`
- `aaa`

✅ Ví dụ nội dung commit:
- `"add Header UI"`
- `"fix responsive issue for mobile"`
- `"update login validation"`

---

## 📤 Push code lên Git

```bash
git push origin <ten-branch>
```

**Ví dụ:**
```bash
git push origin header
```

---

## 🔁 Kiểm tra & chuyển branch

- Kiểm tra đang ở branch nào:
  ```bash
  git branch
  ```
- Chuyển sang branch khác:
  ```bash
  git checkout <ten-branch>
  ```
