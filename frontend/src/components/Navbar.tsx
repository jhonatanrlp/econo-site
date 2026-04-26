import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "@/assets/logo-atletica.png";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#jogos", label: "Jogos" },
    { href: "/#conquistas", label: "Conquistas" },
    { href: "/#galeria", label: "Galeria" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "bg-background/90 backdrop-blur-lg border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Atlética Insper" className="h-10 md:h-12 w-auto drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-transform group-hover:scale-110" width={48} height={48} />
          <div className="hidden sm:block leading-none">
            <div className="font-display text-xl tracking-widest">ATLÉTICA</div>
            <div className="font-display text-sm text-primary tracking-[0.3em]">INSPER</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-condensed uppercase tracking-wider text-sm text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/login"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-condensed uppercase tracking-widest text-sm font-bold overflow-hidden hover:bg-primary-glow transition-colors shadow-red"
          >
            <span className="relative z-10">Área do Atleta</span>
            <span className="relative z-10 text-lg leading-none">→</span>
          </Link>
        </nav>

        <button className="md:hidden text-foreground p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-condensed uppercase tracking-wider py-2 border-b border-border/50">
                {l.label}
              </a>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="bg-primary text-primary-foreground py-3 text-center font-condensed uppercase tracking-widest font-bold">
              Área do Atleta
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
