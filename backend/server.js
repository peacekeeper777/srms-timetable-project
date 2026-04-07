require("dotenv").config(); // Load environment variables first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/timetableRoutes"));

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/", require("./routes/aiRoutes"));