import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  FolderOpen,
  Gem,
  LayoutDashboard,
  Loader2,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Projets", to: "/app/projets", icon: FolderOpen },
  { label: "Compte", to: "/app/compte", icon: UserCircle2 },
  { label: "Abonnement", to: "/app/abonnement", icon: CreditCard },
  { label: "Avancé", to: "/app/avance", icon: Gem },
];

const isNavItemActive = (pathname: string, itemPath: string) => {
  if (itemPath === "/app") return pathname === itemPath;
  return pathname.startsWith(itemPath);
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="noise-bg flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="noise-bg flex min-h-screen">
      <aside className="hidden shrink-0 px-4 py-5 md:flex md:w-[248px]">
        <div className="app-sidebar-shell flex h-[calc(100vh-2.5rem)] w-full flex-col rounded-[1.9rem] px-4 py-4">
          <Link to="/" className="rounded-[1.45rem] border border-white/6 bg-white/[0.02] px-4 py-4">
            <span className="text-xl font-bold text-foreground">
              GIGD<span className="text-primary">.</span>
            </span>
            <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
              GOOD INVESTMENT. GOOD DECISION.
            </div>
          </Link>

          <div className="mt-6 px-2">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Navigation</p>
          </div>

          <nav className="mt-3 flex-1 space-y-2 px-1">
            {navItems.map((item) => {
              const active = isNavItemActive(location.pathname, item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`app-sidebar-item flex items-center gap-3 rounded-[1.15rem] px-4 py-3 text-sm ${
                    active ? "app-sidebar-item-active pl-7 font-medium" : ""
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 rounded-[1.45rem] border border-white/8 bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Compte</p>
            <p className="mt-3 truncate text-sm font-medium text-foreground">{user.email}</p>
            <button
              onClick={() => signOut()}
              className="app-sidebar-item mt-4 flex w-full items-center gap-3 rounded-[1rem] px-3.5 py-3 text-sm hover:text-rose-100"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/6 bg-[rgba(8,14,26,0.72)] px-4 py-3 backdrop-blur-2xl md:hidden">
          <Link to="/" className="text-lg font-bold text-foreground">
            GIGD<span className="text-primary">.</span>
          </Link>

          <div className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const active = isNavItemActive(location.pathname, item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-[0.95rem] p-2.5 transition-all duration-300 ${
                    active ? "bg-primary/12 text-primary" : "text-slate-400"
                  }`}
                >
                  <item.icon size={18} />
                </Link>
              );
            })}
            <button
              onClick={() => signOut()}
              className="rounded-[0.95rem] p-2.5 text-slate-400 transition-colors hover:text-rose-200"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
