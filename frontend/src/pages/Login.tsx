import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { login, homeFor, getDemoUsers } from "@/lib/auth";
import { toast } from "sonner";
import logo from "@/assets/logo-atletica.png";
import heroBg from "@/assets/hero-bg.jpg";

const Login = () => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const session = login(name, cpf);
      setLoading(false);
      if (session) {
        toast.success(`Bem-vindo(a), ${session.name.split(" ")[0]}!`);
        nav(homeFor(session.role));
      } else {
        toast.error("Verifique seu nome completo e CPF.");
      }
    }, 350);
  };

  const formatCpf = (v: string) =>
    v.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const fillDemo = (n: string, c: string) => {
    setName(n);
    setCpf(formatCpf(c));
  };

  const demos = getDemoUsers();

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <main className="relative container pt-32 pb-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logo} alt="Atlética Insper" className="h-20 w-auto mx-auto mb-4 drop-shadow-[0_0_30px_hsl(var(--primary)/0.6)]" />
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="block w-8 h-0.5 bg-primary" />
              <span className="font-condensed uppercase tracking-[0.4em] text-primary text-xs">Acesso ao sistema</span>
              <span className="block w-8 h-0.5 bg-primary" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl leading-none">
              ÁREA <span className="text-primary">INTERNA</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border p-8 shadow-card relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />

            <div className="space-y-5">
              <div>
                <label className="font-condensed uppercase tracking-widest text-xs text-muted-foreground block mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="Seu nome"
                  className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-3 font-condensed text-foreground transition-colors"
                />
              </div>

              <div>
                <label className="font-condensed uppercase tracking-widest text-xs text-muted-foreground block mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  required
                  placeholder="000.000.000-00"
                  className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-3 font-condensed text-foreground transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 font-condensed uppercase tracking-widest font-bold hover:bg-primary-glow shadow-red disabled:opacity-60 transition-all"
              >
                {loading ? "Entrando..." : "Entrar →"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="font-condensed uppercase text-[10px] tracking-widest text-muted-foreground mb-2 text-center">
                Demonstração — clique para preencher
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demos.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => fillDemo(d.name, d.cpf)}
                    className="px-2 py-2 border border-border hover:border-primary hover:bg-surface-elevated transition-colors text-center"
                  >
                    <div className="font-condensed uppercase text-[10px] tracking-widest text-primary font-bold">
                      {d.role}
                    </div>
                    <div className="font-condensed text-[11px] text-foreground truncate">
                      {d.name.split(" ")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>

          <p className="text-center mt-6">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-condensed uppercase tracking-widest text-xs">
              ← Voltar ao site
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
