import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../shared/src/types";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
    name: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Token ausente" });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: Role;
      name: string;
    };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token inválido ou expirado" });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Não autenticado" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Sem permissão" });
      return;
    }
    next();
  };
}
