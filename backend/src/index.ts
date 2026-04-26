import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth";
import athletesRouter from "./routes/athletes";
import modalidadesRouter from "./routes/modalidades";
import competicoesRouter from "./routes/competicoes";

const app = express();
const PORT = process.env.PORT ?? 3001;

// ---- Middleware ----
app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

// ---- Routes ----
app.use("/api/login", authRouter);
app.use("/api/athletes", athletesRouter);
app.use("/api/modalidades", modalidadesRouter);
app.use("/api/competicoes", competicoesRouter);

// ---- Health check ----
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ---- 404 catch-all ----
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`[backend] running on http://localhost:${PORT}`);
});
