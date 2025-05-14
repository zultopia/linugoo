require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
// const clientUrl = process.env.CLIENT_URL || (isProduction ? 'your-production-url' : 'http://localhost:5000');

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Connection successful!' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 
    message: err.message,
    stack: isProduction ? '🥞' : err.stack
  });
});

module.exports = app;