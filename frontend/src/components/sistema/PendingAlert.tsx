import { Pending } from "@/data/mock";
import { CreditCard, FileText, Activity } from "lucide-react";

const icons = { pagamento: CreditCard, documento: FileText, exame: Activity };

export const PendingAlert = ({ pending, compact = false }: { pending: Pending; compact?: boolean }) => {
  const Icon = icons[pending.type];
  return (
    <div className={`flex gap-3 border border-warning/30 bg-warning/5 ${compact ? "p-2.5" : "p-4"}`}>
      <Icon className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="font-condensed uppercase text-[10px] tracking-widest text-warning">{pending.type}</div>
        <div className={`text-foreground ${compact ? "text-xs" : "text-sm"}`}>{pending.description}</div>
        <div className="text-[10px] text-muted-foreground font-condensed mt-0.5">
          Vence: {new Date(pending.dueDate).toLocaleDateString("pt-BR")}
        </div>
      </div>
    </div>
  );
};
