// Faixa "marquee" agressiva entre seções
export const Marquee = () => {
  const items = ["NDU", "FUPE", "ECONO", "Atlética Insper", "Vermelho & Preto", "Tradição"];
  const loop = [...items, ...items, ...items];
  return (
    <div className="bg-primary text-primary-foreground py-4 overflow-hidden border-y-2 border-foreground/10">
      <div className="flex marquee gap-12 whitespace-nowrap">
        {loop.map((t, i) => (
          <span key={i} className="font-display text-2xl md:text-3xl tracking-[0.3em] flex items-center gap-12">
            {t}
            <span className="text-foreground/60 text-xl">★</span>
          </span>
        ))}
      </div>
    </div>
  );
};
