import { PageLayout } from "@/components/layout/PageLayout";

const CGU = () => (
  <PageLayout>
    <section className="py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Conditions Generales d'Utilisation</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Derniere mise a jour : fevrier 2026</p>

          <h2 className="text-lg font-semibold text-foreground">1. Objet</h2>
          <p>Les presentes CGU regissent l'acces et l'utilisation du site et des services GIGD.</p>

          <h2 className="text-lg font-semibold text-foreground">2. Description du service</h2>
          <p>GIGD est un outil d'aide a la decision immobiliere. Il consolide donnees publiques et hypotheses utilisateur pour produire des indicateurs financiers.</p>

          <h2 className="text-lg font-semibold text-foreground">3. Nature de l'outil</h2>
          <p>GIGD ne constitue pas un conseil en investissement, juridique ou fiscal. Les resultats sont indicatifs et doivent etre verifies avant toute decision.</p>

          <h2 className="text-lg font-semibold text-foreground">4. Acces au service</h2>
          <p>Le service est accessible aux utilisateurs disposant d'un compte. Certaines fonctionnalites dependent de la formule d'abonnement selectionnee.</p>

          <h2 className="text-lg font-semibold text-foreground">5. Obligations de l'utilisateur</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fournir des informations exactes</li>
            <li>Ne pas utiliser le service a des fins illicites</li>
            <li>Respecter les droits de propriete intellectuelle</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">6. Limitation de responsabilite</h2>
          <p>GIGD ne saurait etre responsable des decisions prises sur la base des analyses fournies.</p>

          <h2 className="text-lg font-semibold text-foreground">7. Protection des donnees</h2>
          <p>Le traitement des donnees personnelles est decrit dans notre <a href="/confidentialite" className="text-primary hover:underline">politique de confidentialite</a>.</p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default CGU;

