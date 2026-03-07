import { PageLayout } from "@/components/layout/PageLayout";

const MentionsLegales = () => (
  <PageLayout>
    <section className="py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Mentions légales</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">Éditeur du site</h2>
          <p>Le site GIGD est édité par [Nom société], [forme juridique], au capital de [montant] euros.<br/>
          SIRET : [SIRET]<br/>
          Siège social : [Adresse]<br/>
          Email : [Email]<br/>
          Directeur de la publication : [Nom du directeur]</p>

          <h2 className="text-lg font-semibold text-foreground">Hébergement</h2>
          <p>Le site est hébergé par [Nom hébergeur], [Adresse hébergeur], [Téléphone hébergeur].</p>

          <h2 className="text-lg font-semibold text-foreground">Propriété intellectuelle</h2>
          <p>L'ensemble du contenu du site (textes, images, graphismes, logo, icônes, logiciels) est la propriété exclusive de [Nom société], sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable.</p>

          <h2 className="text-lg font-semibold text-foreground">Responsabilité</h2>
          <p>GIGD est un outil d'aide à la décision. Les analyses fournies ne constituent en aucun cas un conseil en investissement, un conseil juridique ou un conseil fiscal. Les informations présentées sont indicatives et doivent être vérifiées par l'utilisateur auprès de professionnels qualifiés (notaire, expert-comptable, agent immobilier). [Nom société] ne saurait être tenue responsable des décisions prises sur la base des analyses fournies par l'outil.</p>

          <h2 className="text-lg font-semibold text-foreground">Données personnelles</h2>
          <p>Consultez notre <a href="/confidentialite" className="text-primary hover:underline">politique de confidentialité</a> pour en savoir plus sur la gestion de vos données personnelles.</p>

          <h2 className="text-lg font-semibold text-foreground">Cookies</h2>
          <p>Le site peut utiliser des cookies techniques nécessaires au bon fonctionnement du service. Aucun cookie publicitaire n'est utilisé sans votre consentement explicite.</p>

          <h2 className="text-lg font-semibold text-foreground">Droit applicable</h2>
          <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default MentionsLegales;
