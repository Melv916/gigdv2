import { ReactNode, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FolderOpen, UserCircle2, CreditCard, Gem, LogOut, Loader2 } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Projets", to: "/app/projets", icon: FolderOpen },
  { label: "Compte", to: "/app/compte", icon: UserCircle2 },
  { label: "Abonnement", to: "/app/abonnement", icon: CreditCard },
  { label: "Avance", to: "/app/avance", icon: Gem },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen noise-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen noise-bg flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border/50 glass-card">
        <Link to="/" className="flex flex-col px-6 py-5 border-b border-border/30">
          <span className="text-lg font-display font-bold text-foreground">
            GIGD<span className="text-primary">.</span>
          </span>
          <span className="text-[8px] tracking-[0.15em] text-muted-foreground uppercase">
            Good Investment. Good Decision.
          </span>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground truncate px-3 mb-2">{user.email}</p>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 glass-card">
          <Link to="/" className="font-display font-bold text-foreground">
            GIGD<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`p-2 rounded-lg ${
                  location.pathname === item.to ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
              >
                <item.icon size={18} />
              </Link>
            ))}
            <button onClick={() => signOut()} className="p-2 text-muted-foreground hover:text-destructive">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
