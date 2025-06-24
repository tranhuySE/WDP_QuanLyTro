const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user)
            return res.status(404).json({ message: "User not found!" });

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch)
        //     return res.status(401).json({ message: "Invalid credentials!" });

        // don't use bcrypt to compare the password
        if (user.password !== password)
            return res.status(401).json({ message: "Invalid credentials!" });

        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                role: user.role,
                email: user.email,
                avatar: user.avatar,
                status: user.status,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.toString() });
    }
};

module.exports = {
    loginUser,
};
