import { Container, Eyebrow, Button } from './primitives';
import Reveal from './Reveal';
import { IMG } from '../lib/assets';

const POINTS = [
  { k: '2', v: 'Founders, one focused team' },
  { k: '17', v: 'Years old and already shipping' },
  { k: 'Helsinki', v: 'Built here, for all of Finland' },
];

export default function Founders() {
  return (
    <section id="about" className="bg-paper-2 py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <Reveal>
              <Eyebrow>Young minds, real impact</Eyebrow>
              <h2 className="poster mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
                Small team.
                <br />
                Big impact.
              </h2>
              <p className="mt-7 max-w-md font-body text-base leading-relaxed text-ink/65">
                We're two 17-year-old founders from Helsinki on a mission to help
                small businesses grow with better websites, clearer data and
                smarter automation. No agency overhead, no jargon. Just modern
                systems and people who actually care about your result.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
                {POINTS.map((p) => (
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
                <Button href="/contact">Get to know us</Button>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <img
                  src={IMG.founders}
                  alt="The two founders working together in Helsinki"
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 font-body text-xs text-ink">
                  Helsinki, Finland
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
