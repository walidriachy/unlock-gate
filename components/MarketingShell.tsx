import MarketingNav from "./MarketingNav";
import MarketingFooter from "./MarketingFooter";
import ScrollProgress from "./anim/ScrollProgress";
import Reveal from "./anim/Reveal";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="glow relative overflow-hidden border-b border-[var(--color-line)]">
      <div className="relative mx-auto max-w-4xl px-5 py-16 text-center md:py-24">
        <div className="anim-in">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="display mt-4 text-4xl md:text-6xl">{title}</h1>
        </div>
        {subtitle && (
          <p className="anim-in mt-5 text-lg muted" style={{ animationDelay: "80ms" }}>
            {subtitle}
          </p>
        )}
        {children && (
          <div className="anim-in mt-8" style={{ animationDelay: "140ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function Section({
  title,
  intro,
  children,
  tinted = false,
  id,
}: {
  title?: string;
  intro?: string;
  children: React.ReactNode;
  tinted?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={tinted ? "border-y border-[var(--color-line)] bg-[rgba(255,255,255,0.02)]" : ""}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        {(title || intro) && (
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              {title && <h2 className="display text-3xl md:text-4xl">{title}</h2>}
              {intro && <p className="mt-4 muted">{intro}</p>}
            </div>
          </Reveal>
        )}
        <div className={title || intro ? "mt-12" : ""}>{children}</div>
      </div>
    </section>
  );
}
