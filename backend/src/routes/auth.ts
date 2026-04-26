import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { findAthleteByCpf } from "../services/sheets";

const router = Router();

const loginSchema = z.object({
  cpf: z.string().min(11),
  name: z.string().min(2),
});

// POST /api/login
// Body: { cpf: string, name: string }
// Returns: { token, role, name, athleteId? }
router.post("/", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Dados inválidos", errors: parsed.error.flatten() });
    return;
  }

  const { cpf, name } = parsed.data;
  const cleanCpf = cpf.replace(/\D/g, "");

  try {
    const athlete = await findAthleteByCpf(cleanCpf);

    if (!athlete) {
      // Not in the database → needs registration
      res.status(404).json({
        success: false,
        message: "CPF não encontrado na base de atletas",
        needsRegistration: true,
      });
      return;
    }

    // Basic name match (case-insensitive, partial)
    const nameMatch = athlete.name.toLowerCase().includes(name.toLowerCase().split(" ")[0]);
    if (!nameMatch) {
      res.status(401).json({ success: false, message: "Nome não confere com o CPF" });
      return;
    }

    const payload = {
      userId: athlete.nduId || cleanCpf,
      role: "atleta" as const,
      name: athlete.name,
      athleteId: athlete.nduId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);

    res.json({
      success: true,
      data: { token, ...payload },
    });
  } catch (err) {
    console.error("[/login]", err);
    res.status(500).json({ success: false, message: "Erro interno ao verificar atleta" });
  }
});

// POST /api/login/check-cpf
// Checks if a CPF exists in the database (for registration flow)
router.post("/check-cpf", async (req: Request, res: Response) => {
  const cpf = req.body?.cpf;
  if (!cpf) {
    res.status(400).json({ success: false, message: "CPF obrigatório" });
    return;
  }

  try {
    const athlete = await findAthleteByCpf(cpf);
    res.json({
      success: true,
      data: { exists: !!athlete, name: athlete?.name ?? null },
    });
  } catch (err) {
    console.error("[/check-cpf]", err);
    res.status(500).json({ success: false, message: "Erro ao verificar CPF" });
  }
});

export default router;
