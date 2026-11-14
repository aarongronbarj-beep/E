import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from './primitives';
import Reveal from './Reveal';
import { useCopy } from '../lib/i18n';

/** Contact details shown on the card. While `phone` is empty, the large line
 *  shows the email address instead. While `photo` is empty, the card is text
 *  only and splits into two columns; with a photo, the text sits on the left
 *  and the portrait fills the right. */
const PERSON = {
  name: 'Lauri Parviainen',
  photo: '',
  email: 'hello@ealize.fi',
  phone: '',
};

const COPY = {
  fi: {
    eyebrow: 'Aloita projekti',
    title: 'Ota yhteyttä, niin katsotaan miten edetään.',
    body: 'Vastaamme yleensä saman päivän aikana. Kerro lyhyesti yrityksestäsi ja tavoitteistasi, niin palaamme ehdotuksen kanssa.',
    role: 'Perustaja',
    call: 'Varaa puhelu',
  },
  en: {
    eyebrow: 'Start a project',
    title: "Get in touch and we'll work out the next step.",
    body: "We usually reply the same day. Tell us briefly about your business and your goals, and we'll come back with a proposal.",
    role: 'Co-founder',
    call: 'Book a call',
  },
};

export default function PersonCard() {
  const t = useCopy(COPY);
  const { name, photo, email, phone } = PERSON;
  const big = phone
    ? { label: phone, href: `tel:${phone.replace(/\s/g, '')}` }
    : { label: email, href: `mailto:${email}` };

  return (
    <section className="bg-paper py-16 md:py-24">
      <Container>
        <Reveal>
          <article className="relative overflow-hidden rounded-[28px] bg-ink text-white">
            <div
              className={`relative z-10 px-7 pt-12 sm:px-10 md:py-20 md:pl-14 ${
                photo
                  ? 'pb-0 md:w-[60%] md:pr-0'
                  : 'pb-12 md:grid md:grid-cols-12 md:items-end md:gap-12 md:pr-14'
              }`}
            >
              <div className={photo ? '' : 'md:col-span-7'}>
                <span className="eyebrow text-white/55">{t.eyebrow}</span>
                <h2 className="poster mt-5 max-w-[16ch] text-[clamp(2.25rem,4.6vw,3.75rem)] uppercase leading-[0.98] tracking-[-0.01em]">
                  {t.title}
                </h2>
                <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-white/70 md:text-lg">
                  {t.body}
                </p>
              </div>

              <div
                className={
                  photo ? '' : 'md:col-span-5 md:border-l md:border-white/15 md:pl-12'
                }
              >
                <p
                  className={`font-body text-sm font-medium text-white/55 ${
                    photo ? 'mt-10' : 'mt-10 md:mt-0'
                  }`}
                >
                  {name} · {t.role}
                </p>
                <a
                  href={big.href}
                  className={`mt-2 inline-block break-all font-heading font-light leading-none tracking-[-0.02em] text-white transition-colors hover:text-blue-100 ${
                    photo
                      ? 'text-[clamp(1.75rem,4.4vw,3.75rem)]'
                      : 'text-[clamp(1.75rem,3.2vw,2.5rem)]'
                  }`}
                >
                  {big.label}
                </a>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-body text-sm font-medium text-ink transition-colors hover:bg-blue-100"
                  >
                    {t.call}
                    <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                  </Link>
                  {phone && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:border-white"
                    >
                      {email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Cut-out portrait; the left edge fades into the card so the
                sweater has no hard edge. */}
            {photo && (
              <div className="relative mt-6 h-[380px] sm:h-[460px] md:absolute md:inset-y-0 md:right-0 md:mt-0 md:h-auto md:w-[44%]">
                <img
                  src={photo}
                  alt={name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top grayscale contrast-[1.08] [mask-image:linear-gradient(to_right,transparent,black_28%)] max-md:[mask-image:none]"
                />
              </div>
            )}
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
