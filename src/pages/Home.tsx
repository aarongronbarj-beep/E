import ArtSeam from '../components/ArtSeam';
import Panel from '../components/Panel';
import Hero from '../components/Hero';
import Path from '../components/Path';
import Flywheel from '../components/Flywheel';
import DarkSignal from '../components/DarkSignal';

/**
 * The landing page tells the story only. Each category — Services, Work,
 * About, Pricing, Contact — lives on its own route and is reached from the nav.
 */
export default function Home() {
  return (
    <>
      <Panel mode="lag" distance={70}>
        <Hero />
      </Panel>

      <ArtSeam />

      {/* Left out of Panel on purpose. Panel animates a transform on its
          wrapper while scrolling, and ScrollTrigger measures its start and end
          against the document — a moving transformed ancestor is a known way
          to make those two disagree. Not the cause of any bug seen here, just
          not worth stacking two scroll systems on the same element. */}
      <Path />

      <Panel>
        <Flywheel />
      </Panel>

      <Panel>
        <DarkSignal />
      </Panel>
    </>
  );
}
