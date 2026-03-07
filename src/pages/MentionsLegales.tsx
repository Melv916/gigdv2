import { PageLayout } from "@/components/layout/PageLayout";

const MentionsLegales = () => (
  <PageLayout>
    <section className="py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Mentions legales</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Ce site appartient a la societe GIGD.</p>
          <p>Contact: contact@gigd.fr</p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default MentionsLegales;
