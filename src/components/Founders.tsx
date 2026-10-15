import { Container, Eyebrow, Button } from './primitives';
import Reveal from './Reveal';
import { IMG } from '../lib/assets';
import { useCopy } from '../lib/i18n';

const COPY = {
  fi: {
    points: [
      { k: '2', v: 'Perustajaa, yksi keskittynyt tiimi' },
      { k: '17', v: 'Vuotta vanhoja ja jo toimittamassa' },
      { k: 'Helsinki', v: 'Tehty täällä, koko Suomelle' },
    ],
    eyebrow: 'Nuoret mielet, todellinen vaikutus',
    title: ['Pieni tiimi.', 'Iso vaikutus.'],
    body: 'Olemme kaksi 17-vuotiasta perustajaa Helsingistä, ja tehtävämme on auttaa pienyrityksiä kasvamaan paremmilla verkkosivuilla, selkeämmällä datalla ja markkinoinnilla, jolla heidät löydetään. Ei toimiston yleiskuluja, ei jargonia. Vain moderneja järjestelmiä ja ihmisiä, joille sinun tuloksesi oikeasti merkitsee.',
    cta: 'Tutustu meihin',
    imgAlt: 'Kaksi perustajaa työskentelemässä yhdessä Helsingissä',
    place: 'Helsinki, Suomi',
  },
  en: {
    points: [
      { k: '2', v: 'Founders, one focused team' },
      { k: '17', v: 'Years old and already shipping' },
      { k: 'Helsinki', v: 'Built here, for all of Finland' },
    ],
    eyebrow: 'Young minds, real impact',
    title: ['Small team.', 'Big impact.'],
    body: "We're two 17-year-old founders from Helsinki on a mission to help small businesses grow with better websites, clearer data and marketing that gets them found. No agency overhead, no jargon. Just modern systems and people who actually care about your result.",
    cta: 'Get to know us',
    imgAlt: 'The two founders working together in Helsinki',
    place: 'Helsinki, Finland',
  },
};

export default function Founders() {
  const t = useCopy(COPY);
  return (
    <section id="about" className="bg-paper-2 py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <Reveal>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
                {t.title[0]}
                <br />
                {t.title[1]}
              </h2>
              <p className="mt-7 max-w-md font-body text-base leading-relaxed text-ink/65">
                {t.body}
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
                {t.points.map((p) => (
                  <div key={p.k}>
                    <div className="font-heading text-2xl font-bold text-blue md:text-3xl">
                      {p.k}
                    </div>
                    <div className="mt-2 font-body text-xs leading-snug text-ink/55">
                      {p.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button href="/contact">{t.cta}</Button>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <img
                  src={IMG.founders}
                  alt={t.imgAlt}
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 font-body text-xs text-ink">
                  {t.place}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
