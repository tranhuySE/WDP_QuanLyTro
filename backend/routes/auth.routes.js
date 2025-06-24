const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/auth.controller.js");

router.post("/login", loginUser);

module.exports = router;
