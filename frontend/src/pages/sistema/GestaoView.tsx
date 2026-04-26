import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SistemaShell } from "@/components/sistema/SistemaShell";
import { AthleteCard } from "@/components/sistema/AthleteCard";
import { AthletePanel } from "@/components/sistema/AthletePanel";
import { getSession } from "@/lib/auth";
import {
  api,
  athletes,
  equipes,
  modalidades,
  type Athlete,
  type AthleteStatus,
  type CompetitionName,
} from "@/data/mock";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

const competitionOptions: ("all" | CompetitionName)[] = ["all", "NDU", "FUPE", "ECONO"];
const statusOptions: ("all" | AthleteStatus)[] = ["all", "ativo", "pendente", "inscrito"];

const Gestao = () => {
  const nav = useNavigate();
  const [selected, setSelected] = useState<Athlete | null>(null);
  const [openMod, setOpenMod] = useState<string[]>(modalidades.map((m) => m.id));
  const [openEquipe, setOpenEquipe] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | AthleteStatus>("all");
  const [filterComp, setFilterComp] = useState<"all" | CompetitionName>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) return nav("/login");
    if (s.role !== "gestao") return nav("/sistema/" + s.role);
  }, [nav]);

  const matches = (a: Athlete) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterComp !== "all" && !a.competitions.some((c) => c.name === filterComp)) return false;
    if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  };

  const totals = useMemo(() => {
    const filtered = athletes.filter(matches);
    return {
      modalidades: modalidades.length,
      atletas: filtered.length,
      pendencias: filtered.reduce((acc, a) => acc + a.pendings.length, 0),
      pendentes: filtered.filter((a) => a.status === "pendente").length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterComp, query]);

  const toggle = (arr: string[], id: string, set: (v: string[]) => void) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  return (
    <SistemaShell title="Gestão geral">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Modalidades", v: totals.modalidades },
          { l: "Atletas filtrados", v: totals.atletas },
          { l: "Pendentes", v: totals.pendentes, color: "text-warning" },
          { l: "Pendências totais", v: totals.pendencias, color: "text-primary" },
        ].map((s) => (
          <div key={s.l} className="bg-card border border-border p-4">
            <div className="font-condensed uppercase text-[10px] tracking-widest text-muted-foreground mb-1">{s.l}</div>
            <div className={`font-display text-2xl ${s.color ?? "text-foreground"}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterPills<"all" | AthleteStatus> label="Status" value={filterStatus} options={statusOptions} onChange={setFilterStatus} />
        <FilterPills<"all" | CompetitionName> label="Competição" value={filterComp} options={competitionOptions} onChange={setFilterComp} />
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar atleta em todas as modalidades..."
            className="w-full bg-input border border-border focus:border-primary outline-none pl-9 pr-3 py-2 font-condensed text-sm"
          />
        </div>
      </div>

      {/* Hierarquia: Modalidade → Equipe → Atleta */}
      <div className="space-y-3">
        {modalidades.map((m) => {
          const modAthletes = api.getAthletesByModalidade(m.id).filter(matches);
          const isOpen = openMod.includes(m.id);
          return (
            <div key={m.id} className="border border-border bg-card">
              <button
                onClick={() => toggle(openMod, m.id, setOpenMod)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-elevated transition-colors text-left"
              >
                {isOpen ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <div className="flex-1 min-w-0">
                  <div className="font-display text-xl">{m.name.toUpperCase()}</div>
                  <div className="font-condensed text-xs text-muted-foreground uppercase tracking-widest">
                    {m.competitions.join(" · ")}
                  </div>
                </div>
                <div className="font-display text-lg text-primary">{modAthletes.length}</div>
              </button>

              {isOpen && (
                <div className="border-t border-border bg-surface/30 p-4 space-y-3">
                  {api.getEquipesByModalidade(m.id).map((eq) => {
                    const eqAthletes = modAthletes.filter((a) => a.equipeId === eq.id);
                    if (eqAthletes.length === 0) return null;
                    const eqOpen = openEquipe.includes(eq.id) || openEquipe.length === 0;
                    return (
                      <div key={eq.id}>
                        <button
                          onClick={() => toggle(openEquipe, eq.id, setOpenEquipe)}
                          className="flex items-center gap-2 mb-2 text-left"
                        >
                          <span className="block w-6 h-px bg-primary" />
                          <span className="font-condensed uppercase text-xs tracking-widest text-primary">
                            {eq.name}
                          </span>
                          <span className="font-condensed text-xs text-muted-foreground">
                            ({eqAthletes.length})
                          </span>
                        </button>
                        {eqOpen && (
                          <div className="space-y-2 pl-8">
                            {eqAthletes.map((a) => (
                              <AthleteCard
                                key={a.id}
                                athlete={a}
                                onClick={() => setSelected(a)}
                                active={selected?.id === a.id}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {modAthletes.length === 0 && (
                    <div className="text-center py-6 font-condensed text-sm text-muted-foreground">
                      Nenhum atleta nessa modalidade com os filtros atuais.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AthletePanel athlete={selected} onClose={() => setSelected(null)} />
    </SistemaShell>
  );
};

function FilterPills<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-condensed uppercase text-[10px] tracking-widest text-muted-foreground">{label}</span>
      <div className="flex bg-surface border border-border p-0.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-2.5 py-1 font-condensed uppercase tracking-widest text-[10px] font-bold transition-colors ${
              value === o ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o === "all" ? "Todos" : o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Gestao;
