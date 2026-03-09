# Kitchen & Bathroom Remodeling Pros — Design & Development Plan

---

## 1. ДИЗАЙН-КОНЦЕПЦИЯ

### Стиль: "Modern Premium Craftsman"
Чистый, современный, premium-feel сайт с тёплыми акцентами.
Не корпоративно-холодный, не дешёвый — баланс между доверием и стилем.

### Цветовая палитра: "Warm Contemporary"

```
Primary (Dark Navy):     #1B2B4B  — заголовки, навигация, footer
Accent (Warm Gold):      #C8973E  — CTA кнопки, акценты, иконки
Accent Hover:            #B8872E  — hover состояние кнопок
Light Background:        #F8F6F3  — тёплый off-white фон секций
White:                   #FFFFFF  — основной фон
Dark Text:               #2D3748  — body текст
Muted Text:              #6B7280  — secondary текст
Border:                  #E5E2DC  — границы, разделители
Success Green:           #2F855A  — отзывы, рейтинги
Light Gold:              #FBF5EB  — лёгкий gold tint для секций
```

**Почему эта палитра:**
- Тёмно-синий = доверие, профессионализм (как у Neil Kelly, Better Builders)
- Золотой = premium, quality craftsmanship
- Тёплый off-white = уютно, отличается от холодных сайтов конкурентов
- Конкуренты используют синий+белый — мы добавляем тёплые тона для отстройки

### Типографика

```
Заголовки:  DM Serif Display (Google Fonts) — элегантный serif, premium feel
Body:       Inter (Google Fonts) — чистый, отлично читается, modern
Accent:     Inter Medium/Semibold — кнопки, метки, навигация
```

**Размеры (mobile-first):**
```
Hero H1:    text-4xl → md:text-5xl → lg:text-6xl  (36→48→60px)
H2:         text-3xl → md:text-4xl                  (30→36px)
H3:         text-xl  → md:text-2xl                  (20→24px)
Body:       text-base → md:text-lg                   (16→18px)
Small:      text-sm                                   (14px)
```

---

## 2. UI/UX ПАТТЕРНЫ

### 2.1 Navigation (Mega Menu)

```
┌──────────────────────────────────────────────────────────────┐
│ LOGO          Services ▾  Areas ▾  Gallery  Cost Guides     │
│                                     Blog    About           │
│                              ☎ (206) XXX-XXXX   [FREE QUOTE]│
└──────────────────────────────────────────────────────────────┘

Services Dropdown (Mega Menu):
┌─────────────────────────────────────────────────────────────┐
│ KITCHEN                    │ BATHROOM                       │
│ ─────────                  │ ─────────                      │
│ Kitchen Remodeling         │ Bathroom Remodeling            │
│ Cabinet Refacing           │ Shower Remodeling              │
│ Countertop Installation    │ Bathtub Replacement            │
│ Kitchen Layout Design      │ Vanity Installation            │
│ Custom Cabinetry           │ Tile Installation              │
│                            │                                │
│ GENERAL                    │ [Featured Image: Recent        │
│ ─────────                  │  project with CTA]             │
│ Flooring Installation      │                                │
│ Aging-in-Place Remodeling  │                                │
└─────────────────────────────────────────────────────────────┘
```

- **Sticky header** с уменьшением высоты при скролле (8-15% рост конверсии)
- **Mobile:** hamburger menu + sticky bottom bar "Call | Free Quote"
- Телефон всегда виден в header на desktop

### 2.2 Hero Section (Homepage)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Full-width background: красивая кухня после ремоделинга] │
│                                                             │
│     Seattle's Trusted Kitchen &                             │
│     Bathroom Remodeling Experts                             │
│                                                             │
│     Transform your home with award-winning                  │
│     craftsmanship. Free consultations.                      │
│                                                             │
│     [Get Free Quote]  [View Our Work →]                     │
│                                                             │
│     ★★★★★ 50+ Five-Star Google Reviews                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Статичное изображение (не видео — быстрее грузится, лучше LCP)
- Parallax-эффект на скролле (CSS scroll-driven, без JS)
- Text reveal анимация при загрузке
- Trust badge с Google Reviews сразу видно

