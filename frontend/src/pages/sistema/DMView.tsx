import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SistemaShell } from "@/components/sistema/SistemaShell";
import { AthleteCard } from "@/components/sistema/AthleteCard";
import { AthletePanel } from "@/components/sistema/AthletePanel";
import { getSession } from "@/lib/auth";
import { api, modalidades, type Athlete, type AthleteStatus } from "@/data/mock";
import { Search } from "lucide-react";

const filters: { value: "all" | AthleteStatus; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "ativo", label: "Ativos" },
  { value: "pendente", label: "Pendentes" },
  { value: "inscrito", label: "Inscritos" },
];

const DM = () => {
  const nav = useNavigate();
  const [modalidadeId, setModalidadeId] = useState<string>("");
  const [filter, setFilter] = useState<"all" | AthleteStatus>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Athlete | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) return nav("/login");
    if (s.role === "atleta") return nav("/sistema/atleta");
    // DM vê só sua modalidade; gestão pode escolher
    setModalidadeId(s.modalidadeId ?? modalidades[0].id);
  }, [nav]);

  const session = getSession();
  const isGestao = session?.role === "gestao";
  const modalidade = modalidades.find((m) => m.id === modalidadeId);

  const list = useMemo(() => {
    if (!modalidadeId) return [];
    let arr = api.getAthletesByModalidade(modalidadeId);
    if (filter !== "all") arr = arr.filter((a) => a.status === filter);
    if (query) arr = arr.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));
    return arr;
  }, [modalidadeId, filter, query]);

  const totals = useMemo(() => {
    const all = modalidadeId ? api.getAthletesByModalidade(modalidadeId) : [];
    return {
      total: all.length,
      ativos: all.filter((a) => a.status === "ativo").length,
      pendentes: all.filter((a) => a.status === "pendente").length,
      pendencias: all.reduce((acc, a) => acc + a.pendings.length, 0),
    };
  }, [modalidadeId]);

  return (
    <SistemaShell title={modalidade ? modalidade.name : "Modalidade"}>
      {/* Stats da modalidade */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Atletas", v: totals.total },
          { l: "Ativos", v: totals.ativos, color: "text-success" },
          { l: "Pendentes", v: totals.pendentes, color: "text-warning" },
          { l: "Pendências", v: totals.pendencias, color: "text-primary" },
        ].map((s) => (
          <div key={s.l} className="bg-card border border-border p-4">
            <div className="font-condensed uppercase text-[10px] tracking-widest text-muted-foreground mb-1">{s.l}</div>
            <div className={`font-display text-2xl ${s.color ?? "text-foreground"}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {isGestao && (
          <select
            value={modalidadeId}
            onChange={(e) => setModalidadeId(e.target.value)}
            className="bg-input border border-border focus:border-primary outline-none px-3 py-2 font-condensed text-sm"
          >
            {modalidades.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        )}
        <div className="flex bg-surface border border-border p-0.5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 font-condensed uppercase tracking-widest text-[11px] font-bold transition-colors ${
                filter === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar atleta..."
            className="w-full bg-input border border-border focus:border-primary outline-none pl-9 pr-3 py-2 font-condensed text-sm"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-condensed">
            Nenhum atleta encontrado.
          </div>
        ) : (
          list.map((a) => (
            <AthleteCard
              key={a.id}
              athlete={a}
              onClick={() => setSelected(a)}
              active={selected?.id === a.id}
            />
          ))
        )}
      </div>

      <AthletePanel athlete={selected} onClose={() => setSelected(null)} />
    </SistemaShell>
  );
};

export default DM;
