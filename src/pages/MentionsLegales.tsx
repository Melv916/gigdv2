import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const MentionsLegales = () => (
  <PageLayout>
    <Seo
      title="Mentions legales"
      description="Mentions legales du site GIGD: editeur, responsable de publication, hebergement et contact."
      pathname="/mentions-legales"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Mentions legales GIGD",
          url: `${SITE_URL}/mentions-legales`,
          publisher: { "@type": "Organization", name: SITE_NAME },
        },
      ]}
    />

    <section className="py-20">
      <div className="container max-w-4xl">
        <div className="glass-card rounded-[2rem] p-8 md:p-10">
          <h1 className="text-3xl font-display font-bold text-foreground md:text-4xl">Mentions legales</h1>
          <div className="prose prose-invert prose-sm mt-8 max-w-none text-muted-foreground">
            <h2>Editeur du site</h2>
            <p>
              {SITE_NAME} est un service web d'analyse immobiliere et d'aide a la decision pour l'investissement locatif.
            </p>

            <h2>Responsable de publication</h2>
            <p>
              La publication du site est assuree par l'equipe GIGD. Pour toute demande relative au contenu du site ou a
              l'utilisation du service, vous pouvez ecrire a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Hebergement</h2>
            <p>
              Le site est heberge sur une infrastructure de diffusion web compatible SPA. La configuration du projet
              actuellement versionnee repose sur Netlify pour la publication front et sur Supabase pour les services de
              donnees et d'authentification.
            </p>

            <h2>Contact</h2>
            <p>
              Email principal: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>

            <h2>Propriete intellectuelle</h2>
            <p>
              La structure du site, les contenus originaux, la marque GIGD et les elements graphiques associes sont
              proteges par les regles applicables en matiere de propriete intellectuelle. Toute reproduction ou
              reutilisation non autorisee est interdite.
            </p>

            <h2>Nature des informations</h2>
            <p>
              Les contenus publics et les analyses produites dans l'application ont pour finalite d'aider a la
              comprehension et a la decision. Ils ne constituent pas un conseil juridique, fiscal, comptable ou
              financier.
            </p>

            <h2>Pages utiles</h2>
            <p>
              Vous pouvez egalement consulter la <Link to="/politique-confidentialite">politique de confidentialite</Link>,
              la <Link to="/methode">methode</Link> et la <Link to="/contact">page contact</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default MentionsLegales;
