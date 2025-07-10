import * as Yup from 'yup';

export const userSchema = Yup.object().shape({
    username: Yup.string().when([], (fields, schema, context) => {
        if (context.parent.isVerifiedByAdmin) {
            return schema.required('Tên đăng nhập là bắt buộc');
        }
        return schema.nullable();
    }),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().when([], (fields, schema, context) => {
        if (context.parent.isVerifiedByAdmin) {
            return schema.min(6, 'Mật khẩu phải có ít nhất 6 ký tự');
        }
        return schema.nullable();
    }),
    fullname: Yup.string().required('Họ tên là bắt buộc'),
    citizen_id: Yup.string().required('CMND/CCCD là bắt buộc'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
        .required('Số điện thoại là bắt buộc'),
    role: Yup.string().required('Vai trò là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    dateOfBirth: Yup.date().required('Ngày sinh là bắt buộc'),
    status: Yup.string().required('Trạng thái là bắt buộc'),
    contactEmergency: Yup.object().shape({
        name: Yup.string().required('Tên người liên hệ là bắt buộc'),
        relationship: Yup.string().required('Mối quan hệ là bắt buộc'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
            .required('Số điện thoại liên hệ là bắt buộc')
    }),
    isVerifiedByAdmin: Yup.boolean()
});

export const verifySchema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập là bắt buộc'),
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc')
});