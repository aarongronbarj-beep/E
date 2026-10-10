import { IMG } from './assets';

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
  /** Short facts shown beside the intro. */
  facts: { label: string; value: string }[];
  challenge: string;
  solution: string;
  /** What we delivered, as a numbered list. */
  delivered: { title: string; text: string }[];
};

export const getProject = (slug?: string) =>
  PROJECTS.find((p) => p.slug === slug);

export const PROJECTS: Project[] = [
  {
    slug: 'kokkoma',
    name: 'Kokkoma Oy',
    tag: 'Website & SEO',
    img: IMG.work.kokkoma,
    url: 'https://kokkoma.fi',
    summary:
      'A modernised website for a Finnish concrete-engineering contractor, built to be found. Kokkoma already ranks in the Google top five for more than ten search terms.',
    facts: [
      { label: 'Client', value: 'Kokkoma Oy' },
      { label: 'Industry', value: 'Concrete engineering & construction' },
      { label: 'Scope', value: 'Website, SEO, Google Business Profile' },
      { label: 'Stack', value: 'Next.js · Sanity · Vercel' },
      { label: 'Result', value: 'Google top 5 for 10+ search terms' },
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
        text: 'Search engine optimisation to make the site easy to find. Kokkoma now ranks in the Google top five for more than ten search terms.',
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
