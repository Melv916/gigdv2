import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const MentionsLegales = () => (
  <PageLayout>
    <Seo
      title="Mentions légales"
      description="Mentions légales du site GIGD: éditeur, responsable de publication, hébergement et contact."
      pathname="/mentions-legales"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Mentions légales GIGD",
          url: `${SITE_URL}/mentions-legales`,
          publisher: { "@type": "Organization", name: SITE_NAME },
        },
      ]}
    />

    <section className="py-20">
      <div className="container max-w-4xl">
        <div className="glass-card rounded-[2rem] p-8 md:p-10">
          <h1 className="text-3xl font-display font-bold text-foreground md:text-4xl">Mentions légales</h1>
          <div className="prose prose-invert prose-sm mt-8 max-w-none text-muted-foreground">
            <h2>Éditeur du site</h2>
            <p>
              {SITE_NAME} est un service web d'analyse immobilière et d'aide à la décision pour l'investissement locatif.
            </p>

            <h2>Responsable de publication</h2>
            <p>
              La publication du site est assurée par l'équipe GIGD. Pour toute demande relative au contenu du site ou à
              l'utilisation du service, vous pouvez écrire à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Hébergement</h2>
            <p>
              Le site est hébergé sur une infrastructure de diffusion web compatible SPA. La configuration du projet
              actuellement versionnée repose sur Netlify pour la publication front et sur Supabase pour les services de
              données et d'authentification.
            </p>

            <h2>Contact</h2>
            <p>
              Email principal: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              La structure du site, les contenus originaux, la marque GIGD et les éléments graphiques associés sont
              protégés par les règles applicables en matière de propriété intellectuelle. Toute reproduction ou
              réutilisation non autorisée est interdite.
            </p>

            <h2>Nature des informations</h2>
            <p>
              Les contenus publics et les analyses produites dans l'application ont pour finalité d'aider à la
              compréhension et à la décision. Ils ne constituent pas un conseil juridique, fiscal, comptable ou
              financier.
            </p>

            <h2>Pages utiles</h2>
            <p>
              Vous pouvez également consulter la <Link to="/politique-confidentialite">politique de confidentialité</Link>,
              la <Link to="/methode">méthode</Link> et la <Link to="/contact">page contact</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default MentionsLegales;
