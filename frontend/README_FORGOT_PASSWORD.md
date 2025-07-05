# Hướng dẫn sử dụng chức năng Quên mật khẩu

## Tổng quan

Chức năng quên mật khẩu cho phép người dùng đặt lại mật khẩu thông qua email khi quên mật khẩu đăng nhập.

## Luồng hoạt động

1. **Quên mật khẩu**: Người dùng nhập email → hệ thống gửi email chứa link reset
2. **Đặt lại mật khẩu**: Người dùng click link trong email → nhập mật khẩu mới

## Các trang đã tạo

### 1. ForgotPasswordPage (`/forgot-password`)
- Form nhập email
- Validation email
- Gửi yêu cầu reset password
- Hiển thị thông báo thành công/lỗi

### 2. ResetPasswordPage (`/reset-password/:token`)
- Form nhập mật khẩu mới
- Validation mật khẩu (độ mạnh, xác nhận)
- Đặt lại mật khẩu
- Chuyển hướng về trang đăng nhập

## API Endpoints

### Forgot Password
```javascript
POST /auth/forgot-password
{
  "email": "user@example.com"
}
```

### Reset Password
```javascript
POST /auth/reset-password
{
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123"
}
```

## Validation Rules

### Email
- Bắt buộc nhập
- Định dạng email hợp lệ
- Tồn tại trong hệ thống

### Mật khẩu mới
- Ít nhất 6 ký tự
- Bao gồm chữ hoa, chữ thường và số
- Phải khớp với mật khẩu xác nhận

## Tính năng bảo mật

1. **Token hết hạn**: Token reset có thời hạn 10 phút
2. **Mật khẩu mạnh**: Yêu cầu mật khẩu đủ mạnh
3. **Email thông báo**: Gửi email xác nhận khi reset thành công
4. **Validation**: Kiểm tra dữ liệu đầu vào

## Cách sử dụng

### 1. Từ trang đăng nhập
- Click link "Quên mật khẩu?"
- Nhập email đã đăng ký
- Kiểm tra email và click link reset

### 2. Từ email
- Mở email từ hệ thống
- Click link "Đặt lại mật khẩu"
- Nhập mật khẩu mới
- Xác nhận mật khẩu

## Lưu ý

- Token reset chỉ có hiệu lực 10 phút
- Mỗi token chỉ sử dụng được 1 lần
- Email reset sẽ được gửi đến địa chỉ email đã đăng ký
- Nếu không nhận được email, kiểm tra spam folder

## Troubleshooting

### Không nhận được email
1. Kiểm tra email đã nhập đúng chưa
2. Kiểm tra spam folder
3. Thử lại sau vài phút

### Link không hoạt động
1. Token có thể đã hết hạn
2. Token đã được sử dụng
3. Yêu cầu link mới từ trang quên mật khẩu

### Lỗi validation
1. Mật khẩu không đủ mạnh
2. Mật khẩu xác nhận không khớp
3. Email không đúng định dạng 