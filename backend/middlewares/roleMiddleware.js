const User = require("../models/User");

const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.userID); // lấy từ verifyToken

            if (!user || !roles.includes(user.role)) {
                return res
                    .status(403)
                    .json({ message: "Forbidden: You are not allowed!" });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: err.toString() });
        }
    };
};

module.exports = { authorizeRoles };
