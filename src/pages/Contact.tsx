import { FormEvent, useMemo, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Seo } from "@/components/seo/Seo";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, SUPPORT_SLA } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => {
    return name.trim().length > 1 && email.includes("@") && message.trim().length > 10;
  }, [email, message, name]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    const subject = encodeURIComponent(`Contact GIGD - ${name.trim()}`);
    const body = encodeURIComponent(
      `Nom: ${name.trim()}\nEmail: ${email.trim()}\nSociété: ${company.trim() || "Non précisée"}\n\nMessage:\n${message.trim()}`,
    );

    trackEvent("submit_contact_form", { source: "/contact" });
    setSubmitted(true);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <PageLayout>
      <Seo
        title="Contact GIGD"
        description="Contacter GIGD pour une question produit, un besoin d'accompagnement ou un sujet de partenariat."
        pathname="/contact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact GIGD",
            description: "Page de contact du site GIGD.",
            url: `${SITE_URL}/contact`,
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />

      <section className="py-20">
        <div className="container grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Contact</span>
            <h1 className="mt-4 text-4xl font-display font-bold text-foreground md:text-5xl">
              Une question produit, un besoin spécifique ou un sujet de partenariat
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              Utilisez ce formulaire pour nous écrire. Le message prépare un email vers {CONTACT_EMAIL} afin de rester
              simple, direct et sans dépendance à un service tiers ajouté à la hâte.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Nom</Label>
                  <Input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-company">Société ou contexte</Label>
                <Input
                  id="contact-company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Optionnel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Votre message</Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={7}
                  required
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" variant="hero" disabled={!isValid}>
                  Envoyer le message
                </Button>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-primary hover:underline"
                  onClick={() => trackEvent("click_email", { source: "/contact", email: CONTACT_EMAIL })}
                >
                  Écrire directement à {CONTACT_EMAIL}
                </a>
              </div>

              {submitted ? (
                <p className="text-sm text-muted-foreground">
                  Votre client email devrait s'ouvrir avec le message pré-rempli.
                </p>
              ) : null}
            </form>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[1.75rem] border border-border/50 bg-card/50 p-6">
              <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary">
                <Mail size={20} />
              </div>
              <h2 className="mt-4 text-xl font-display font-semibold text-foreground">Coordonnées</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Email:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                  onClick={() => trackEvent("click_email", { source: "contact-sidebar", email: CONTACT_EMAIL })}
                >
                  {CONTACT_EMAIL}
                </a>
                <br />
                Support: {SUPPORT_SLA}
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-border/50 bg-card/50 p-6">
              <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary">
                <ShieldCheck size={20} />
              </div>
              <h2 className="mt-4 text-xl font-display font-semibold text-foreground">Réassurance</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <li>Pas de tunnel agressif ni de collecte opaque.</li>
                <li>Le formulaire sert uniquement à préparer votre message vers l'équipe GIGD.</li>
                <li>Pour la gestion des données, voir la politique de confidentialité.</li>
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
