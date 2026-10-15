import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Container } from './primitives';
import Reveal from './Reveal';
import { useCopy } from '../lib/i18n';
import { IMG } from '../lib/assets';

const COPY = {
  fi: {
    quote:
      'Näyttää kotisivu-uudistus toimivan – kävijämäärä ja kiinnostus ovat monipuolistuneet selvästi!',
    client: 'Kokkoma Oy',
    role: 'Betonirakentaminen',
    logoAlt: 'Kokkoma Oy:n logo',
    caseLink: 'Lue Kokkoman case',
  },
  en: {
    quote:
      'The website redesign seems to be working – visitor numbers and interest have clearly become more varied!',
    client: 'Kokkoma Oy',
    role: 'Concrete engineering',
    logoAlt: 'Kokkoma Oy logo',
    caseLink: 'Read the Kokkoma case',
  },
};

/** Client quote straight after the hero. */
export default function Testimonial() {
  const t = useCopy(COPY);
  return (
    <section className="border-b border-line bg-paper py-24 md:py-32">
      <Container>
        <Reveal as="div" className="mx-auto max-w-4xl text-center">
          <figure>
            <span
              aria-hidden
              className="block font-heading text-[6rem] leading-[0.6] text-blue md:text-[8rem]"
            >
              “
            </span>
            <blockquote className="poster mt-6 text-[clamp(1.875rem,4.5vw,3.25rem)] text-ink">
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="mt-12 flex flex-col items-center gap-4">
              <img
                src={IMG.clients.kokkoma}
                alt={t.logoAlt}
                loading="lazy"
                className="h-10 w-auto md:h-12"
              />
              <div>
                <div className="font-heading text-lg font-semibold text-ink">{t.client}</div>
                <div className="mt-1 font-body text-sm text-ink/55">{t.role}</div>
              </div>
              <Link
                to="/work/kokkoma"
                className="group mt-2 inline-flex items-center gap-2 font-body text-sm text-blue transition-colors hover:text-blue-600"
              >
                {t.caseLink}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
