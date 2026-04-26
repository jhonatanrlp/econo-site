import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SistemaShell } from "@/components/sistema/SistemaShell";
import { CompetitionBadge } from "@/components/sistema/CompetitionBadge";
import { StatusBadge } from "@/components/sistema/StatusBadge";
import { PendingAlert } from "@/components/sistema/PendingAlert";
import { getSession, getAthlete } from "@/lib/auth";
import type { Athlete as AthleteType } from "@/data/mock";
import avatar from "@/assets/athlete-avatar.jpg";
import { CheckCircle2, AlertTriangle, Calendar } from "lucide-react";

const Athlete = () => {
  const [user, setUser] = useState<AthleteType | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const s = getSession();
    if (!s) return nav("/login");
    // Atletas e DMs (DMs também são atletas) podem ver esta tela.
    const a = getAthlete(s);
    if (!a) return nav("/sistema/" + s.role);
    setUser(a);
  }, [nav]);

  if (!user) return null;
  const ok = user.status === "ativo" && user.pendings.length === 0;

  return (
    <SistemaShell title="Minha visão">
      {/* Identidade do atleta */}
      <section className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-center bg-card border border-border p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="w-24 h-24 border-2 border-primary overflow-hidden">
          <img src={avatar} alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-condensed uppercase text-[10px] tracking-widest text-muted-foreground mb-1">
            Atleta · {new Date().getFullYear()}
          </div>
          <h2 className="font-display text-3xl md:text-4xl leading-none mb-2">{user.name.toUpperCase()}</h2>
          <div className="flex flex-wrap gap-1.5">
            {user.competitions.map((c) => (
              <CompetitionBadge key={c.name} name={c.name} />
            ))}
          </div>
        </div>
        <StatusBadge status={user.status} />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        {/* Minhas competições */}
        <div className="lg:col-span-2 bg-card border border-border p-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-2xl">MINHAS COMPETIÇÕES</h3>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-2">
            {user.competitions.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-4 bg-surface border-l-2 border-primary hover:bg-surface-elevated transition-colors">
                <div className="flex items-center gap-3">
                  <CompetitionBadge name={c.name} />
                  <span className="font-condensed text-sm">{c.sport}</span>
                </div>
                <div className="font-display text-lg text-primary">{c.ranking}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pendências */}
        <div className="bg-card border border-border p-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-warning" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-2xl">PENDÊNCIAS</h3>
            {user.pendings.length === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning" />
            )}
          </div>
          {user.pendings.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
              <p className="font-condensed uppercase tracking-widest text-xs text-muted-foreground">
                Tudo em dia
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {user.pendings.map((p, i) => <PendingAlert key={i} pending={p} compact />)}
            </div>
          )}
        </div>

        {/* Status & quick stats */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "Modalidades", v: user.competitions.length },
            { l: "Pendências", v: user.pendings.length },
            { l: "Status", v: user.status.toUpperCase() },
            { l: "Geral", v: ok ? "OK" : "AÇÃO" },
          ].map((s) => (
            <div key={s.l} className="bg-gradient-card border border-border p-5">
              <div className="font-condensed uppercase text-[10px] tracking-widest text-muted-foreground mb-2">{s.l}</div>
              <div className="font-display text-2xl text-primary">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </SistemaShell>
  );
};

export default Athlete;
