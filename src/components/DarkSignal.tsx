import { Container, Eyebrow, Button } from './primitives';
import Reveal from './Reveal';
import { IMG } from '../lib/assets';
import { useCopy } from '../lib/i18n';

const COPY = {
  fi: {
    eyebrow: 'Signaali, ei kohinaa',
    title: 'Data ilman oivalluksia on pelkkää kohinaa.',
    body: 'Yhdistämme työkalut, joita yrityksesi jo käyttää, rakentamamme sivuston kävijädataan ja muutamme kaiken selkeiksi vastauksiksi: mistä asiakkaat tulevat, mikä toimii ja mitä kannattaa muuttaa seuraavaksi. Näin jokainen päätös perustuu näyttöön eikä arvailuun.',
    cta: 'Katso miten se toimii',
  },
  en: {
    eyebrow: 'Signal, not noise',
    title: 'Data without insight is just noise.',
    body: 'We connect the tools your business already uses with the visitor data from the website we build, then turn it all into clear answers: where customers come from, what works, and what to change next. So every decision is backed by evidence, not guesswork.',
    cta: 'See how it works',
  },
};

export default function DarkSignal() {
  const t = useCopy(COPY);
  return (
    <section className="relative overflow-hidden bg-navy py-28 md:py-36">
      {/* Generated cobalt data-wave field */}
      <div
        className="noise-field pointer-events-none absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${IMG.dataWave})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,16,58,0.95) 0%, rgba(5,16,58,0.6) 45%, rgba(5,16,58,0.2) 100%)',
        }}
        aria-hidden
      />

      <Container className="relative">
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow dark>{t.eyebrow}</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2.5rem,6vw,4.25rem)] text-white">
              {t.title}
            </h2>
            <p className="mt-7 max-w-md font-body text-base leading-relaxed text-white/70">
              {t.body}
            </p>
            <div className="mt-9">
              <Button href="/services" variant="white">
                {t.cta}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
