import type { ComponentType } from 'react';
import { Globe, BarChart3, Sparkles, PenTool } from 'lucide-react';
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
    title: 'Websites',
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
    title: 'Data Analytics',
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
    slug: 'ai-automation',
    icon: Sparkles,
    img: IMG.service.ai,
    title: 'AI Automation',
    body: 'We automate the repetitive work that eats your week, so your time goes to customers.',
    intro:
      'We find the repetitive work that eats your week and hand it off to AI, so your time goes to customers, not busywork.',
    features: [
      { slug: 'workflow-audit', title: 'Workflow audit', body: 'We map the recurring tasks quietly slowing your team down.', detail: '', bullets: [] },
      { slug: 'custom-automations', title: 'Custom automations', body: 'AI workflows built around how your business actually runs.', detail: '', bullets: [] },
      { slug: 'tools-connected', title: 'Tools connected', body: 'Your site, inbox and tools wired together into one flow.', detail: '', bullets: [] },
      { slug: 'one-dashboard', title: 'One dashboard', body: 'Everything surfaced in a single place instead of scattered tabs.', detail: '', bullets: [] },
    ],
  },
  {
    slug: 'graphic-design',
    icon: PenTool,
    img: IMG.service.design,
    title: 'Graphic Design',
    body: 'Logos, animated ads, banners and full rebrands, sharp, on-brand visuals ready to ship.',
    intro:
      'Logos, animated ads, banners and full rebrands, sharp, on-brand visuals ready to ship across every channel.',
    features: [
      { slug: 'logos-identity', title: 'Logos & identity', body: 'Distinctive marks, type and color systems people remember.', detail: '', bullets: [] },
      { slug: 'animated-ads', title: 'Animated ads', body: 'Scroll-stopping motion ads for social and display that convert.', detail: '', bullets: [] },
      { slug: 'banners-social', title: 'Banners & social', body: 'Campaign kits and templates you can roll out in minutes.', detail: '', bullets: [] },
      { slug: 'rebranding', title: 'Rebranding', body: 'A fresh, modern identity for brands that have outgrown their look.', detail: '', bullets: [] },
    ],
  },
];

export const getService = (slug?: string): Service | undefined =>
  SERVICES.find((s) => s.slug === slug);
