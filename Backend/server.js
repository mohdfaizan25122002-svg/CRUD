require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./Config/db");

const authRoutes = require("./routes/authRoutes");
const salesforceRoutes = require("./routes/salesforceRoutes");
const recordsRoutes = require("./routes/recordsRoutes");

const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ==========================
// TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend server is running",
  });
});

// ==========================
// AUTH ROUTES
// ==========================
app.use("/api/auth", authRoutes);

// ==========================
// SALESFORCE ROUTES
// ==========================
app.use("/api/salesforce", salesforceRoutes);

// CRUD routes used by the React dashboard.
app.use("/api/records", recordsRoutes);

// ==========================
// 404
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : "Internal server error.",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exitCode = 1;
  }
};

if (require.main === module) startServer();

module.exports = { app, startServer };
