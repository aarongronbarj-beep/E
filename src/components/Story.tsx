import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ImageIcon } from 'lucide-react';
import { Container, Eyebrow } from './primitives';
import Reveal from './Reveal';
import BeforeAfter from './BeforeAfter';
import { useStatic } from '../lib/motion';
import { useCopy } from '../lib/i18n';
import { IMG } from '../lib/assets';

type Block = { eyebrow: string; title: string; body: string[] };

const COPY = {
  fi: {
    placeholder: 'Kuvan paikka',
    compare: {
      before: 'Ennen',
      after: 'Jälkeen',
      slider: 'Vertaa ennen ja jälkeen',
      beforeAlt: 'Google-haku, jossa kilpailija on ensimmäisenä',
      afterAlt: 'Sama Google-haku, jossa sinun yrityksesi on ensimmäisenä',
    },
    why: {
      eyebrow: '01 Miksi nettisivut ovat tärkeät',
      title: 'Nettisivusi on myyjä, joka ei lomaile.',
      body: [
        'Ennen kuin asiakas soittaa, pyytää tarjousta tai astuu ovesta sisään, hän on jo googlannut sinut. Nettisivut ovat ensivaikutelma, käyntikortti ja myyntipuhe samassa paketissa. Ne tekevät töitä myös silloin, kun sinä et tee.',
      ],
    },
    problem: {
      eyebrow: '02 Ongelma',
      title: 'Hyvä yritys, jota kukaan ei löydä.',
      body: [
        'Moni yritys tekee erinomaista työtä, mutta verkossa se ei näy. Sivut ovat vanhentuneet, hitaat tai hankalat puhelimella. Google ei ymmärrä, mitä yritys tekee, joten kilpailija näkyy hakutuloksissa ensin. Mainontaan menee rahaa, mutta kävijät lähtevät ennen kuin ottavat yhteyttä.',
        'Kukaan ei huomaa, minne asiakkaat katosivat.',
      ],
    },
    process: {
      eyebrow: '03 Mitä Ealize tekee',
      title: 'Rakennamme sivut, jotka löydetään ja jotka tuottavat.',
      steps: [
        { title: 'Kartoitus', text: 'Selvitämme asiakkaasi, kilpailijasi ja sanat, joilla sinua haetaan.' },
        { title: 'Sivukartta', text: 'Rakenne, jossa jokaisella sivulla on yksi tehtävä ja selkeä polku yhteydenottoon.' },
        { title: 'Sisällöt', text: 'Tekstit, jotka puhuvat asiakkaan kieltä ja vastaavat hänen kysymyksiinsä.' },
        { title: 'Visuaalinen ilme', text: 'Design, joka herättää luottamusta ja toimii puhelimella yhtä hyvin kuin koneella.' },
        { title: 'Hakukoneoptimointi', text: 'Nopeus, rakenne ja metatiedot kuntoon, jotta Google ymmärtää sivusi.' },
        { title: 'Mittaus', text: 'Analytiikka GDPR:n mukaisesti, jotta näet, mistä asiakkaat tulevat.' },
        { title: 'Kasvu', text: 'Kun pohja toimii, ohjaamme liikennettä Google- ja Meta-mainonnalla.' },
      ],
    },
    result: {
      eyebrow: '04 Lopputulos',
      title: 'Ei arvailua. Kasvua, jonka näet ja jonka asiakkaasi tuntevat.',
      body: [
        'Mittaamme lähtötason ennen kuin aloitamme ja näytämme muutoksen sen jälkeen: kävijät, hakusijoitukset ja yhteydenotot. Luvut kertovat kuitenkin vain puolet tarinasta. Saat myös ilmeen, joka näyttää yhtä ammattimaiselta kuin työ, jota teet. Yhtenäiset värit, typografia ja kuvat tekevät yrityksestäsi tunnistettavan, ja asiakas luottaa sinuun jo ennen ensimmäistä yhteydenottoa.',
      ],
    },
  },
  en: {
    placeholder: 'Image placeholder',
    compare: {
      before: 'Before',
      after: 'After',
      slider: 'Compare before and after',
      beforeAlt: 'A Google search with a competitor ranked first',
      afterAlt: 'The same Google search with your business ranked first',
    },
    why: {
      eyebrow: '01 Why your website matters',
      title: 'Your website is a salesperson that never takes a holiday.',
      body: [
        "Before a customer calls, asks for a quote or walks through your door, they have already googled you. Your website is your first impression, business card and sales pitch in one. It keeps working even when you don't.",
      ],
    },
    problem: {
      eyebrow: '02 The problem',
      title: 'A great business nobody can find.',
      body: [
        "Many businesses do excellent work, but it doesn't show online. The site is outdated, slow or awkward on a phone. Google can't tell what the business does, so a competitor shows up first. Money goes into ads, but visitors leave before they get in touch.",
        'Nobody notices where the customers went.',
      ],
    },
    process: {
      eyebrow: '03 What Ealize does',
      title: 'We build websites that get found and get results.',
      steps: [
        { title: 'Discovery', text: 'We map out your customers, your competitors and the words people use to search for you.' },
        { title: 'Sitemap', text: 'A structure where every page has one job and a clear path to getting in touch.' },
        { title: 'Content', text: "Copy that speaks your customer's language and answers their questions." },
        { title: 'Visual identity', text: 'Design that builds trust and works as well on a phone as on a computer.' },
        { title: 'SEO', text: 'Speed, structure and metadata in shape, so Google understands your site.' },
        { title: 'Measurement', text: 'GDPR-compliant analytics, so you can see where your customers come from.' },
        { title: 'Growth', text: 'Once the foundation works, we drive traffic with Google and Meta ads.' },
      ],
    },
    result: {
      eyebrow: '04 The result',
      title: 'No guesswork. Growth you can see and your customers can feel.',
      body: [
        "We measure the baseline before we start and show you the change afterwards: visitors, search rankings and enquiries. But numbers only tell half the story. You also get a look that is as professional as the work you do. Consistent colours, typography and imagery make your business recognisable, and customers trust you before they've even got in touch.",
      ],
    },
  },
};

