import ArtSeam from '../components/ArtSeam';
import Panel from '../components/Panel';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Path from '../components/Path';
import Flywheel from '../components/Flywheel';
import DarkSignal from '../components/DarkSignal';
import Work from '../components/Work';
import Founders from '../components/Founders';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Panel mode="lag" distance={70}>
        <Hero />
      </Panel>

      <ArtSeam />

      <Panel distance={56}>
        <Services />
      </Panel>

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

      <Panel>
        <Work />
      </Panel>

      <Panel>
        <Founders />
      </Panel>

      <Panel>
        <Pricing />
      </Panel>

      <Panel>
        <Contact />
      </Panel>
    </>
  );
}
