const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

app.use("/", authRoutes);
app.use("/", subjectRoutes);
app.use("/", timetableRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});