import ArtSeam from '../components/ArtSeam';
import Panel from '../components/Panel';
import HomeHero from '../components/HomeHero';
import Testimonial from '../components/Testimonial';
import Story from '../components/Story';
import ServicesMenu from '../components/ServicesMenu';
import SeoPromo from '../components/SeoPromo';
import PersonCard from '../components/PersonCard';
import DarkSignal from '../components/DarkSignal';

/**
 * The landing page tells the story only. Each category — Services, Work,
 * About, Pricing, Contact — lives on its own route and is reached from the nav.
 */
export default function Home() {
  return (
    <>
      {/* Hero + its own nav from Figma (Ealize – Etusivu, node 105:3575). */}
      <HomeHero />

      <ArtSeam />

      <Testimonial />

      {/* Services menu from Figma (Ealize – Etusivu, node 94:5689). */}
      <ServicesMenu />
      {/* Figma node 62:272: SEO promo band, following on from the SEO card. */}
      <SeoPromo />

      {/* Outside Panel: Panel transforms its wrapper while scrolling, which
          would fight the pinned column in the process steps. */}
      <Story />

      <Panel>
        <PersonCard />
      </Panel>

      <Panel>
        <DarkSignal />
      </Panel>
    </>
  );
}
