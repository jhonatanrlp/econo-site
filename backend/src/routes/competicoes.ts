import { Router, Request, Response } from "express";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// Stub data — replace with DB or Sheets when available
const COMPETICOES = [
  {
    id: "ndu-2026",
    name: "NDU",
    year: 2026,
    sport: "Geral",
    startDate: "2026-03-01",
    endDate: "2026-11-30",
    status: "ongoing",
  },
  {
    id: "fupe-2026",
    name: "FUPE",
    year: 2026,
    sport: "Geral",
    startDate: "2026-04-01",
    status: "ongoing",
  },
  {
    id: "econo-2026",
    name: "ECONO",
    year: 2026,
    sport: "Geral",
    startDate: "2026-06-01",
    status: "upcoming",
  },
];

// GET /api/competicoes
router.get("/", requireAuth, async (_req: Request, res: Response) => {
  res.json({ success: true, data: COMPETICOES });
});

// GET /api/competicoes/:id
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const comp = COMPETICOES.find((c) => c.id === req.params.id);
  if (!comp) {
    res.status(404).json({ success: false, message: "Competição não encontrada" });
    return;
  }
  res.json({ success: true, data: comp });
});

// GET /api/competicoes/:id/standings
// Tournament standings for a specific competition (ECONO)
router.get(
  "/:id/standings",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    // TODO: integrate with ECONO scenario state (read from DB or Sheets)
    res.json({
      success: true,
      data: [],
      message: "Integração com ECONO em desenvolvimento",
    });
  }
);

export default router;
