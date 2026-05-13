require("dotenv").config();

const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api.routes");

const app = express();
//API configuration
const port = Number(process.env.API_PORT) || 3003;
const apiUrl = process.env.API_URL || `http://localhost:${port}`;

//CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3002")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(apiRoutes);

app.listen(port, () => {
  console.log(`API listening at ${apiUrl}`);
});
