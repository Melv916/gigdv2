import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { PillarsSection } from "@/components/landing/PillarsSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { MethodSection } from "@/components/landing/MethodSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { LevelsSection } from "@/components/landing/LevelsSection";
import { DashboardMock } from "@/components/landing/DashboardMock";
import { FAQSection } from "@/components/landing/FAQSection";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  ArrowRight,
  MessageSquareText,
  Database,
  Users,
  ChevronRight,
} from "lucide-react";
import "./index-home.css";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listingUrl, setListingUrl] = useState("");

  const launchHref = useMemo(() => {
    const nextUrl = encodeURIComponent(listingUrl.trim());
    return user ? `/app/projets/nouveau${nextUrl ? `?url=${nextUrl}` : ""}` : "/auth";
  }, [listingUrl, user]);

  const onAnalyze = () => {
    navigate(launchHref);
  };

  return (
    <div className="v2home-root min-h-screen flex flex-col">
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
                  <Link to="/produit" className="v2home-stage-navlink">Produit</Link>
                  <Link to="/tarifs" className="v2home-stage-navlink">Tarifs</Link>
                  <Link to="/faq" className="v2home-stage-navlink">FAQ</Link>
                </nav>

                <Link to={user ? "/app" : "/auth"}>
                  <Button variant="hero-outline" size="sm">{user ? "Mon espace" : "Connexion"}</Button>
                </Link>
              </header>

              <div className="v2home-stage-hero">
                <h1 className="mt-4 text-4xl md:text-6xl font-display font-bold leading-[1.05] text-white">
                  L'interface qui structure
                  <br />
                  <span className="v2home-headline-accent">tes decisions d'investisseur.</span>
                </h1>

                <p className="mt-5 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
                  Importe une annonce. GIGD fait le reste.
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

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
                  {[
                    { label: "Confiance loyer", value: "84/100" },
                    { label: "Cash-flow net-net", value: "+162 EUR/mois" },
                    { label: "TRI projet", value: "11.2%" },
                  ].map((s) => (
                    <div key={s.label} className="v2home-card v2home-card-secondary p-4 text-left">
                      <p className="v2home-label">{s.label}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <section className="v2home-workspace">
                <aside className="v2home-workspace-left">
                  <Link to="/produit#exemple-nego" className="v2home-iconbtn" aria-label="Exemple script de negociation">
                    <MessageSquareText size={14} />
                  </Link>
                  <Link to="/produit#exemple-database" className="v2home-iconbtn" aria-label="Exemple base de donnees">
                    <Database size={14} />
                  </Link>
                  <Link to="/produit#exemple-risque" className="v2home-iconbtn" aria-label="Exemple analyse de risque">
                    <Users size={14} />
                  </Link>
                </aside>

                <div className="v2home-workspace-main">
                  <div className="v2home-workspace-head">
                    <p className="text-sm text-foreground font-semibold">Core Team - Deal review</p>
                    <span className="text-xs text-muted-foreground">Canal prioritaire</span>
                  </div>
                  <div className="v2home-chat-stack">
                    <div className="v2home-chat-card">
                      <p className="text-xs text-muted-foreground">Ari - 11:14</p>
                      <p className="text-sm text-foreground mt-1">
                        Le prix affiche doit descendre de 20k pour tenir notre DSCR cible.
                      </p>
                    </div>
                    <div className="v2home-chat-card">
                      <p className="text-xs text-muted-foreground">Tejas - 11:19</p>
                      <p className="text-sm text-foreground mt-1">
                        OK, on envoie un script de nego base sur les risques DPE et charges copro.
                      </p>
                    </div>
                  </div>
                </div>

                <aside className="v2home-workspace-right">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Quick access</p>
                  <div className="mt-2 space-y-2">
                    <Link to="/produit#exemple-database" className="v2home-side-row">
                      <span>Database</span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link to="/produit#exemple-api" className="v2home-side-row">
                      <span>API Collections</span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link to="/produit#exemple-nego" className="v2home-side-row">
                      <span>Scripts de nego</span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link to="/produit#exemple-risque" className="v2home-side-row">
                      <span>Analyse risque</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </aside>
              </section>
            </div>
          </div>
        </section>

        <div className="container py-14 space-y-14">
          <section className="v2home-section-shell"><DashboardMock /></section>
          <section className="v2home-section-shell"><SocialProofSection /></section>
          <section className="v2home-section-shell"><ProblemSection /></section>
          <section className="v2home-section-shell"><SolutionSection /></section>
          <section className="v2home-section-shell"><PillarsSection /></section>
          <section className="v2home-section-shell"><MissionSection /></section>
          <section className="v2home-section-shell"><MethodSection /></section>
          <section className="v2home-section-shell"><ComparisonSection /></section>
          <section className="v2home-section-shell"><LevelsSection /></section>
          <section className="v2home-section-shell"><FAQSection /></section>
          <section className="v2home-section-shell"><WaitlistForm /></section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
