# Hướng dẫn cấu hình Email cho chức năng Quên mật khẩu

## 1. Cài đặt thư viện

```bash
npm install nodemailer
```

## 2. Tạo file .env

Tạo file `.env` trong thư mục `backend` với nội dung:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/wdp_quanlytro

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-16-characters

# Frontend URL (for reset password link)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 3. Cấu hình Gmail

### Bước 1: Bật 2-Step Verification
1. Đăng nhập vào tài khoản Google
2. Vào Settings > Security
3. Bật "2-Step Verification"

### Bước 2: Tạo App Password
1. Vào Settings > Security > 2-Step Verification
2. Cuộn xuống "App passwords"
3. Chọn "Mail" và "Other (Custom name)"
4. Đặt tên: "WDP Quan Ly Tro"
5. Copy mật khẩu 16 ký tự được tạo
6. Cập nhật `EMAIL_PASS` trong file `.env`

## 4. Test chức năng

### API Forgot Password:
```bash
POST http://localhost:5000/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### API Reset Password:
```bash
POST http://localhost:5000/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "new-password-123"
}
```

## 5. Lưu ý bảo mật

- Không commit file `.env` lên git
- Thay đổi `JWT_SECRET` trong production
- Sử dụng HTTPS trong production
- Giới hạn số lần gửi email reset password 