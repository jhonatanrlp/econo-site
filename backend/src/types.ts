// Types espelhados de data/types.ts — mantidos aqui para o backend compilar sem depender de pacote externo.

export type AthleteStatus = "ativo" | "pendente" | "inscrito" | "inativo";

export interface Athlete {
  id: string;
  nome: string;
  cpf: string;
  modalidade: string;
  equipe: string;
  foto: string | null;
  status: AthleteStatus;
}

export interface Competition {
  id: string;
  nome: string;
  ano: number;
}

export interface Enrollment {
  athleteId: string;
  competitionId: string;
  status: string;
}

export interface Pending {
  athleteId: string;
  tipo: string;
  descricao: string;
  status: string;
}

export type Role = "atleta" | "dm" | "gestao";
