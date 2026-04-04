import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const Confidentialite = () => (
  <PageLayout>
    <Seo
      title="Politique de confidentialité"
      description="Politique de confidentialité de GIGD: données collectées, finalités, durée de conservation et droits utilisateur."
      pathname="/politique-confidentialite"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Politique de confidentialité GIGD",
          url: `${SITE_URL}/politique-confidentialite`,
          publisher: { "@type": "Organization", name: SITE_NAME },
        },
      ]}
    />

    <section className="py-20">
      <div className="container max-w-4xl">
        <div className="glass-card rounded-[2rem] p-8 md:p-10">
          <h1 className="text-3xl font-display font-bold text-foreground md:text-4xl">Politique de confidentialité</h1>
          <div className="prose prose-invert prose-sm mt-8 max-w-none text-muted-foreground">
            <p>Dernière mise à jour: mars 2026.</p>

            <h2>Responsable du traitement</h2>
            <p>
              Les traitements réalisés via le site et l'application GIGD sont administrés par l'équipe GIGD. Pour toute
              question relative à vos données personnelles: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Données collectées</h2>
            <ul>
              <li>Données de compte: email et informations nécessaires à l'authentification.</li>
              <li>Données de projet: informations sur les biens analysés et hypothèses saisies dans l'application.</li>
              <li>Données techniques: journaux techniques, informations de navigation et événements utiles au pilotage du service.</li>
              <li>Données de contact: contenu des messages transmis via la page contact ou par email.</li>
            </ul>

            <h2>Finalités</h2>
            <ul>
              <li>Permettre l'accès au service et l'administration du compte utilisateur.</li>
              <li>Fournir les analyses, les restitutions produit et le suivi d'abonnement.</li>
              <li>Répondre aux demandes de support, contact et relation client.</li>
              <li>Améliorer la qualité du produit, la compréhension des pages publiques et le suivi de conversion.</li>
            </ul>

            <h2>Base légale</h2>
            <p>
              Les traitements sont fondés, selon les cas, sur l'exécution du contrat de service, l'intérêt légitime de
              l'éditeur pour l'amélioration et la sécurisation du service, ou le consentement lorsque celui-ci est requis.
            </p>

            <h2>Durée de conservation</h2>
            <p>
              Les données sont conservées pendant la durée strictement nécessaire à la fourniture du service, à la gestion
              de la relation client et au respect des obligations légales applicables. Les données de compte et de projet
              peuvent être supprimées ou anonymisées sur demande, sous réserve des obligations de conservation légales.
            </p>

            <h2>Destinataires</h2>
            <p>
              Les données sont traitées dans l'environnement technique du service et peuvent être accessibles aux
              prestataires strictement nécessaires à l'exploitation du produit, dans la limite de ce qui est utile à la
              fourniture du service.
            </p>

            <h2>Vos droits</h2>
            <p>
              Vous pouvez demander l'accès, la rectification, l'effacement, la limitation ou la portabilité de vos
              données, ou vous opposer à certains traitements lorsque la loi le permet. Les demandes peuvent être adressées
              à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Pages utiles</h2>
            <p>
              Pour comprendre comment le produit exploite les données dans ses analyses, consultez la <Link to="/methode">méthode</Link>.
              Pour toute demande spécifique, utilisez la <Link to="/contact">page contact</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Confidentialite;
