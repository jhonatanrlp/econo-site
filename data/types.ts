// Modelos de dados canônicos do sistema.
// Usados tanto pelo frontend (mock) quanto pelo backend (real).

export type AthleteStatus = "ativo" | "pendente" | "inscrito" | "inativo";

export interface Athlete {
  id: string;
  nome: string;
  cpf: string;       // só dígitos
  modalidade: string;
  equipe: string;
  foto: string | null;
  status: AthleteStatus;
}

export interface Competition {
  id: string;
  nome: "NDU" | "FUPE" | "ECONO";
  ano: number;
}

export type EnrollmentStatus = "inscrito" | "pendente" | "cancelado";

export interface Enrollment {
  athleteId: string;
  competitionId: string;
  status: EnrollmentStatus;
}

export type PendingType = "pagamento" | "documento" | "exame";

export interface Pending {
  athleteId: string;
  tipo: PendingType;
  descricao: string;
  status: "pendente" | "resolvido";
}

// Auth
export type Role = "atleta" | "dm" | "gestao";

export interface Session {
  userId: string;
  role: Role;
  nome: string;
  athleteId?: string;
  modalidadeId?: string;
  token?: string;
}
