import { readFileSync } from "fs";
import { join } from "path";

// Reads a JSON file from the shared data/ folder.
// Path: backend/src/services/data.ts → ../../.. → repo root → data/
const DATA_DIR = join(__dirname, "../../../data");

function load<T>(file: string): T {
  const raw = readFileSync(join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

export function getAthletes() {
  return load<import("../types").Athlete[]>("athletes.json");
}

export function getCompetitions() {
  return load<import("../types").Competition[]>("competitions.json");
}

export function getEnrollments() {
  return load<import("../types").Enrollment[]>("enrollments.json");
}

export function getPending() {
  return load<import("../types").Pending[]>("pending.json");
}

export function findAthleteByCpf(cpf: string) {
  const clean = cpf.replace(/\D/g, "");
  return getAthletes().find((a) => a.cpf === clean) ?? null;
}
