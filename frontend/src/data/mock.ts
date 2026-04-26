// Mock data — estruturado como API real para fácil substituição por backend

export type Role = "atleta" | "dm" | "gestao";
export type CompetitionName = "NDU" | "FUPE" | "ECONO" | "Amistoso";
export type AthleteStatus = "ativo" | "pendente" | "inscrito";
export type PendingType = "pagamento" | "documento" | "exame";

export type Game = {
  id: string;
  opponent: string;
  competition: CompetitionName;
  sport: string;
  date: string;
  venue: string;
  home: boolean;
};

export type Trophy = {
  id: string;
  year: number;
  competition: string;
  title: string;
  position: 1 | 2 | 3;
};

export type Pending = {
  type: PendingType;
  description: string;
  dueDate: string;
};

export type AthleteCompetition = {
  name: CompetitionName;
  sport: string;
  ranking: string;
};

export type Athlete = {
  id: string;
  name: string;
  cpf: string;
  photo: string;
  modalidadeIds: string[]; // pode estar em várias modalidades
  equipeId: string; // equipe principal
  competitions: AthleteCompetition[];
  status: AthleteStatus;
  pendings: Pending[];
};

export type Equipe = {
  id: string;
  name: string; // ex: "Sub-23 Masc."
  modalidadeId: string;
};

export type Modalidade = {
  id: string;
  name: string; // ex: "Futsal Masculino"
  sport: string; // ex: "Futsal"
  category: "Masculino" | "Feminino" | "Misto";
  dmId: string; // diretor de modalidade
  competitions: CompetitionName[];
};

export type User = {
  id: string;
  name: string;
  cpf: string;
  role: Role;
  athleteId?: string; // se role=atleta
  modalidadeId?: string; // se role=dm
};

// ============================================================
// MODALIDADES
// ============================================================
export const modalidades: Modalidade[] = [
  { id: "m1", name: "Futsal Masculino", sport: "Futsal", category: "Masculino", dmId: "u-dm-1", competitions: ["NDU", "FUPE", "ECONO"] },
  { id: "m2", name: "Vôlei Feminino", sport: "Vôlei", category: "Feminino", dmId: "u-dm-2", competitions: ["NDU", "ECONO"] },
  { id: "m3", name: "Basquete Masculino", sport: "Basquete", category: "Masculino", dmId: "u-dm-3", competitions: ["NDU", "FUPE"] },
  { id: "m4", name: "Handebol Feminino", sport: "Handebol", category: "Feminino", dmId: "u-dm-4", competitions: ["NDU", "FUPE"] },
  { id: "m5", name: "Natação", sport: "Natação", category: "Misto", dmId: "u-dm-5", competitions: ["NDU", "FUPE", "ECONO"] },
];

// ============================================================
// EQUIPES
// ============================================================
export const equipes: Equipe[] = [
  { id: "e1", name: "Principal", modalidadeId: "m1" },
  { id: "e2", name: "Sub-23", modalidadeId: "m1" },
  { id: "e3", name: "Principal", modalidadeId: "m2" },
  { id: "e4", name: "Principal", modalidadeId: "m3" },
  { id: "e5", name: "Sub-23", modalidadeId: "m3" },
  { id: "e6", name: "Principal", modalidadeId: "m4" },
  { id: "e7", name: "Equipe Única", modalidadeId: "m5" },
];

