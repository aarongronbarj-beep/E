import type { ComponentType } from 'react';
import { Globe, BarChart3, Megaphone, Search } from 'lucide-react';
import { IMG } from './assets';

export type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

export type Feature = {
  slug: string;
  title: string;
  body: string;
  detail: string;
  /** Optional hero image shown on the feature's own page. */
  img?: string;
  bullets: { heading: string; text: string }[];
};

export type Service = {
  slug: string;
  icon: IconType;
  /** Fanned mockup visual shown on the Services card. */
  img: string;
  title: string;
  /** Short one-liner used on the Services cards. */
  body: string;
  /** Longer lede shown at the top of the detail page. */
  intro: string;
  features: Feature[];
};

export const getFeature = (serviceSlug?: string, featureSlug?: string) =>
  SERVICES.find((s) => s.slug === serviceSlug)?.features.find(
    (f) => f.slug === featureSlug,
  );

export const SERVICES: Service[] = [
  {
    slug: 'websites',
    icon: Globe,
    img: IMG.service.websites,
    title: 'Website Development',
    body: 'Custom-built, fast and easy to manage, from first plan to launch and hosting.',
    intro:
      'Fast, professional websites that look great and get results, planned, designed, built, launched and hosted by us.',
    features: [
      {
        slug: 'custom-design',
        title: 'Custom design',
        body: 'Mobile-first layouts crafted around your brand, never a template.',
        img: '/images/feature-custom-design.png',
        detail:
          "Every pixel is built around your brand identity and your customers' needs. We start from scratch — no templates, no shortcuts — so your site looks like you and no one else. From the first wireframe to the final polish, your site is designed to feel unmistakably yours and to work flawlessly on every screen.",
        bullets: [
          {
            heading: 'Brand discovery',
            text: 'We dig into your identity, values and audience before a single frame is drawn.',
          },
          {
            heading: 'Mobile-first',
            text: 'Every layout starts on the smallest screen and expands outward, so it works perfectly everywhere.',
          },
          {
            heading: 'Typography & colour',
            text: 'Your fonts, palette and visual language applied with precision and consistency.',
          },
          {
            heading: 'Unique layouts',
            text: 'Page structures designed to guide your visitors, not borrowed from a theme library.',
          },
        ],
      },
      {
        slug: 'built-to-convert',
        title: 'Built to convert',
        body: 'Clear structure and copy that turns visitors into enquiries.',
        detail:
          'A beautiful site that generates no enquiries is a missed opportunity. We design with conversion in mind from the first wireframe — clear hierarchy, persuasive copy and calls to action placed exactly where they need to be.',
        bullets: [
          {
            heading: 'Clear hierarchy',
            text: "Visitors know instantly what you do, who it's for, and what to do next.",
          },
          {
            heading: 'Strategic CTAs',
            text: 'Every page has one clear action we want the visitor to take.',
          },
          {
            heading: 'Persuasive copy',
            text: 'Structured messaging that addresses objections and builds trust before the ask.',
          },
          {
            heading: 'Enquiry flow',
            text: 'Forms, contact points and lead capture designed to feel effortless.',
          },
        ],
      },
      {
        slug: 'seo-foundations',
        title: 'SEO foundations',
        body: 'Clean markup, fast load times and on-page SEO from day one.',
        detail:
          "We build every site with search engines in mind from day one. Clean code, fast load times and proper on-page structure mean your site is ready to rank before you've published a single piece of content.",
        bullets: [
          {
            heading: 'Clean markup',
            text: 'Semantic HTML that search engines can read and understand easily.',
          },
          {
            heading: 'Page speed',
            text: 'Optimised images, minimal JavaScript and fast hosting for top Core Web Vitals scores.',
          },
          {
            heading: 'On-page SEO',
            text: 'Meta titles, descriptions, heading structure and schema markup set up properly.',
          },
          {
            heading: 'Crawlable structure',
            text: 'Logical sitemap, internal linking and canonical tags from day one.',
          },
        ],
      },
      {
        slug: 'hosting-care',
        title: 'Hosting & care',
        body: 'Domain, hosting and updates handled so you never have to worry.',
        detail:
          "Once your site is live, you shouldn't have to think about it. We handle domain, hosting, security updates and content changes so you can stay focused on running your business.",
        bullets: [
          {
            heading: 'Managed hosting',
            text: 'Fast, reliable servers with uptime monitoring included.',
          },
          {
            heading: 'Domain management',
            text: 'We register and renew your domain so it never accidentally lapses.',
          },
          {
            heading: 'Security updates',
            text: 'CMS and plugin updates applied before they become vulnerabilities.',
          },
          {
            heading: 'Content changes',
            text: 'Small text and image updates handled by us, quickly, without a support ticket queue.',
          },
        ],
      },
    ],
  },
  {
    slug: 'data-analytics',
    icon: BarChart3,
    img: IMG.service.data,
    title: 'Data Analysis',
    body: 'We connect the tools you already use with visitor data from your site, turned into one clear, plain-language picture.',
    intro:
      'We plug into the tools your business already runs on and combine them with live visitor data from the website we build, then turn it all into plain-language insight you can act on.',
    features: [
      { slug: 'tool-integrations', title: 'Tool integrations', body: 'We connect your CRM, POS, email, ads and accounting tools so all your data lives in one place.', detail: '', bullets: [] },
      { slug: 'visitor-data', title: 'Website visitor data', body: 'Every site we build feeds in real visitor behaviour: where people come from and what they do.', detail: '', bullets: [] },
      { slug: 'unified-view', title: 'One unified view', body: 'Business tools and site analytics combined, so you see the full customer journey, not scattered fragments.', detail: '', bullets: [] },
      { slug: 'insight', title: 'Insight you can act on', body: 'Clear, plain-language reports that tell you what to do next, not just charts.', detail: '', bullets: [] },
    ],
  },
  {
    slug: 'digital-marketing',
    icon: Megaphone,
    img: IMG.service.marketing,
    title: 'Digital Marketing',
    body: 'Ads and content that put your business in front of the right people, measured so you know what each euro brings back.',
    intro:
      'We plan and run the campaigns that bring the right people to your business, and measure every one, so you know exactly what your marketing returns.',
    features: [
      { slug: 'campaign-strategy', title: 'Campaign strategy', body: 'A clear plan for who to reach, where they are and what to tell them.', detail: '', bullets: [] },
      { slug: 'paid-ads', title: 'Paid ads', body: 'Google and social media ads set up, run and tuned to what actually converts.', detail: '', bullets: [] },
      { slug: 'social-content', title: 'Social media content', body: 'Posts and visuals that keep your business visible and on-brand.', detail: '', bullets: [] },
      { slug: 'results-reporting', title: 'Results you can see', body: 'Every campaign tracked, so you see what brings in customers and what does not.', detail: '', bullets: [] },
    ],
  },
  {
    slug: 'seo',
    icon: Search,
    img: IMG.service.seo,
    title: 'SEO',
    body: 'Get found on Google by the people already searching for what you do.',
    intro:
      'We make sure the people already searching for what you do find you first, on Google Search, on Maps and in local results.',
    features: [
      { slug: 'keyword-research', title: 'Keyword research', body: 'We find the searches your customers actually type, and which ones you can win.', detail: '', bullets: [] },
      { slug: 'on-page-seo', title: 'On-page optimisation', body: 'Titles, content, structure and speed tuned so Google understands every page.', detail: '', bullets: [] },
      { slug: 'google-business-profile', title: 'Google Business Profile', body: 'Your profile set up and kept current, so you show up on Maps and in local searches.', detail: '', bullets: [] },
      { slug: 'ranking-reports', title: 'Ranking reports', body: 'Regular reports on where you rank and how many people find you through search.', detail: '', bullets: [] },
    ],
  },
];

export const getService = (slug?: string): Service | undefined =>
  SERVICES.find((s) => s.slug === slug);
