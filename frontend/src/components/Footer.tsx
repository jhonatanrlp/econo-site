import logo from "@/assets/logo-atletica.png";
import { Instagram, Youtube } from "lucide-react";

export const Footer = () => (
  <footer className="bg-background border-t border-border relative overflow-hidden">
    <div className="absolute inset-0 stripe-bg opacity-40" />
    <div className="container relative py-16">
      <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-10 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="" className="h-14 w-auto" width={56} height={56} />
            <div>
              <div className="font-display text-2xl tracking-widest">ATLÉTICA</div>
              <div className="font-display text-primary tracking-[0.3em]">INSPER</div>
            </div>
          </div>
          <p className="text-muted-foreground font-condensed max-w-md">
            Representando o Insper nos maiores torneios universitários do Brasil. Tradição construída em quadra, campo e arquibancada.
          </p>
        </div>
        <div>
          <h4 className="font-display tracking-widest text-primary mb-4">NAVEGAÇÃO</h4>
          <ul className="space-y-2 font-condensed text-muted-foreground">
            <li><a href="#jogos" className="hover:text-primary transition-colors">Próximos jogos</a></li>
            <li><a href="#conquistas" className="hover:text-primary transition-colors">Conquistas</a></li>
            <li><a href="#galeria" className="hover:text-primary transition-colors">Galeria</a></li>
            <li><a href="/login" className="hover:text-primary transition-colors">Área do atleta</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display tracking-widest text-primary mb-4">CONECTE</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="w-11 h-11 border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="YouTube" className="w-11 h-11 border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="font-display text-[18vw] md:text-[12vw] leading-none text-primary/10 select-none -mb-8 overflow-hidden">
        VERMELHO E PRETO
      </div>

      <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs font-condensed text-muted-foreground tracking-wider uppercase">
        <span>© {new Date().getFullYear()} Atlética Insper · Todos os direitos reservados</span>
        <span>Desde 2002 · São Paulo, BR</span>
      </div>
    </div>
  </footer>
);
