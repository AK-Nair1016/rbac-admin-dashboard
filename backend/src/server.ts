import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import app from "./app";

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log("🚀 Server running");
  console.log(`🔗 Health check: ${BASE_URL}/health`);
});
