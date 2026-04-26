import { CompetitionName } from "@/data/mock";

const colors: Record<CompetitionName, string> = {
  NDU: "bg-primary/15 text-primary border-primary/40",
  FUPE: "bg-warning/15 text-warning border-warning/40",
  ECONO: "bg-success/15 text-success border-success/40",
  Amistoso: "bg-muted text-muted-foreground border-border",
};

export const CompetitionBadge = ({ name, className = "" }: { name: CompetitionName; className?: string }) => (
  <span
    className={`inline-flex items-center font-condensed uppercase tracking-widest text-[10px] font-bold px-2 py-0.5 border ${colors[name]} ${className}`}
  >
    {name}
  </span>
);
