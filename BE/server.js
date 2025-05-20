const express = require("express");
const app = express();
const router = require("./src/routers/api.js");
const connectDB = require("./config/db.js");

app.get("/", async (req, res) => {
  try {
    res.send({ message: "Welcome to Boarding House Management System!" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.use(express.json());

app.use("/", router);

const PORT = process.env.PORT || 9999;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
