# 🚀 Authorization với Google

## 📌 Giới thiệu

Dự án này là ứng dụng MERN Stack cho phép người dùng thực hiện **authentication**,  
Mục tiêu: Tìm hiểu về **authentication** với Google - cấu trúc rõ ràng, tách service, middleware, controller đầy đủ.

---

## 🖼️ Demo / Screenshot

Link:

![demo1](./screenshots/demo1.PNG)
![demo1](./screenshots/demo2.PNG)

---

## 🛠️ Tech Stack

### Frontend

- React + TypeScript
- Vite
- Zustand (quản lý state)
- Axios + interceptor (refresh token)
- React Router DOM

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Bcrypt / Crypto (hash password)
- Cookie HttpOnly / refresh token
- OAuth / Google Auth

---

## 🚀 Cài đặt & Chạy dự án

### **1. Clone project**

```bash
git clone https://github.com/taikhoanchuafile/authgg.git
cd authgg
```

### **2.Backend setup**

```bash
cd backend
npm install
```

- Vào authgg/backend tạo file .env

```bash
PORT=5001
# port của api backend (http://localhost:PORT)

GOOGLE_CLIENT_ID=<client_id của Google>
# client_id lấy từ https://console.cloud.google.com/ .VD:xxxxxxxxxxxx-ap44gugk6d5m56husl04bqkohgi0bd35.apps.googleusercontent.com

MONGODB_URL= <url csdl của mongodb>
# Key URL mongodb. Vd:mongodb+srv:....@cluster0.jerdkbp.mongodb.net/devGG?appName=Cluster0

FRONTEND_URL=http://localhost:5173
#port frontend React

ACCESS_TOKEN_SECRET= <key access tokeb>
# VD:c39acd4a56d3a428767a9a5bd7f37a6b9ea40d1278401aeef (chuỗi bất kỳ)
```

- Chạy backend(/authgg/backend)

```base
npm run dev
```

### **3.Setup frontend**

```bash
cd ../frontend
npm install
```

- Vào authgg/frontend tạo file **_.env_**

```base
VITE_GOOGLE_CLIENT_ID=<client_id>
# VD: xxxxxxxxxxxx-ap44gugk6d5m56husl04bqkohgi0bd35.apps.googleusercontent.com

VITE_BACKEND_API_BASE_URL=http://localhost:5001/api
# Nếu PORT Backend thay đổi: http://localhost:<PORT>/api
```

- Chạy Frontend(/authgg/frontend)

```base
npm run dev
```

- Ctrl + click chuột trái vào URL: _http://localhost:5173_ để mở dự án trên trình duyệt

## 📄 License

Dự án phát hành theo giấy phép [MIT](./LICENSE).
