import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const Confidentialite = () => (
  <PageLayout>
    <Seo
      title="Politique de confidentialite"
      description="Politique de confidentialite de GIGD: donnees collectees, finalites, duree de conservation et droits utilisateur."
      pathname="/politique-confidentialite"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Politique de confidentialite GIGD",
          url: `${SITE_URL}/politique-confidentialite`,
          publisher: { "@type": "Organization", name: SITE_NAME },
        },
      ]}
    />

    <section className="py-20">
      <div className="container max-w-4xl">
        <div className="glass-card rounded-[2rem] p-8 md:p-10">
          <h1 className="text-3xl font-display font-bold text-foreground md:text-4xl">Politique de confidentialite</h1>
          <div className="prose prose-invert prose-sm mt-8 max-w-none text-muted-foreground">
            <p>Derniere mise a jour: mars 2026.</p>

            <h2>Responsable du traitement</h2>
            <p>
              Les traitements realises via le site et l'application GIGD sont administres par l'equipe GIGD. Pour toute
              question relative a vos donnees personnelles: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Donnees collectees</h2>
            <ul>
              <li>Donnees de compte: email et informations necessaires a l'authentification.</li>
              <li>Donnees de projet: informations sur les biens analyses et hypotheses saisies dans l'application.</li>
              <li>Donnees techniques: journaux techniques, informations de navigation et evenements utiles au pilotage du service.</li>
              <li>Donnees de contact: contenu des messages transmis via la page contact ou par email.</li>
            </ul>

            <h2>Finalites</h2>
            <ul>
              <li>Permettre l'acces au service et l'administration du compte utilisateur.</li>
              <li>Fournir les analyses, les restitutions produit et le suivi d'abonnement.</li>
              <li>Repondre aux demandes de support, contact et relation client.</li>
              <li>Ameliorer la qualite du produit, la comprehension des pages publiques et le suivi de conversion.</li>
            </ul>

            <h2>Base legale</h2>
            <p>
              Les traitements sont fondes, selon les cas, sur l'execution du contrat de service, l'interet legitime de
              l'editeur pour l'amelioration et la securisation du service, ou le consentement lorsque celui-ci est requis.
            </p>

            <h2>Duree de conservation</h2>
            <p>
              Les donnees sont conservees pendant la duree strictement necessaire a la fourniture du service, a la gestion
              de la relation client et au respect des obligations legales applicables. Les donnees de compte et de projet
              peuvent etre supprimees ou anonymisees sur demande, sous reserve des obligations de conservation legales.
            </p>

            <h2>Destinataires</h2>
            <p>
              Les donnees sont traitees dans l'environnement technique du service et peuvent etre accessibles aux
              prestataires strictement necessaires a l'exploitation du produit, dans la limite de ce qui est utile a la
              fourniture du service.
            </p>

            <h2>Vos droits</h2>
            <p>
              Vous pouvez demander l'acces, la rectification, l'effacement, la limitation ou la portabilite de vos
              donnees, ou vous opposer a certains traitements lorsque la loi le permet. Les demandes peuvent etre adressees
              a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Pages utiles</h2>
            <p>
              Pour comprendre comment le produit exploite les donnees dans ses analyses, consultez la <Link to="/methode">methode</Link>.
              Pour toute demande specifique, utilisez la <Link to="/contact">page contact</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Confidentialite;
