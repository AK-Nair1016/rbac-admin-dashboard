import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import entityRoutes from "./routes/entity.routes";
import metricsRoutes from "./routes/metrics.routes";
import userRoutes from "./routes/users.routes";
import permissionRoutes from "./routes/permission.routes";

const app = express();

/**
 * 🔒 Trust proxy (important for production)
 */
app.set("trust proxy", 1);

/**
 * 🔒 Security Headers
 */
app.use(helmet());

/**
 * 🔒 Rate Limiter
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

/**
 * 🔒 Strict CORS
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

/**
 * 🔎 Request Logger
 */
app.use((req, _res, next) => {
  console.log("➡️ REQUEST:", req.method, req.originalUrl);
  next();
});

/**
 * 🔒 JSON Parser with size limit
 */
app.use(
  express.json({
    strict: true,
    limit: "10kb",
  })
);

/**
 * ---------------- ROUTES ----------------
 */
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/entities", entityRoutes);
app.use("/metrics", metricsRoutes);
app.use("/users", userRoutes);
app.use("/permissions", permissionRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

/**
 * 🔒 Central Error Handler
 */
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("❌ Error caught:", err);

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal Server Error" });
});

export default app;
