import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { Container, Eyebrow, Button } from '../components/primitives';
import Reveal from '../components/Reveal';
import { getService, SERVICES } from '../lib/services';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);

  useEffect(() => {
    if (service) document.title = `${service.title} — Ealize`;
    return () => {
      document.title = 'Ealize';
    };
  }, [service]);

  if (!service) return <Navigate to="/" replace />;

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-paper-2 pt-28 pb-20 md:pt-36 md:pb-28">
        <Container>
          <div className={service.slug === 'websites' ? 'flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16' : ''}>
            <Reveal className={service.slug === 'websites' ? 'lg:w-5/12 shrink-0' : 'max-w-2xl'}>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 font-body text-sm text-ink/60 transition-colors hover:text-blue"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                All services
              </Link>

              <div className="mt-8">
                <Eyebrow>{service.title}</Eyebrow>
              </div>
              <h1 className="poster mt-5 text-[clamp(2.5rem,6vw,4.25rem)] text-ink">
                {service.title}.
              </h1>
              <p className="mt-6 font-body text-lg leading-relaxed text-ink/65">
                {service.intro}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="/contact">
                  Book a free call
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button href="/pricing" variant="outline">
                  See pricing
                </Button>
              </div>
            </Reveal>

            {service.slug === 'websites' && (
              <Reveal delay={0.15} className="lg:flex-1 min-w-0">
                <div className="overflow-hidden rounded-2xl border border-line shadow-xl">
                  <img
                    src="/images/service-websites-hero.png"
                    alt="Website design mockups"
                    className="w-full"
                  />
                </div>
              </Reveal>
            )}
          </div>

          {service.slug === 'websites' && (
            <div className="mt-16 overflow-hidden rounded-2xl border border-line">
              <video
                src="/animationwebdesign.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
              />
            </div>
          )}

          {service.slug === 'websites' &&
            (() => {
              const cd = service.features.find((f) => f.slug === 'custom-design');
              if (!cd) return null;
              return (
                <div className="mt-20 flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
                  <Reveal className="lg:w-5/12 shrink-0">
                    <Eyebrow>{cd.title}</Eyebrow>
                    <h2 className="poster mt-5 text-[clamp(2rem,4.5vw,3rem)] text-ink">
                      {cd.title}.
                    </h2>
                    <p className="mt-6 font-body text-lg leading-relaxed text-ink/65">
                      {cd.detail}
                    </p>
                  </Reveal>

                  {cd.img && (
                    <Reveal delay={0.15} className="lg:flex-1 min-w-0">
                      <div className="overflow-hidden rounded-2xl border border-line shadow-xl">
                        <img src={cd.img} alt={cd.title} className="w-full" />
                      </div>
                    </Reveal>
                  )}
                </div>
              );
            })()}
        </Container>
      </section>

      {/* Features */}
      <section className="border-b border-line bg-paper py-24 md:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2rem,4.5vw,3rem)] text-ink">
              Everything, handled.
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col divide-y divide-line border-y border-line">
            {service.features.map((f, i) => {
              return (
                <Reveal key={f.slug} y={40}>
                  <div className="flex items-start gap-8 py-10 md:gap-16 md:py-14">
                    <span className="mt-1 shrink-0 font-heading text-sm font-semibold tabular-nums text-ink/25">
                      0{i + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
                        {f.title}
                      </h3>
                      <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-ink/60">{f.body}</p>
                    </div>
                    <Check className="mt-1.5 h-5 w-5 shrink-0 text-blue" strokeWidth={2.5} />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Other services */}
      <section className="border-b border-line bg-paper-2 py-24 md:py-32">
        <Container>
          <Reveal>
            <Eyebrow>Keep exploring</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2rem,4.5vw,3rem)] text-ink">
              Other services.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {others.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08}>
                <Link
                  to={`/services/${s.slug}`}
                  className="group flex h-full flex-col bg-paper p-7 transition-colors hover:bg-paper-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-100 text-blue">
                      <s.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-ink/25 transition-colors group-hover:text-blue" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink/55">
                    {s.body}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-blue py-24 md:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="poster text-[clamp(2.25rem,5vw,3.5rem)] text-white">
              Ready to get started?
            </h2>
            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-white/80">
              Book a free 15-minute call and we'll tell you exactly what your
              business needs. No commitment, no pressure.
            </p>
            <div className="mt-9">
              <Button href="/contact" variant="white">
                Book a free call
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
