import { users, athletes, type User, type Athlete, type Role } from "@/data/mock";

const KEY = "atletica_session_v2";

export type Session = {
  userId: string;
  role: Role;
  name: string;
  athleteId?: string;
  modalidadeId?: string;
};

export function login(name: string, cpf: string): Session | null {
  const cleanCpf = cpf.replace(/\D/g, "");
  const user = users.find(
    (u) => u.name.toLowerCase().trim() === name.toLowerCase().trim() && u.cpf === cleanCpf
  );
  if (!user) return null;
  const session: Session = {
    userId: user.id,
    role: user.role,
    name: user.name,
    athleteId: user.athleteId,
    modalidadeId: user.modalidadeId,
  };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; } catch { return null; }
}

export function getAthlete(session: Session | null): Athlete | null {
  if (!session?.athleteId) return null;
  return athletes.find((a) => a.id === session.athleteId) ?? null;
}

export function logout() {
  localStorage.removeItem(KEY);
}

// Rota inicial conforme role
export function homeFor(role: Role): string {
  if (role === "atleta") return "/sistema/atleta";
  if (role === "dm") return "/sistema/dm";
  return "/sistema/gestao";
}

export function getDemoUsers(): User[] {
  return [
    users.find((u) => u.role === "atleta")!,
    users.find((u) => u.role === "dm")!,
    users.find((u) => u.role === "gestao")!,
  ];
}