// ============================================================
// ATLETAS
// ============================================================
export const athletes: Athlete[] = [
  {
    id: "a1",
    name: "João Silva",
    cpf: "12345678900",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m1"],
    equipeId: "e1",
    competitions: [
      { name: "NDU", sport: "Futsal Masculino", ranking: "Titular #10" },
      { name: "FUPE", sport: "Futsal Masculino", ranking: "Capitão" },
    ],
    status: "ativo",
    pendings: [
      { type: "exame", description: "Atestado médico vence em 15 dias", dueDate: "2026-05-10" },
    ],
  },
  {
    id: "a2",
    name: "Maria Santos",
    cpf: "98765432100",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m2"],
    equipeId: "e3",
    competitions: [
      { name: "NDU", sport: "Vôlei Feminino", ranking: "Levantadora" },
      { name: "ECONO", sport: "Vôlei Feminino", ranking: "Titular" },
    ],
    status: "pendente",
    pendings: [
      { type: "pagamento", description: "Mensalidade abril em aberto", dueDate: "2026-04-30" },
      { type: "documento", description: "Termo de responsabilidade pendente", dueDate: "2026-05-05" },
    ],
  },
  {
    id: "a3",
    name: "Pedro Oliveira",
    cpf: "11122233344",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m1"],
    equipeId: "e1",
    competitions: [
      { name: "NDU", sport: "Futsal Masculino", ranking: "Titular #7" },
      { name: "ECONO", sport: "Futsal Masculino", ranking: "Reserva" },
    ],
    status: "ativo",
    pendings: [],
  },
  {
    id: "a4",
    name: "Lucas Mendes",
    cpf: "22233344455",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m1"],
    equipeId: "e2",
    competitions: [{ name: "FUPE", sport: "Futsal Masculino", ranking: "Reserva" }],
    status: "pendente",
    pendings: [{ type: "pagamento", description: "Inscrição FUPE pendente", dueDate: "2026-05-01" }],
  },
  {
    id: "a5",
    name: "Ana Costa",
    cpf: "33344455566",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m2"],
    equipeId: "e3",
    competitions: [{ name: "NDU", sport: "Vôlei Feminino", ranking: "Ponteira" }],
    status: "ativo",
    pendings: [],
  },
  {
    id: "a6",
    name: "Rafael Lima",
    cpf: "44455566677",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m3"],
    equipeId: "e4",
    competitions: [
      { name: "NDU", sport: "Basquete Masculino", ranking: "Pivô" },
      { name: "FUPE", sport: "Basquete Masculino", ranking: "Capitão" },
    ],
    status: "ativo",
    pendings: [{ type: "exame", description: "Renovar atestado médico", dueDate: "2026-06-01" }],
  },
  {
    id: "a7",
    name: "Beatriz Almeida",
    cpf: "55566677788",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m4"],
    equipeId: "e6",
    competitions: [{ name: "NDU", sport: "Handebol Feminino", ranking: "Goleira" }],
    status: "inscrito",
    pendings: [{ type: "documento", description: "Falta termo de imagem", dueDate: "2026-05-15" }],
  },
  {
    id: "a8",
    name: "Thiago Ferreira",
    cpf: "66677788899",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m5"],
    equipeId: "e7",
    competitions: [
      { name: "NDU", sport: "Natação", ranking: "100m livre" },
      { name: "FUPE", sport: "Natação", ranking: "200m medley" },
    ],
    status: "ativo",
    pendings: [],
  },
  {
    id: "a9",
    name: "Carolina Reis",
    cpf: "77788899900",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m4"],
    equipeId: "e6",
    competitions: [
      { name: "NDU", sport: "Handebol Feminino", ranking: "Armadora" },
      { name: "FUPE", sport: "Handebol Feminino", ranking: "Capitã" },
    ],
    status: "ativo",
    pendings: [],
  },
  {
    id: "a10",
    name: "Gabriel Souza",
    cpf: "88899900011",
    photo: "/src/assets/athlete-avatar.jpg",
    modalidadeIds: ["m3"],
    equipeId: "e5",
    competitions: [{ name: "NDU", sport: "Basquete Masculino", ranking: "Ala" }],
    status: "pendente",
    pendings: [
      { type: "pagamento", description: "Mensalidade março/abril", dueDate: "2026-04-25" },
      { type: "documento", description: "RG escaneado pendente", dueDate: "2026-05-02" },
    ],
  },
  // ===== DMs também são atletas da própria modalidade =====
  {
    id: "a-dm-1", name: "Carlos Mendonça", cpf: "10000000001",
    photo: "/src/assets/athlete-avatar.jpg", modalidadeIds: ["m1"], equipeId: "e1",
    competitions: [
      { name: "NDU", sport: "Futsal Masculino", ranking: "Titular #5" },
      { name: "FUPE", sport: "Futsal Masculino", ranking: "Titular" },
    ],
    status: "ativo", pendings: [],
  },
  {
    id: "a-dm-2", name: "Patrícia Vieira", cpf: "10000000002",
    photo: "/src/assets/athlete-avatar.jpg", modalidadeIds: ["m2"], equipeId: "e3",
    competitions: [
      { name: "NDU", sport: "Vôlei Feminino", ranking: "Central" },
      { name: "ECONO", sport: "Vôlei Feminino", ranking: "Capitã" },
    ],
    status: "ativo",
    pendings: [{ type: "exame", description: "Renovar atestado médico", dueDate: "2026-05-20" }],
  },
  {
    id: "a-dm-3", name: "Rodrigo Tavares", cpf: "10000000003",
    photo: "/src/assets/athlete-avatar.jpg", modalidadeIds: ["m3"], equipeId: "e4",
    competitions: [
      { name: "NDU", sport: "Basquete Masculino", ranking: "Armador" },
      { name: "FUPE", sport: "Basquete Masculino", ranking: "Titular" },
    ],
    status: "ativo", pendings: [],
  },
  {
    id: "a-dm-4", name: "Juliana Castro", cpf: "10000000004",
    photo: "/src/assets/athlete-avatar.jpg", modalidadeIds: ["m4"], equipeId: "e6",
    competitions: [
      { name: "NDU", sport: "Handebol Feminino", ranking: "Pivô" },
      { name: "FUPE", sport: "Handebol Feminino", ranking: "Titular" },
    ],
    status: "ativo", pendings: [],
  },
  {
    id: "a-dm-5", name: "Marcelo Pinto", cpf: "10000000005",
    photo: "/src/assets/athlete-avatar.jpg", modalidadeIds: ["m5"], equipeId: "e7",
    competitions: [
      { name: "NDU", sport: "Natação", ranking: "50m livre" },
      { name: "FUPE", sport: "Natação", ranking: "100m costas" },
      { name: "ECONO", sport: "Natação", ranking: "Revezamento" },
    ],
    status: "ativo", pendings: [],
  },
];

