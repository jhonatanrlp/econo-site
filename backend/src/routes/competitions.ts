import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { getCompetitions, getEnrollments, getAthletes } from "../services/data";

const router = Router();

// GET /api/competitions
router.get("/", requireAuth, (_req: Request, res: Response) => {
  res.json({ ok: true, data: getCompetitions() });
});

// GET /api/competitions/:id
router.get("/:id", requireAuth, (req: Request, res: Response) => {
  const comp = getCompetitions().find((c) => c.id === req.params.id);
  if (!comp) { res.status(404).json({ ok: false, message: "Não encontrada" }); return; }
  res.json({ ok: true, data: comp });
});

// GET /api/competitions/:id/athletes — quem está inscrito nessa competição
router.get("/:id/athletes", requireAuth, (req: Request, res: Response) => {
  const enrollments = getEnrollments().filter((e) => e.competitionId === req.params.id);
  const athletes = getAthletes().filter((a) => enrollments.some((e) => e.athleteId === a.id));
  res.json({ ok: true, data: athletes, total: athletes.length });
});

export default router;
