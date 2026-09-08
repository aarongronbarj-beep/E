# Ealize — Visual Schema

Ealizen visuaalisen ilmeen lähdemateriaali. Tämä kansio on **design-lähde**, ei
build-artefakti: mitään täältä ei tarjoilla suoraan selaimeen. Kun kuva otetaan
sivustolle käyttöön, siitä tehdään optimoitu kopio `public/images/`-kansioon.

---

## 1. Väripaletti

Sama paletti kuin koodissa ([tailwind.config.js](../tailwind.config.js),
[src/index.css](../src/index.css)). Julisteet käyttävät samaa kobolttisineä
lämpimällä paperipohjalla.

| Rooli | Token | HEX | Käyttö |
|---|---|---|---|
| Brändiväri | `blue` | `#002FD6` | Pinnat, typografia, halftone-rasteri |
| Tumma sininen | `blue-600` | `#0026B0` | Hover, syvyys |
| Vaalea sininen | `blue-100` | `#E8ECFF` | Taustat, chipit |
| Musta | `ink` | `#0A0E1A` | Otsikot, kontrastilohkot |
| Navy | `navy` | `#05103A` | Tummat sektiot |
| Paperi | `paper` | `#FFFFFF` | Perustausta |
| Paperi 2 | `paper-2` | `#F6F7FB` | Vuorottelevat sektiot |
| Viiva | `line` | `#E5E7EF` | Reunat, erottimet |

**Sääntö:** sininen on kobolttia, ei koskaan violettia. Julisteiden luonnonvalkoinen
paperisävy on printtitekstuuria — verkossa käytetään `paper` / `paper-2`.

## 2. Typografia

- **Otsikot:** Space Grotesk (`font-heading`)
- **Leipäteksti:** Inter (`font-body`)
- **Julisteiden display:** erittäin kondensoitu grotesk, versaalit, tiukka riviväli
  — käytetään vain kuvamateriaalissa, ei web-typografiassa.

## 3. Visuaaliset motiivit

| Motiivi | Kuvaus | Esiintyy |
|---|---|---|
| Halftone-rasteri | Pisterasteri, joka häivyttää sinisen paperiin | 01, 02, 03, 04 |
| Porraslohkot | Nousevat suorakulmiot = kasvu / eteneminen | 01, 03 |
| UI-annotaatiot | Design-työkalun valintakahvat ja labelit | 01, 03 |
| Repeämä / krakelointi | Printtikulunut reuna, riso-estetiikka | 01, 02, 03 |
| Palvelu-chipit | Pyöristetyt pillerit palveluiden nimillä | 04 |
| Leimat | Vinot "STRATEGY / DESIGN / MARKETING" -leimat | 02 |

## 4. Kansiorakenne

```
brand/
├── VISUAL-SCHEMA.md   ← tämä tiedosto
├── posters/           Valmiit julisteet / kampanjagrafiikat (1856×2304)
├── logo/              Logon variantit (wordmark, merkki, mono)
├── textures/          Halftone-, paperi- ja repeämätekstuurit
└── mockups/           Laite- ja tuotemockupit
```

## 5. Julisteet

| Tiedosto | Sisältö | Sävy | Käyttöidea |
|---|---|---|---|
| [poster-01-services-halftone-blocks.png](posters/poster-01-services-halftone-blocks.png) | Halftone-porraslohkot, annotaatiot Websites / Automation / Analytics / Design, "ealize." | Sininen + luonnonvalkoinen | Palvelut-sektion hero |
| [poster-02-realize-hand-dashboard.png](posters/poster-02-realize-hand-dashboard.png) | Käsi pitelee selainikkunaa kasvukäyrällä, leimat STRATEGY / DESIGN / DEVELOPMENT / MARKETING | Sininen + luonnonvalkoinen | Analytics / prosessi |
| [poster-03-websites-this-smart.png](posters/poster-03-websites-this-smart.png) | "SINCE WHEN DID WEBSITES GET THIS SMART?", portaat annotaatioilla Faster / Cleaner / Smarter / Automated | Sininen + musta + valkoinen | Kampanja, some |
| [poster-04-four-things-one-solution.png](posters/poster-04-four-things-one-solution.png) | "FOUR THINGS. ONE SOLUTION." + palvelu-chipit, halftone-konfetti | Sininen valkoisella | Palvelupaketti, hinnoittelu |

Kaikki: **1856 × 2304 px** (4:5, pysty), PNG, 4–9 MB.

## 6. Käyttöohje verkossa

1. Älä linkitä `brand/`-kansioon suoraan — Vite ei tarjoile sitä.
2. Vie käytettävä kuva `public/images/`-kansioon WebP:nä, leveys ≤ 1600 px, laatu ~80.
3. Viittaa absoluuttisella polulla: `/images/<nimi>.webp`.
4. Anna aina kuvaava `alt`-teksti suomeksi.