### 2.3 Homepage Sections (порядок)

```
1. Hero — H1, CTA, trust signal
2. Trust Bar — лицензии, "Licensed Bonded Insured", years in business, Google rating
3. Services Overview — 6 карточек услуг с иконками + hover эффект
4. Before/After Showcase — 3 интерактивных слайдера до/после
5. Why Choose Us — 4 value props с иконками + числовые статы (animated counters)
6. Featured Projects Gallery — masonry grid, 6-8 проектов с hover overlay
7. Cost Guide Teaser — "How Much Does a Kitchen Remodel Cost in Seattle?" + CTA
8. Areas Served — карта + список городов с ссылками
9. Testimonials — карусель отзывов с Google stars
10. Process Steps — 5-step timeline (Consult → Design → Permit → Build → Reveal)
11. Blog Preview — 3 последних поста
12. Final CTA — большой CTA блок с формой или кнопкой
13. Footer — mega footer с навигацией, контактами, locations, social links
```

### 2.4 Service Page Layout

```
1. Hero — service name + stunning image + breadcrumbs
2. Intro — 2-3 параграфа о сервисе
3. Before/After — 2 сравнения для этого типа услуги
4. Features/What We Offer — grid карточек (sub-services)
5. Our Process — 5-step timeline для этого сервиса
6. Gallery — 4-6 проектов этого типа
7. Cost Guide CTA — "How much does [service] cost? Read our guide →"
8. FAQ — 5-7 вопросов (accordion) + FAQPage schema
9. Testimonials — 2-3 отзыва по этому типу работ
10. Areas Served — "We provide [service] in:" + список городов
11. CTA — "Ready to start your [service] project?" + форма
```

### 2.5 Location Page Layout

```
1. Hero — "[City] Kitchen & Bathroom Remodeling" + local image
2. Intro — уникальный текст о городе, жилфонде, стиле домов
3. Services in [City] — карточки со ссылками на combo pages
4. Local Projects — 2-4 кейса из этого города с фото
5. Permits & Regulations — локальные требования к разрешениям
6. Housing Data — средняя стоимость домов, год постройки, популярные проекты
7. Testimonials — отзывы от клиентов из этого района
8. Neighborhoods — список районов/соседних городов со ссылками
9. FAQ — 3-5 локальных вопросов
10. CTA — "Start your [City] remodeling project" + форма
11. Map — Google Maps embed с обозначением зоны обслуживания
```

### 2.6 Lead Capture Form (Multi-Step)

Multi-step формы дают на 86% больше конверсий чем одностраничные.

```
Step 1: What type of project?
        ○ Kitchen Remodel  ○ Bathroom Remodel  ○ Both  ○ Other

Step 2: What's your timeline?
        ○ ASAP  ○ 1-3 months  ○ 3-6 months  ○ Just exploring

Step 3: Your contact info
        [Name] [Phone] [Email] [ZIP Code]
        [Tell us about your project... (textarea)]
        [Get Your Free Quote →]
```

- Progress bar сверху формы
- Каждый шаг = одна анимация slide
- Honeypot поле для спам-защиты

---

## 3. АНИМАЦИИ И ЭФФЕКТЫ

### Все анимации GPU-accelerated (только transform + opacity)

