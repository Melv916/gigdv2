import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";

const CGU = () => (
  <PageLayout>
    <Seo
      title="Conditions générales d'utilisation"
      description="Conditions générales d'utilisation du site et du service GIGD."
      pathname="/cgu"
    />
    <section className="py-24">
      <div className="container max-w-3xl">
        <h1 className="mb-8 text-3xl font-display font-bold text-foreground">Conditions générales d'utilisation</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Dernière mise à jour : février 2026</p>

          <h2 className="text-lg font-semibold text-foreground">1. Objet</h2>
          <p>Les présentes CGU régissent l'accès et l'utilisation du site et des services GIGD.</p>

          <h2 className="text-lg font-semibold text-foreground">2. Description du service</h2>
          <p>
            GIGD est un outil d'aide à la décision immobilière. Il consolide données publiques et hypothèses utilisateur
            pour produire des indicateurs financiers.
          </p>

          <h2 className="text-lg font-semibold text-foreground">3. Nature de l'outil</h2>
          <p>
            GIGD ne constitue pas un conseil en investissement, juridique ou fiscal. Les résultats sont indicatifs et
            doivent être vérifiés avant toute décision.
          </p>

          <h2 className="text-lg font-semibold text-foreground">4. Accès au service</h2>
          <p>
            Le service est accessible aux utilisateurs disposant d'un compte. Certaines fonctionnalités dépendent de la
            formule d'abonnement sélectionnée.
          </p>

          <h2 className="text-lg font-semibold text-foreground">5. Obligations de l'utilisateur</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fournir des informations exactes</li>
            <li>Ne pas utiliser le service à des fins illicites</li>
            <li>Respecter les droits de propriété intellectuelle</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">6. Limitation de responsabilite</h2>
          <p>GIGD ne saurait être responsable des décisions prises sur la base des analyses fournies.</p>

          <h2 className="text-lg font-semibold text-foreground">7. Protection des données</h2>
          <p>
            Le traitement des données personnelles est décrit dans notre{" "}
            <a href="/politique-confidentialite" className="text-primary hover:underline">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default CGU;
