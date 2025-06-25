import * as Yup from "yup";

// Schema validation này phải khớp với yêu cầu của backend
export const roomValidationSchema = Yup.object({
  roomNumber: Yup.string().required("Số phòng là bắt buộc"),
  floor: Yup.number()
    .typeError("Tầng phải là một con số")
    .integer("Tầng phải là số nguyên")
    .min(0, "Tầng không được là số âm")
    .required("Tầng là bắt buộc"),
  area: Yup.number()
    .typeError("Diện tích phải là một con số")
    .positive("Diện tích phải là số dương")
    .required("Diện tích là bắt buộc"),
  price: Yup.number()
    .typeError("Giá phòng phải là một con số")
    .min(0, "Giá phòng không được là số âm")
    .required("Giá phòng là bắt buộc"),
  maxOccupants: Yup.number()
    .typeError("Số người phải là một con số")
    .integer("Số người tối đa phải là số nguyên")
    .min(1, "Phải có ít nhất 1 người")
    .required("Số người tối đa là bắt buộc"),
  status: Yup.string()
    .oneOf(
      ["available", "occupied", "under_maintenance"],
      "Trạng thái không hợp lệ"
    )
    .required("Trạng thái là bắt buộc"),
  description: Yup.string().optional(),
  images: Yup.array().of(Yup.string().url("Phải là một URL hợp lệ")).optional(),

  amenities: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Tên tiện ích là bắt buộc"),
        quantity: Yup.number()
          .typeError("Số lượng phải là một con số")
          .integer("Số lượng phải là số nguyên")
          .min(1, "Số lượng ít nhất là 1")
          .required("Số lượng là bắt buộc"),
        status: Yup.string()
          .oneOf(["available", "unavailable"], "Trạng thái không hợp lệ")
          .required("Trạng thái tiện ích là bắt buộc"),
      })
    )
    .optional(),

  assets: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string()
          .oneOf(
            ["motorbike", "car", "bicycle", "other"],
            "Loại tài sản không hợp lệ"
          )
          .required("Loại tài sản là bắt buộc"),
        description: Yup.string().optional(),
        quantity: Yup.number()
          .typeError("Số lượng phải là một con số")
          .integer("Số lượng phải là số nguyên")
          .min(1, "Số lượng ít nhất là 1")
          .default(1),
        licensePlate: Yup.string().optional(),
      })
    )
    .optional(),
});
