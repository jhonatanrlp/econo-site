// ============================================================
// SHARED TYPES — used by both frontend and backend
// ============================================================

// ---- Auth & Users ----

export type Role = "atleta" | "dm" | "gestao";

export interface User {
  id: string;
  name: string;
  cpf: string; // digits only, no formatting
  email: string;
  role: Role;
  athleteId?: string;    // populated when role = "atleta"
  modalidadeId?: string; // populated when role = "dm"
  createdAt: string;     // ISO 8601
}

export interface Session {
  userId: string;
  role: Role;
  name: string;
  athleteId?: string;
  modalidadeId?: string;
  token: string; // JWT
}

// ---- Athletes ----

export type AthleteStatus = "ativo" | "pendente" | "inscrito" | "inativo";

export interface Athlete {
  id: string;
  name: string;
  cpf: string;
  email: string;
  photo?: string;
  nduId?: string; // ID na plataforma NDU
  modalidadeIds: string[];
  equipeId?: string;
  competitions: AthleteCompetition[];
  status: AthleteStatus;
  pendings: Pending[];
  registeredAt: string; // ISO 8601
}

export type CompetitionName = "NDU" | "FUPE" | "ECONO" | "Amistoso";

export interface AthleteCompetition {
  name: CompetitionName;
  sport: string;
  ranking?: string;
  year?: number;
}

// ---- Modalidades (Sport Modalities) ----

export type ModalidadeCategory = "Masculino" | "Feminino" | "Misto";

export interface Modalidade {
  id: string;
  name: string;         // e.g. "Futsal Masculino"
  sport: string;        // e.g. "Futsal"
  category: ModalidadeCategory;
  dmId: string;         // Director of Modalidade (User.id)
  competitions: CompetitionName[];
  athleteIds: string[];
  equipeId?: string;    // team in ECONO context
}

// ---- Equipes ----

export interface Equipe {
  id: string;
  name: string;
  modalidadeId: string;
  athleteIds: string[];
}

// ---- Competitions / Events ----

export interface Competicao {
  id: string;
  name: CompetitionName;
  year: number;
  sport: string;
  startDate: string;  // ISO 8601
  endDate?: string;
  venue?: string;
  status: "upcoming" | "ongoing" | "finished";
  result?: CompeticaoResult;
}

export interface CompeticaoResult {
  position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  points: number;
}

// ---- Pending Items ----

export type PendingType = "pagamento" | "documento" | "exame";

export interface Pending {
  id: string;
  type: PendingType;
  description: string;
  dueDate: string; // ISO 8601
  resolved: boolean;
}

// ---- Games ----

export interface Game {
  id: string;
  opponent: string;
  competition: CompetitionName;
  sport: string;
  date: string;   // ISO 8601
  venue: string;
  home: boolean;
  result?: GameResult;
}

export interface GameResult {
  scoreUs: number;
  scoreThem: number;
  won: boolean;
}

// ---- Trophies ----

export type TrophyPosition = 1 | 2 | 3;

export interface Trophy {
  id: string;
  year: number;
  competition: string;
  title: string;
  sport: string;
  position: TrophyPosition;
}

// ---- ECONO Module (Tournament) ----

export type EconoUniversity = "Insper" | "Mackenzie" | "USP" | "FECAP" | "FGV" | "IBMEC" | "PUC" | "ESPM";

export type EconoModalidadeType =
  | "single-elim"
  | "jiu-jitsu"
  | "rugby"
  | "xadrez"
  | "natacao";

export interface EconoModalidade {
  id: string;
  name: string;
  type: EconoModalidadeType;
  bracket?: EconoBracket;
}

export interface EconoBracket {
  left: [EconoUniversity, EconoUniversity][];
  right: [EconoUniversity, EconoUniversity][];
}

export interface EconoStandings {
  university: EconoUniversity;
  points: number;
  breakdown: Record<string, number>; // modalidadeId → points earned
}

export interface EconoScenario {
  id: string;
  name: string;
  modalityState: Record<string, unknown>;
  updatedAt: string;
}

// ---- API Responses ----

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// ---- Google Sheets Integration ----

export interface SheetAthleteRow {
  ndu: string;
  nome: string;
  email: string;
  renovacao: string;
  status: string;
  atleta_id: string;
  modalidades_cadastradas: string;
}