| Эффект | Где | Реализация |
|---|---|---|
| Fade-in-up при скролле | Все секции | Intersection Observer + CSS transition |
| Stagger children | Карточки услуг, gallery | CSS transition-delay по nth-child |
| Parallax hero | Homepage hero | CSS scroll-driven animation (без JS) |
| Text reveal | Hero H1 | CSS clip-path animation |
| Number counters | Stats секция | CSS @property animation |
| Before/After slider | Service pages, gallery | CSS clip-path + input range |
| Card hover lift | Карточки | Tailwind hover:-translate-y-1 + shadow |
| Image zoom on hover | Gallery | Tailwind group-hover:scale-110 |
| Button fill | CTA buttons | CSS ::before pseudo-element transition |
| Nav underline slide | Desktop nav links | CSS ::after scale-x transition |
| Page transitions | Все переходы | Astro View Transitions (crossfade) |
| Shared element morph | Gallery → project page | Astro transition:name |
| Smooth scroll | Anchor links | CSS scroll-behavior: smooth |
| Floating labels | Forms | Tailwind peer + CSS transition |
| Accordion expand | FAQ | CSS grid-rows + transition |

### Accessibility
- Все анимации отключаются при `prefers-reduced-motion: reduce`
- Astro View Transitions делает это автоматически
- `motion-safe:` prefix в Tailwind для scroll animations

---

## 4. КОМПОНЕНТНАЯ АРХИТЕКТУРА

### Layouts (3)
```
BaseLayout.astro        — HTML shell, fonts, meta, schema, analytics
PageLayout.astro        — header + footer + slot (для обычных страниц)
BlogLayout.astro        — header + sidebar + footer (для блога)
```

### Global Components (7)
```
Header.astro            — sticky header с mega menu
MobileNav.astro         — hamburger + slide-out menu
MegaMenu.astro          — dropdown с услугами и featured image
Footer.astro            — mega footer с навигацией
StickyMobileCTA.astro   — fixed bottom bar (Call | Quote) на мобильных
Breadcrumbs.astro       — breadcrumb навигация
CookieConsent.astro     — если понадобится
```

### SEO Components (6)
```
SEOHead.astro           — title, meta description, canonical, OG tags
SchemaLocalBusiness.astro — HomeAndConstructionBusiness JSON-LD
SchemaService.astro     — Service JSON-LD
SchemaArticle.astro     — Article JSON-LD для блога
SchemaFAQ.astro         — FAQPage JSON-LD
SchemaBreadcrumb.astro  — BreadcrumbList JSON-LD
```

### Hero Components (4)
```
HeroHome.astro          — full-width с parallax + CTA + trust badge
HeroService.astro       — service name + image + breadcrumbs
HeroLocation.astro      — city name + local image + breadcrumbs
HeroBlog.astro          — post title + date + author + featured image
```

### CTA Components (4)
```
CTABanner.astro         — full-width CTA секция
CTAInline.astro         — inline CTA внутри контента
CTASidebar.astro        — sidebar CTA виджет
QuoteForm.astro         — multi-step lead capture form
```

### Content Components (15)
```
ServiceCard.astro       — карточка услуги с иконкой
ServiceGrid.astro       — grid из ServiceCard
LocationCard.astro      — карточка города
LocationGrid.astro      — grid из LocationCard
BeforeAfter.astro       — интерактивный slider до/после
GalleryGrid.astro       — masonry gallery grid
GalleryCard.astro       — карточка проекта с hover overlay
ProjectDetail.astro     — детальная страница проекта
TestimonialCard.astro   — карточка отзыва
TestimonialCarousel.astro — карусель отзывов
ProcessTimeline.astro   — 5-step process timeline
StatsCounter.astro      — animated number counters
FAQAccordion.astro      — accordion FAQ
CostTable.astro         — таблица стоимости услуг
BlogCard.astro          — карточка блог-поста
```

### UI Primitives (6)
```
Button.astro            — кнопка с вариантами (primary, secondary, outline)
Badge.astro             — label/badge
StarRating.astro        — звёзды рейтинга
Icon.astro              — SVG иконки
SectionWrapper.astro    — wrapper для секций с reveal animation
Container.astro         — max-width container
```

---

## 5. СТРУКТУРА ПРОЕКТА (Astro 5)

