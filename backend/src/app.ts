// import "./types/express";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import entityRoutes from "./routes/entity.routes";

const app = express();

// 🔴 LOG REQUEST BEFORE ANY PARSING
app.use((req, _res, next) => {
  console.log("➡️ REQUEST:", req.method, req.originalUrl);
  next();
});

// 🔴 SAFE JSON PARSER
app.use(
  express.json({
    strict: true,
  })
);

app.use(cors());

// routes
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/entities", entityRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

// 🔴 JSON ERROR HANDLER (prevents hanging)
app.use((err: any, _req: any, res: any, _next: any) => {
  if (err instanceof SyntaxError && "body" in err) {
    console.error("❌ Invalid JSON body received");
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  console.error("❌ Unknown error", err);
  return res.status(500).json({ message: "Internal server error" });
});

export default app;
