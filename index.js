// dotenv MUST be the first import so env variables load before anything else
import "dotenv/config";

import "./config/dbConnect.js";
import express from "express";
import cors from "cors";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import router from "./routes/main.js";

const app = express();
const port = process.env.PORT || 7000;

// Render runs behind a proxy; needed so rate limiting sees the real user IP
app.set("trust proxy", 1);

// Load swagger file
const swaggerDocument = JSON.parse(
  fs.readFileSync(
    new URL("./controller/swagger/swagger.json", import.meta.url),
    "utf-8"
  )
);

// Security headers (CSP off so Swagger UI works; cross-origin on so images load in your frontend)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS: set FRONTEND_URL in Render to restrict. If not set, allows all origins.
app.use(
  cors(
    process.env.FRONTEND_URL
      ? { origin: process.env.FRONTEND_URL.split(",") }
      : {}
  )
);

app.use(express.json());

// Rate limits for sensitive routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
});
app.use("/api/seller/login", authLimiter);
app.use("/api/seller/verifyOTP", authLimiter);
app.use("/api/seller/verifyEmail", authLimiter);
app.use("/api/seller/resetPassword", authLimiter);

// Health check (set Render's Health Check Path to /health)
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  })
);

// API routes
app.use("/api", router);

// Static files
app.use("/profile", express.static("public/profile"));
app.use("/image", express.static("public/product"));
app.use("/category_Image", express.static("public/category"));

// 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: "Server error" });
});

app.listen(port, () => {
  console.log("server running", port);
});