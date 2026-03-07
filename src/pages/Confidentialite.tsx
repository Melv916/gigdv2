import { PageLayout } from "@/components/layout/PageLayout";

const Confidentialite = () => (
  <PageLayout>
    <section className="py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Politique de confidentialite</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Derniere mise a jour : fevrier 2026</p>

          <h2 className="text-lg font-semibold text-foreground">Responsable du traitement</h2>
          <p>[Nom societe] - [Adresse] - Email : [Email]</p>

          <h2 className="text-lg font-semibold text-foreground">Finalites du traitement</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Creer et administrer votre compte utilisateur</li>
            <li>Fournir les analyses et les services associes</li>
            <li>Gerer les abonnements et la relation client</li>
            <li>Repondre a vos demandes de support</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">Donnees collectees</h2>
          <p>Donnees de compte (email), donnees de projets et donnees techniques necessaires au fonctionnement du service.</p>

          <h2 className="text-lg font-semibold text-foreground">Base legale</h2>
          <p>Execution du contrat de service et interet legitime pour l'amelioration produit.</p>

          <h2 className="text-lg font-semibold text-foreground">Conservation</h2>
          <p>Les donnees sont conservees pendant la duree de la relation commerciale puis selon les obligations legales applicables.</p>

          <h2 className="text-lg font-semibold text-foreground">Vos droits</h2>
          <p>Vous disposez des droits d'acces, rectification, effacement, opposition et portabilite. Contact : [Email]</p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Confidentialite;


