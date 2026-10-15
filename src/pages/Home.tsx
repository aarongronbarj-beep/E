import ArtSeam from '../components/ArtSeam';
import Panel from '../components/Panel';
import Hero from '../components/Hero';
import Testimonial from '../components/Testimonial';
import Story from '../components/Story';
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

      <Testimonial />

      {/* Outside Panel: Panel transforms its wrapper while scrolling, which
          would fight the pinned column in the process steps. */}
      <Story />

      <Panel>
        <Flywheel />
      </Panel>

      <Panel>
        <DarkSignal />
      </Panel>
    </>
  );
}
