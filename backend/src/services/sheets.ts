import { google } from "googleapis";

const SHEET_IDS = {
  athletes: process.env.SHEET_ID_ATHLETES!,
  cadastro: process.env.SHEET_ID_CADASTRO!,
};

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

async function readSheet(sheetId: string, range: string): Promise<string[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  return (res.data.values ?? []) as string[][];
}

// ---- Athletes sheet ----
// Expected columns: ndu_id | nome | email | cpf | renovacao | status | modalidades
export async function fetchAthletes() {
  const rows = await readSheet(SHEET_IDS.athletes, "A2:G");

  return rows.map((row) => ({
    nduId: row[0] ?? "",
    name: row[1] ?? "",
    email: row[2] ?? "",
    cpf: (row[3] ?? "").replace(/\D/g, ""), // digits only
    renovacao: row[4] ?? "",
    status: row[5] ?? "pendente",
    modalidades: (row[6] ?? "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
  }));
}

// ---- Registration sheet ----
// Expected columns: nome | email | cpf | modalidades | timestamp
export async function fetchCadastros() {
  const rows = await readSheet(SHEET_IDS.cadastro, "A2:E");

  return rows.map((row) => ({
    name: row[0] ?? "",
    email: row[1] ?? "",
    cpf: (row[2] ?? "").replace(/\D/g, ""),
    modalidades: (row[3] ?? "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
    registeredAt: row[4] ?? "",
  }));
}

// ---- Lookup by CPF ----
export async function findAthleteByCpf(cpf: string) {
  const clean = cpf.replace(/\D/g, "");
  const athletes = await fetchAthletes();
  return athletes.find((a) => a.cpf === clean) ?? null;
}
