import { AthleteStatus } from "@/data/mock";

const map: Record<AthleteStatus, { label: string; cls: string; dot: string }> = {
  ativo: { label: "Ativo", cls: "bg-success/15 text-success border-success/40", dot: "bg-success animate-pulse" },
  pendente: { label: "Pendente", cls: "bg-warning/10 text-warning border-warning/40", dot: "bg-warning" },
  inscrito: { label: "Inscrito", cls: "bg-primary/15 text-primary border-primary/40", dot: "bg-primary" },
};

export const StatusBadge = ({ status }: { status: AthleteStatus }) => {
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 border font-condensed uppercase tracking-widest text-[10px] font-bold ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};