```
kitchenandbathroomremodelingpros.com/
├── astro.config.mjs
├── tailwind.css                    # Tailwind v4 с @theme
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── _headers                    # Cloudflare security headers
│   └── images/
│       ├── hero/
│       ├── projects/
│       ├── team/
│       └── icons/
│
├── src/
│   ├── assets/                     # Optimized by Astro
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── global/                 # Header, Footer, Nav, etc.
│   │   ├── heroes/                 # Hero variants
│   │   ├── cta/                    # CTA variants + QuoteForm
│   │   ├── content/                # ServiceCard, Gallery, FAQ, etc.
│   │   ├── seo/                    # Schema, SEOHead
│   │   └── ui/                     # Button, Badge, Icon, etc.
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   └── BlogLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── get-a-quote.astro
│   │   ├── financing.astro
│   │   ├── reviews.astro
│   │   ├── our-process.astro
│   │   ├── services/
│   │   │   ├── index.astro         # Services hub
│   │   │   ├── kitchen-remodeling.astro
│   │   │   ├── bathroom-remodeling.astro
│   │   │   ├── cabinet-refacing.astro
│   │   │   ├── countertop-installation.astro
│   │   │   ├── tile-installation.astro
│   │   │   ├── shower-remodeling.astro
│   │   │   ├── bathtub-replacement.astro
│   │   │   ├── vanity-installation.astro
│   │   │   ├── kitchen-layout-design.astro
│   │   │   ├── custom-cabinetry.astro
│   │   │   ├── flooring-installation.astro
│   │   │   └── aging-in-place.astro
│   │   │
│   │   ├── areas-served/
│   │   │   ├── index.astro         # Locations hub
│   │   │   └── [city]/
│   │   │       ├── index.astro     # Dynamic: location page
│   │   │       └── [service].astro # Dynamic: service+location combo
│   │   │
│   │   ├── cost-guides/
│   │   │   ├── index.astro         # Cost guides hub
│   │   │   └── [slug].astro        # Dynamic: individual guides
│   │   │
│   │   ├── gallery/
│   │   │   ├── index.astro         # Gallery hub
│   │   │   └── [slug].astro        # Dynamic: project detail
│   │   │
│   │   ├── blog/
│   │   │   ├── index.astro         # Blog hub
│   │   │   └── [slug].astro        # Dynamic: blog post
│   │   │
│   │   └── api/
│   │       └── quote.ts            # Form handler (Cloudflare Worker)
│   │
│   ├── data/                       # Content Collections
│   │   ├── services/               # .md files per service
│   │   ├── locations/              # .yaml with city data
│   │   ├── blog/                   # .md files per post
│   │   ├── gallery/                # .md files per project
│   │   ├── cost-guides/            # .md files per guide
│   │   ├── testimonials.yaml       # All testimonials
│   │   ├── faqs.yaml               # All FAQs by category
│   │   └── combo-content/          # Unique content per city+service
│   │
│   ├── lib/
│   │   ├── constants.ts            # Site config, NAP, phone, etc.
│   │   ├── utils.ts                # Helper functions
│   │   └── schema.ts               # Schema generation helpers
│   │
│   ├── content.config.ts           # Content Collections schemas
│   └── styles/
│       └── global.css              # Global styles + animations
│
└── wrangler.jsonc                  # Cloudflare Pages config
```

---

## 6. DATA COLLECTIONS (Content Layer)

### services/*.md
```yaml
---
title: "Kitchen Remodeling"
slug: "kitchen-remodeling"
category: "kitchen"  # kitchen | bathroom | general
description: "Full kitchen remodeling..."
metaTitle: "Kitchen Remodeling Seattle | Kitchen & Bathroom Remodeling Pros"
metaDescription: "Transform your kitchen with..."
icon: "kitchen"
heroImage: "./images/kitchen-hero.jpg"
features:
  - "Custom cabinet design"
  - "Countertop installation"
  - "Layout optimization"
order: 1
---

[Full service page content in markdown]
```

