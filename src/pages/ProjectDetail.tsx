import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { Container, Eyebrow, Button } from '../components/primitives';
import Reveal from '../components/Reveal';
import { findProject, useProjects } from '../lib/projects';
import { useCopy } from '../lib/i18n';
import { useStatic } from '../lib/motion';
import { useNavTheme } from '../lib/navOverlay';

const COPY = {
  fi: {
    back: 'Kaikki työt',
    visit: 'Vieraile sivustolla',
    challenge: 'Haaste',
    did: 'Mitä teimme',
    delivered: 'Toimitettu',
    builtPre: 'Mitä',
    builtAccent: 'rakensimme.',
    moreEyebrow: 'Tutustu lisää',
    moreTitle: 'Lisää töitä.',
    ctaTitle: 'Haluatko vastaavia tuloksia?',
    ctaBody: 'Varaa ilmainen 15 minuutin puhelu, niin kerromme tarkalleen, mitä yrityksesi tarvitsee. Ei sitoumuksia, ei painostusta.',
    call: 'Varaa ilmainen puhelu',
  },
  en: {
    back: 'All work',
    visit: 'Visit the site',
    challenge: 'The challenge',
    did: 'What we did',
    delivered: 'Delivered',
    builtPre: 'What we',
    builtAccent: 'built.',
    moreEyebrow: 'Keep exploring',
    moreTitle: 'More work.',
    ctaTitle: 'Want results like this?',
    ctaBody: "Book a free 15-minute call and we'll tell you exactly what your business needs. No commitment, no pressure.",
    call: 'Book a free call',
  },
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const t = useCopy(COPY);
  const projects = useProjects();
  const project = findProject(projects, slug);
  const isStatic = useStatic();
  // The hero is full-bleed media starting at the very top, so the nav lands on
  // the artwork either way. Dark artwork carries a transparent, inverted nav;
  // anything else keeps the ordinary paper bar, since a light or mixed still
  // leaves no legible text colour.
  const darkHero = Boolean(project?.darkHero);
  useNavTheme(darkHero ? 'dark' : 'solid');

  useEffect(() => {
    if (project) document.title = `${project.name} — Ealize`;
    return () => {
      document.title = 'Ealize';
    };
  }, [project]);

  if (!project) return <Navigate to="/work" replace />;

  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <>
      {/* Hero: the reel, full screen and starting at the very top — no band
          of page above it. The back link is laid over the footage rather than
          sitting in a strip of its own, which is what used to push the video
          down. The name, summary and live link that used to sit here were
          removed by request; the heading survives as screen-reader text so the
          page still has an h1 to be indexed and navigated by. */}
      <section className="relative border-b border-line bg-ink">
        <h1 className="sr-only">{project.name}</h1>

        {project.video && !isStatic ? (
          <video
            className="block w-full object-cover"
            style={{ height: '100svh' }}
            src={project.video}
            poster={project.poster ?? project.img}
            autoPlay
            loop
            muted
            // Without this, iOS takes the video fullscreen instead of playing
            // it inline, and autoplay is refused outright.
            playsInline
            preload="metadata"
            aria-label={project.name}
          />
        ) : (
          <img
            src={project.video ? (project.poster ?? project.img) : project.img}
            alt={project.name}
            className="block w-full object-cover"
            style={{ height: '100svh' }}
          />
        )}

        <Container className="pointer-events-none absolute inset-x-0 top-24 md:top-28">
          <Link
            to="/work"
            className={`group pointer-events-auto inline-flex items-center gap-2 font-body text-sm transition-colors ${
              darkHero
                ? 'text-white/80 hover:text-white'
                : // Light or mixed artwork gives the link no colour that
                  // clears AA — measured 1.19:1 as ink and 1.0:1 as white over
                  // the Kesäyrittäjät still — so it brings its own paper chip.
                  'rounded-full border border-line bg-paper/90 px-3 py-1.5 text-ink/80 backdrop-blur-sm hover:text-ink'
            }`}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {t.back}
          </Link>
        </Container>
      </section>

      {/* Results band */}
      {project.highlights && (
        <section className="bg-blue py-16 md:py-20">
          <Container>
            <div className="grid gap-10 sm:grid-cols-3">
              {project.highlights.map((h, i) => (
                <Reveal key={h.label} delay={i * 0.08}>
                  <div className="border-l border-white/25 pl-6">
                    <div className="poster text-[clamp(2.5rem,5vw,3.75rem)] text-white">
                      {h.value}
                    </div>
                    <p className="mt-3 max-w-[16rem] font-body text-sm leading-relaxed text-white/75">
                      {h.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Facts + story */}
      <section className="border-b border-line bg-paper py-24 md:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <dl className="flex flex-col divide-y divide-line border-y border-line">
                {project.facts.map((f) => (
                  <div key={f.label} className="py-5">
                    <dt className="eyebrow text-ink/45">{f.label}</dt>
                    <dd
                      className={`mt-2 font-body text-base ${
                        f.accent ? 'font-semibold text-blue' : 'text-ink'
                      }`}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="flex flex-col gap-14 lg:col-span-7 lg:col-start-6">
              <Reveal>
                <Eyebrow>{t.challenge}</Eyebrow>
                <p className="mt-5 font-body text-lg leading-relaxed text-ink/70">
                  {project.challenge}
                </p>
              </Reveal>
              <Reveal>
                <Eyebrow>{t.did}</Eyebrow>
                <p className="mt-5 font-body text-lg leading-relaxed text-ink/70">
                  {project.solution}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Delivered */}
      <section className="border-b border-line bg-paper py-24 md:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>{t.delivered}</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2rem,4.5vw,3rem)] text-ink">
              {t.builtPre} <span className="text-blue">{t.builtAccent}</span>
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col divide-y divide-line border-y border-line">
            {project.delivered.map((d, i) => (
              <Reveal key={d.title} y={40}>
                <div className="flex items-start gap-8 py-10 md:gap-16 md:py-14">
                  <span className="mt-1 shrink-0 font-heading text-sm font-semibold tabular-nums text-blue">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
                      {d.title}
                    </h3>
                    <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-ink/60">
                      {d.text}
                    </p>
                  </div>
                  <Check className="mt-1.5 h-5 w-5 shrink-0 text-blue" strokeWidth={2.5} />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Other projects */}
      {others.length > 0 && (
        <section className="border-b border-line bg-paper-2 py-24 md:py-32">
          <Container>
            <Reveal>
              <Eyebrow>{t.moreEyebrow}</Eyebrow>
              <h2 className="poster mt-6 text-[clamp(2rem,4.5vw,3rem)] text-ink">
                {t.moreTitle}
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {others.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <Link to={`/work/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-paper">
                      <img
                        src={p.img}
                        alt={`${p.name}: ${p.tag}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <h3 className="font-heading text-lg font-semibold text-ink">
                        {p.name}
                      </h3>
                      <span className="font-body text-sm text-ink/50">{p.tag}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="bg-blue py-24 md:py-32">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="poster text-[clamp(2.25rem,5vw,3.5rem)] text-white">
              {t.ctaTitle}
            </h2>
            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-white/80">
              {t.ctaBody}
            </p>
            <div className="mt-9">
              <Button href="/contact" variant="white">
                {t.call}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
