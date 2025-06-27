import * as yup from 'yup';

export const roomValidationSchema = yup.object().shape({
    // --- Các quy tắc đã có ---
    roomNumber: yup.string().trim().required('Vui lòng nhập số phòng.'),
    floor: yup
        .number()
        .typeError('Tầng phải là một con số.')
        .required('Vui lòng nhập số tầng.')
        .moreThan(0, 'Số tầng phải lớn hơn 0.'),
    area: yup
        .number()
        .typeError('Diện tích phải là một con số.')
        .required('Vui lòng nhập diện tích.')
        .positive('Diện tích phải là một số dương.'),
    price: yup
        .number()
        .typeError('Giá phòng phải là một con số.')
        .required('Vui lòng nhập giá phòng.')
        .min(0, 'Giá phòng không được là số âm.'),
    maxOccupants: yup
        .number()
        .typeError('Số người tối đa phải là một con số.')
        .required('Vui lòng nhập số người tối đa.')
        .positive('Số người tối đa phải là số dương.')
        .integer('Số người tối đa phải là số nguyên.'),
    description: yup.string().trim().required('Vui lòng nhập mô tả cho phòng.'),
    status: yup.string(),
    images: yup.array(),
    tenant: yup.array(),

    // Validation cho mỗi mục trong danh sách Tiện ích
    amenities: yup.array().of(
        yup.object().shape({
            name: yup.string().trim().required('Vui lòng nhập tên tiện ích.'),
            quantity: yup
                .number()
                .typeError('Số lượng phải là số.')
                .required('Vui lòng nhập số lượng.')
                .positive('Số lượng phải lớn hơn 0.')
                .integer('Số lượng phải là số nguyên.'),
            status: yup.string().required('Vui lòng chọn trạng thái.'),
        }),
    ),

    // Validation cho mỗi mục trong danh sách Tài sản
    assets: yup.array().of(
        yup.object().shape({
            type: yup.string().required('Vui lòng chọn loại tài sản.'),
            // Biển số và mô tả có thể không bắt buộc, nên chỉ cần định nghĩa là string
            licensePlate: yup.string().trim(),
            description: yup.string().trim(),
        }),
    ),
});