### locations/cities.yaml
```yaml
- city: "Seattle"
  slug: "seattle"
  state: "WA"
  county: "King"
  tier: 1
  population: 750000
  medianHomeValue: 850000
  medianHomeAge: 1955
  coordinates: { lat: 47.6062, lng: -122.3321 }
  description: "As Seattle's premier kitchen and bathroom remodeling company..."
  neighborhoods:
    - "Ballard"
    - "Capitol Hill"
    - "Queen Anne"
    - "Fremont"
    - "West Seattle"
    # ...
  housingStyles:
    - "Craftsman bungalows"
    - "Mid-century modern"
    - "New construction"
  permitInfo: "Seattle SDCI requires permits for remodeling projects over $6,000..."
  localFacts:
    - "Seattle homes average 70 years old, making kitchen updates essential"
    - "PNW moisture requires careful bathroom ventilation planning"
  nearbyAreas: ["Shoreline", "Burien", "Tukwila", "Renton"]
```

### combo-content/{city}--{service}.md
```yaml
---
city: "bellevue"
service: "kitchen-remodeling"
title: "Kitchen Remodeling in Bellevue, WA"
metaTitle: "Kitchen Remodeling Bellevue WA | Free Estimates"
metaDescription: "Expert kitchen remodeling in Bellevue. Serving Eastside homes since..."
---

[300-500 words unique to this city+service combination]

Bellevue homeowners in neighborhoods like Crossroads, Factoria, and
Somerset often seek kitchen remodeling to modernize the builder-grade
finishes common in 1990s-2000s construction...
```

### testimonials.yaml
```yaml
- name: "John & Sarah M."
  city: "Bellevue"
  service: "kitchen-remodeling"
  rating: 5
  text: "Completely transformed our dated kitchen in Crossroads..."
  date: "2025-11-15"
  source: "google"
```

### gallery/projects/*.md
```yaml
---
title: "Modern Kitchen Remodel in Capitol Hill"
slug: "capitol-hill-modern-kitchen"
city: "seattle"
neighborhood: "Capitol Hill"
service: "kitchen-remodeling"
beforeImage: "./before.jpg"
afterImage: "./after.jpg"
galleryImages: ["./img1.jpg", "./img2.jpg", "./img3.jpg"]
description: "Complete kitchen transformation..."
scope: ["Countertops", "Cabinets", "Flooring", "Lighting"]
timeline: "6 weeks"
budgetRange: "$45,000 - $55,000"
year: 2025
featured: true
---

[Detailed project case study]
```

---

## 7. ПОЛНЫЙ СПИСОК СТРАНИЦ НА LAUNCH

### Static Pages (7)
1. Homepage
2. About
3. Our Process
4. Contact
5. Get a Quote
6. Financing
7. Reviews

### Service Pages (13)
1. Services Hub
2. Kitchen Remodeling
3. Bathroom Remodeling
4. Cabinet Refacing
5. Countertop Installation
6. Tile Installation
7. Shower Remodeling
8. Bathtub Replacement
9. Vanity Installation
10. Kitchen Layout Design
11. Custom Cabinetry
12. Flooring Installation
13. Aging-in-Place Remodeling

### Location Pages — Tier 1 (10 cities × 1 hub page = 10)
Seattle, Bellevue, Kirkland, Redmond, Renton, Kent, Federal Way, Tacoma, Everett, Sammamish

### Location Pages — Tier 2 (18 cities × 1 hub page = 18)
Bothell, Woodinville, Issaquah, Mercer Island, Burien, Shoreline, Lynnwood, Edmonds, Auburn, Puyallup, Kenmore, Lake Forest Park, Mountlake Terrace, Mukilteo, Mill Creek, Maple Valley, Covington, Newcastle

