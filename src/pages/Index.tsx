import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo/Seo";
import { PremiumHeroScene } from "@/components/landing/PremiumHeroScene";
import { useAuth } from "@/hooks/useAuth";
import { getAnalysisCtaPath, primaryNavLinks, SITE_NAME, SITE_URL } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import { Search, ArrowRight } from "lucide-react";
import "./index-home.css";

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
          <PremiumHeroScene />
          <div className="v2home-showcase-overlay" />

          <div className="container v2home-hero-shell">
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
              <div className="v2home-stage-grid">
                <div className="v2home-copy-col">
                  <h1 className="v2home-hero-title">
                    Ne devinez plus,
                    <span className="v2home-headline-accent">soyez sûrs.</span>
                  </h1>

                  <p className="v2home-hero-copy">
                    Le projet a été développé pour aider les investisseurs à comprendre rapidement si un bien tient
                    réellement debout : coût global, rentabilité, cash-flow, hypothèses, projections et lecture du
                    marché local.
                  </p>

                  <div className="v2home-input-block">
                    <div className="v2home-input-shell">
                      <Search size={17} strokeWidth={1.5} className="v2home-icon" />
                      <input
                        type="url"
                        value={listingUrl}
                        onChange={(e) => setListingUrl(e.target.value)}
                        placeholder="https://... collez le lien de l'annonce"
                        className="v2home-url-input"
                      />
                      <Button className="v2home-cta-btn px-5" onClick={onAnalyze}>
                        Lancer l’analyse
                        <ArrowRight size={16} strokeWidth={1.5} />
                      </Button>
                    </div>

                    <div className="v2home-input-meta">
                      <span>Seloger, Leboncoin ou saisie manuelle</span>
                      <span>Lecture brute, marché, projection et cash-flow</span>
                    </div>
                  </div>

                  <div className="v2home-hero-actions">
                    <Link
                      to={secondaryHref}
                      onClick={() => trackEvent("click_cta_secondary", { location: "home-hero", target: secondaryHref })}
                    >
                      <Button variant="hero-outline" size="sm">Comprendre la méthode</Button>
                    </Link>
                    <Link
                      to={defaultAnalysisHref}
                      className="v2home-inline-link"
                      onClick={() => trackEvent("click_cta_secondary", { location: "home-hero-text", target: defaultAnalysisHref })}
                    >
                      Ouvrir l'application sans URL
                    </Link>
                  </div>

                  <div className="v2home-mobile-summary">
                    <div className="v2home-mobile-chip">Lecture directe du rendement, du cash-flow et du marché.</div>
                    <div className="v2home-mobile-chip">Pensé pour passer vite de l'annonce à la décision.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
