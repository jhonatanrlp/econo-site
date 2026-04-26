import { Router, Response } from "express";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";
import { fetchAthletes, fetchCadastros } from "../services/sheets";

const router = Router();

// GET /api/athletes
// Returns all athletes (gestao only)
router.get(
  "/",
  requireAuth,
  requireRole("gestao", "dm"),
  async (_req: AuthRequest, res: Response) => {
    try {
      const athletes = await fetchAthletes();
      res.json({ success: true, data: athletes, total: athletes.length });
    } catch (err) {
      console.error("[GET /athletes]", err);
      res.status(500).json({ success: false, message: "Erro ao buscar atletas" });
    }
  }
);

// GET /api/athletes/me
// Returns the current athlete's data (atleta role)
router.get(
  "/me",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const athletes = await fetchAthletes();
      const me = athletes.find((a) => a.nduId === req.user!.userId);

      if (!me) {
        res.status(404).json({ success: false, message: "Atleta não encontrado" });
        return;
      }

      res.json({ success: true, data: me });
    } catch (err) {
      console.error("[GET /athletes/me]", err);
      res.status(500).json({ success: false, message: "Erro interno" });
    }
  }
);

// GET /api/athletes/:id
// Returns a specific athlete (dm or gestao)
router.get(
  "/:id",
  requireAuth,
  requireRole("dm", "gestao"),
  async (req: AuthRequest, res: Response) => {
    try {
      const athletes = await fetchAthletes();
      const athlete = athletes.find((a) => a.nduId === req.params.id);

      if (!athlete) {
        res.status(404).json({ success: false, message: "Atleta não encontrado" });
        return;
      }

      res.json({ success: true, data: athlete });
    } catch (err) {
      console.error("[GET /athletes/:id]", err);
      res.status(500).json({ success: false, message: "Erro interno" });
    }
  }
);

// GET /api/athletes/cadastros
// Returns pending registrations from the cadastro sheet (gestao only)
router.get(
  "/cadastros",
  requireAuth,
  requireRole("gestao"),
  async (_req: AuthRequest, res: Response) => {
    try {
      const cadastros = await fetchCadastros();
      res.json({ success: true, data: cadastros, total: cadastros.length });
    } catch (err) {
      console.error("[GET /athletes/cadastros]", err);
      res.status(500).json({ success: false, message: "Erro ao buscar cadastros" });
    }
  }
);

export default router;
