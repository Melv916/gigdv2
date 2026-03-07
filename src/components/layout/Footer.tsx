import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="text-lg font-display font-bold text-foreground">
              GIGD<span className="text-primary">.</span>
            </span>
            <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mt-0.5">
              Good Investment. Good Decision.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Plateforme d'analyse immobiliere V2 pour investisseurs.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Produit</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/produit" className="hover:text-primary transition-colors">Fonctionnalites</Link></li>
              <li><Link to="/tarifs" className="hover:text-primary transition-colors">Tarifs</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/mentions-legales" className="hover:text-primary transition-colors">Mentions legales</Link></li>
              <li><Link to="/confidentialite" className="hover:text-primary transition-colors">Politique de confidentialite</Link></li>
              <li><Link to="/cgu" className="hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
            <p className="text-sm text-muted-foreground">contact@gigd.fr</p>
            <p className="text-xs text-muted-foreground mt-4">Support: reponse sous 24h ouvrées</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GIGD. Tous droits reserves.
          </p>
          <p className="text-xs text-muted-foreground">
            Version V2 - Aide a la decision, pas conseil financier.
          </p>
        </div>
      </div>
    </footer>
  );
}

