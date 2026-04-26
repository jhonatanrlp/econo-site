import { trophies } from "@/data/mock";
import { Trophy as TrophyIcon, Medal, Award } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const iconFor = (pos: 1 | 2 | 3) =>
  pos === 1 ? TrophyIcon : pos === 2 ? Medal : Award;

export const Achievements = () => {
  const titleRef = useReveal<HTMLDivElement>();
  return (
    <section id="conquistas" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute -top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container relative">
        <div ref={titleRef} className="reveal mb-16 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-12 h-0.5 bg-primary" />
            <span className="font-condensed uppercase tracking-[0.4em] text-primary text-sm">02 · Conquistas</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-none">
            VITRINE DE <span className="text-primary">TÍTULOS</span>
          </h2>
          <p className="text-muted-foreground mt-4 font-condensed text-lg">
            Cada troféu, uma história. Cada medalha, um suor. NDU, FUPE, ECONO — onde a Insper deixa marca.
          </p>
        </div>

        {/* Scroll horizontal em mobile, grid em desktop */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory">
          {trophies.map((t, i) => {
            const Icon = iconFor(t.position);
            const accent = t.position === 1 ? "text-warning" : t.position === 2 ? "text-foreground/70" : "text-primary";
            return (
              <article
                key={t.id}
                className="group relative min-w-[260px] md:min-w-0 snap-start bg-gradient-card border border-border hover:border-primary p-6 transition-all hover:-translate-y-2 hover:shadow-red"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`} />
                <Icon className={`w-10 h-10 ${accent} mb-4`} strokeWidth={1.5} />
                <div className="font-display text-5xl text-foreground/95 leading-none">{t.year}</div>
                <div className="font-condensed uppercase tracking-widest text-xs text-primary mt-3">{t.competition}</div>
                <div className="text-foreground/80 text-sm mt-2 font-condensed">{t.title}</div>
                <div className="absolute bottom-3 right-4 font-display text-3xl text-foreground/10 group-hover:text-primary/30 transition-colors">
                  #{t.position}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
