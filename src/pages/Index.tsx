import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo/Seo";
import { useAuth } from "@/hooks/useAuth";
import { getAnalysisCtaPath, primaryNavLinks, SITE_NAME, SITE_URL } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import { Search, ArrowRight } from "lucide-react";
import "./index-home.css";

const demoProperty = {
  title: "T2 renove pour location longue duree",
  city: "Lille Centre",
  surface: "42 m2",
  price: "164 000 EUR",
  rent: "820 EUR / mois",
  yield: "5,4 %",
  cashFlow: "+74 EUR / mois",
  marketGap: "+3,8 % vs marche local",
};

const demoHighlights = [
  "Travaux legers, dossier simple a exploiter",
  "Loyer coherent avec le secteur retenu",
  "Prix legerement au-dessus du marche, marge de nego limitee",
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listingUrl, setListingUrl] = useState("");

  const launchHref = useMemo(() => {
    const nextUrl = encodeURIComponent(listingUrl.trim());
    return user ? `/app/projets/nouveau${nextUrl ? `?url=${nextUrl}` : ""}` : getAnalysisCtaPath(false);
  }, [listingUrl, user]);

  const secondaryHref = useMemo(() => "/methode", []);
  const defaultAnalysisHref = useMemo(() => getAnalysisCtaPath(Boolean(user)), [user]);

  const onAnalyze = () => {
    trackEvent("click_cta_primary", { location: "home-hero", target: launchHref });
    trackEvent("start_analysis", { location: "home-hero", hasPrefilledUrl: Boolean(listingUrl.trim()) });
    navigate(launchHref);
  };

  return (
    <div className="v2home-root min-h-screen flex flex-col">
      <Seo
        title="Analyse investissement locatif"
        description="GIGD aide les investisseurs à analyser une annonce immobilière, calculer la rentabilité réelle d'un projet locatif et prendre une décision claire et rapide."
        pathname="/"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            email: "contact@gigd.fr",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
          },
        ]}
      />

      <main className="flex-1">
        <section className="v2home-showcase">
          <div className="container py-6 md:py-10">
            <div className="v2home-stage">
              <div className="v2home-stage-glow" />
              <header className="v2home-stage-top">
                <Link to="/" className="v2home-logo-wrap" aria-label="GIGD accueil">
                  <span className="v2home-logo-text">
                    GIGD<span className="v2home-logo-dot">.</span>
                  </span>
                  <span className="v2home-logo-sub">Good Investment. Good Decision.</span>
                </Link>

                <nav className="v2home-stage-nav hidden md:flex">
                  {primaryNavLinks.slice(0, 5).map((link) => (
                    <Link key={link.to} to={link.to} className="v2home-stage-navlink">
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <Link to={user ? "/app" : "/auth"}>
                  <Button variant="hero-outline" size="sm">{user ? "Mon espace" : "Connexion"}</Button>
                </Link>
              </header>

              <div className="v2home-stage-hero">
                <h1 className="mt-4 text-4xl md:text-6xl font-display font-bold leading-[1.02] text-white">
                  Ne devinez plus,
                  <br />
                  <span className="v2home-headline-accent">soyez surs.</span>
                </h1>

                <p className="mt-4 max-w-sm mx-auto text-sm leading-6 text-slate-300 md:hidden">
                  GIGD vous aide a savoir rapidement si une annonce tient vraiment, sans bruit inutile.
                </p>

                <div className="mt-7 v2home-input-shell max-w-3xl mx-auto">
                  <Search size={17} strokeWidth={1.5} className="v2home-icon" />
                  <input
                    type="url"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    placeholder="https://... collez le lien de l'annonce"
                    className="v2home-url-input"
                  />
                  <Button className="v2home-cta-btn px-5" onClick={onAnalyze}>
                    Lancer l'analyse
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to={secondaryHref}
                    onClick={() => trackEvent("click_cta_secondary", { location: "home-hero", target: secondaryHref })}
                  >
                    <Button variant="hero-outline" size="sm">Comprendre la methode</Button>
                  </Link>
                  <Link
                    to={defaultAnalysisHref}
                    className="text-sm text-slate-300 hover:text-white"
                    onClick={() => trackEvent("click_cta_secondary", { location: "home-hero-text", target: defaultAnalysisHref })}
                  >
                    Ouvrir l'application sans URL
                  </Link>
                </div>

                <div className="mt-5 grid gap-2 text-left md:hidden max-w-sm mx-auto">
                  <div className="v2home-mobile-chip">Lecture directe du rendement, du cash-flow et du marche.</div>
                  <div className="v2home-mobile-chip">Pense pour passer vite de l'annonce a la decision.</div>
                </div>

                <div className="mt-6 hidden max-w-3xl mx-auto gap-3 md:grid md:grid-cols-3">
                  {[
                    { label: "Prix au m2 compare", value: "3 690 EUR/m2" },
                    { label: "Cash-flow net-net", value: "+162 EUR/mois" },
                    { label: "Loyer estime prudent", value: "1 180 EUR/mois" },
                  ].map((stat) => (
                    <div key={stat.label} className="v2home-card v2home-card-secondary p-4 text-left">
                      <p className="v2home-label">{stat.label}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container v2home-content-stack py-12 md:py-16">
          <section className="v2home-section-shell v2home-essentials">
            <div className="grid gap-8 px-5 py-6 md:grid-cols-[minmax(0,1.2fr)_0.8fr] md:px-8 md:py-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Simulation de demonstration</p>
                <h2 className="mt-3 text-2xl font-display font-bold text-foreground md:text-4xl">
                  Un exemple concret de lecture GIGD
                </h2>
                <div className="mt-6 rounded-[1.5rem] border border-border/50 bg-card/60 p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {demoProperty.city}
                    </span>
                    <span className="rounded-full border border-border/40 bg-background/35 px-3 py-1 text-xs text-muted-foreground">
                      {demoProperty.surface}
                    </span>
                    <span className="rounded-full border border-border/40 bg-background/35 px-3 py-1 text-xs text-muted-foreground">
                      Demonstration
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-display font-semibold text-foreground">{demoProperty.title}</h3>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Prix affiche", value: demoProperty.price },
                      { label: "Loyer estime", value: demoProperty.rent },
                      { label: "Rentabilite", value: demoProperty.yield },
                      { label: "Cash-flow", value: demoProperty.cashFlow },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[1.1rem] border border-border/40 bg-background/35 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="rounded-[1.5rem] border border-border/50 bg-card/50 p-5 md:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Lecture GIGD</p>
                <div className="mt-4 rounded-[1.1rem] border border-border/40 bg-background/35 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Prix au m2 vs marche</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{demoProperty.marketGap}</p>
                </div>

                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {demoHighlights.map((point) => (
                    <li key={point} className="rounded-xl border border-border/40 bg-background/35 px-4 py-3">
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-[1.1rem] border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Conclusion demo</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/85">
                    Dossier plutot sain pour un investisseur qui cherche une exploitation simple. Le bien reste credible
                    si le loyer retenu est prudent, mais il faut garder un oeil sur le niveau d'entree par rapport au
                    secteur.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    to={defaultAnalysisHref}
                    onClick={() => trackEvent("click_cta_primary", { location: "home-bottom", target: defaultAnalysisHref })}
                  >
                    <Button className="w-full" variant="hero">
                      Lancer une analyse
                      <ArrowRight size={16} strokeWidth={1.5} />
                    </Button>
                  </Link>
                  <Link
                    to="/methode"
                    onClick={() => trackEvent("click_cta_secondary", { location: "home-bottom", target: "/methode" })}
                  >
                    <Button className="w-full" variant="hero-outline">Comprendre la methode</Button>
                  </Link>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
