import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getAnalysisCtaPath, primaryNavLinks } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const ctaHref = getAnalysisCtaPath(Boolean(user));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-xl font-display font-bold tracking-tight text-foreground">
            GIGD<span className="text-primary">.</span>
          </span>
          <span className="text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            Good Investment. Good Decision.
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 p-1">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                location.pathname === link.to
                  ? "text-foreground bg-background/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={ctaHref}
            onClick={() => trackEvent("click_cta_primary", { location: "header", target: ctaHref })}
          >
            <Button variant="hero-outline" size="sm" className="hidden md:inline-flex">
              {user ? "Mon espace" : "Lancer une analyse"}
            </Button>
          </Link>
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/30 overflow-hidden"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={ctaHref}
                onClick={() => trackEvent("click_cta_primary", { location: "header-mobile", target: ctaHref })}
              >
                <Button variant="hero-outline" size="sm" className="mt-2 w-fit">
                  {user ? "Mon espace" : "Lancer une analyse"}
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
