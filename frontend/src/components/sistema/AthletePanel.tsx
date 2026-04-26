import { Athlete } from "@/data/mock";
import { StatusBadge } from "./StatusBadge";
import { CompetitionBadge } from "./CompetitionBadge";
import { PendingAlert } from "./PendingAlert";
import avatar from "@/assets/athlete-avatar.jpg";
import { X, Mail, Phone } from "lucide-react";
import { useEffect } from "react";

export const AthletePanel = ({
  athlete,
  onClose,
}: {
  athlete: Athlete | null;
  onClose: () => void;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!athlete) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-card border-l-2 border-primary z-50 overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <span className="font-condensed uppercase tracking-widest text-xs text-muted-foreground">
            Detalhes do atleta
          </span>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 border-2 border-primary overflow-hidden">
              <img src={avatar} alt={athlete.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl leading-tight mb-2">{athlete.name.toUpperCase()}</h3>
              <StatusBadge status={athlete.status} />
            </div>
          </div>

          <div>
            <div className="font-condensed uppercase tracking-widest text-[10px] text-muted-foreground mb-2">
              Competições
            </div>
            <div className="space-y-2">
              {athlete.competitions.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-3 bg-surface border-l-2 border-primary">
                  <div className="flex items-center gap-3">
                    <CompetitionBadge name={c.name} />
                    <span className="font-condensed text-sm">{c.sport}</span>
                  </div>
                  <span className="font-display text-base text-primary">{c.ranking}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-condensed uppercase tracking-widest text-[10px] text-muted-foreground mb-2">
              Pendências ({athlete.pendings.length})
            </div>
            {athlete.pendings.length === 0 ? (
              <div className="p-4 border border-success/30 bg-success/5 text-sm text-success font-condensed uppercase tracking-wider">
                ✓ Tudo em dia
              </div>
            ) : (
              <div className="space-y-2">
                {athlete.pendings.map((p, i) => <PendingAlert key={i} pending={p} compact />)}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm font-condensed text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {athlete.name.toLowerCase().replace(/\s+/g, ".")}@al.insper.edu.br</div>
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> CPF ***.***.***-{athlete.cpf.slice(-2)}</div>
          </div>
        </div>
      </aside>
    </>
  );
};
