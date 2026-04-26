import { upcomingGames } from "@/data/mock";
import { useReveal } from "@/hooks/useReveal";
import { Calendar, MapPin } from "lucide-react";

const fmt = (iso: string) => {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("pt-BR", { day: "2-digit" }),
    month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(),
    weekday: d.toLocaleDateString("pt-BR", { weekday: "long" }).toUpperCase(),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
};

const compColor: Record<string, string> = {
  NDU: "bg-primary text-primary-foreground",
  FUPE: "bg-foreground text-background",
  ECONO: "bg-warning text-background",
  Amistoso: "bg-muted text-foreground",
};

export const NextGames = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="jogos" className="py-24 md:py-32 bg-gradient-to-b from-surface to-background relative">
      <div className="container">
        <div ref={ref} className="reveal mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-12 h-0.5 bg-primary" />
              <span className="font-condensed uppercase tracking-[0.4em] text-primary text-sm">01 · Calendário</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-none">
              PRÓXIMOS <span className="text-primary">JOGOS</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-primary/40 self-start">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-red" />
            <span className="font-condensed uppercase text-xs tracking-widest">Atualizado em tempo real</span>
          </div>
        </div>

        <div className="space-y-3">
          {upcomingGames.map((g, i) => {
            const d = fmt(g.date);
            return (
              <article
                key={g.id}
                className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] items-center gap-4 md:gap-6 p-4 md:p-6 bg-card border-l-4 border-primary hover:bg-surface-elevated transition-all hover:translate-x-1 cursor-pointer"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Data */}
                <div className="text-center w-16 md:w-20 border-r border-border pr-4">
                  <div className="font-display text-4xl md:text-5xl text-primary leading-none">{d.day}</div>
                  <div className="font-condensed uppercase text-xs tracking-widest text-muted-foreground mt-1">{d.month}</div>
                </div>

                {/* Confronto */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest ${compColor[g.competition]}`}>
                      {g.competition}
                    </span>
                    <span className="font-condensed uppercase text-xs text-muted-foreground tracking-widest">{g.sport}</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl leading-tight">
                    INSPER <span className="text-primary mx-2">×</span> <span className="text-stroke">{g.opponent.toUpperCase()}</span>
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground font-condensed">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{d.weekday} · {d.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{g.venue}</span>
                  </div>
                </div>

                {/* Casa/Fora */}
                <div className="hidden md:flex flex-col items-center px-4">
                  <span className={`font-display text-xl ${g.home ? "text-primary" : "text-muted-foreground"}`}>
                    {g.home ? "CASA" : "FORA"}
                  </span>
                </div>

                <span className="text-2xl text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">→</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