// ============================================================
// USUÁRIOS DO SISTEMA (com roles)
// ============================================================
export const users: User[] = [
  // ATLETAS — login = nome + cpf do próprio atleta
  ...athletes.map<User>((a) => ({ id: `u-${a.id}`, name: a.name, cpf: a.cpf, role: "atleta", athleteId: a.id })),
  // DIRETORES DE MODALIDADE
  { id: "u-dm-1", name: "Carlos Mendonça", cpf: "10000000001", role: "dm", modalidadeId: "m1", athleteId: "a-dm-1" },
  { id: "u-dm-2", name: "Patrícia Vieira", cpf: "10000000002", role: "dm", modalidadeId: "m2", athleteId: "a-dm-2" },
  { id: "u-dm-3", name: "Rodrigo Tavares", cpf: "10000000003", role: "dm", modalidadeId: "m3", athleteId: "a-dm-3" },
  { id: "u-dm-4", name: "Juliana Castro", cpf: "10000000004", role: "dm", modalidadeId: "m4", athleteId: "a-dm-4" },
  { id: "u-dm-5", name: "Marcelo Pinto", cpf: "10000000005", role: "dm", modalidadeId: "m5", athleteId: "a-dm-5" },
  // GESTÃO (admin total)
  { id: "u-g-1", name: "Diretoria Atlética", cpf: "99999999999", role: "gestao" },
];

// ============================================================
// LANDING — JOGOS / TROFÉUS
// ============================================================
export const upcomingGames: Game[] = [
  { id: "g1", opponent: "FGV", competition: "NDU", sport: "Futsal Masc.", date: "2026-05-08T19:00:00", venue: "Ginásio Insper", home: true },
  { id: "g2", opponent: "ESPM", competition: "FUPE", sport: "Vôlei Fem.", date: "2026-05-12T20:30:00", venue: "Arena ESPM", home: false },
  { id: "g3", opponent: "Mackenzie", competition: "ECONO", sport: "Basquete Masc.", date: "2026-05-17T18:00:00", venue: "Ginásio Insper", home: true },
  { id: "g4", opponent: "USP", competition: "NDU", sport: "Handebol Fem.", date: "2026-05-22T21:00:00", venue: "CEPEUSP", home: false },
  { id: "g5", opponent: "PUC-SP", competition: "FUPE", sport: "Futsal Fem.", date: "2026-05-29T19:30:00", venue: "Ginásio Insper", home: true },
];

export const trophies: Trophy[] = [
  { id: "t1", year: 2024, competition: "NDU", title: "Campeão Geral", position: 1 },
  { id: "t2", year: 2023, competition: "FUPE", title: "Vice-campeão Vôlei", position: 2 },
  { id: "t3", year: 2023, competition: "ECONO", title: "Campeão Futsal", position: 1 },
  { id: "t4", year: 2022, competition: "NDU", title: "3º Lugar Geral", position: 3 },
  { id: "t5", year: 2022, competition: "FUPE", title: "Campeão Basquete", position: 1 },
  { id: "t6", year: 2021, competition: "ECONO", title: "Vice-campeão Geral", position: 2 },
];

// ============================================================
// API helpers (mock — preparado para backend)
// ============================================================
export const api = {
  getAthletesByModalidade: (modalidadeId: string) =>
    athletes.filter((a) => a.modalidadeIds.includes(modalidadeId)),
  getAthletesByEquipe: (equipeId: string) =>
    athletes.filter((a) => a.equipeId === equipeId),
  getEquipesByModalidade: (modalidadeId: string) =>
    equipes.filter((e) => e.modalidadeId === modalidadeId),
  getModalidadeById: (id: string) => modalidades.find((m) => m.id === id),
  getAthleteById: (id: string) => athletes.find((a) => a.id === id),
};
