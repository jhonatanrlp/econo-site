import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-atletica.png";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 stripe-bg opacity-60" />
      </div>

      {/* Vertical accent stripes */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-glow" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary shadow-glow" />

      <div className="container relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-6 animate-slide-in-left">
            <span className="block w-12 h-0.5 bg-primary" />
            <span className="font-condensed uppercase tracking-[0.4em] text-primary text-sm font-semibold">
              Desde 2002 · São Paulo
            </span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] mb-6 animate-slide-up">
            TRADIÇÃO.<br />
            <span className="text-primary glow-text">COMPETIÇÃO.</span><br />
            <span className="text-stroke">CONQUISTA.</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 max-w-xl mb-10 font-condensed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            A força esportiva do Insper. Mais de 20 modalidades, centenas de atletas e o orgulho de vestir a camisa vermelha.
          </p>

          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="#jogos"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-condensed uppercase tracking-widest font-bold shadow-red hover:shadow-glow transition-all hover:translate-x-1"
            >
              Ver próximos jogos
              <span className="text-xl">→</span>
            </a>
            <Link
              to="/login"
              className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-foreground/40 text-foreground font-condensed uppercase tracking-widest font-bold hover:border-primary hover:text-primary transition-all"
            >
              Área do atleta
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl border-t border-border/50 pt-8 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            {[
              { n: "23", l: "Modalidades" },
              { n: "400+", l: "Atletas" },
              { n: "50+", l: "Títulos" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-4xl md:text-5xl text-primary glow-text">{s.n}</div>
                <div className="font-condensed uppercase text-xs tracking-widest text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block animate-float">
          <img
            src={logo}
            alt="Logo Atlética Insper"
            className="w-72 lg:w-96 drop-shadow-[0_0_60px_hsl(var(--primary)/0.6)]"
            width={384}
            height={384}
          />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
        <span className="font-condensed uppercase tracking-widest text-xs">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};
