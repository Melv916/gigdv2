import { motion } from "framer-motion";
import { AlertTriangle, BarChart3, MapPin, FileText, TrendingUp, WalletCards } from "lucide-react";

export function DashboardMock() {
  return (
    <section id="dashboard-mock" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Cockpit V2</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Une interface concue pour trancher vite
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto holo-panel rounded-3xl p-6 md:p-8 gradient-border"
        >
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4 space-y-3">
              <div className="rounded-2xl bg-muted/25 p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Verdict deal</p>
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 mb-3">
                  A negocier
                </div>
                <p className="text-sm text-foreground font-semibold">T3 - Lyon 3e - 72 m2</p>
                <p className="text-xs text-muted-foreground mt-1">Prix annonce: 285 000 EUR</p>
              </div>

              <div className="rounded-2xl bg-muted/25 p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">KPI prioritaires</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cash-flow net-net</span>
                    <span className="text-green-400 font-semibold">+85 EUR/mois</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rendement net</span>
                    <span className="text-foreground font-semibold">5.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">TRI</span>
                    <span className="text-foreground font-semibold">9.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">DSCR</span>
                    <span className="text-foreground font-semibold">1.27</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-destructive/8 border border-destructive/30 p-4">
                <p className="text-[10px] uppercase tracking-wider text-destructive mb-2">Alerte principale</p>
                <p className="text-sm text-foreground">Prix m2 superieur au secteur</p>
                <p className="text-xs text-destructive mt-1">Ecart estime: -20 000 EUR</p>
              </div>
            </div>

            <div className="xl:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Prix cible", value: "265k EUR", sub: "hors frais" },
                  { label: "Loyer estime", value: "1 180 EUR", sub: "source ANIL" },
                  { label: "Confiance", value: "72/100", sub: "donnees locales" },
                  { label: "VAN 10 ans", value: "+18k EUR", sub: "taux 6%" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-muted/25 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-base font-display font-semibold text-foreground">{item.value}</p>
                    <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-muted/20 p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-destructive" />
                    Risques a verifier
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg bg-background/40 p-3">
                      Charges copro elevees
                      <p className="text-destructive mt-1">Impact: -4 560 EUR/an</p>
                    </div>
                    <div className="rounded-lg bg-background/40 p-3">
                      DPE E, budget travaux a estimer
                      <p className="text-destructive mt-1">Impact potentiel: 8k a 15k EUR</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-muted/20 p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 size={14} className="text-primary" />
                    Donnees operationnelles
                  </h4>
                  <div className="space-y-2">
                    {[
                      { icon: MapPin, label: "Mediane DVF", value: "3 690 EUR/m2" },
                      { icon: TrendingUp, label: "Rendement brut", value: "5.8%" },
                      { icon: WalletCards, label: "Mensualite", value: "1 040 EUR" },
                      { icon: FileText, label: "Regime fiscal", value: "LMNP micro" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between bg-background/40 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <row.icon size={13} className="text-primary" /> {row.label}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
