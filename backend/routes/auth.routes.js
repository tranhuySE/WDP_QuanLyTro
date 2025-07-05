const express = require("express");
const router = express.Router();
const { loginUser, forgotPassword, resetPassword } = require("../controllers/auth.controller.js");
const { validateForgotPassword, validateResetPassword, handleValidationErrors } = require("../middlewares/validation.middleware.js");

router.post("/login", loginUser);
router.post("/forgot-password", validateForgotPassword, handleValidationErrors, forgotPassword);
router.post("/reset-password", validateResetPassword, handleValidationErrors, resetPassword);

module.exports = router;