/** Stand-in for artwork that hasn't been made yet. Swap for an <img> later. */
function ImagePlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`grid aspect-[4/3] w-full place-items-center rounded-2xl border border-dashed border-ink/15 bg-ink/[0.03] ${className}`}
    >
      <span className="flex flex-col items-center gap-3 font-body text-sm text-ink/40">
        <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
        {label}
      </span>
    </div>
  );
}

/** Text beside an image (a placeholder unless `media` is given); `flip` puts
 *  the image on the left. */
function TextBlock({
  block,
  placeholder,
  media,
  flip = false,
  tone = 'bg-paper',
}: {
  block: Block;
  placeholder: string;
  media?: ReactNode;
  flip?: boolean;
  tone?: string;
}) {
  return (
    <section className={`border-b border-line py-24 md:py-32 ${tone}`}>
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className={`md:col-span-6 ${flip ? 'md:order-2' : ''}`}>
            <Eyebrow>{block.eyebrow}</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-blue">
              {block.title}
            </h2>
            {block.body.map((p, i) => (
              <p
                key={i}
                className={`max-w-xl font-body leading-relaxed text-ink ${
                  i === 0 ? 'mt-7 text-lg md:text-xl' : 'mt-6 text-xl font-semibold md:text-2xl'
                }`}
              >
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.1} className={`md:col-span-6 ${flip ? 'md:order-1' : ''}`}>
            {media ?? <ImagePlaceholder label={placeholder} />}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * The seven steps, lit one at a time as they cross the middle of the screen.
 * The heading, progress and image stay pinned beside them on wide screens.
 */
function Process({
  process,
  placeholder,
}: {
  process: (typeof COPY)['fi']['process'];
  placeholder: string;
}) {
  const isStatic = useStatic();
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (isStatic) return;
    // A thin band across the middle of the viewport: whichever step sits in
    // it is the current one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isStatic]);

  const total = process.steps.length;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="border-b border-line bg-paper py-24 md:py-32">
      <Container>
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <Eyebrow>{process.eyebrow}</Eyebrow>
              <h2 className="poster mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] text-blue">
                {process.title}
              </h2>

              {!isStatic && (
                <div className="mt-8 flex items-center gap-4" aria-hidden>
                  <span className="font-heading text-base font-semibold tabular-nums text-blue">
                    {pad(active + 1)} / {pad(total)}
                  </span>
                  <span className="h-px flex-1 bg-line">
                    <span
                      className="block h-px bg-blue transition-[width] duration-500 ease-out"
                      style={{ width: `${((active + 1) / total) * 100}%` }}
                    />
                  </span>
                </div>
              )}

              <ImagePlaceholder label={placeholder} className="mt-10" />
            </div>
          </div>

          <ol className="flex flex-col md:col-span-6 md:col-start-7">
            {process.steps.map((s, i) => {
              const state = isStatic || i === active ? 'on' : i < active ? 'done' : 'off';
              return (
                <li
                  key={s.title}
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  data-index={i}
                  className={`flex flex-col justify-center border-t border-line py-8 transition-opacity duration-500 last:border-b md:min-h-[26vh] ${
                    state === 'off' ? 'opacity-30' : state === 'done' ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  {/* Baseline-aligned, so the number sits on the heading's first line. */}
                  <div className="flex items-baseline gap-5 md:gap-8">
                    <span
                      className={`shrink-0 font-heading text-xl font-semibold tabular-nums transition-colors duration-500 md:text-2xl ${
                        state === 'on' ? 'text-blue' : 'text-ink/40'
                      }`}
                    >
                      {pad(i + 1)}
                    </span>
                    <div>
                      <h3 className="font-heading text-4xl font-semibold text-blue md:text-[3.25rem] md:leading-tight">
                        {s.title}
                      </h3>
                      <p className="mt-4 max-w-xl font-body text-xl leading-relaxed text-ink md:text-2xl">
                        {s.text}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/** Home-page story after the hero: why, the problem, what we do, the result. */
export default function Story() {
  const t = useCopy(COPY);
  return (
    <>
      <TextBlock block={t.why} placeholder={t.placeholder} />
      <TextBlock block={t.problem} placeholder={t.placeholder} flip tone="bg-paper-2" />
      <Process process={t.process} placeholder={t.placeholder} />
      <TextBlock
        block={t.result}
        placeholder={t.placeholder}
        tone="bg-paper-2"
        media={
          <BeforeAfter
            before={{ src: IMG.result.before, alt: t.compare.beforeAlt }}
            after={{ src: IMG.result.after, alt: t.compare.afterAlt }}
            labels={t.compare}
          />
        }
      />
    </>
  );
}
