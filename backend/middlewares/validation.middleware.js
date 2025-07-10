const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose"); // <-- THÊM DÒNG NÀY ĐỂ FIX LỖI

// Hàm xử lý lỗi validation tập trung
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Quy tắc validation cho Forgot Password
const validateForgotPassword = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),
];

// Quy tắc validation cho Reset Password
const validateResetPassword = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required.")
    .isString()
    .withMessage("Token must be a string.")
    .isLength({ min: 32, max: 64 })
    .withMessage("Token must be between 32 and 64 characters."),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number."),
];

// Quy tắc validation cho Room
const validateRoom = [
  body("roomNumber")
    .notEmpty()
    .withMessage("Room number is required.")
    .isString()
    .withMessage("Room number must be a string."),

  body("floor")
    .notEmpty()
    .withMessage("Floor is required.")
    .isInt({ min: 0 })
    .withMessage("Floor must be a non-negative integer."),

  body("area")
    .notEmpty()
    .withMessage("Area is required.")
    .isFloat({ min: 1 })
    .withMessage("Area must be a positive number."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number."),

  // Sửa lỗi ở đây: kiểm tra xem tenant có phải là mảng các ObjectId hợp lệ không
  body("tenant")
    .optional()
    .isArray()
    .withMessage("Tenant must be an array of user IDs.")
    .custom((value) => {
      // Đảm bảo value là một mảng trước khi dùng .some
      if (Array.isArray(value)) {
        if (value.some((item) => !mongoose.Types.ObjectId.isValid(item))) {
          throw new Error("Invalid user ID in tenant list.");
        }
      }
      return true;
    }),

  body("maxOccupants")
    .notEmpty()
    .withMessage("Max occupants is required.")
    .isInt({ min: 1 })
    .withMessage("Max occupants must be a positive integer."),

  body("status")
    .optional()
    .isIn(["available", "occupied", "under_maintenance"])
    .withMessage("Invalid status value."),

  body("room_service")
    .optional()
    .isArray()
    .withMessage("Room service must be an array of service IDs.")
    .custom((value) => {
      if (Array.isArray(value)) {
        if (value.some((item) => !mongoose.Types.ObjectId.isValid(item))) {
          throw new Error("Invalid service ID in room_service list.");
        }
      }
      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings."),
  body("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string (URL)."),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array."),
  body("amenities.*.name").notEmpty().withMessage("Amenity name is required."),
  body("amenities.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Amenity quantity must be a positive integer."),
  body("amenities.*.status")
    .optional()
    .isIn(["available", "unavailable"])
    .withMessage("Invalid amenity status."),

  body("assets").optional().isArray().withMessage("Assets must be an array."),
  body("assets.*.type")
    .notEmpty()
    .isIn(["motorbike", "car", "bicycle", "other"])
    .withMessage("Invalid asset type."),
  body("assets.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Asset quantity must be a positive integer."),
  body("assets.*.licensePlate")
    .optional()
    .isString()
    .withMessage("License plate must be a string."),
];

// Quy tắc validation cho ID trong params
const validateId = [param("id").isMongoId().withMessage("Invalid ID format.")];

module.exports = {
  validateRoom,
  validateId,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors,
};
