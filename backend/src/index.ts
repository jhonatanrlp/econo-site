import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth";
import athletesRouter from "./routes/athletes";
import competitionsRouter from "./routes/competitions";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:8080" }));
app.use(express.json());

app.use("/api/login",        authRouter);
app.use("/api/athletes",     athletesRouter);
app.use("/api/competitions", competitionsRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use((_req, res) => res.status(404).json({ ok: false, message: "Rota não encontrada" }));

app.listen(PORT, () => console.log(`backend → http://localhost:${PORT}`));
