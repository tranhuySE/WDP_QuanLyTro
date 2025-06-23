const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db.js");
const router = require("./routes/index.js");

const allowOrigins = [
    "http://localhost:3000",
]

app.use(cors({
    origin: allowOrigins,
    credentials: true,
}))

app.get("/", async (req, res) => {
    try {
        res.send({ message: "Welcome to Boarding House Management System!" });
    } catch (error) {
        res.send({ error: error.message });
    }
});

app.use(cors()); // 👈 Cho phép tất cả nguồn truy cập (bao gồm localhost:3000)
app.use(express.json());

app.use("/", router);

const PORT = process.env.PORT || 9999;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
