import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { fetchAthletes } from "../services/sheets";

const router = Router();

// Hardcoded modalities (can be moved to a sheet or DB later)
const MODALIDADES = [
  { id: "ff",  name: "Futsal Feminino",       sport: "Futsal",   category: "Feminino" },
  { id: "fm",  name: "Futsal Masculino",       sport: "Futsal",   category: "Masculino" },
  { id: "fc",  name: "Futebol de Campo",       sport: "Futebol",  category: "Masculino" },
  { id: "vf",  name: "Vôlei Feminino",         sport: "Vôlei",    category: "Feminino" },
  { id: "vm",  name: "Vôlei Masculino",        sport: "Vôlei",    category: "Masculino" },
  { id: "hf",  name: "Handebol Feminino",      sport: "Handebol", category: "Feminino" },
  { id: "hm",  name: "Handebol Masculino",     sport: "Handebol", category: "Masculino" },
  { id: "bf",  name: "Basquete Feminino",      sport: "Basquete", category: "Feminino" },
  { id: "bm",  name: "Basquete Masculino",     sport: "Basquete", category: "Masculino" },
  { id: "tcf", name: "Tênis de Campo Fem.",    sport: "Tênis",    category: "Feminino" },
  { id: "tcm", name: "Tênis de Campo Masc.",   sport: "Tênis",    category: "Masculino" },
  { id: "tmf", name: "Tênis de Mesa Fem.",     sport: "Ping-Pong",category: "Feminino" },
  { id: "tmm", name: "Tênis de Mesa Masc.",    sport: "Ping-Pong",category: "Masculino" },
  { id: "judo",name: "Judô",                   sport: "Judô",     category: "Misto" },
  { id: "jj",  name: "Jiu-Jitsu",              sport: "Jiu-Jitsu",category: "Misto" },
  { id: "rug", name: "Rugby",                  sport: "Rugby",    category: "Misto" },
  { id: "xad", name: "Xadrez",                 sport: "Xadrez",   category: "Misto" },
  { id: "ntm", name: "Natação Masculina",      sport: "Natação",  category: "Masculino" },
  { id: "ntf", name: "Natação Feminina",       sport: "Natação",  category: "Feminino" },
];

// GET /api/modalidades
router.get("/", requireAuth, async (_req: Request, res: Response) => {
  res.json({ success: true, data: MODALIDADES });
});

// GET /api/modalidades/:id
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const mod = MODALIDADES.find((m) => m.id === req.params.id);
  if (!mod) {
    res.status(404).json({ success: false, message: "Modalidade não encontrada" });
    return;
  }
  res.json({ success: true, data: mod });
});

// GET /api/modalidades/:id/athletes
// Returns athletes registered in this modality
router.get(
  "/:id/athletes",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const modId = req.params.id;
      const mod = MODALIDADES.find((m) => m.id === modId);
      if (!mod) {
        res.status(404).json({ success: false, message: "Modalidade não encontrada" });
        return;
      }

      const athletes = await fetchAthletes();
      const filtered = athletes.filter((a) =>
        a.modalidades.some((m) =>
          m.toLowerCase().includes(mod.sport.toLowerCase())
        )
      );

      res.json({ success: true, data: filtered, total: filtered.length });
    } catch (err) {
      console.error("[GET /modalidades/:id/athletes]", err);
      res.status(500).json({ success: false, message: "Erro interno" });
    }
  }
);

export default router;
