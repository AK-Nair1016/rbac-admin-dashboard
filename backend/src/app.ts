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

/* -----------------------------------------------------
   Core Security Configuration
----------------------------------------------------- */

// Trust proxy (required if deployed behind reverse proxy)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Global rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// JSON body parser with size limit
app.use(
  express.json({
    strict: true,
    limit: "10kb",
  })
);

/* -----------------------------------------------------
   Routes
----------------------------------------------------- */

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/entities", entityRoutes);
app.use("/metrics", metricsRoutes);
app.use("/users", userRoutes);
app.use("/permissions", permissionRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

/* -----------------------------------------------------
   404 Handler
----------------------------------------------------- */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* -----------------------------------------------------
   Global Error Handler
----------------------------------------------------- */

app.use((err: any, _req: any, res: any, _next: any) => {
  const isDev = process.env.NODE_ENV !== "production";

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body",
    });
  }

  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(isDev && { stack: err.stack }), // Only show stack in dev
  });
});

export default app;
