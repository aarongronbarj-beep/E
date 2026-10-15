import type { ComponentType } from 'react';
import { Globe, BarChart3, Megaphone, Search } from 'lucide-react';
import { IMG } from './assets';
import { useLang, type Lang } from './i18n';

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

const EN: Service[] = [
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

const FI: Service[] = [
  {
    slug: 'websites',
    icon: Globe,
    img: IMG.service.websites,
    title: 'Verkkosivut',
    body: 'Räätälöidyt, nopeat ja helppohoitoiset sivut suunnittelusta julkaisuun ja ylläpitoon.',
    intro:
      'Nopeat ja ammattimaiset verkkosivut, jotka näyttävät hyvältä ja tuovat tulosta. Me suunnittelemme, toteutamme, julkaisemme ja ylläpidämme ne.',
    features: [
      {
        slug: 'custom-design',
        title: 'Räätälöity ulkoasu',
        body: 'Mobiili edellä suunnitellut sivut brändisi ympärille, ei valmispohjia.',
        img: '/images/feature-custom-design.png',
        detail:
          'Jokainen yksityiskohta rakennetaan brändisi ja asiakkaidesi tarpeiden ympärille. Aloitamme tyhjästä, ilman valmispohjia ja oikoteitä, jotta sivusi näyttävät sinulta eivätkä keneltäkään muulta. Ensimmäisestä luonnoksesta viimeiseen viimeistelyyn sivut suunnitellaan tuntumaan omiltasi ja toimimaan moitteetta jokaisella näytöllä.',
        bullets: [
          {
            heading: 'Brändin kartoitus',
            text: 'Perehdymme identiteettiisi, arvoihisi ja kohderyhmääsi ennen kuin piirrämme ensimmäistäkään näkymää.',
          },
          {
            heading: 'Mobiili edellä',
            text: 'Jokainen asettelu suunnitellaan ensin pienimmälle näytölle ja laajennetaan siitä, joten se toimii kaikkialla.',
          },
          {
            heading: 'Typografia ja värit',
            text: 'Fonttisi, värisi ja visuaalinen ilmeesi toteutettuna tarkasti ja johdonmukaisesti.',
          },
          {
            heading: 'Omat asettelut',
            text: 'Kävijää ohjaavat sivurakenteet, joita ei ole lainattu teemakirjastosta.',
          },
        ],
      },
      {
        slug: 'built-to-convert',
        title: 'Rakennettu myymään',
        body: 'Selkeä rakenne ja tekstit, jotka muuttavat kävijät yhteydenotoiksi.',
        detail:
          'Kaunis sivusto, joka ei tuo yhteydenottoja, on hukattu mahdollisuus. Suunnittelemme konversiot mielessä ensimmäisestä luonnoksesta asti: selkeä hierarkia, vakuuttavat tekstit ja toimintakehotteet juuri oikeissa paikoissa.',
        bullets: [
          {
            heading: 'Selkeä hierarkia',
            text: 'Kävijä näkee heti, mitä teet, kenelle ja mitä hänen kannattaa tehdä seuraavaksi.',
          },
          {
            heading: 'Harkitut toimintakehotteet',
            text: 'Jokaisella sivulla on yksi selkeä toiminto, johon kävijää ohjataan.',
          },
          {
            heading: 'Vakuuttavat tekstit',
            text: 'Viestit, jotka vastaavat epäilyihin ja rakentavat luottamusta ennen pyyntöä.',
          },
          {
            heading: 'Sujuva yhteydenotto',
            text: 'Lomakkeet ja yhteydenottokohdat, jotka tuntuvat vaivattomilta.',
          },
        ],
      },
      {
        slug: 'seo-foundations',
        title: 'Hakukoneoptimoinnin perusta',
        body: 'Siisti koodi, nopea latautuminen ja hakukoneoptimointi alusta asti.',
        detail:
          'Rakennamme jokaisen sivuston hakukoneet huomioiden ensimmäisestä päivästä lähtien. Siisti koodi, nopea latautuminen ja oikea sivurakenne tarkoittavat, että sivustosi on valmis nousemaan hakutuloksissa jo ennen ensimmäistä julkaisua.',
        bullets: [
          {
            heading: 'Siisti koodi',
            text: 'Semanttista HTML:ää, jota hakukoneet lukevat ja ymmärtävät helposti.',
          },
          {
            heading: 'Sivunopeus',
            text: 'Optimoidut kuvat, vähän JavaScriptiä ja nopea palvelin parhaisiin Core Web Vitals -tuloksiin.',
          },
          {
            heading: 'Sivukohtainen SEO',
            text: 'Otsikot, kuvaukset, otsikkorakenne ja strukturoitu data kunnossa.',
          },
          {
            heading: 'Indeksoitava rakenne',
            text: 'Looginen sivukartta, sisäinen linkitys ja kanoniset osoitteet alusta asti.',
          },
        ],
      },
      {
        slug: 'hosting-care',
        title: 'Ylläpito ja huolenpito',
        body: 'Verkkotunnus, palvelin ja päivitykset hoidettuina, ettei sinun tarvitse huolehtia.',
        detail:
          'Kun sivustosi on julkaistu, sinun ei tarvitse ajatella sitä. Hoidamme verkkotunnuksen, palvelimen, tietoturvapäivitykset ja sisältömuutokset, jotta voit keskittyä yrityksesi pyörittämiseen.',
        bullets: [
          {
            heading: 'Hallinnoitu palvelin',
            text: 'Nopeat ja luotettavat palvelimet sekä käytettävyyden valvonta.',
          },
          {
            heading: 'Verkkotunnuksen hallinta',
            text: 'Rekisteröimme ja uusimme verkkotunnuksesi, ettei se pääse vahingossa vanhenemaan.',
          },
          {
            heading: 'Tietoturvapäivitykset',
            text: 'Julkaisujärjestelmän ja lisäosien päivitykset ennen kuin niistä tulee haavoittuvuuksia.',
          },
          {
            heading: 'Sisältömuutokset',
            text: 'Pienet teksti- ja kuvamuutokset hoidamme nopeasti, ilman tukipyyntöjonoa.',
          },
        ],
      },
    ],
  },
  {
    slug: 'data-analytics',
    icon: BarChart3,
    img: IMG.service.data,
    title: 'Data-analyysi',
    body: 'Yhdistämme jo käyttämäsi työkalut sivustosi kävijädataan yhdeksi selkeäksi kokonaiskuvaksi.',
    intro:
      'Liitämme yhteen työkalut, joilla yrityksesi jo toimii, ja yhdistämme ne rakentamamme sivuston reaaliaikaiseen kävijädataan. Lopputulos on selkokielistä tietoa, jonka pohjalta voit toimia.',
    features: [
      { slug: 'tool-integrations', title: 'Työkalujen integraatiot', body: 'Yhdistämme CRM:n, kassajärjestelmän, sähköpostin, mainonnan ja kirjanpidon, jotta kaikki data on yhdessä paikassa.', detail: '', bullets: [] },
      { slug: 'visitor-data', title: 'Sivuston kävijädata', body: 'Jokainen rakentamamme sivusto kerää todellista kävijäkäyttäytymistä: mistä ihmiset tulevat ja mitä he tekevät.', detail: '', bullets: [] },
      { slug: 'unified-view', title: 'Yksi yhtenäinen näkymä', body: 'Liiketoiminnan työkalut ja sivuston analytiikka yhdessä, jotta näet koko asiakaspolun etkä irrallisia palasia.', detail: '', bullets: [] },
      { slug: 'insight', title: 'Tietoa, jonka pohjalta toimia', body: 'Selkeät ja selkokieliset raportit, jotka kertovat mitä tehdä seuraavaksi, eivät pelkkiä kaavioita.', detail: '', bullets: [] },
    ],
  },
  {
    slug: 'digital-marketing',
    icon: Megaphone,
    img: IMG.service.marketing,
    title: 'Digitaalinen markkinointi',
    body: 'Mainontaa ja sisältöä, jotka tuovat yrityksesi oikeiden ihmisten eteen. Mitattuna, jotta tiedät mitä jokainen euro tuottaa.',
    intro:
      'Suunnittelemme ja toteutamme kampanjat, jotka tuovat oikeat ihmiset yritykseesi, ja mittaamme jokaisen, jotta tiedät tarkalleen mitä markkinointisi tuottaa.',
    features: [
      { slug: 'campaign-strategy', title: 'Kampanjastrategia', body: 'Selkeä suunnitelma siitä, keitä tavoitellaan, missä he ovat ja mitä heille kerrotaan.', detail: '', bullets: [] },
      { slug: 'paid-ads', title: 'Maksettu mainonta', body: 'Google- ja somemainokset pystytettyinä, ajettuina ja hiottuina sen mukaan, mikä oikeasti tuottaa.', detail: '', bullets: [] },
      { slug: 'social-content', title: 'Somesisältö', body: 'Julkaisuja ja visuaaleja, jotka pitävät yrityksesi näkyvillä ja brändin mukaisena.', detail: '', bullets: [] },
      { slug: 'results-reporting', title: 'Näkyvät tulokset', body: 'Jokaista kampanjaa seurataan, joten näet mikä tuo asiakkaita ja mikä ei.', detail: '', bullets: [] },
    ],
  },
  {
    slug: 'seo',
    icon: Search,
    img: IMG.service.seo,
    title: 'Hakukoneoptimointi',
    body: 'Löydy Googlesta niille, jotka jo etsivät sitä, mitä teet.',
    intro:
      'Varmistamme, että ihmiset, jotka jo etsivät palveluitasi, löytävät sinut ensimmäisenä: Google-haussa, Mapsissa ja paikallisissa hakutuloksissa.',
    features: [
      { slug: 'keyword-research', title: 'Avainsanatutkimus', body: 'Selvitämme hakusanat, joita asiakkaasi oikeasti käyttävät, ja ne joissa voit voittaa.', detail: '', bullets: [] },
      { slug: 'on-page-seo', title: 'Sivujen optimointi', body: 'Otsikot, sisältö, rakenne ja nopeus kuntoon, jotta Google ymmärtää jokaisen sivun.', detail: '', bullets: [] },
      { slug: 'google-business-profile', title: 'Google-yritysprofiili', body: 'Profiilisi perustettuna ja ajan tasalla, jotta näyt Mapsissa ja paikallisissa hauissa.', detail: '', bullets: [] },
      { slug: 'ranking-reports', title: 'Sijoitusraportit', body: 'Säännölliset raportit sijoituksistasi ja siitä, kuinka moni löytää sinut haun kautta.', detail: '', bullets: [] },
    ],
  },
];

export const SERVICES: Record<Lang, Service[]> = { fi: FI, en: EN };

/** The service list in the visitor's language. */
export const useServices = () => SERVICES[useLang().lang];

export const findService = (services: Service[], slug?: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const findFeature = (services: Service[], serviceSlug?: string, featureSlug?: string) =>
  findService(services, serviceSlug)?.features.find((f) => f.slug === featureSlug);