### Service+Location Combo Pages
- Tier 1 cities × 2 combos (kitchen + bathroom) = 20
- Tier 2 cities × 2 combos = 36
- **Total combos: 56**

### Location Hub (1)
Areas Served — с картой и списком всех городов

### Cost Guide Pages (6)
1. Cost Guides Hub
2. Kitchen Remodel Cost Seattle 2026
3. Bathroom Remodel Cost Seattle 2026
4. Cabinet Refacing Cost
5. Countertop Installation Cost
6. Shower Remodel Cost

### Gallery Pages (12)
1. Gallery Hub
2-12. 10 individual project pages (before/after case studies)

### Blog Posts (20)
1. Blog Hub
2-21. 20 blog articles covering different topics

### FAQ Pages (4)
General FAQ, Kitchen FAQ, Bathroom FAQ, Permit FAQ
(integrated into service pages as accordion sections)

---

### GRAND TOTAL: ~167 pages

| Тип | Количество |
|---|---|
| Static pages | 7 |
| Service pages | 13 |
| Location pages | 29 |
| Service+Location combos | 56 |
| Cost guides | 6 |
| Gallery pages | 12 |
| Blog posts | 21 |
| **TOTAL** | **~144 pages** |

Расширение до 200+ через:
- Дополнительные blog posts (+20)
- Больше gallery projects (+10)
- Seattle neighborhood sub-pages (+6-8)
- Дополнительные combo pages для popular services (+20)

---

## 8. SEO CHECKLIST НА КАЖДОЙ СТРАНИЦЕ

- [ ] Уникальный `<title>` (50-60 chars) с keyword + city
- [ ] Уникальный `<meta description>` (150-160 chars) с CTA
- [ ] `<h1>` с primary keyword (один на страницу)
- [ ] Semantic headings hierarchy (h1 → h2 → h3)
- [ ] `<canonical>` URL
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Schema JSON-LD (тип зависит от страницы)
- [ ] BreadcrumbList schema
- [ ] Internal links to hub page + related pages (5-10 на страницу)
- [ ] Alt text на всех изображениях с keyword
- [ ] Optimized images (WebP/AVIF, srcset, lazy loading)
- [ ] Минимум 800 слов на service pages, 500 на location pages
- [ ] CTA с "Get a Free Quote" или "Call Now"
- [ ] NAP (Name, Address, Phone) в footer
- [ ] Mobile-friendly layout
- [ ] Core Web Vitals pass (LCP < 2.5s, INP < 200ms, CLS < 0.1)

---

## 9. ПРИОРИТЕТ РАЗРАБОТКИ

### Phase 1: Foundation (первым делом)
1. Astro project setup, Tailwind config, fonts, colors
2. BaseLayout + SEOHead + Schema components
3. Header (mega menu) + Footer + StickyMobileCTA
4. Button, Container, SectionWrapper, Icon components
5. Homepage (все 13 секций)

### Phase 2: Service Pages
6. HeroService component
7. ProcessTimeline, FAQAccordion, ServiceCard/Grid components
8. BeforeAfter slider component
9. All 12 service pages + services hub

### Phase 3: Location Engine
10. Content Collections setup (locations, combo-content)
11. Dynamic [city]/index.astro + [city]/[service].astro
12. LocationCard/Grid, map embed
13. All 29 location pages + 56 combo pages + hub

### Phase 4: Content Pages
14. Cost guide pages (6)
15. Gallery pages (12) + GalleryGrid, GalleryCard, Lightbox
16. Blog pages (21) + BlogCard, BlogLayout
17. About, Process, Contact, Quote, Financing, Reviews

### Phase 5: Polish & Launch
18. QuoteForm (multi-step)
19. All animations (scroll reveal, counters, transitions)
20. Sitemap generation, robots.txt
21. Performance optimization (fonts, images, prefetch)
22. Final SEO audit
23. Deploy to Cloudflare Pages
