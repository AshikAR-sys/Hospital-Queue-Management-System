import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "carequeue-api",
    message: "Backend API is running",
  });
});

app.listen(port, () => {
  console.log(`CareQueue API listening on http://localhost:${port}`);
});
