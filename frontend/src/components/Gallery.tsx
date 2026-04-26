import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import { useReveal } from "@/hooks/useReveal";

const photos = [
  { src: g1, label: "Final NDU 2024", tag: "Campeonato", span: "md:col-span-2 md:row-span-2" },
  { src: g2, label: "Basquete Masc.", tag: "Modalidade" },
  { src: g3, label: "Torcida Vermelha", tag: "Bateria" },
  { src: g4, label: "Futebol Fem.", tag: "Modalidade", span: "md:col-span-2" },
  { src: g5, label: "Vôlei Fem.", tag: "Equipe" },
];

export const Gallery = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="galeria" className="py-24 md:py-32 bg-background relative">
      <div className="container">
        <div ref={ref} className="reveal mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-12 h-0.5 bg-primary" />
              <span className="font-condensed uppercase tracking-[0.4em] text-primary text-sm">03 · Galeria</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-none">
              MOMENTOS <span className="text-primary">VERMELHOS</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md font-condensed text-lg">
            Suor, lágrima e festa. Os instantes que definem nossa atlética.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3">
          {photos.map((p, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden bg-surface ${p.span ?? ""}`}
            >
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-overlay opacity-80 group-hover:opacity-100 transition-opacity" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="font-condensed uppercase text-[10px] tracking-[0.3em] text-primary mb-1">{p.tag}</div>
                <div className="font-display text-xl md:text-2xl tracking-wide">{p.label}</div>
              </figcaption>
              <div className="absolute top-3 right-3 w-8 h-8 border border-primary/0 group-hover:border-primary group-hover:bg-primary/20 transition-all flex items-center justify-center text-primary opacity-0 group-hover:opacity-100">
                +
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
