import { IMG } from './assets';
import { useLang, type Lang } from './i18n';

export type Project = {
  slug: string;
  name: string;
  /** Disciplines joined with ' & ' — the Work page builds its filters from these. */
  tag: string;
  img: string;
  /** Live site, shown as a link on the project page. */
  url?: string;
  /** One line under the title on the project page. */
  summary: string;
  /** Short facts shown beside the intro. `accent` sets the value in brand blue. */
  facts: { label: string; value: string; accent?: boolean }[];
  /** Headline numbers shown in the blue results band. */
  highlights?: { value: string; label: string }[];
  challenge: string;
  solution: string;
  /** What we delivered, as a numbered list. */
  delivered: { title: string; text: string }[];
};

const EN: Project[] = [
  {
    slug: 'kokkoma',
    name: 'Kokkoma Oy',
    tag: 'Website & SEO',
    img: IMG.work.kokkoma,
    url: 'https://kokkoma.fi',
    summary:
      'A modernised website for a Finnish concrete-engineering contractor, built to be found.',
    facts: [
      { label: 'Client', value: 'Kokkoma Oy' },
      { label: 'Industry', value: 'Concrete engineering & construction' },
      { label: 'Scope', value: 'Website, SEO, Google Business Profile' },
      { label: 'Stack', value: 'Next.js · Sanity · Vercel' },
    ],
    challenge:
      'Kokkoma needed a website that works on every phone, gets found on Google and feels current — without turning the brand upside down. The goal was to modernise what was already there, not to start the identity over.',
    solution:
      'We built the site, both visually and content-wise, on Next.js and host it on Vercel, which keeps it fast to load and fully responsive on mobile. Sanity is the content system, so Kokkoma can keep the site up to date themselves. Alongside the build we optimised the site for search and set up their Google Business Profile. Version 1 is live at kokkoma.fi, and the collaboration continues with more projects on the way.',
    delivered: [
      {
        title: 'Design & content',
        text: 'The website built from the ground up, both visually and content-wise, modernising the look while keeping the brand Kokkoma already had.',
      },
      {
        title: 'Search engine optimisation',
        text: 'Search engine optimisation to make the site easy to find.',
      },
      {
        title: 'Google Business Profile',
        text: 'Their Google Business Profile set up, so the company shows up on Maps and in local searches.',
      },
      {
        title: 'Fast, mobile-first build',
        text: 'Next.js hosted on Vercel for quick load times and a layout that works on every screen, with Sanity as an easy-to-use CMS.',
      },
    ],
  },
  {
    slug: 'kesayrittajat',
    name: 'Kesäyrittäjät.fi',
    tag: 'Website',
    img: IMG.work.kesayrittajat,
    url: 'https://kesäyrittäjät.fi',
    // Placeholder copy: replace with the real project details.
    summary:
      'A website for Kesäyrittäjät.fi. Replace this line with a one-sentence description of the project.',
    facts: [
      { label: 'Client', value: 'Kesäyrittäjät.fi' },
      { label: 'Scope', value: 'Website' },
    ],
    challenge:
      'Placeholder: describe what the client needed and what was not working before.',
    solution:
      'Placeholder: describe what we built and how it solved the problem.',
    delivered: [
      {
        title: 'Website',
        text: 'Placeholder: list the main things delivered in this project.',
      },
    ],
  },
];

const FI: Project[] = [
  {
    slug: 'kokkoma',
    name: 'Kokkoma Oy',
    tag: 'Verkkosivut & SEO',
    img: IMG.work.kokkoma,
    url: 'https://kokkoma.fi',
    summary:
      'Uudistetut verkkosivut suomalaiselle betonirakentamisen urakoitsijalle, rakennettu löytymään.',
    facts: [
      { label: 'Asiakas', value: 'Kokkoma Oy' },
      { label: 'Toimiala', value: 'Betonirakentaminen ja rakennusurakointi' },
      { label: 'Laajuus', value: 'Verkkosivut, hakukoneoptimointi, Google-yritysprofiili' },
      { label: 'Teknologiat', value: 'Next.js · Sanity · Vercel' },
    ],
    challenge:
      'Kokkoma tarvitsi verkkosivut, jotka toimivat jokaisella puhelimella, löytyvät Googlesta ja tuntuvat ajanmukaisilta, ilman että brändi kääntyy päälaelleen. Tavoitteena oli uudistaa olemassa olevaa, ei aloittaa identiteettiä alusta.',
    solution:
      'Rakensimme sivuston sekä visuaalisesti että sisällöllisesti Next.js:llä ja ylläpidämme sitä Vercelissä, mikä pitää sen nopeana ja täysin mobiiliystävällisenä. Sisällönhallintana toimii Sanity, joten Kokkoma voi päivittää sivujaan itse. Toteutuksen ohella optimoimme sivuston hakukoneille ja perustimme yrityksen Google-yritysprofiilin. Ensimmäinen versio on julkaistu osoitteessa kokkoma.fi, ja yhteistyö jatkuu uusien projektien parissa.',
    delivered: [
      {
        title: 'Ulkoasu ja sisältö',
        text: 'Sivusto rakennettuna alusta asti sekä visuaalisesti että sisällöllisesti: ilme modernisoitiin, mutta Kokkoman oma brändi säilyi.',
      },
      {
        title: 'Hakukoneoptimointi',
        text: 'Hakukoneoptimointi, jotta sivusto on helppo löytää.',
      },
      {
        title: 'Google-yritysprofiili',
        text: 'Google-yritysprofiili perustettuna, jotta yritys näkyy Mapsissa ja paikallisissa hauissa.',
      },
      {
        title: 'Nopea, mobiili edellä',
        text: 'Next.js Vercelissä nopeita latausaikoja varten, jokaisella näytöllä toimiva asettelu ja Sanity helppokäyttöisenä sisällönhallintana.',
      },
    ],
  },
  {
    slug: 'kesayrittajat',
    name: 'Kesäyrittäjät.fi',
    tag: 'Verkkosivut',
    img: IMG.work.kesayrittajat,
    url: 'https://kesäyrittäjät.fi',
    // Placeholder copy: replace with the real project details.
    summary:
      'Verkkosivut Kesäyrittäjät.fi:lle. Korvaa tämä rivi yhden lauseen kuvauksella projektista.',
    facts: [
      { label: 'Asiakas', value: 'Kesäyrittäjät.fi' },
      { label: 'Laajuus', value: 'Verkkosivut' },
    ],
    challenge:
      'Paikkateksti: kerro, mitä asiakas tarvitsi ja mikä ei toiminut aiemmin.',
    solution:
      'Paikkateksti: kerro, mitä rakensimme ja miten se ratkaisi ongelman.',
    delivered: [
      {
        title: 'Verkkosivut',
        text: 'Paikkateksti: listaa projektin tärkeimmät toimitukset.',
      },
    ],
  },
];

export const PROJECTS: Record<Lang, Project[]> = { fi: FI, en: EN };

/** The project list in the visitor's language. */
export const useProjects = () => PROJECTS[useLang().lang];

export const findProject = (projects: Project[], slug?: string) =>
  projects.find((p) => p.slug === slug);
