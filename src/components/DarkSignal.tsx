import { Container, Eyebrow, Button } from './primitives';
import Reveal from './Reveal';
import { IMG } from '../lib/assets';

export default function DarkSignal() {
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
            <Eyebrow dark>Signal, not noise</Eyebrow>
            <h2 className="poster mt-6 text-[clamp(2.5rem,6vw,4.25rem)] text-white">
              Data without insight is just noise.
            </h2>
            <p className="mt-7 max-w-md font-body text-base leading-relaxed text-white/70">
              We connect the tools your business already uses with the visitor
              data from the website we build, then turn it all into clear
              answers: where customers come from, what works, and what to change
              next. So every decision is backed by evidence, not guesswork.
            </p>
            <div className="mt-9">
              <Button href="/services" variant="white">
                See how it works
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
