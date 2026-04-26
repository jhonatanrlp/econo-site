import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { findAthleteByCpf } from "../services/data";

const router = Router();

const loginSchema = z.object({
  cpf: z.string().min(11),
  nome: z.string().min(2),
});

// POST /api/login
router.post("/", (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, message: "Dados inválidos" });
    return;
  }

  const { cpf, nome } = parsed.data;
  const athlete = findAthleteByCpf(cpf);

  if (!athlete) {
    res.status(404).json({ ok: false, message: "CPF não encontrado", needsRegistration: true });
    return;
  }

  const nameMatch = athlete.nome.toLowerCase().includes(nome.toLowerCase().split(" ")[0]);
  if (!nameMatch) {
    res.status(401).json({ ok: false, message: "Nome não confere com o CPF" });
    return;
  }

  const payload = { userId: athlete.id, role: "atleta" as const, nome: athlete.nome, athleteId: athlete.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" } as jwt.SignOptions);

  res.json({ ok: true, data: { token, ...payload } });
});

// POST /api/login/check-cpf
router.post("/check-cpf", (req: Request, res: Response) => {
  const cpf = req.body?.cpf as string | undefined;
  if (!cpf) { res.status(400).json({ ok: false, message: "CPF obrigatório" }); return; }

  const athlete = findAthleteByCpf(cpf);
  res.json({ ok: true, data: { exists: !!athlete, nome: athlete?.nome ?? null } });
});

export default router;
