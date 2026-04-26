// API client — wraps all backend calls.
// During development with no backend, falls back to mock data.

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("atletica_token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Erro desconhecido");
  return json.data ?? json;
}

// ---- Auth ----

export async function apiLogin(cpf: string, name: string) {
  return request<{ token: string; role: string; name: string; athleteId?: string }>(
    "/login",
    { method: "POST", body: JSON.stringify({ cpf, name }) }
  );
}

export async function apiCheckCpf(cpf: string) {
  return request<{ exists: boolean; name: string | null }>(
    "/login/check-cpf",
    { method: "POST", body: JSON.stringify({ cpf }) }
  );
}

// ---- Athletes ----

export async function apiGetMe() {
  return request("/athletes/me");
}

export async function apiGetAthletes() {
  return request("/athletes");
}

export async function apiGetCadastros() {
  return request("/athletes/cadastros");
}

// ---- Modalidades ----

export async function apiGetModalidades() {
  return request("/modalidades");
}

export async function apiGetModalidade(id: string) {
  return request(`/modalidades/${id}`);
}

export async function apiGetModalidadeAthletes(id: string) {
  return request(`/modalidades/${id}/athletes`);
}

// ---- Competições ----

export async function apiGetCompeticoes() {
  return request("/competicoes");
}

export async function apiGetCompeticao(id: string) {
  return request(`/competicoes/${id}`);
}
