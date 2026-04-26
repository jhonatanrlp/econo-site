import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { getSession, logout, homeFor } from "@/lib/auth";
import { LogOut } from "lucide-react";
import logo from "@/assets/logo-atletica.png";
import { toast } from "sonner";

export const SistemaShell = ({ children, title }: { children: ReactNode; title: string }) => {
  const session = getSession();
  const nav = useNavigate();
  const { pathname } = useLocation();

  if (!session) {
    nav("/login");
    return null;
  }

  const tabs = [
    { id: "atleta",  label: "Atleta", path: "/sistema/atleta",  roles: ["atleta", "dm", "gestao"] },
    { id: "dm",      label: "DM",     path: "/sistema/dm",      roles: ["dm", "gestao"] },
    { id: "gestao",  label: "Gestão", path: "/sistema/gestao",  roles: ["gestao"] },
    { id: "econo",   label: "ECONO",  path: "/sistema/econo",   roles: ["dm", "gestao"] },
  ];

  const allowed = tabs.filter((t) => t.roles.includes(session.role));

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada");
    nav("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topo fixo do sistema */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to={homeFor(session.role)} className="flex items-center gap-3 group">
            <img src={logo} alt="" className="h-9 w-auto drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]" />
            <div className="hidden sm:block leading-none">
              <div className="font-display text-base tracking-widest">SISTEMA</div>
              <div className="font-display text-[10px] text-primary tracking-[0.3em]">ATLÉTICA INSPER</div>
            </div>
          </Link>

          {/* Toggle de modo */}
          <div className="flex items-center bg-surface border border-border p-0.5">
            {allowed.map((t) => {
              const active = pathname.startsWith(t.path);
              return (
                <Link
                  key={t.id}
                  to={t.path}
                  className={`px-3 sm:px-5 py-2 font-condensed uppercase tracking-widest text-xs font-bold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right leading-tight">
              <div className="font-condensed text-sm text-foreground">{session.name}</div>
              <div className="font-condensed uppercase text-[10px] tracking-widest text-primary">
                {session.role === "dm" && session.athleteId
                  ? "Atleta · DM"
                  : session.role === "gestao"
                  ? "Gestão"
                  : session.role}
              </div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Sair"
              className="p-2 text-muted-foreground hover:text-primary border border-border hover:border-primary transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Page header */}
      <div className="border-b border-border bg-surface/30">
        <div className="container py-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-6 h-0.5 bg-primary" />
              <span className="font-condensed uppercase tracking-[0.4em] text-primary text-[10px]">
                Painel · {session.role === "dm" && session.athleteId ? "Atleta + DM" : session.role}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl leading-none">{title}</h1>
          </div>
        </div>
      </div>

      <main className="container py-8">{children}</main>
    </div>
  );
};
