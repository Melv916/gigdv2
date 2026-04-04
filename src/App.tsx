import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Produit from "./pages/Produit";
import Tarifs from "./pages/Tarifs";
import FAQ from "./pages/FAQ";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import CGU from "./pages/CGU";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/app/Dashboard";
import ProjectList from "./pages/app/ProjectList";
import NewProject from "./pages/app/NewProject";
import ProjectDetail from "./pages/app/ProjectDetail";
import Account from "./pages/app/Account";
import Subscription from "./pages/app/Subscription";
import Advanced from "./pages/app/Advanced";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Method from "./pages/Method";
import Resources from "./pages/Resources";
import SeoArticlePage from "./pages/SeoArticlePage";
import { seoPages } from "./content/seoPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produit" element={<Produit />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<Confidentialite />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/methode" element={<Method />} />
            <Route path="/ressources" element={<Resources />} />
            {seoPages.map((page) => (
              <Route key={page.path} path={page.path} element={<SeoArticlePage />} />
            ))}
            <Route path="/cgu" element={<CGU />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/projets" element={<ProjectList />} />
            <Route path="/app/projets/nouveau" element={<NewProject />} />
            <Route path="/app/projets/:id" element={<ProjectDetail />} />
            <Route path="/app/compte" element={<Account />} />
            <Route path="/app/abonnement" element={<Subscription />} />
            <Route path="/app/avance" element={<Advanced />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
