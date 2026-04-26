import { Athlete } from "@/data/mock";
import { StatusBadge } from "./StatusBadge";
import { CompetitionBadge } from "./CompetitionBadge";
import avatar from "@/assets/athlete-avatar.jpg";
import { AlertTriangle } from "lucide-react";

export const AthleteCard = ({
  athlete,
  onClick,
  active = false,
}: {
  athlete: Athlete;
  onClick?: () => void;
  active?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left group flex items-center gap-4 p-4 border transition-all ${
        active
          ? "bg-surface-elevated border-primary"
          : "bg-card border-border hover:border-primary/60 hover:bg-surface-elevated"
      }`}
    >
      <div className="w-12 h-12 border-2 border-border group-hover:border-primary overflow-hidden flex-shrink-0 transition-colors">
        <img src={avatar} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display text-lg leading-none truncate">{athlete.name.toUpperCase()}</span>
          {athlete.pendings.length > 0 && (
            <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {athlete.competitions.map((c) => (
            <CompetitionBadge key={c.name} name={c.name} />
          ))}
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1.5">
        <StatusBadge status={athlete.status} />
        {athlete.pendings.length > 0 && (
          <span className="font-condensed text-[10px] uppercase tracking-widest text-warning">
            {athlete.pendings.length} pendência{athlete.pendings.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </button>
  );
};
