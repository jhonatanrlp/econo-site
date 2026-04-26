import { Router, Response } from "express";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";
import { getAthletes, getEnrollments, getPending } from "../services/data";

const router = Router();

// GET /api/athletes  (dm, gestao)
router.get("/", requireAuth, requireRole("dm", "gestao"), (_req: AuthRequest, res: Response) => {
  res.json({ ok: true, data: getAthletes() });
});

// GET /api/athletes/me  (atleta)
router.get("/me", requireAuth, (req: AuthRequest, res: Response) => {
  const athlete = getAthletes().find((a) => a.id === req.user!.userId);
  if (!athlete) { res.status(404).json({ ok: false, message: "Não encontrado" }); return; }

  const enrollments = getEnrollments().filter((e) => e.athleteId === athlete.id);
  const pending = getPending().filter((p) => p.athleteId === athlete.id);

  res.json({ ok: true, data: { ...athlete, enrollments, pending } });
});

// GET /api/athletes/:id  (dm, gestao)
router.get("/:id", requireAuth, requireRole("dm", "gestao"), (req: AuthRequest, res: Response) => {
  const athlete = getAthletes().find((a) => a.id === req.params.id);
  if (!athlete) { res.status(404).json({ ok: false, message: "Não encontrado" }); return; }

  const enrollments = getEnrollments().filter((e) => e.athleteId === athlete.id);
  const pending = getPending().filter((p) => p.athleteId === athlete.id);

  res.json({ ok: true, data: { ...athlete, enrollments, pending } });
});

export default router;
