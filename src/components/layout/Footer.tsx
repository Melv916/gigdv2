import { Link } from "react-router-dom";
import { CONTACT_EMAIL, featuredSeoLinks, primaryNavLinks, SITE_NAME, SUPPORT_SLA, trustNavLinks } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[linear-gradient(180deg,rgba(12,20,36,0.82)_0%,rgba(8,14,26,0.96)_100%)]">
      <div className="container py-12">
        <div className="premium-shell px-6 py-8 md:px-8 md:py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
            <span className="text-lg font-display font-bold text-foreground">
              {SITE_NAME}<span className="text-primary">.</span>
            </span>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Good Investment. Good Decision.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Plateforme d'analyse immobilière pour investisseurs locatifs, avec méthode explicite et parcours public
              structuré.
            </p>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {primaryNavLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/ressources" className="transition-colors hover:text-primary">
                    Tous les guides
                  </Link>
                </li>
                {featuredSeoLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Confiance</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {trustNavLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="transition-colors hover:text-primary"
                    onClick={() => trackEvent("click_email", { source: "footer", email: CONTACT_EMAIL })}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">Support: {SUPPORT_SLA}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">(c) {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.</p>
            <p className="text-xs text-muted-foreground">Version V2 - Aide à la décision, pas conseil financier.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
