import type { ReactNode } from 'react';

type Section = {
  title: string;
  body?: string;
  bullets?: string[];
  children?: ReactNode;
};

interface CompliancePageProps {
  title: string;
  intro: string;
  sections: Section[];
  footer?: ReactNode;
}

export function CompliancePage({ title, intro, sections, footer }: CompliancePageProps) {
  return (
    <main className="min-h-screen bg-cream-50">
      <section className="mx-auto max-w-screen-xl px-6 py-16 lg:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
            Compliance and trust
          </p>
          <h1 className="mb-4 font-display text-h1 text-ink-800">{title}</h1>
          <p className="text-body-lg text-text-muted">{intro}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-cream-100 bg-white p-8 shadow-sm"
            >
              <h2 className="mb-4 text-h3 font-semibold text-ink-800">{section.title}</h2>
              {section.body ? (
                <p className="text-body text-text-muted">{section.body}</p>
              ) : null}
              {section.bullets ? (
                <ul className="mt-4 space-y-2 text-body text-text-muted">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.children}
            </article>
          ))}
        </div>

        {footer ? <div className="mt-8">{footer}</div> : null}
      </section>
    </main>
  );
}
