import * as Yup from 'yup';
import * as yup from 'yup';

// Schema cho thêm mới user
export const userSchema = Yup.object().shape({
    username: Yup.string().when(['isVerifiedByAdmin'], (isVerifiedByAdmin, schema) => {
        if (isVerifiedByAdmin[0]) {
            return schema.required('Tên đăng nhập là bắt buộc');
        }
        return schema.nullable();
    }),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().when(['isVerifiedByAdmin'], (isVerifiedByAdmin, schema) => {
        if (isVerifiedByAdmin[0]) {
            return schema.min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc');
        }
        return schema.nullable();
    }),
    fullname: Yup.string().required('Họ tên là bắt buộc'),
    citizen_id: Yup.string()
        .matches(/^[0-9]+$/, 'CMND/CCCD phải là số')
        .required('CMND/CCCD là bắt buộc'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 số')
        .required('Số điện thoại là bắt buộc'),
    role: Yup.string().oneOf(['admin', 'staff', 'user'], 'Vai trò không hợp lệ').required('Vai trò là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    dateOfBirth: Yup.date()
        .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại')
        .required('Ngày sinh là bắt buộc'),
    status: Yup.string().oneOf(['active', 'inactive', 'banned'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),
    contactEmergency: Yup.object().shape({
        name: Yup.string().required('Tên người liên hệ là bắt buộc'),
        relationship: Yup.string().required('Mối quan hệ là bắt buộc'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 số')
            .required('Số điện thoại liên hệ là bắt buộc')
    }),
    isVerifiedByAdmin: Yup.boolean(),
    avatar: Yup.string().url('Avatar phải là URL hợp lệ').nullable()
});

// Schema riêng cho edit user - password không bắt buộc
export const editUserSchema = Yup.object().shape({
    username: Yup.string().when(['isVerifiedByAdmin'], (isVerifiedByAdmin, schema) => {
        if (isVerifiedByAdmin[0]) {
            return schema.required('Tên đăng nhập là bắt buộc');
        }
        return schema.nullable();
    }),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    // Password không bắt buộc khi edit, nhưng nếu có thì phải đủ độ dài
    password: Yup.string().when(['isVerifiedByAdmin'], (isVerifiedByAdmin, schema) => {
        if (isVerifiedByAdmin[0]) {
            return schema
                .nullable()
                .notRequired()
                .test('password-length', 'Mật khẩu phải có ít nhất 6 ký tự', function (value) {
                    if (value && value.length > 0) {
                        return value.length >= 6;
                    }
                    return true; // Cho phép empty khi edit
                });
        }
        return schema.nullable();
    }),
    fullname: Yup.string().required('Họ tên là bắt buộc'),

    citizen_id: Yup.string().required('CMND/CCCD là bắt buộc'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 số')
        .required('Số điện thoại là bắt buộc'),
    role: Yup.string().oneOf(['admin', 'staff', 'user'], 'Vai trò không hợp lệ').required('Vai trò là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    dateOfBirth: Yup.date()
        .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại')
        .required('Ngày sinh là bắt buộc'),
    status: Yup.string().oneOf(['active', 'inactive', 'banned'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),
    contactEmergency: Yup.object().shape({
        name: Yup.string().required('Tên người liên hệ là bắt buộc'),
        relationship: Yup.string().required('Mối quan hệ là bắt buộc'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 số')
            .required('Số điện thoại liên hệ là bắt buộc')
    }),
    isVerifiedByAdmin: Yup.boolean(),
    avatar: Yup.string().url('Avatar phải là URL hợp lệ').nullable()
});

export const verifySchema = yup.object().shape({
    username: yup
        .string()
        .required('Vui lòng nhập tên đăng nhập')
        .min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự')
        .max(20, 'Tên đăng nhập tối đa 20 ký tự'),
    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});