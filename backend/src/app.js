require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const morgan = require("morgan");
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;