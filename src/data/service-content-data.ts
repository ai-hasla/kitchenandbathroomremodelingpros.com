import type { LocationData } from './locations/location-data';

// Deterministic hash for FAQ answer variation (stable across builds)
function faqHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Pick one of N variations based on hash — used across hero, paragraphs, FAQ, CTA
function pickVariant<T>(variants: T[], hash: number): T {
  return variants[Math.abs(hash) % variants.length];
}

// City-slug hash for hero/paragraph variation
function cityHash(slug: string): number {
  return faqHash(slug);
}

// Pick one of N sentence variations based on hash
function pickVariation(loc: LocationData, slug: string, questionIndex: number, variations: string[]): string {
  const h = faqHash(`${loc.slug}:${slug}:faq${questionIndex}`);
  return variations[h % variations.length];
}

export interface ServiceContentData {
  title: string;
  slug: string;
  category: 'kitchen' | 'bathroom' | 'general';
  room: string;
  shortDescription: string;
  costMultiplierLow: number;
  costMultiplierHigh: number;
  costTiers: {
    budget: { label: string; description: string };
    average: { label: string; description: string };
    premium: { label: string; description: string };
  };
  heroText: (loc: LocationData, hash?: number) => string;
  mainHeading: (loc: LocationData) => string;
  mainParagraph1: (loc: LocationData, formatCurrency: (n: number) => string, hash?: number) => string;
  mainParagraph2: (loc: LocationData) => string;
  mainParagraph3: (loc: LocationData, hash?: number) => string;
  projectsHeading: (loc: LocationData) => string;
  projectsSubheading: (loc: LocationData) => string;
  projectFilter: (project: string) => boolean;
  costSubheading: (loc: LocationData) => string;
  costDisclaimer: (loc: LocationData, formatCurrency: (n: number) => string) => string;
  permitText: (loc: LocationData, hash?: number) => string;
  faqs: (loc: LocationData, formatCurrency: (n: number) => string, costLow: number, costHigh: number, avgCost: number) => { question: string; answer: string }[];
  ctaHeading: (loc: LocationData, hash?: number) => string;
  ctaText: (loc: LocationData, hash?: number) => string;
  crossLinkText: (loc: LocationData) => string;
}

const serviceContentMap: Record<string, ServiceContentData> = {
  'kitchen-remodeling': {
    title: 'Kitchen Remodeling',
    slug: 'kitchen-remodeling',
    category: 'kitchen',
    room: 'kitchen',
    shortDescription: 'Complete kitchen transformations from layout redesign to finishing touches.',
    costMultiplierLow: 0.05,
    costMultiplierHigh: 0.12,
    costTiers: {
      budget: { label: 'Budget Kitchen Remodel', description: 'Cabinet refacing, new countertops, updated fixtures' },
      average: { label: 'Average Kitchen Remodel', description: 'New cabinets, quartz counters, appliances, tile backsplash' },
      premium: { label: 'Premium Kitchen Remodel', description: 'Custom cabinets, premium stone, pro appliances, layout changes' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We've remodeled kitchens in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, ${loc.housingStyles[1]?.toLowerCase() || 'newer construction'}, and everything in between. Got a cramped galley from 1955 or an open-concept layout that just needs better finishes? We know how to make it work for your life and your budget.`,
        `${loc.city} kitchen remodeling starts with understanding what makes homes here unique. The ${loc.housingStyles[0].toLowerCase()} construction common throughout ${loc.neighborhoods[0] || loc.city} and ${loc.neighborhoods[1] || 'surrounding areas'} presents specific opportunities for layout improvements, cabinet upgrades, and modern finishes that respect the original architecture while transforming how you use the space.`,
        `Your ${loc.city} kitchen deserves better than a cookie-cutter renovation. Whether you're in a ${loc.housingStyles[0].toLowerCase()} home near ${loc.neighborhoods[0] || 'downtown'} or a newer build closer to ${loc.neighborhoods[2] || 'the outskirts'}, we design around your actual space — not a catalog template. Every kitchen we deliver is built for how your household really cooks, gathers, and lives.`,
        `After 15 years remodeling kitchens across the Puget Sound, we know ${loc.city}'s housing stock inside and out. The ${loc.medianHomeAge}-year-old homes here have specific quirks that affect layout, plumbing routes, and electrical capacity. That local knowledge means fewer surprises during demolition and a smoother project from start to finish.`,
      ], h);
    },
    mainHeading: (loc) => `What ${loc.city} Homeowners Typically Want in a Kitchen Remodel`,
    mainParagraph1: (loc, fmt, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Most of the ${loc.city} kitchens we remodel are in ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'mid-century'} homes that are ${loc.medianHomeAge} years old on average. At that age, you're typically looking at dated cabinets, laminate countertops, worn flooring, and a layout that doesn't match how families cook and live today. With homes here valued around ${fmt(loc.medianHomeValue)}, most ${loc.city} homeowners invest ${fmt(Math.round(loc.medianHomeValue * 0.06 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.12 / 1000) * 1000)} in a kitchen remodel — enough to make a real transformation without overcapitalizing relative to the neighborhood.`,
        `Kitchen remodeling in ${loc.city} revolves around one core issue: the original kitchens in these ${loc.medianHomeAge}-year-old ${loc.housingStyles[0].toLowerCase()} homes were designed for a different era. Closed-off rooms, insufficient countertop workspace, and electrical panels that struggle with modern appliance loads are the norm. At a median home value of ${fmt(loc.medianHomeValue)}, strategic investments of ${fmt(Math.round(loc.medianHomeValue * 0.06 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.12 / 1000) * 1000)} deliver the highest return — enough scope to address layout, surfaces, and function without overimproving for the market.`,
        `The typical ${loc.city} kitchen tells a predictable story: ${loc.housingStyles[0].toLowerCase()} construction from ${loc.medianHomeAge} years ago with cabinets that have seen better decades, laminate surfaces showing their age, and a floor plan built before the kitchen became the social hub of the home. Homeowners here, with property values averaging ${fmt(loc.medianHomeValue)}, generally allocate ${fmt(Math.round(loc.medianHomeValue * 0.06 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.12 / 1000) * 1000)} for their kitchen renovation — a range that covers everything from a focused refresh to a comprehensive overhaul.`,
      ], h);
    },
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Here's what we see most often from ${loc.city} homeowners: they want more counter space, better storage, updated finishes, and a kitchen that feels connected to the rest of the home. Many ${loc.housingStyles[0].toLowerCase()} homes in the area have closed-off galley kitchens — opening that up to the dining or living area is one of our most requested projects. Others have the right layout but need everything resurfaced: new quartz countertops, refaced or replaced cabinets, modern backsplash, and better lighting. We'll help you figure out which approach makes sense for your home and your budget during a free in-home consultation.`,
        `Three priorities dominate ${loc.city} kitchen remodeling conversations. First, layout: removing walls or reconfiguring traffic flow so the kitchen works for multiple cooks and connects to gathering spaces. Second, surfaces: replacing worn laminate and dated tile with quartz countertops, modern cabinetry, and a backsplash that anchors the room's visual identity. Third, infrastructure: upgrading the electrical panel, adding circuits for modern appliances, and improving ventilation. We address all three during our free consultation, helping you sequence improvements based on impact and budget.`,
        `${loc.city} homeowners consistently prioritize the same upgrades: expanding usable counter space, maximizing cabinet storage, and creating sightlines between the kitchen and living areas. In the ${loc.housingStyles[0].toLowerCase()} homes that define much of ${loc.city}, this often means converting a compartmentalized galley into a more open arrangement — sometimes by removing a wall, other times by replacing upper cabinets with open shelving or adding a peninsula. Quartz countertops and soft-close cabinets round out the typical wish list. During your free in-home consultation, we assess what your specific home can accommodate and present options that deliver the most impact per dollar.`,
      ], h);
    },
    projectsHeading: (loc) => `Popular Kitchen Remodeling Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `Given ${loc.city}'s mix of ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'newer'} homes, here are the kitchen projects we complete most often for homeowners in this area.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('kitchen') || lower.includes('cabinet') || lower.includes('countertop') || lower.includes('island') || lower.includes('pantry');
    },
    costSubheading: (loc) =>
      `These ranges reflect what ${loc.city} homeowners are actually paying, adjusted for local home values and the typical scope of work we see in this area's ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'newer'} homes.`,
    costDisclaimer: (loc, fmt) =>
      `These estimates reflect ${loc.city}'s median home value of ${fmt(loc.medianHomeValue)} and current Puget Sound labor rates ($65-95/hour for skilled trades). Older homes in ${loc.city} may require electrical or plumbing updates that add 10-15% — we'll identify those during your free in-home consultation before quoting a final price.`,
    permitText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `In ${loc.city}, you'll need a permit for any kitchen remodel involving structural changes (wall removal), plumbing relocation (moving the sink or gas line), or new electrical circuits. We handle the entire permit process as part of our service — filing the application, managing plan review, and scheduling inspections. It's included in your quote, not an add-on. Our crews work with ${loc.city}'s building department regularly and know exactly what they require.`,
        `${loc.city}'s permit requirements follow standard ${loc.county} County building codes: structural modifications, plumbing rerouting, and electrical additions all trigger permits. Cosmetic work — painting, countertops on existing cabinets, hardware swaps — does not. We file every necessary permit, coordinate plan reviews, and schedule all required inspections as a standard part of our project management. You never deal with the building department directly.`,
        `Permit requirements in ${loc.city} depend entirely on scope. Replacing cabinets and countertops in their current positions? No permit. Opening a wall, moving the sink, or adding dedicated appliance circuits? Each of those triggers its own trade permit through ${loc.county} County. Our team submits permit applications on a weekly basis and has established relationships with local plan reviewers — we handle the entire process from filing to final inspection at no additional cost.`,
      ], h);
    },
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does a kitchen remodel cost in ${loc.city}, WA?`,
        answer: pickVariation(loc, 'kitchen-remodeling', 0, [
          `For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, we typically see kitchen remodels ranging from ${fmt(costLow)} for a basic refresh (cabinet refacing, new countertops, updated fixtures) to ${fmt(costHigh)} for a high-end renovation with custom cabinetry, premium stone, and layout changes. The average project in ${loc.city} runs about ${fmt(avgCost)}. Older ${loc.housingStyles[0].toLowerCase()} homes in the area often need electrical or plumbing updates once walls are opened, which can add 10-15% — we identify these issues during your free in-home consultation so there are no budget surprises.`,
          `Based on ${loc.city}'s housing market where the median home value sits at ${fmt(loc.medianHomeValue)}, kitchen remodel investments here range from ${fmt(costLow)} for cosmetic updates to ${fmt(costHigh)} for a complete transformation. Most ${loc.city} homeowners land around ${fmt(avgCost)}, which covers new cabinets, quartz countertops, modern appliances, and a tile backsplash. The ${loc.housingStyles[0].toLowerCase()} homes that characterize much of ${loc.city} often have hidden issues — outdated wiring, galvanized plumbing — that surface during demolition, so we always include a thorough pre-project inspection in our process.`,
          `${loc.city} homeowners investing in kitchen remodeling generally budget between ${fmt(costLow)} and ${fmt(costHigh)}, with the average project coming in at ${fmt(avgCost)}. Given that homes here are valued at approximately ${fmt(loc.medianHomeValue)}, that investment range aligns with the 5-12% of home value that real estate experts recommend for kitchen renovations. In the ${loc.medianHomeAge}-year-old ${loc.housingStyles[0].toLowerCase()} homes common to ${loc.city}, we frequently encounter electrical systems and plumbing that need updating — our free in-home assessment identifies these factors before we quote a final number.`,
        ]),
      },
      {
        question: `How long does a kitchen remodel take in ${loc.city}?`,
        answer: pickVariation(loc, 'kitchen-remodeling', 1, [
          `A basic refresh in ${loc.city} takes 2-3 weeks. A mid-range remodel with new cabinets and countertops runs 6-8 weeks. High-end renovations with layout changes take 10-16 weeks. If your project requires permits from ${loc.county} County, add 2-5 weeks for plan review before construction starts — we use that time for material selection and ordering so you're not waiting twice. The ${loc.medianHomeAge}-year-old homes common in ${loc.city} sometimes reveal surprises during demo that add a few days, which is why we always build contingency into our project schedule.`,
          `Timeline depends on scope: ${loc.city} homeowners doing a cosmetic refresh (new counters, hardware, paint) can expect 2-3 weeks. A mid-range renovation that includes cabinet replacement and layout tweaks takes 6-8 weeks from demo to final walkthrough. Full-scale remodels with structural changes and custom cabinetry run 10-16 weeks. ${loc.county} County's permit review process adds 2-5 weeks upfront — we submit plans immediately and use that window for material procurement so your actual construction timeline stays tight. With ${loc.city}'s ${loc.medianHomeAge}-year-old housing stock, we build a buffer into every schedule for the unexpected discoveries that are routine in older homes.`,
          `For ${loc.city}'s typical kitchen renovation, plan on 6-8 weeks from demolition to cooking your first meal in the new space. Simpler projects — countertop replacement, cabinet refacing, fixture updates — wrap up in 2-3 weeks. A comprehensive remodel involving wall removal, plumbing relocation, and custom cabinetry stretches to 10-16 weeks. The ${loc.county} County permit process takes 2-5 weeks before we break ground, though we use that lead time productively for material ordering and fabrication. Given that ${loc.city}'s homes average ${loc.medianHomeAge} years old, our project plans always include contingency days for the kinds of behind-the-wall surprises that come with renovating older ${loc.housingStyles[0].toLowerCase()} homes.`,
        ]),
      },
      {
        question: `Do I need a permit for a kitchen remodel in ${loc.city}?`,
        answer: pickVariation(loc, 'kitchen-remodeling', 2, [
          `${loc.permitInfo} Bottom line: if you're moving plumbing, adding electrical circuits, or touching structural walls, you need a permit. Cosmetic work (painting, countertops on existing cabinets, hardware) does not. We handle the entire permit process — filing, plan review, inspections — as part of our service. It's included in every quote, not an add-on.`,
          `Short answer: any kitchen remodel in ${loc.city} that involves structural, electrical, or plumbing work requires permits. ${loc.permitInfo} Purely cosmetic updates — paint, new cabinet hardware, countertop replacement on existing cabinets — are permit-free. Our team manages all permit filings, plan reviews, and inspection scheduling as a standard part of our service. You'll never need to visit ${loc.city}'s building department or navigate the process yourself.`,
          `It depends on scope. In ${loc.city}, cosmetic kitchen updates (refacing cabinets, installing countertops, upgrading hardware and fixtures) do not require permits. Once you start moving walls, relocating plumbing, or adding electrical circuits, permits are mandatory. ${loc.permitInfo} We include complete permit management in every project quote — application, plan submission, review coordination, and inspection scheduling are all covered at no additional cost.`,
        ]),
      },
      {
        question: `What kitchen remodeling styles are popular in ${loc.city}?`,
        answer: pickVariation(loc, 'kitchen-remodeling', 3, [
          `The most common requests from ${loc.city} homeowners: opening up closed-off galley kitchens (very common in the area's ${loc.housingStyles[0].toLowerCase()} homes), quartz countertops to replace worn laminate, shaker-style cabinets in white or warm wood tones, and modern tile backsplashes. With homes here averaging ${loc.medianHomeAge} years old, many kitchens still have the original cabinets and layout. Popular upgrades also include updated lighting, soft-close drawers, and kitchen islands with seating — projects that match the housing stock and lifestyle in this part of the Puget Sound.`,
          `In ${loc.city}, we see strong demand for transitional kitchens that blend modern function with the character of the area's ${loc.housingStyles[0].toLowerCase()} homes. Shaker cabinets remain the top choice — about 55% of our projects — with white, warm gray, and natural wood tones leading the palette. Quartz countertops dominate at roughly 65% of installations, particularly marble-look patterns from Cambria and Silestone. Many ${loc.city} homeowners with ${loc.medianHomeAge}-year-old homes prioritize opening closed layouts, adding undercabinet lighting, and incorporating a kitchen island or peninsula for additional prep space and casual seating.`,
          `${loc.city}'s remodeling preferences reflect the area's mix of ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'newer'} homes. The leading trend: converting compartmentalized kitchens into open-concept spaces that connect to living areas — we do this more than any other project type. Material-wise, engineered quartz has largely replaced granite as the countertop standard, and frameless cabinet construction is gaining ground on traditional face-frame styles. Subway tile backsplashes remain popular but homeowners are increasingly choosing larger formats (3x12 or 4x12) and handmade textures over the classic 3x6. Under-cabinet and in-drawer lighting round out the top upgrade requests from homeowners in this ${loc.medianHomeAge}-year-old housing market.`,
        ]),
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Start Your ${loc.city} Kitchen Remodel Today`,
        `Ready to Transform Your ${loc.city} Kitchen?`,
        `Let's Talk About Your ${loc.city} Kitchen Project`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll come to your ${loc.city} home, measure the kitchen, look at the existing plumbing and electrical, and give you a detailed line-item estimate. No vague ranges, no pressure, no "let me check with my manager." Just a straight answer from people who remodel kitchens every day.`,
        `Hundreds of ${loc.city} homeowners have trusted us with their kitchens — and the results speak for themselves. From galley-to-open-concept conversions to surface-level refreshes, we deliver on time and on budget. Your free consultation includes a detailed scope review and a line-item estimate you can actually plan around.`,
        `We've built our reputation in ${loc.city} one kitchen at a time. Licensed, bonded, insured, and backed by 15+ years of Puget Sound remodeling experience. Schedule a free in-home consultation and get an honest assessment of what your kitchen needs, what it'll cost, and how long it'll take. No sales pitch — just answers.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Need a bathroom remodel in ${loc.city} too? Many homeowners do both — and we offer project bundling that can save 5-8% on combined work.`,
  },

  'bathroom-remodeling': {
    title: 'Bathroom Remodeling',
    slug: 'bathroom-remodeling',
    category: 'bathroom',
    room: 'bathroom',
    shortDescription: 'Complete bathroom renovations that blend style with functionality.',
    costMultiplierLow: 0.03,
    costMultiplierHigh: 0.07,
    costTiers: {
      budget: { label: 'Budget Bathroom Remodel', description: 'New vanity, tub refinishing, updated fixtures & paint' },
      average: { label: 'Average Bathroom Remodel', description: 'Walk-in shower, custom tile, new vanity, heated floors' },
      premium: { label: 'Premium Bathroom Remodel', description: 'Full spa conversion, custom everything, premium stone & fixtures' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `From tub-to-shower conversions in ${loc.city}'s older ${loc.housingStyles[0].toLowerCase()} homes to full spa-style builds in newer construction, we handle bathroom remodels of every scope. Proper waterproofing, quality tile work, and fixtures that last — built for the PNW climate.`,
        `Bathroom remodeling in ${loc.city} demands one thing above all: waterproofing that can handle the Pacific Northwest. Our crew builds every shower with Schluter Kerdi systems, installs humidity-sensing exhaust fans, and uses materials rated for sustained moisture exposure. The result is a bathroom that looks stunning and performs for decades in this climate.`,
        `${loc.city} homeowners are upgrading bathrooms that haven't been touched since the ${loc.housingStyles[0].toLowerCase()} homes were built. Walk-in showers, floating vanities, heated floors, and ventilation systems that actually work in PNW humidity — we bring all of it together in a single project managed by one team.`,
        `Every ${loc.city} bathroom we remodel starts with understanding the specific challenges of ${loc.medianHomeAge}-year-old plumbing and construction. Old drain pipes, inadequate ventilation, and deteriorating waterproofing behind tiles are issues we encounter and resolve daily. The end result is a bathroom rebuilt to modern standards inside a home with genuine character.`,
      ], h);
    },
    mainHeading: (loc) => `What ${loc.city} Homeowners Ask for in Bathroom Remodels`,
    mainParagraph1: (loc, fmt, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `The bathrooms we see in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'mid-century'} homes are typically ${loc.medianHomeAge} years old and showing it: cracked grout, dated tile, worn-out fixtures, and ventilation that can't keep up with PNW moisture levels. With homes valued around ${fmt(loc.medianHomeValue)}, ${loc.city} homeowners are putting ${fmt(Math.round(loc.medianHomeValue * 0.03 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.07 / 1000) * 1000)} into bathroom remodels that solve real problems while adding lasting value.`,
        `Bathrooms in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} housing stock share common problems: ${loc.medianHomeAge} years of PNW moisture have taken a toll on grout integrity, waterproof membranes behind tile, and exhaust systems that were undersized from day one. Fixture styles have aged out. Storage is inadequate by modern standards. Homeowners with properties valued near ${fmt(loc.medianHomeValue)} are investing ${fmt(Math.round(loc.medianHomeValue * 0.03 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.07 / 1000) * 1000)} to address these issues comprehensively rather than patching symptoms.`,
        `${loc.city}'s bathroom renovation market is driven by necessity as much as aesthetics. The ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'mid-century'} homes here — averaging ${loc.medianHomeAge} years old — frequently have bathrooms with compromised waterproofing, insufficient ventilation for the Pacific Northwest climate, and plumbing components approaching end of life. At current home values of approximately ${fmt(loc.medianHomeValue)}, allocating ${fmt(Math.round(loc.medianHomeValue * 0.03 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.07 / 1000) * 1000)} for a bathroom remodel addresses both functional failures and visual aging simultaneously.`,
      ], h);
    },
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `The most common requests from ${loc.city} homeowners: converting an old tub-shower combo to a walk-in shower, upgrading to a modern vanity with storage, replacing worn tile throughout, and — this is a big one in the Pacific Northwest — fixing ventilation issues that are causing mold or moisture damage. Heated tile floors are also a popular add-on in our climate. We start every ${loc.city} bathroom project with an assessment of the existing plumbing, electrical, and waterproofing situation so there are no surprises once demo starts.`,
        `Walk-in shower conversions lead our ${loc.city} project list by a wide margin, followed by vanity upgrades with actual storage, complete tile replacement, and ventilation overhauls. PNW-specific additions — heated tile floors, humidity-sensing exhaust fans rated at 110+ CFM, and mildew-resistant materials — come up in nearly every conversation. Before we quote any ${loc.city} project, we inspect behind access panels and under fixtures to understand the true condition of your plumbing and waterproofing. That upfront assessment prevents the mid-project surprises that plague poorly planned bathroom renovations.`,
        `What ${loc.city} homeowners want most: showers that feel spacious rather than cramped, vanities with real storage instead of a pedestal sink wasting floor space, tile that looks current rather than dated, and bathroom ventilation that can actually manage PNW moisture levels. Heated flooring has moved from luxury to standard request in our market. Our approach to every ${loc.city} bathroom starts with a thorough pre-demo inspection — checking plumbing condition, waterproofing integrity, and electrical capacity — so your quote reflects reality, not optimistic assumptions about what's behind the walls.`,
      ], h);
    },
    projectsHeading: (loc) => `Popular Bathroom Remodeling Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `With homes averaging ${loc.medianHomeAge} years old in ${loc.city}, these are the bathroom projects we see the most demand for from local homeowners.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('bathroom') || lower.includes('bath') || lower.includes('shower') || lower.includes('tub') || lower.includes('vanity') || lower.includes('tile') || lower.includes('floor');
    },
    costSubheading: (loc) =>
      `Based on ${loc.city}'s home values and the typical bathroom conditions we encounter in the area's ${loc.medianHomeAge}-year-old housing stock. Your actual cost depends on scope, tile selections, and what we find behind the walls.`,
    costDisclaimer: (loc, fmt) =>
      `Based on ${loc.city}'s median home value of ${fmt(loc.medianHomeValue)} and current Seattle-area labor and material costs. Tile selection is the biggest cost variable in any bathroom — it can shift your total by $3,000-$8,000 depending on material. We'll walk through all the options during your free consultation.`,
    permitText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Even converting a tub to a walk-in shower typically triggers a plumbing permit in ${loc.city}. Electrical changes (new circuits, GFCI outlets, exhaust fan wiring) also require permits. We handle all of it — the application, the plan review, the inspections — as part of our standard service. No extra charge, no hassle. Unpermitted bathroom work creates real problems when you sell your home, so we do every project by the book.`,
        `${loc.city}'s building department requires permits for any bathroom work that alters plumbing or electrical systems. That includes tub-to-shower conversions, fixture relocations, GFCI outlet additions, and exhaust fan wiring. Cosmetic updates alone — paint, accessories, mirror replacement — are permit-free. Our team files permits with ${loc.county} County as a routine part of every qualifying project. The cost is included in your quote, and we coordinate all inspections so you never have to schedule around a building inspector.`,
        `Permit rules for ${loc.city} bathroom remodels are straightforward: if you're changing the plumbing layout, adding electrical circuits, or modifying structure, you need a permit. A simple vanity swap or paint job does not. We manage the entire permitting process — from initial application through final inspection — as an included service on every project. Unpermitted work in ${loc.city} creates disclosure issues at resale and can void homeowner's insurance claims, which is why we never skip this step regardless of project size.`,
      ], h);
    },
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does a bathroom remodel cost in ${loc.city}, WA?`,
        answer: pickVariation(loc, 'bathroom-remodeling', 0, [
          `For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, bathroom remodels range from ${fmt(costLow)} for a cosmetic refresh (new vanity, fixtures, paint, lighting) to ${fmt(costHigh)} for a full spa-style renovation with custom tile, frameless glass shower, heated floors, and premium fixtures. The average project in ${loc.city} comes in around ${fmt(avgCost)}. Tile selection is the biggest cost variable — porcelain at $7-14/sqft vs. marble at $18-35/sqft can swing the total by $3,000-$8,000. We'll walk through all the options during your free consultation.`,
          `${loc.city} homeowners typically spend between ${fmt(costLow)} and ${fmt(costHigh)} on bathroom renovations, with the sweet spot around ${fmt(avgCost)} for a comprehensive mid-range remodel. At ${loc.city}'s median home value of ${fmt(loc.medianHomeValue)}, that investment range keeps you well within the 3-7% of home value that real estate professionals recommend. The two biggest cost drivers: tile material choice (porcelain vs. natural stone can shift the total by $3,000-$8,000) and whether you're changing the plumbing layout or working within existing positions. We break down every line item during your free consultation so there are no gray areas.`,
          `Based on what we see across ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'newer'} homes, bathroom remodeling budgets range from ${fmt(costLow)} for targeted upgrades to ${fmt(costHigh)} for a complete spa-grade transformation. The median ${loc.city} bathroom project lands at ${fmt(avgCost)}, which generally covers a walk-in shower conversion, new vanity, heated floor, and modern fixtures. Homes valued at ${fmt(loc.medianHomeValue)} support this level of investment — buyers in this price range expect updated bathrooms. Tile is where budgets diverge most: ceramic porcelain at $7-14/sqft delivers excellent results, while natural marble at $18-35/sqft adds a luxury tier.`,
        ]),
      },
      {
        question: `How long does a bathroom remodel take in ${loc.city}?`,
        answer: pickVariation(loc, 'bathroom-remodeling', 1, [
          `A cosmetic refresh takes 5-8 days. A mid-range remodel with new tile and fixtures runs 2-3 weeks. A full gut renovation in ${loc.city} takes 4-6 weeks. Permits from ${loc.county} County add 2-4 weeks before construction if your project involves plumbing or electrical work. Tile is the biggest time factor — a fully tiled shower with floor-to-ceiling tile needs 3-5 days just for the tile setter, plus cure time. In ${loc.city}'s ${loc.medianHomeAge}-year-old homes, we sometimes find plumbing or waterproofing issues during demo that add a couple of days.`,
          `For a standard bathroom renovation in ${loc.city}, expect 2-3 weeks from demolition to final walkthrough. Quick refreshes (vanity swap, new fixtures, paint) take 5-8 days, while comprehensive gut remodels with layout changes run 4-6 weeks. The ${loc.county} County permit process adds 2-4 weeks before we start construction — we use that lead time for material procurement and tile fabrication. The single biggest schedule variable is tile work: a fully tiled shower requires 3-5 days of setting time plus mandatory cure periods between thin-set, grout, and sealer applications. In ${loc.city}'s older homes, we occasionally uncover plumbing or structural issues during demo that extend the timeline by 2-3 days.`,
          `Timeline varies with scope: cosmetic bathroom updates in ${loc.city} finish in under two weeks, a full remodel with new shower, vanity, and tile runs 3-4 weeks, and a luxury bathroom renovation with layout changes takes 5-6 weeks. If ${loc.county} County permits are required (plumbing changes, electrical additions), add 2-4 weeks for review before construction begins. We always sequence our ${loc.city} projects to minimize the time you're without a functioning bathroom — demolition through rough-in happens first, then tile, then fixtures. The ${loc.medianHomeAge}-year-old homes in this area sometimes surprise us during demo, so our schedules include contingency days as standard practice.`,
        ]),
      },
      {
        question: `Do I need a permit for a bathroom remodel in ${loc.city}?`,
        answer: pickVariation(loc, 'bathroom-remodeling', 2, [
          `${loc.permitInfo} In practical terms: a tub-to-shower conversion requires a plumbing permit. Adding or moving electrical outlets or circuits requires an electrical permit. Structural changes need a building permit. Cosmetic updates (new vanity, paint, accessories) don't need permits. We handle all the paperwork and inspections as part of our standard service — it's included in your quote.`,
          `The quick rule of thumb for ${loc.city}: if your bathroom remodel touches plumbing, electrical, or structure, you need a permit. Swapping a vanity, painting, and updating accessories? No permit needed. Converting a tub to a shower, adding GFCI outlets, or moving fixtures? Those each require their respective trade permits. ${loc.permitInfo} Our team files permits with ${loc.city}'s building department regularly and manages the entire process — applications, plan review, and inspections — as an included part of every project.`,
          `Permit requirements in ${loc.city} depend entirely on what's being changed. Cosmetic bathroom updates — new paint, vanity replacement on existing plumbing, mirror and lighting fixture swaps — are permit-free. The moment you alter plumbing (tub-to-shower conversion, fixture relocation), electrical (new circuits, GFCI outlets), or structure (wall modification), ${loc.county} County requires permits. ${loc.permitInfo} We handle every step of the permit process at no extra cost — it's built into our standard project pricing because we believe every renovation should be done by the book.`,
        ]),
      },
      {
        question: `What are popular bathroom remodel features in ${loc.city}?`,
        answer: pickVariation(loc, 'bathroom-remodeling', 3, [
          `The #1 request from ${loc.city} homeowners is converting an old tub-shower combo to a walk-in shower with frameless glass — we do this project more than any other. Heated tile floors are extremely popular in our PNW climate (they cost $600-$1,600 and add about $30/year to your electric bill). Other common requests: floating vanities, large-format porcelain tile that mimics marble, proper exhaust fans with humidity sensors, and built-in shower niches. In the ${loc.housingStyles[0].toLowerCase()} homes common to ${loc.city}, improving ventilation is especially important given our 9 months of damp weather.`,
          `Walk-in showers with frameless glass enclosures top the request list from ${loc.city} homeowners by a wide margin — roughly 70% of our bathroom projects include this conversion. Right behind that: heated tile floors (a PNW essential at $600-$1,600 installed), floating vanities for a clean modern look, and large-format porcelain that replicates natural marble without the maintenance. Humidity-sensing exhaust fans are becoming standard in ${loc.city} renovations — they activate automatically when moisture levels rise and shut off when the air is dry, which is critical in our climate. Built-in shower niches, matte black fixtures, and linear drains round out the current favorites among ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homeowners.`,
          `${loc.city} bathroom trends track closely with broader Pacific Northwest preferences but with local character. The tub-to-shower conversion remains dominant — most ${loc.housingStyles[0].toLowerCase()} homes here have standard alcove tub-shower combos that homeowners are eager to replace with spacious walk-in showers. Material-wise, marble-look porcelain in large formats (12x24, 24x24) has become the go-to for shower walls and floors. Heated tile is practically standard in ${loc.city} bathroom remodels — at $600-$1,600 for a typical bathroom, it's one of the most satisfying upgrades for our climate's cool mornings. Other trending features: wall-mounted vanities, built-in shower benches, and high-CFM exhaust fans with humidity sensors that are essential for ${loc.medianHomeAge}-year-old homes where original ventilation is inadequate.`,
        ]),
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Start Your ${loc.city} Bathroom Remodel Today`,
        `Ready to Upgrade Your ${loc.city} Bathroom?`,
        `Let's Plan Your ${loc.city} Bathroom Renovation`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll visit your ${loc.city} home, assess the bathroom's plumbing, waterproofing, and layout, and give you an honest line-item estimate. We'll tell you what needs fixing, what's optional, and where your money will have the biggest impact. No charge, no obligation.`,
        `${loc.city} homeowners deserve a bathroom that works as well as it looks — especially in our demanding PNW climate. Our free consultation covers plumbing condition, waterproofing assessment, ventilation evaluation, and a detailed scope-and-cost breakdown. Every line item is transparent. Every timeline is realistic.`,
        `Fifteen years of bathroom renovations across the Puget Sound have taught us that honesty upfront prevents headaches later. We'll inspect your ${loc.city} bathroom thoroughly, identify hidden issues before they become change orders, and present a clear plan with fixed pricing. Licensed, bonded, insured, and committed to doing the work right.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Also thinking about your kitchen? Many ${loc.city} homeowners remodel both — we offer bundled pricing that saves 5-8% on combined projects.`,
  },

  'cabinet-refacing': {
    title: 'Cabinet Refacing',
    slug: 'cabinet-refacing',
    category: 'kitchen',
    room: 'kitchen',
    shortDescription: 'Transform your cabinets for a fraction of full replacement cost.',
    costMultiplierLow: 0.005,
    costMultiplierHigh: 0.015,
    costTiers: {
      budget: { label: 'Basic Cabinet Refacing', description: 'Rigid thermofoil (RTF) doors, matching veneer on boxes, new hinges' },
      average: { label: 'Mid-Range Refacing', description: 'Wood veneer or laminate doors, soft-close hardware, new pulls' },
      premium: { label: 'Premium Refacing', description: 'Solid wood doors, dovetail drawer boxes, custom crown molding' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Cabinet refacing gives ${loc.city} homeowners a kitchen transformation at roughly one-third the cost of full cabinet replacement. We replace the doors, drawer fronts, and apply matching veneer to the cabinet boxes — keeping your existing layout and saving thousands. If your cabinet frames are solid but the style is dated, refacing is the smartest move.`,
        `Why tear out perfectly good cabinet boxes? In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, the original plywood boxes are often sturdier than anything you'd buy today. Refacing swaps out the visible surfaces — doors, drawer fronts, veneer — while preserving that solid foundation. New look, fraction of the cost, completed in under a week.`,
        `${loc.city} kitchens built ${loc.medianHomeAge} years ago often have one thing going for them: quality cabinet construction behind dated doors. Refacing capitalizes on that advantage, delivering a complete visual transformation without the demolition, dust, and six-figure price tag of full replacement. Your kitchen stays functional throughout the entire process.`,
        `Think of cabinet refacing as a facelift for your ${loc.city} kitchen — same solid bones, completely new appearance. We replace every door and drawer front, wrap exposed cabinet boxes in matching veneer, and install modern soft-close hardware. The result looks like a brand-new kitchen at roughly 30-40% of the replacement cost.`,
      ], h);
    },
    mainHeading: (loc) => `Why ${loc.city} Homeowners Choose Cabinet Refacing`,
    mainParagraph1: (loc, fmt, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} and ${loc.housingStyles[1]?.toLowerCase() || 'mid-century'} homes, we see a lot of kitchens where the cabinet boxes are structurally sound — good plywood or solid wood construction from ${loc.medianHomeAge} years ago — but the doors and finish look tired. Honey oak from the '90s, yellowed thermofoil peeling at the edges, or flat-panel doors that just feel outdated. Cabinet refacing replaces every visible surface while keeping the solid framework behind the walls. For homes valued around ${fmt(loc.medianHomeValue)}, refacing typically runs ${fmt(Math.round(loc.medianHomeValue * 0.005 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.015 / 1000) * 1000)} — a fraction of the ${fmt(Math.round(loc.medianHomeValue * 0.08 / 1000) * 1000)}+ you'd spend on brand-new cabinets.`,
        `Cabinet refacing exists because of a simple reality: the boxes behind your doors are usually the most expensive and durable part of the cabinet system. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, those ${loc.medianHomeAge}-year-old boxes were built with plywood that outperforms today's particleboard alternatives. What ages poorly is the visible surface — peeling thermofoil, yellowed oak, dated cathedral-arch profiles. Refacing replaces all of it. At ${loc.city}'s median home value of ${fmt(loc.medianHomeValue)}, projects typically cost ${fmt(Math.round(loc.medianHomeValue * 0.005 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.015 / 1000) * 1000)}, saving homeowners ${fmt(Math.round(loc.medianHomeValue * 0.05 / 1000) * 1000)}+ compared to full replacement.`,
        `The economics of cabinet refacing make particular sense in ${loc.city}'s housing market. Homes here average ${loc.medianHomeAge} years old with ${loc.housingStyles[0].toLowerCase()} construction — an era when cabinet boxes were built from quality plywood rather than today's engineered panels. Those boxes have decades of life remaining. The doors and surface finish, however, show every year of their age. Refacing replaces all visible components for ${fmt(Math.round(loc.medianHomeValue * 0.005 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.015 / 1000) * 1000)} — compared to ${fmt(Math.round(loc.medianHomeValue * 0.08 / 1000) * 1000)}+ for full cabinet replacement in homes valued around ${fmt(loc.medianHomeValue)}.`,
      ], h);
    },
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `The refacing process is straightforward: we remove all doors, drawer fronts, and hardware. The cabinet boxes get covered with a matching veneer — real wood veneer, rigid thermofoil (RTF), or high-pressure laminate depending on your budget and style preference. New doors are fabricated to exact measurements. We install soft-close hinges and drawer slides standard on every project. Most ${loc.city} refacing jobs take 3-5 days with minimal disruption — you keep your sink, countertops, and appliances the entire time. No demo dust, no plumbing disconnections, and your kitchen is usable every evening.`,
        `Here's how a ${loc.city} refacing project unfolds: Day one, we remove existing doors and hardware. Days two through three, precision-cut veneer gets applied to every exposed cabinet surface using commercial-grade contact adhesive. Days three through five, new doors and drawer fronts are installed with soft-close Blum or Grass hinges and full-extension slides. Material choices include real wood veneer, high-pressure laminate, or rigid thermofoil — each with different price points and aesthetic characteristics we'll walk through during consultation. Your kitchen remains fully functional throughout: sink, dishwasher, oven, and refrigerator never get disconnected.`,
        `Cabinet refacing follows a precise sequence that keeps your ${loc.city} kitchen operational from start to finish. Existing doors and drawer fronts come off first. Then we apply matching veneer — wood, laminate, or RTF — to all exposed box surfaces with industrial adhesive. New doors, fabricated to exact measurements of your existing openings, get mounted with soft-close hinges and modern hardware. The entire process takes 3-5 days for a standard kitchen. No plumbing disruption, no countertop removal, no demolition dust. You can cook dinner every night of the project — a sharp contrast to the 6-8 weeks of displacement that comes with full cabinet replacement.`,
      ], h);
    },
    projectsHeading: (loc) => `Popular Cabinet Refacing Styles in ${loc.city}`,
    projectsSubheading: (loc) =>
      `${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes often have good cabinet bones that just need a modern face. Here are the refacing projects we complete most in this area.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('cabinet') || lower.includes('kitchen') || lower.includes('refac');
    },
    costSubheading: (loc) =>
      `Cabinet refacing costs in ${loc.city} depend on kitchen size, door style, and material. A typical 20-cabinet kitchen falls in these ranges:`,
    costDisclaimer: (loc, fmt) =>
      `Prices for ${loc.city} based on a standard 20-cabinet kitchen. Includes new doors, drawer fronts, veneer on exposed boxes, soft-close hardware, and installation. Does not include new countertops or backsplash — though many homeowners pair refacing with a countertop upgrade for a complete refresh at a fraction of full remodel cost.`,
    permitText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Cabinet refacing in ${loc.city} almost never requires a permit. We're not touching plumbing, electrical, or structural elements — just replacing cosmetic surfaces. The only exception is if you want to add under-cabinet lighting that requires new electrical circuits. In that case, a simple electrical permit is needed. We'll let you know during the consultation if your project triggers any permit requirements.`,
        `Good news for ${loc.city} homeowners: cabinet refacing is classified as cosmetic maintenance, so no building permit is required. The work involves only surface replacement — doors, drawer fronts, and veneer — without touching plumbing, electrical, or structure. If you choose to add under-cabinet lighting with new wiring as part of the project, that specific element needs an electrical permit, which we handle if applicable.`,
        `Permits are rarely a factor in ${loc.city} cabinet refacing projects. Since refacing replaces only cosmetic surfaces without altering plumbing, electrical, or structural components, ${loc.county} County does not require a building permit. The sole exception: adding new electrical circuits for under-cabinet task lighting or interior cabinet illumination. We identify any permit needs during your initial consultation so there are no procedural surprises.`,
      ], h);
    },
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does cabinet refacing cost in ${loc.city}, WA?`,
        answer: pickVariation(loc, 'cabinet-refacing', 0, [
          `For a typical 20-cabinet kitchen in ${loc.city}, refacing runs from ${fmt(costLow)} for rigid thermofoil (RTF) doors with laminate veneer to ${fmt(costHigh)} for solid wood Shaker or raised-panel doors with real wood veneer and custom crown molding. The average project comes in around ${fmt(avgCost)}. That's roughly one-third the cost of all-new cabinets, which in ${loc.city} would run ${fmt(Math.round(loc.medianHomeValue * 0.04 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.08 / 1000) * 1000)}. Refacing makes the most sense when your cabinet boxes are solid but the look is outdated — which describes most ${loc.medianHomeAge}-year-old kitchens in this area.`,
          `Cabinet refacing in ${loc.city} costs between ${fmt(costLow)} and ${fmt(costHigh)} for a standard 20-cabinet kitchen. Where you land in that range depends on door material — RTF and laminate sit at the lower end, solid wood Shaker or raised-panel doors at the top. The typical ${loc.city} project averages ${fmt(avgCost)}, which includes new doors, drawer fronts, veneer on cabinet boxes, and soft-close hardware. For comparison, full cabinet replacement in ${loc.city}'s market would run ${fmt(Math.round(loc.medianHomeValue * 0.04 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.08 / 1000) * 1000)} — making refacing the clear winner when your ${loc.medianHomeAge}-year-old cabinet boxes are still structurally sound.`,
          `${loc.city} homeowners considering cabinet refacing can expect to invest ${fmt(costLow)} to ${fmt(costHigh)}, averaging ${fmt(avgCost)} for a complete kitchen. The cost-per-door approach helps illustrate the value: RTF doors run $150-$250 each, wood veneer $250-$400, and solid hardwood $350-$550. Multiply by your door count, add veneer for exposed box ends and crown molding, and you have your number. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, where cabinets were often built with quality plywood boxes ${loc.medianHomeAge} years ago, refacing preserves that solid foundation while delivering a visual transformation that rivals a full replacement at roughly one-third the price.`,
        ]),
      },
      {
        question: `How long does cabinet refacing take in ${loc.city}?`,
        answer: pickVariation(loc, 'cabinet-refacing', 1, [
          `Most ${loc.city} cabinet refacing jobs take 3-5 days. Day one is removal of old doors, drawer fronts, and hardware. Days two and three are veneer application to the cabinet boxes — this requires precision cutting and contact cement work. Days three through five are new door and drawer front installation, hardware mounting, and final adjustments. Your kitchen is usable every evening — we don't disconnect plumbing or remove countertops. Compare that to a full cabinet replacement which takes 4-8 weeks and leaves you without a functional kitchen for most of it.`,
          `Plan on 3-5 days for cabinet refacing in ${loc.city}. The process is sequential: first we remove existing doors and hardware (day one), then apply precision-cut veneer to all exposed cabinet surfaces (days two-three), and finally install your new doors with fresh hardware and soft-close mechanisms (days three-five). The key advantage over full replacement: your kitchen stays functional throughout. We never disconnect plumbing, remove countertops, or disrupt appliances. You can cook dinner every night of the project — something ${loc.city} homeowners with families particularly appreciate.`,
        ]),
      },
      {
        question: `What's the difference between cabinet refacing and refinishing in ${loc.city}?`,
        answer: pickVariation(loc, 'cabinet-refacing', 2, [
          `Refinishing means sanding and repainting or restaining your existing doors — it's cheaper ($2,000-$5,000) but you keep the same door style. Refacing replaces the doors and drawer fronts entirely and covers the cabinet boxes with new veneer, so you get a completely different look. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes with dated door profiles (think cathedral arch or flat slab from the '80s), refacing is the better choice because you can switch to a modern Shaker or slab profile. If your existing doors are a style you like but just need a color change, refinishing may be enough.`,
          `Two distinct processes that ${loc.city} homeowners often confuse. Refinishing preserves your existing door style — we sand, prime, and repaint or restain them ($2,000-$5,000 for a typical kitchen). The door profile stays the same. Refacing is more comprehensive: we replace every door and drawer front with new ones in whatever style you choose, plus cover all visible cabinet box surfaces with matching veneer. If your ${loc.housingStyles[0].toLowerCase()} home has outdated cathedral arch or flat-slab doors, refacing lets you switch to modern Shaker or slab profiles — a change refinishing cannot achieve. Refinishing makes sense only when you already like the door style and just want a new color.`,
        ]),
      },
      {
        question: `What door styles are popular for cabinet refacing in ${loc.city}?`,
        answer: pickVariation(loc, 'cabinet-refacing', 3, [
          `About 60% of our ${loc.city} refacing clients choose Shaker-style doors — the clean recessed panel works in everything from Craftsman bungalows to modern townhomes. White and warm greige are the top color choices. Another 25% go with flat slab doors for a contemporary European look, especially popular in newer ${loc.city} homes. The remaining 15% choose raised-panel or beadboard styles that suit the traditional character of older ${loc.housingStyles[0].toLowerCase()} homes. We bring door samples to every consultation so you can see and feel the actual materials in your kitchen's lighting.`,
          `Shaker doors lead the pack in ${loc.city} at roughly 60% of our refacing projects — the recessed panel profile complements virtually every home style in the area, from ${loc.housingStyles[0].toLowerCase()} to ${loc.housingStyles[1]?.toLowerCase() || 'newer construction'}. Color trends: white remains king but warm tones (greige, mushroom, warm gray) are gaining fast. Flat slab doors account for about 25% — these have a European contemporary feel that pairs well with modern hardware and waterfall quartz islands. The remaining 15% opt for raised panel or beadboard, typically in homes where traditional character is the goal. We bring a full sample kit to every ${loc.city} consultation because door material and color look completely different in your kitchen's actual lighting versus a showroom.`,
        ]),
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get a Cabinet Refacing Estimate in ${loc.city}`,
        `Transform Your ${loc.city} Kitchen Cabinets`,
        `See What Cabinet Refacing Can Do for Your ${loc.city} Kitchen`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll come to your ${loc.city} home, inspect your existing cabinet boxes, measure everything, and show you door samples in your kitchen's actual lighting. You'll get a detailed quote within a week — no vague ranges, no hidden fees. If your boxes are in good shape, refacing can save you tens of thousands compared to new cabinets.`,
        `${loc.city} homeowners who choose refacing over replacement save an average of $15,000-$25,000 — and get their kitchen back in days instead of months. We'll bring door samples to your home, assess your cabinet box condition, and provide a fixed-price quote with no hidden charges. Every project includes soft-close hardware as standard.`,
        `We've refaced hundreds of kitchens across ${loc.county} County and know exactly what to look for in your ${loc.city} cabinets. Our free in-home assessment determines whether your boxes are refacing candidates, shows you material options in your actual kitchen lighting, and delivers a transparent, line-item quote. No pressure, no sales tactics — just honest guidance from people who do this work every day.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Considering a full kitchen remodel instead? Or pairing refacing with new countertops? We do both — and bundling saves 5-8% on combined projects.`,
  },

  'countertop-installation': {
    title: 'Countertop Installation',
    slug: 'countertop-installation',
    category: 'kitchen',
    room: 'kitchen',
    shortDescription: 'Premium quartz, granite, marble, and butcher block countertop installation.',
    costMultiplierLow: 0.004,
    costMultiplierHigh: 0.012,
    costTiers: {
      budget: { label: 'Budget Countertops', description: 'Laminate or butcher block, standard edge, basic install' },
      average: { label: 'Mid-Range Countertops', description: 'Quartz (Cambria/Silestone), undermount sink, waterfall edge option' },
      premium: { label: 'Premium Countertops', description: 'Natural stone (granite/marble/quartzite), custom edges, full backsplash' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Countertops define the look and function of your kitchen more than almost any other element. We install quartz, granite, marble, quartzite, butcher block, and solid surface countertops in ${loc.city} homes — fabricated to exact measurements with precision seams, undermount sink cutouts, and edge profiles that match your style.`,
        `New countertops transform a ${loc.city} kitchen faster than any other single upgrade. We install engineered quartz, natural granite, marble, quartzite, and butcher block — laser-templated to your exact dimensions, fabricated with precision seams, and installed in a single day. From material selection to final polish, we manage the entire process.`,
        `The countertop is where your kitchen's design comes together. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, we replace worn laminate and dated tile with premium stone surfaces — quartz, granite, marble, quartzite — each laser-templated for a flawless fit. Undermount sinks, custom edge profiles, and invisible seam placement are all standard.`,
        `${loc.city} homeowners upgrading their countertops are choosing engineered quartz at a 2-to-1 ratio over natural stone, and for good reason — it's non-porous, maintenance-free, and the vein patterns rival genuine marble. We also install granite, quartzite, marble, and butcher block for homeowners who prefer natural materials. Every surface is laser-templated and fabricated to 1/16-inch precision.`,
      ], h);
    },
    mainHeading: (loc) => `Countertop Materials ${loc.city} Homeowners Are Choosing`,
    mainParagraph1: (loc, fmt) =>
      `Quartz dominates the ${loc.city} market right now — about 65% of our countertop installs are engineered quartz (Cambria, Silestone, Caesarstone, MSI). It's non-porous, never needs sealing, and the vein patterns have gotten so realistic that most people can't tell it from natural marble. Granite still has a loyal following at about 20% of our projects, especially for homeowners who want the depth and variation only natural stone provides. For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, countertop projects typically run ${fmt(Math.round(loc.medianHomeValue * 0.004 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.012 / 1000) * 1000)} depending on material, square footage, and edge profile complexity.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `Our process: we template your countertops with a laser measuring system (accurate to 1/16"), fabricate at our shop in 7-10 business days, then install in a single day. Undermount sinks get mounted before the stone goes down. We handle the plumbing disconnect and reconnect for the sink and disposal. Seam placement is planned during templating so joints land in the least visible locations. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes with non-standard layouts, the laser template is critical — hand measurements miss the kind of out-of-square walls we see in ${loc.medianHomeAge}-year-old homes.`,
    projectsHeading: (loc) => `Popular Countertop Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `From quartz replacements in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} kitchens to natural stone installs in newer construction, these are the countertop projects we handle most frequently.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('countertop') || lower.includes('granite') || lower.includes('quartz') || lower.includes('marble') || lower.includes('stone') || lower.includes('kitchen');
    },
    costSubheading: (loc) =>
      `Countertop pricing in ${loc.city} varies by material, square footage, and edge profile. For a typical 40-50 sqft kitchen:`,
    costDisclaimer: (loc, fmt) =>
      `Based on 40-50 sqft of countertop surface for a typical ${loc.city} kitchen. Includes material, fabrication, template, installation, undermount sink cutout, and plumbing reconnection. Edge profiles beyond standard eased edge add $8-25/linear foot. Backsplash installation from the same material adds $40-80/linear foot. We show you exact slab selections at our fabricator — what you pick is what gets installed.`,
    permitText: (loc) =>
      `Countertop installation in ${loc.city} generally does not require a building permit. It's classified as a cosmetic upgrade. The only exception is if your project includes plumbing changes — relocating the sink, adding a pot filler, or installing a second sink in an island. Those changes trigger a plumbing permit. We handle the permit process when it applies, and we'll tell you upfront during the consultation.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much do new countertops cost in ${loc.city}, WA?`,
        answer: pickVariation(loc, 'countertop-installation', 0, [
          `For a typical ${loc.city} kitchen (40-50 sqft of counter space), installed countertop costs range from ${fmt(costLow)} for laminate or butcher block to ${fmt(costHigh)} for premium quartzite or exotic granite with waterfall edges. The most popular choice — mid-range quartz from Cambria or Silestone — runs about ${fmt(avgCost)} installed. That includes laser template, fabrication, delivery, installation, undermount sink cutout, and plumbing reconnection. Natural stone slabs vary wildly in price depending on rarity, so we always recommend visiting the fabricator to select your actual slab before finalizing your budget.`,
          `Countertop costs in ${loc.city} break down by material: laminate and butcher block start at ${fmt(costLow)} installed for a typical 40-50 sqft kitchen. Engineered quartz — which accounts for about 65% of our installs — runs ${fmt(avgCost)} on average. Premium options like quartzite, exotic granite, or marble with waterfall edges reach ${fmt(costHigh)}. Every quote includes the full package: laser templating, fabrication, delivery, installation, undermount sink cutout, and plumbing reconnection. The biggest cost variable beyond material selection is edge profile — standard eased edges are included, while ogee, waterfall, and mitered edges add $8-25 per linear foot.`,
          `${loc.city} homeowners can expect countertop installation to run from ${fmt(costLow)} at the entry level (laminate or butcher block) to ${fmt(costHigh)} for premium natural stone with custom edge work. The majority of our ${loc.city} projects fall around ${fmt(avgCost)}, which gets you a quality engineered quartz surface from brands like Cambria, Silestone, or Caesarstone — fabricated to laser-precision measurements, installed with seamless joints, and including undermount sink integration. We strongly recommend visiting our fabrication partner to hand-select your actual slab before committing — photos never capture the full depth and movement of natural or engineered stone.`,
        ]),
      },
      {
        question: `How long does countertop installation take in ${loc.city}?`,
        answer: pickVariation(loc, 'countertop-installation', 1, [
          `The process from template to installation takes about 10-14 days total. Day one is the laser template (30-45 minutes in your home). Then 7-10 business days for fabrication at our shop. Installation day itself takes 2-4 hours for a standard kitchen — we arrive with the slabs pre-cut, set them in place, make final adjustments, apply seams with color-matched epoxy, and reconnect your sink and disposal. You'll be cooking dinner that same evening. The only delay factor is material availability — popular quartz colors are usually in stock, but exotic natural stone slabs may take 2-3 weeks to source.`,
          `From first measurement to cooking on your new counters: 10-14 days for most ${loc.city} kitchens. Here's the sequence — we laser-template your kitchen (30-45 minutes, non-invasive), then our fabrication shop cuts and polishes the stone over 7-10 business days. Installation day is fast: 2-4 hours for a standard L-shaped or U-shaped kitchen. We arrive with slabs pre-cut to 1/16" precision, set them, join any seams with color-matched epoxy, and reconnect the sink and disposal before we leave. Exotic or rare natural stone slabs that need to be sourced from specific quarries can add 2-3 weeks to material procurement, but popular quartz colorways are typically in stock.`,
        ]),
      },
      {
        question: `Quartz vs. granite — which is better for ${loc.city} homes?`,
        answer: pickVariation(loc, 'countertop-installation', 2, [
          `Both are excellent choices, but they serve different priorities. Quartz (engineered stone) is non-porous, never needs sealing, has consistent patterning, and resists staining — it's the lower-maintenance option. Granite is natural stone — each slab is unique, it handles heat better (you can set hot pans directly on granite, but not on quartz), and many homeowners prefer its depth and character. In the PNW climate, quartz has a slight edge because our high humidity means less risk of moisture penetrating unsealed granite. Price-wise, mid-range quartz and mid-range granite are similar ($55-85/sqft installed). We'll bring samples to your ${loc.city} home so you can compare in your kitchen's lighting.`,
          `This is the most common question we field from ${loc.city} homeowners, and the answer depends on your priorities. Quartz wins on maintenance: zero sealing required, non-porous surface that resists stains and bacteria, and consistent patterning if uniformity matters to you. Granite wins on character: every slab is genuinely unique, it handles direct heat from pots and pans (quartz cannot), and the depth of natural stone is hard to replicate. For ${loc.city}'s climate specifically, quartz has a practical advantage — our sustained PNW humidity can penetrate improperly sealed granite over time. Cost-wise, mid-range options in both materials are comparable at $55-85/sqft installed. We bring material samples to every ${loc.city} consultation because the choice always comes down to how the stone looks in your kitchen's specific lighting.`,
        ]),
      },
      {
        question: `Can you install countertops on existing cabinets in ${loc.city}?`,
        answer: pickVariation(loc, 'countertop-installation', 3, [
          `Absolutely — that's how most of our ${loc.city} countertop projects work. We remove the old countertop, inspect the cabinet boxes for level and structural integrity, make any needed adjustments (shimming, reinforcing for heavy stone), then template and install the new surface. For ${loc.city}'s ${loc.medianHomeAge}-year-old homes, we occasionally find that existing cabinets need minor leveling due to settling — it adds an hour or two but ensures your new countertops sit perfectly flat. If you're also doing cabinet refacing, we coordinate both projects so the countertop template happens after the new doors are installed for a seamless fit.`,
          `Yes — in fact, installing new stone on existing cabinets represents the majority of our ${loc.city} countertop work. The process starts with removing your current counters, then we assess the cabinets beneath: checking for level, structural soundness, and adequate support for the weight of stone (granite and quartzite are significantly heavier than laminate). In ${loc.city}'s ${loc.medianHomeAge}-year-old homes, minor leveling is common due to decades of settling — we handle this with precision shimming during the install. If your existing cabinets are in good structural shape, there's no reason to replace them just to get new counters. And if you're combining this with cabinet refacing, we sequence the work so your countertop template is taken after the new doors go on, ensuring a perfect fit at every junction.`,
        ]),
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get a Countertop Installation Quote in ${loc.city}`,
        `Ready for New Countertops in Your ${loc.city} Kitchen?`,
        `Choose Your Slab — We Handle the Rest`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll visit your ${loc.city} kitchen, measure the counter space, discuss material options, and give you an installed price — material, fabrication, and labor all included. We can also arrange a visit to our fabricator so you can hand-pick your exact slab. No obligation, no pressure.`,
        `Countertop selection should be a hands-on experience. Our free ${loc.city} consultation includes kitchen measurements, material recommendations, and a quote that covers everything — template, fabrication, delivery, installation, and sink reconnection. We'll also arrange a visit to our fabrication partner so you can hand-select the actual slab that goes in your kitchen.`,
        `From laser template to final installation, our countertop process is designed for precision and transparency. Schedule your free ${loc.city} consultation to get exact measurements, material comparisons in your kitchen's lighting, and an all-inclusive installed price. No hidden fees, no surprise charges — just a straight answer from a team that installs countertops every week.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Pairing new countertops with cabinet refacing or a full kitchen remodel? We offer bundled pricing that saves 5-8% on combined projects.`,
  },

  'tile-installation': {
    title: 'Tile Installation',
    slug: 'tile-installation',
    category: 'bathroom',
    room: 'bathroom',
    shortDescription: 'Expert tile work for floors, walls, backsplashes, and showers.',
    costMultiplierLow: 0.003,
    costMultiplierHigh: 0.01,
    costTiers: {
      budget: { label: 'Basic Tile Installation', description: 'Standard ceramic or porcelain floor tile, basic layout' },
      average: { label: 'Mid-Range Tile Work', description: 'Large-format porcelain, shower surround, accent patterns' },
      premium: { label: 'Premium Tile Installation', description: 'Natural stone, custom mosaics, full shower build with Schluter system' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Tile is where craftsmanship shows. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, we install everything from simple ceramic floor tile to complex natural stone shower builds with Schluter Kerdi waterproofing, linear drains, and custom mosaic accents. Proper substrate prep and waterproofing are non-negotiable in the PNW climate — and that's where experience matters most.`,
        `Professional tile installation in ${loc.city} requires more than laying squares on a floor. Our climate demands Schluter-grade waterproofing behind every shower, substrate prep that accounts for ${loc.medianHomeAge}-year-old subfloors, and material selections that perform through sustained PNW humidity. We bring that expertise to every project, from a kitchen backsplash to a full custom shower build.`,
        `${loc.city} homeowners trust us with their tile work because we understand what this climate demands. Every shower gets Schluter Kerdi waterproofing. Every floor gets proper substrate assessment. Every installation uses materials and methods rated for the Pacific Northwest's unique moisture challenges. From porcelain to natural marble, backsplashes to full bathroom renovations — we execute it all at a craft level.`,
        `Tile defines a space more than almost any other material. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, we've installed everything from 2x2 mosaics on shower floors to 48-inch panels on feature walls. The difference between good tile work and great tile work is what you don't see — substrate preparation, waterproofing integrity, and grout lines that stay clean for years, not months.`,
      ], h);
    },
    mainHeading: (loc) => `Tile Installation Expertise for ${loc.city} Homes`,
    mainParagraph1: (loc, fmt, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Tile work in the Pacific Northwest demands a level of waterproofing knowledge that many regions don't require. With 37 inches of annual rainfall and 9+ months of elevated humidity, ${loc.city} homes need tile installations backed by proper moisture barriers — especially in showers and on exterior-facing walls. We use the Schluter Kerdi system as our standard waterproofing for all wet areas: Kerdi membrane on walls, Kerdi-Band at joints, Kerdi-Drain for shower pans, and Ditra uncoupling membrane under floor tile to prevent crack transfer. For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, tile projects range from ${fmt(Math.round(loc.medianHomeValue * 0.003 / 1000) * 1000)} for a basic floor retile to ${fmt(Math.round(loc.medianHomeValue * 0.01 / 1000) * 1000)} for a full custom shower build with natural stone.`,
        `The Pacific Northwest's sustained humidity separates professional tile installation from amateur work. In ${loc.city}, where 37 inches of annual rainfall combines with 9+ months of elevated indoor moisture, tile installations that rely on paint-on waterproofing or basic cement board fail within years. Our standard spec for all wet areas is the complete Schluter Kerdi system — membrane, band, drain, and Ditra uncoupling mat — because nothing else performs reliably in this climate. Tile project budgets for ${loc.city} homes (median value ${fmt(loc.medianHomeValue)}) range from ${fmt(Math.round(loc.medianHomeValue * 0.003 / 1000) * 1000)} for straightforward floor work to ${fmt(Math.round(loc.medianHomeValue * 0.01 / 1000) * 1000)} for elaborate natural stone shower installations.`,
        `Every tile installation we complete in ${loc.city} starts with the same foundation: proper waterproofing and substrate prep. The PNW's 37 inches of annual rain and persistent humidity mean that showers, bathroom floors, and exterior-adjacent walls all need robust moisture management. We specify Schluter Kerdi across the board — membrane behind tile, Kerdi-Band at transitions, Kerdi-Drain for shower pans, and Ditra uncoupling beneath floor tile to prevent crack transmission from substrate movement. For homeowners in ${loc.city}'s ${fmt(loc.medianHomeValue)} housing market, tile installation projects span ${fmt(Math.round(loc.medianHomeValue * 0.003 / 1000) * 1000)} for basic retiling to ${fmt(Math.round(loc.medianHomeValue * 0.01 / 1000) * 1000)} for comprehensive shower builds in natural stone.`,
      ], h);
    },
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We install tile in every room: bathroom floors and walls, shower enclosures, kitchen backsplashes, entryway floors, fireplace surrounds, and outdoor patios (with freeze-resistant materials rated for PNW winters). Our tile setters work with porcelain, ceramic, natural stone (marble, travertine, slate), glass mosaic, cement tile, and large-format panels up to 48"x48". For ${loc.city}'s older ${loc.housingStyles[0].toLowerCase()} homes, we assess the subfloor condition before quoting — ${loc.medianHomeAge}-year-old homes sometimes need subfloor reinforcement or leveling compound before tile goes down, and we'd rather tell you that upfront than discover it mid-project.`,
        `Our tile crews handle every application: shower enclosures with complex waterproofing, bathroom floors requiring drain integration, kitchen backsplashes with precise outlet cutouts, entryway floors designed for high-traffic durability, and outdoor installations using frost-rated porcelain for PNW winters. We work across the full material spectrum — standard ceramic, large-format porcelain up to 48 inches, natural marble, travertine, handmade zellige, glass mosaic, and patterned cement tile. Before quoting any ${loc.city} project, we inspect the substrate: the ${loc.medianHomeAge}-year-old ${loc.housingStyles[0].toLowerCase()} homes here frequently need leveling compound or subfloor reinforcement, and identifying that early prevents costly mid-project surprises.`,
        `From a 20-square-foot backsplash to a 200-square-foot shower build, our ${loc.city} tile work spans every room and every material: porcelain, ceramic, natural stone, glass mosaic, cement tile, and large-format panels. Outdoor patios get frost-resistant porcelain rated for PNW freeze-thaw cycles. Shower installations get full Schluter waterproofing as standard. What ties every project together is our commitment to substrate integrity — particularly in ${loc.city}'s ${loc.medianHomeAge}-year-old homes where subfloor deflection, leveling issues, and multi-layer flooring removal are common prerequisites before the first tile goes down. We assess all of this during the initial consultation so your quote reflects the real scope of work.`,
      ], h);
    },
    projectsHeading: (loc) => `Popular Tile Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `From shower rebuilds in ${loc.city}'s aging bathrooms to kitchen backsplash upgrades, here are the tile projects we complete most often in the area.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('tile') || lower.includes('floor') || lower.includes('shower') || lower.includes('backsplash') || lower.includes('stone');
    },
    costSubheading: (loc) =>
      `Tile installation costs in ${loc.city} depend on the scope of work, tile material, and complexity of the layout. Here are typical ranges:`,
    costDisclaimer: (loc, fmt) =>
      `Tile costs for ${loc.city} include material, substrate prep, waterproofing (Schluter system for wet areas), setting, grouting, and sealing where applicable. Natural stone adds $5-20/sqft in material cost vs. porcelain. Complex patterns (herringbone, chevron, basketweave) add 15-25% to labor. We quote exact amounts after seeing the space — subfloor condition and existing tile removal can significantly affect the total.`,
    permitText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Tile installation itself doesn't require a permit in ${loc.city}. However, if your tile project involves moving or adding plumbing (shower valve relocation, new drain placement, adding a shower where there wasn't one), those plumbing changes require a permit. If your tile project is part of a larger bathroom remodel with electrical or structural work, those elements need permits as well. We coordinate all of it so you never have to set foot in the permit office.`,
        `Tile is classified as a finish material in ${loc.city}, so the tile work itself needs no permit. What can trigger permits: relocating a shower drain, moving a valve, adding plumbing for a new shower, or modifying electrical for heated floors. When tile is part of a larger renovation involving plumbing or electrical changes, we pull the appropriate trade permits and schedule all inspections. Your only job is choosing the tile you love — we handle the rest.`,
        `${loc.county} County does not require permits for tile installation as a standalone finish project. The permit triggers are plumbing and electrical modifications that sometimes accompany tile work — moving drains, adding shower valves, installing radiant heat mats, or adding GFCI circuits. Our project coordinators identify all permit requirements during the initial scope review and manage the entire process from application through final inspection at no additional charge.`,
      ], h);
    },
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does tile installation cost in ${loc.city}, WA?`,
        answer: pickVariation(loc, 'tile-installation', 0, [
          `Tile installation in ${loc.city} ranges from ${fmt(costLow)} for a basic bathroom floor retile (ceramic or porcelain, straightforward layout) to ${fmt(costHigh)} for a full custom shower build with natural stone, Schluter waterproofing system, linear drain, and niches. A mid-range shower retile with large-format porcelain and a simple accent strip runs about ${fmt(avgCost)}. Material cost is the biggest variable — ceramic porcelain runs $3-8/sqft while marble or designer cement tile can be $15-40/sqft. We always separate material and labor costs on our quotes so you can make informed tradeoffs.`,
          `For ${loc.city} homeowners, tile project costs span a wide range depending on scope. A bathroom floor retile starts at ${fmt(costLow)}, a full shower rebuild with proper Schluter waterproofing averages ${fmt(avgCost)}, and a comprehensive natural stone installation with custom details reaches ${fmt(costHigh)}. The two main cost drivers: tile material ($3-8/sqft for porcelain vs. $15-40/sqft for marble or designer cement tile) and project complexity (a straight floor layout is far less labor-intensive than a shower with niches, benches, and multiple tile patterns). Our quotes always itemize material and labor separately so ${loc.city} homeowners can see exactly where the money goes and make informed tradeoffs.`,
          `${loc.city} tile installation pricing reflects both material choice and craftsmanship requirements. Entry-level projects — a bathroom floor in standard porcelain with a simple grid layout — start around ${fmt(costLow)}. The mid-range, which covers most shower retiles with quality porcelain and accent work, averages ${fmt(avgCost)}. Premium installations involving natural stone, Schluter waterproofing, linear drains, and built-in niches can reach ${fmt(costHigh)}. Porcelain tile itself runs $3-8/sqft, while marble and artisan cement tile range from $15-40/sqft — so material selection alone can shift your total by several thousand dollars. We present all options transparently during your ${loc.city} consultation.`,
        ]),
      },
      {
        question: `How long does tile installation take in ${loc.city}?`,
        answer: pickVariation(loc, 'tile-installation', 1, [
          `A bathroom floor retile (50-80 sqft) takes 2-3 days including demolition and prep. A full shower retile with waterproofing takes 5-7 days. A kitchen backsplash is typically a 1-2 day project. Floor-to-ceiling bathroom tile (walls + floor) runs 7-10 days. These timelines include demolition of old tile, substrate repair, waterproofing membrane installation, tile setting, overnight cure times, grouting, and sealing. We don't rush cure times — thin-set needs 24 hours before grouting, and grout needs 72 hours before sealing. Cutting those corners is how you get cracked grout and loose tile within a year.`,
          `Timeline depends on scope: kitchen backsplash projects wrap up in 1-2 days. Bathroom floor retiles (50-80 sqft) take 2-3 days including demo and prep. A full shower retile with Schluter waterproofing runs 5-7 days. Complete bathroom tile (floor + all walls) takes 7-10 days. These timeframes account for every step: demolition, substrate assessment, waterproofing membrane installation, tile setting, mandatory cure periods, grouting, and final sealing. We never compress cure times — thin-set requires a full 24 hours before grout goes on, and grout needs 72 hours before sealer is applied. In ${loc.city}'s ${loc.medianHomeAge}-year-old homes, we occasionally add a day for subfloor repair or leveling that the old tile was masking.`,
        ]),
      },
      {
        question: `What waterproofing system do you use for showers in ${loc.city}?`,
        answer: pickVariation(loc, 'tile-installation', 2, [
          `We exclusively use the Schluter Kerdi system for shower waterproofing in ${loc.city}. It's the industry gold standard and is critical in our PNW climate. The system includes: Kerdi waterproof membrane bonded directly to cement board walls, Kerdi-Band at all joints and corners, Kerdi-Drain pre-sloped shower pan components, and Kerdi-Seal pipe seals at all penetrations. This creates a fully waterproof envelope behind the tile that eliminates moisture migration into the wall cavity. We've seen too many ${loc.city} homes with mold damage from older showers that used paint-on waterproofing or plastic sheeting — the Kerdi system eliminates that risk entirely.`,
          `Every shower we tile in ${loc.city} gets the Schluter Kerdi system — no exceptions, no substitutions. In the PNW's high-humidity climate, this is non-negotiable. The system creates a continuous waterproof envelope: Kerdi membrane on all wall surfaces, Kerdi-Band sealing every joint and corner, Kerdi-Drain components forming the shower pan, and Kerdi-Seal gaskets at every pipe penetration. Unlike paint-on membranes or the plastic sheeting methods common in older ${loc.city} homes, Kerdi bonds directly to cement board and integrates with the tile installation as a single system. We've demolished showers in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes and found extensive mold damage behind tile from inferior waterproofing — the Kerdi system prevents this entirely.`,
        ]),
      },
      {
        question: `What tile styles are trending in ${loc.city} right now?`,
        answer: pickVariation(loc, 'tile-installation', 3, [
          `Large-format porcelain (24"x24" or 12"x24") dominates ${loc.city} bathroom floors and shower walls — fewer grout lines means a cleaner look and easier maintenance. Marble-look porcelain (Calacatta, Statuario patterns) is by far the most requested finish for showers. For kitchen backsplashes, handmade-look zellige and subway tile in unusual sizes (3"x12", 4"x12") are popular. Matte and textured finishes have overtaken glossy in the last two years. Penny round mosaics in shower pans are a consistent favorite. For the ${loc.housingStyles[0].toLowerCase()} homes in ${loc.city}, hexagonal floor tile and classic subway tile maintain strong demand for period-appropriate renovations.`,
          `${loc.city}'s tile preferences reflect a blend of modern aesthetics and PNW practicality. Large-format porcelain (12x24 and 24x24) dominates both floors and shower walls — the minimal grout lines create a sleek, easy-to-clean surface. Marble-look porcelain remains the undisputed favorite for showers, with Calacatta and Statuario veining leading the requests. Kitchen backsplashes are trending toward handmade textures — zellige tile, artisan subway in non-standard sizes (3x12, 4x12), and matte finishes that have overtaken glossy across the board. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, we see strong demand for hexagonal floor tile and period-appropriate subway patterns that honor the home's original character while delivering modern performance. Penny round mosaics remain the go-to for shower pan floors where texture and traction matter.`,
        ]),
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get a Tile Installation Quote in ${loc.city}`,
        `Ready for Expert Tile Work in Your ${loc.city} Home?`,
        `Let's Discuss Your ${loc.city} Tile Project`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll visit your ${loc.city} home, assess the substrate condition, discuss material options, and give you a detailed quote — labor and materials separated so you know exactly where your money goes. Bring your Pinterest board or tile samples — we'll tell you what's feasible and what it'll cost.`,
        `Our tile setters have installed hundreds of thousands of square feet across ${loc.county} County. We know which materials perform in this climate, which patterns maximize visual impact in your space, and how to prep substrates in ${loc.medianHomeAge}-year-old homes for lasting results. Schedule a free assessment and get a quote that separates material from labor so you can make informed decisions.`,
        `From material selection to final grout seal, we guide ${loc.city} homeowners through every decision. Our free in-home consultation includes substrate assessment, material recommendations tailored to your space and budget, a detailed timeline, and a fixed-price quote with labor and materials itemized separately. Bring your inspiration photos — we'll tell you exactly what's achievable and what it costs.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Planning a full bathroom remodel in ${loc.city}? Tile is often the centerpiece — we can coordinate with vanity, plumbing, and fixture work for a seamless project.`,
  },

  'shower-remodeling': {
    title: 'Shower Remodeling',
    slug: 'shower-remodeling',
    category: 'bathroom',
    room: 'bathroom',
    shortDescription: 'Custom walk-in showers, glass enclosures, and modern upgrades.',
    costMultiplierLow: 0.008,
    costMultiplierHigh: 0.025,
    costTiers: {
      budget: { label: 'Basic Shower Remodel', description: 'Acrylic surround replacement, new valve and showerhead' },
      average: { label: 'Mid-Range Shower Remodel', description: 'Tiled walk-in, frameless glass, rain showerhead, niche' },
      premium: { label: 'Premium Shower Remodel', description: 'Custom stone, body sprays, steam, linear drain, bench' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `The tub-to-shower conversion is our most-requested project in ${loc.city}. Walk-in showers with frameless glass enclosures, rain showerheads, and built-in niches have replaced the old tub-shower combos in thousands of PNW homes. We handle the plumbing relocation, waterproofing, tile work, and glass — one crew, one schedule, one warranty.`,
        `${loc.city} homeowners are replacing outdated tub-shower combos with spacious walk-in showers at a record pace. Frameless glass, rain showerheads, heated floors, and Schluter waterproofing designed for the Pacific Northwest — we deliver the complete package with one crew managing every phase from demolition to final glass installation.`,
        `Walk-in showers have become the standard in ${loc.city}'s bathroom renovations, and for good reason. They transform a cramped alcove into an open, modern bathing space while eliminating the high tub wall that becomes a tripping hazard with age. We handle plumbing, framing, waterproofing, tile, and glass as a single coordinated project.`,
        `Your ${loc.city} shower should be the best part of your morning — not a reminder that your bathroom is ${loc.medianHomeAge} years old. Whether you want a simple retile, a full tub-to-shower conversion, or a premium build with steam and body sprays, we manage the entire transformation under one contract and one warranty.`,
      ], h);
    },
    mainHeading: (loc) => `Shower Remodeling Options for ${loc.city} Homes`,
    mainParagraph1: (loc, fmt) =>
      `Most ${loc.city} bathrooms were built with a standard 5-foot alcove tub-shower combo. For the ${loc.medianHomeAge}-year-old homes common here, these combos are showing their age: cracked fiberglass, mildewed grout, outdated tile, and valves that barely work. The #1 upgrade we do is converting that tub combo to a spacious walk-in shower. In ${loc.city}, where homes average ${fmt(loc.medianHomeValue)}, shower remodel projects range from ${fmt(Math.round(loc.medianHomeValue * 0.008 / 1000) * 1000)} for a basic upgrade to ${fmt(Math.round(loc.medianHomeValue * 0.025 / 1000) * 1000)} for a high-end custom shower with steam, body sprays, and premium stone.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `Our shower remodels include complete waterproofing with the Schluter Kerdi system — this is non-negotiable in the Pacific Northwest. We see too many ${loc.city} homes with hidden mold damage from showers that relied on outdated waterproofing methods. Beyond waterproofing, we handle everything: framing adjustments for curbless or zero-threshold entries, plumbing rough-in for rain showerheads and body sprays, custom tile installation, frameless glass enclosure fabrication and install, and accessories like built-in benches, recessed niches, and grab bars. One contractor, one timeline, one point of contact.`,
    projectsHeading: (loc) => `Popular Shower Remodel Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `${loc.city}'s ${loc.medianHomeAge}-year-old housing stock means most showers are ready for an upgrade. Here are the shower projects we complete most often in this area.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('shower') || lower.includes('tub') || lower.includes('bathroom') || lower.includes('walk-in') || lower.includes('glass');
    },
    costSubheading: (loc) =>
      `Shower remodel costs in ${loc.city} depend on whether you're upgrading an existing shower or converting from a tub, plus your material and fixture selections:`,
    costDisclaimer: (loc, fmt) =>
      `Shower remodel pricing for ${loc.city} includes demolition, plumbing rough-in, Schluter waterproofing, tile installation, glass enclosure, and all fixtures. Tub-to-shower conversions include the added plumbing work to relocate the drain and valve. Custom glass enclosures (frameless, semi-frameless) run $1,200-$3,500 depending on size and configuration. We measure for glass after tile is complete to ensure a perfect fit.`,
    permitText: (loc) =>
      `A shower remodel in ${loc.city} typically requires a plumbing permit — especially tub-to-shower conversions which involve moving the drain location and potentially changing the valve position. If you're adding a steam generator or new electrical for a digital valve system, an electrical permit is also needed. We submit all permits, schedule inspections, and handle the process from start to finish as part of our standard service. No extra charge.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does a shower remodel cost in ${loc.city}, WA?`,
        answer: pickVariation(loc, 'shower-remodeling', 0, [
          `Shower remodels in ${loc.city} range from ${fmt(costLow)} for a basic retile and new fixtures on an existing shower to ${fmt(costHigh)} for a full custom build with natural stone, body sprays, steam generator, linear drain, and frameless glass. The most common project — a tub-to-shower conversion with porcelain tile, frameless glass, rain showerhead, and a built-in niche — runs about ${fmt(avgCost)} in ${loc.city}. Glass enclosures are a significant cost factor: a frameless setup runs $1,800-$3,500 while a semi-frameless is $1,200-$2,000. We itemize everything on our quotes.`,
          `A shower remodel in ${loc.city} starts at ${fmt(costLow)} for refreshing an existing shower (new tile, valve, and showerhead) and reaches ${fmt(costHigh)} for a premium build with natural stone, steam system, body sprays, and a linear drain. The average ${loc.city} shower project — typically a tub-to-walk-in conversion with quality porcelain tile and frameless glass — comes in around ${fmt(avgCost)}. The frameless glass enclosure alone represents a significant portion of the budget at $1,800-$3,500, though many ${loc.city} homeowners consider it non-negotiable for the clean, modern aesthetic. Every element is itemized on our quotes so you can see exactly what drives the total.`,
          `${loc.city} shower remodeling costs reflect the scope of work and material choices. At the entry level (${fmt(costLow)}), you get a fresh tile surface, new valve and showerhead, and basic glass. The mid-range (${fmt(avgCost)}) covers the tub-to-shower conversion that most ${loc.city} homeowners are after — porcelain tile, Schluter waterproofing, frameless glass, rain head, and a built-in niche. At the premium end (${fmt(costHigh)}), you're looking at natural stone, steam capability, multiple body sprays, a built-in bench, and a linear drain. For ${loc.city} homes valued at ${fmt(loc.medianHomeValue)}, the mid-range option delivers the strongest combination of daily enjoyment and resale impact.`,
        ]),
      },
      {
        question: `Can you convert my ${loc.city} tub to a walk-in shower?`,
        answer: pickVariation(loc, 'shower-remodeling', 1, [
          `Yes — it's our most-requested project. We remove the existing tub, relocate the drain from the tub position to the shower position, reframe the opening as needed, install the Schluter Kerdi waterproofing system, tile the floor and walls, and install a frameless glass enclosure. The entire conversion takes 7-12 days depending on complexity. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes with ${loc.medianHomeAge}-year-old plumbing, we often upgrade the valve to a modern pressure-balancing or thermostatic unit at the same time — the old two-handle valves are usually at the end of their lifespan anyway.`,
          `Absolutely — tub-to-shower conversions are our single most popular project in ${loc.city}. The process involves tub removal, drain relocation to the new shower position, reframing the alcove as needed, full Schluter Kerdi waterproofing, custom tile installation, and frameless glass enclosure. Start to finish takes 7-12 days. In the ${loc.housingStyles[0].toLowerCase()} homes common to ${loc.city}, we almost always recommend upgrading the ${loc.medianHomeAge}-year-old shower valve to a modern pressure-balancing or thermostatic unit during the conversion — it prevents dangerous temperature swings when someone flushes a toilet, and the old valve is typically near end-of-life anyway. One project, one disruption, and you walk away with a completely transformed bathroom.`,
        ]),
      },
      {
        question: `Do I need a permit to remodel my shower in ${loc.city}?`,
        answer: pickVariation(loc, 'shower-remodeling', 2, [
          `${loc.permitInfo} For shower-specific work: a tub-to-shower conversion always requires a plumbing permit because you're relocating the drain. Retiling an existing shower without moving plumbing typically does not. Adding electrical for steam generators, digital valves, or heated floors requires an electrical permit. We file all necessary permits and schedule inspections as part of our service — it's included in your project cost, not an extra fee.`,
          `Here's the breakdown for ${loc.city}: retiling an existing shower within the same footprint and plumbing positions generally does not require a permit. A tub-to-shower conversion always requires a plumbing permit because you're changing the drain location and often the valve position. Adding steam generators, digital controls, or heated floors triggers an electrical permit. ${loc.permitInfo} We manage all permits as a standard part of every project — filing, plan review, inspection scheduling — at no additional cost to you. Unpermitted shower work is one of the most common issues flagged during home sales in ${loc.city}, so we do every project by the book.`,
        ]),
      },
      {
        question: `What shower features are popular in ${loc.city} right now?`,
        answer: pickVariation(loc, 'shower-remodeling', 3, [
          `The biggest trend in ${loc.city} is the curbless (zero-threshold) shower — it looks modern and is accessibility-friendly. Rain showerheads mounted at ceiling height are standard on nearly every project. Built-in niches (12"x24" or larger, often with a shelf) have replaced corner caddies. Linear drains allow for continuous floor tile patterns and better drainage. Frameless glass is non-negotiable for most ${loc.city} homeowners — it opens up the visual space dramatically. Heated tile floors in the shower area are a popular PNW add-on (about $400-$800 for the shower footprint). Body spray systems and steam generators are growing in the premium tier.`,
          `${loc.city} homeowners are gravitating toward shower designs that blend luxury with practicality. Curbless entries lead the trend — they create a seamless, modern look while also being universally accessible. Rain showerheads at ceiling height have become standard rather than premium. Frameless glass enclosures are virtually required in ${loc.city}'s market — they transform even a modest 3x5-foot shower into something that feels spacious. Niches have evolved from simple recessed shelves to designed features with accent tile and LED backlighting. For the Pacific Northwest specifically, heated shower floors ($400-$800 for the footprint) and high-CFM ventilation are particularly popular. Body sprays and steam systems are the fastest-growing premium upgrades we install in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes.`,
        ]),
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Start Your ${loc.city} Shower Remodel Today`,
        `Ready for a New Shower in ${loc.city}?`,
        `Let's Design Your ${loc.city} Dream Shower`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll visit your ${loc.city} bathroom, assess the plumbing and framing, discuss your vision, and give you a detailed estimate. Whether it's a simple retile or a full tub-to-shower conversion with all the bells and whistles — we'll give you a straight, itemized price. No vague ranges.`,
        `From basic retiles to full custom builds with steam and frameless glass, our ${loc.city} shower projects are delivered on schedule with transparent, fixed pricing. Schedule your free in-home assessment and get a detailed plan that covers demolition through final glass installation — every cost itemized, every timeline realistic.`,
        `We've completed more shower remodels in ${loc.county} County than we can count, and every one started with a thorough in-home assessment. We check plumbing condition, framing integrity, and waterproofing status before quoting a single dollar. That upfront diligence is why our projects come in on budget. Schedule your free consultation today.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Doing a complete bathroom overhaul? We handle the entire scope — shower, vanity, flooring, lighting, and ventilation. Bundled pricing saves 5-8%.`,
  },

  'bathtub-replacement': {
    title: 'Bathtub Replacement',
    slug: 'bathtub-replacement',
    category: 'bathroom',
    room: 'bathroom',
    shortDescription: 'Freestanding, soaking, and alcove tub installation and replacement.',
    costMultiplierLow: 0.004,
    costMultiplierHigh: 0.014,
    costTiers: {
      budget: { label: 'Standard Tub Replacement', description: 'New alcove tub, basic surround, updated fixtures' },
      average: { label: 'Mid-Range Tub Install', description: 'Freestanding soaking tub, floor-mounted filler, new tile floor' },
      premium: { label: 'Premium Tub Experience', description: 'Japanese soaking tub, custom deck, air jets, radiant floor' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Whether you're replacing a worn-out alcove tub, upgrading to a freestanding soaking tub, or installing a Japanese ofuro for a true spa experience, we handle every aspect of bathtub replacement in ${loc.city} — plumbing rough-in, structural support for heavy tubs, tile work, and fixture installation.`,
        `Bathtub replacement in ${loc.city} goes beyond swapping one tub for another. We manage the full scope: old tub removal, plumbing relocation, floor reinforcement for heavier freestanding models, surround tile work, and fixture installation. From standard alcove replacements to statement freestanding soakers — one crew handles everything.`,
        `The standard alcove tub in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes was designed for function, not relaxation. Today's options — sculptured freestanding soakers, Japanese ofuro tubs, and modern air-jet models — transform your bathroom into a genuine retreat. We handle the plumbing, structure, and finishing that make it all work.`,
        `${loc.city} homeowners are reimagining what a bathtub can be. Freestanding soakers have replaced dated alcove tubs as the centerpiece of modern bathroom design. Our team manages every detail — from structural assessment for heavy cast iron to floor-mounted filler plumbing to seamless tile work around the new footprint.`,
      ], h);
    },
    mainHeading: (loc) => `Bathtub Replacement Options for ${loc.city} Homes`,
    mainParagraph1: (loc, fmt) =>
      `The bathtub market has evolved dramatically from the standard 60"x30" alcove tubs installed in most ${loc.city} homes. Freestanding tubs have become the centerpiece of modern bathroom design — from classic clawfoot reproductions to sleek contemporary sculpted designs. But replacing a built-in alcove tub with a freestanding model isn't just a swap — it requires plumbing relocation, floor tile work, and sometimes structural reinforcement (a cast iron freestanding tub can weigh 300+ pounds empty). For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, bathtub replacement projects run ${fmt(Math.round(loc.medianHomeValue * 0.004 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.014 / 1000) * 1000)} depending on the tub style and scope of surrounding work.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `The most important consideration for bathtub replacement in ${loc.city}'s ${loc.medianHomeAge}-year-old homes is drain location and floor structure. Older homes often have 2x8 floor joists that may need sistering or bridging to support a heavy freestanding tub. We check this during our initial assessment and include any structural work in our quote. Plumbing for freestanding tubs is also different — a floor-mounted tub filler requires rough-in through the subfloor, and the drain needs to be repositioned to match the new tub's footprint. We coordinate all of this so the final result looks intentional, not retrofitted.`,
    projectsHeading: (loc) => `Popular Bathtub Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `From simple alcove replacements to statement-making freestanding installations, here are the bathtub projects ${loc.city} homeowners are requesting most.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('tub') || lower.includes('bath') || lower.includes('soak') || lower.includes('freestanding');
    },
    costSubheading: (loc) =>
      `Bathtub replacement costs in ${loc.city} vary significantly based on tub type, plumbing complexity, and surrounding finish work:`,
    costDisclaimer: (loc, fmt) =>
      `Bathtub replacement pricing for ${loc.city} includes old tub removal/disposal, plumbing modifications, tub installation, and basic surrounding finish work. Freestanding tub installs include floor tile repair/replacement around the tub footprint. Heavy tubs (cast iron, stone) may require floor reinforcement — we assess this during the initial visit. Tub prices vary widely: acrylic alcove ($300-$800), acrylic freestanding ($800-$3,000), cast iron ($1,500-$5,000), stone composite ($2,500-$8,000).`,
    permitText: (loc) =>
      `Bathtub replacement in ${loc.city} requires a plumbing permit when the drain location changes — which it always does when converting from alcove to freestanding. A straight swap of an alcove tub with a same-size replacement typically does not need a permit. If you're adding a whirlpool or air tub that needs a dedicated electrical circuit, that requires an electrical permit. We'll tell you exactly what permits your project needs during the consultation and handle all filing and inspections.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does bathtub replacement cost in ${loc.city}, WA?`,
        answer: `A straightforward alcove tub swap in ${loc.city} starts at ${fmt(costLow)} — that includes the new tub, basic surround, fixtures, and plumbing connection. A freestanding soaking tub installation with floor-mounted filler and surrounding tile work runs about ${fmt(avgCost)}. Premium installations with Japanese soaking tubs, custom tile decks, or stone composite tubs reach ${fmt(costHigh)}. The tub itself is often less than half the total cost — plumbing modifications, floor work, and finishing details make up the rest. We itemize everything so you see exactly where the money goes.`,
      },
      {
        question: `How long does bathtub replacement take in ${loc.city}?`,
        answer: `A simple alcove tub swap takes 1-2 days. A freestanding tub installation with plumbing relocation and new floor tile takes 4-6 days. A full custom tub installation with deck building, structural reinforcement, and surrounding tile work can take 7-10 days. In ${loc.city}'s ${loc.medianHomeAge}-year-old homes, we sometimes find deteriorated subfloor around the old tub (a common issue in PNW homes due to decades of moisture exposure) — fixing this adds a day but prevents much bigger problems down the road.`,
      },
      {
        question: `Can my ${loc.city} bathroom floor support a freestanding tub?`,
        answer: `It depends on the tub material and your home's construction. An acrylic freestanding tub weighs 70-100 lbs empty plus 250-350 lbs of water — most floors handle this fine. Cast iron freestanding tubs weigh 250-400 lbs empty, and stone composite tubs can weigh 300+ lbs — filled with water, you're looking at 600-800 lbs concentrated on a small footprint. For ${loc.city}'s older ${loc.housingStyles[0].toLowerCase()} homes with ${loc.medianHomeAge}-year-old floor joists, we always check the structural capacity. Many homes need joist sistering or a support post in the crawl space — it's a $500-$1,500 addition that's absolutely necessary for safety.`,
      },
      {
        question: `What bathtub styles are popular in ${loc.city}?`,
        answer: `Freestanding soaking tubs dominate ${loc.city} requests — about 55% of our tub replacements. The oval sculpted shape in white or matte finishes is the top seller. Japanese soaking tubs (deeper, shorter footprint) have gained strong traction for smaller master baths. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes with period character, clawfoot reproduction tubs remain popular — we source both modern acrylic versions and traditional cast iron. Alcove tubs still make up about 30% of replacements, typically in hall and guest bathrooms where a tub-shower combo is practical for families. Air jet tubs have largely replaced whirlpool jets — they're quieter, easier to clean, and dry completely between uses.`,
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get a Bathtub Replacement Quote in ${loc.city}`,
        `Upgrade Your ${loc.city} Bathtub Experience`,
        `Find the Perfect Tub for Your ${loc.city} Bathroom`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll come to your ${loc.city} home, assess the bathroom layout, check the floor structure, discuss your tub preferences, and give you a detailed installed price. We can help you choose the right tub style for your space and budget. Free consultation, no obligation.`,
        `Choosing the right tub for your ${loc.city} bathroom involves more than aesthetics — floor structure, plumbing routing, and space constraints all matter. Our free consultation covers everything: structural assessment, tub style recommendations for your specific bathroom, and a transparent installed price with no hidden fees.`,
        `From alcove replacements to freestanding installations that require plumbing relocation and floor reinforcement, our team has handled every type of bathtub project in ${loc.county} County. We'll assess your ${loc.city} bathroom, recommend options that fit your space and style, and deliver a fixed-price quote. Free consultation, zero pressure.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Replacing the tub as part of a full bathroom remodel? We handle the entire project — tub, shower, tile, vanity, and fixtures. Bundled pricing saves 5-8%.`,
  },

  'vanity-installation': {
    title: 'Vanity Installation',
    slug: 'vanity-installation',
    category: 'bathroom',
    room: 'bathroom',
    shortDescription: 'Single, double, and floating vanity installation with custom options.',
    costMultiplierLow: 0.002,
    costMultiplierHigh: 0.007,
    costTiers: {
      budget: { label: 'Standard Vanity Install', description: 'Pre-built vanity, cultured marble top, basic faucet' },
      average: { label: 'Mid-Range Vanity', description: 'Semi-custom vanity, quartz top, undermount sink, quality hardware' },
      premium: { label: 'Custom Vanity', description: 'Custom-built floating vanity, natural stone top, vessel or integrated sink' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `The bathroom vanity anchors the entire room's design. We install everything from pre-built stock vanities for quick updates to custom-built floating vanities with natural stone tops for complete bathroom transformations. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, upgrading from a dated pedestal sink or builder-grade vanity instantly modernizes the space and adds real storage.`,
        `A vanity upgrade is the single fastest way to transform a ${loc.city} bathroom. We install stock, semi-custom, and fully custom vanities — including wall-mounted floating models that have become the top request in this market. Plumbing connection, countertop integration, mirror mounting, and wall repair are all included as standard.`,
        `Pedestal sinks waste space. Builder-grade vanities from ${loc.medianHomeAge} years ago look their age. ${loc.city} homeowners are replacing both with modern vanities that deliver real storage, quality countertops, and a design statement that anchors the entire bathroom. We handle the complete installation — plumbing, mounting, finishing, and fixtures.`,
        `From a simple vanity swap that takes half a day to a custom floating installation with quartz top and in-wall blocking — vanity projects in ${loc.city} deliver dramatic visual impact relative to their cost. We handle every aspect: old vanity removal, wall repair, plumbing modification if needed, and professional installation of the new unit with all fixtures connected.`,
      ], h);
    },
    mainHeading: (loc) => `Vanity Installation Options for ${loc.city} Bathrooms`,
    mainParagraph1: (loc, fmt) =>
      `A vanity swap is one of the highest-impact, lowest-disruption bathroom upgrades you can make. In ${loc.city}'s ${loc.medianHomeAge}-year-old homes, we typically see either builder-grade oak vanities from the original construction, pedestal sinks that waste valuable floor space, or outdated 36" single-sink vanities in master baths that really need a double. The plumbing connections are almost always in the same general location, so installing a new vanity rarely involves moving drain or supply lines. For homes valued around ${fmt(loc.medianHomeValue)}, vanity projects in ${loc.city} run ${fmt(Math.round(loc.medianHomeValue * 0.002 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.007 / 1000) * 1000)} depending on the vanity type and countertop material.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `Floating (wall-mounted) vanities are our fastest-growing category in ${loc.city}. They create a modern, open feeling, make the bathroom appear larger, and simplify floor cleaning — especially important in our damp PNW climate where bathroom floors see a lot of moisture. Installation requires blocking inside the wall for structural support, so we open the drywall behind the vanity, add 2x6 blocking between studs, patch, and then mount the vanity. For the ${loc.housingStyles[0].toLowerCase()} homes here, we also check the wall for plaster condition (older homes) and ensure the drain height works with the vanity design. Our installations include the vanity, top, sink(s), faucet(s), drain connections, and mirror — a complete turnkey result.`,
    projectsHeading: (loc) => `Popular Vanity Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `From double vanity conversions in master baths to floating vanity installs in powder rooms, here are the vanity projects ${loc.city} homeowners are requesting most.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('vanity') || lower.includes('bathroom') || lower.includes('sink') || lower.includes('cabinet');
    },
    costSubheading: (loc) =>
      `Vanity installation costs in ${loc.city} depend on vanity type, countertop material, and whether plumbing needs modifications:`,
    costDisclaimer: (loc, fmt) =>
      `Vanity prices for ${loc.city} include the vanity unit, countertop, sink(s), faucet(s), installation, plumbing connections, and basic wall repair behind the old vanity. Floating vanity installations include in-wall blocking. Double vanity conversions that require extending the drain and supply lines add $800-$2,000 for plumbing work. We always quote the complete installed price — no surprises.`,
    permitText: (loc) =>
      `A standard vanity swap in ${loc.city} doesn't require a permit — you're connecting to existing plumbing in the same location. If you're converting from a single to a double vanity and need to extend drain/supply lines, a plumbing permit is typically required. Adding new electrical for lighted mirrors or vanity-side outlets also needs an electrical permit. We handle all permit work as part of our service when it's needed.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does vanity installation cost in ${loc.city}, WA?`,
        answer: `A basic vanity replacement in ${loc.city} — new pre-built vanity with cultured marble top and faucet — starts at ${fmt(costLow)} installed. A mid-range project with a semi-custom vanity, quartz top, undermount sink, and quality hardware runs about ${fmt(avgCost)}. Custom-built floating vanities with natural stone tops and vessel sinks reach ${fmt(costHigh)}. These prices include the vanity, top, sink, faucet, installation, and plumbing connection. Wall repair behind the old vanity is included. A single-to-double conversion adds $800-$2,000 for the additional plumbing work.`,
      },
      {
        question: `How long does vanity installation take in ${loc.city}?`,
        answer: `A straightforward single vanity swap takes 3-5 hours — we can often do it in one morning. A double vanity installation where the plumbing needs extending takes 1-2 days. A custom floating vanity installation with in-wall blocking, new plumbing, and tile backsplash work takes 2-3 days. We'll have your bathroom fully functional the same day in most cases — or by the next morning for more complex installations. Compare that to a full bathroom remodel which takes 3-6 weeks.`,
      },
      {
        question: `Can I convert my single vanity to a double in ${loc.city}?`,
        answer: `Yes — if your bathroom has the space. A double vanity needs at least 60" of wall width (48" minimum for a tight fit). The plumbing work involves extending the drain line and adding a second set of supply lines and shut-off valves. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, we check the wall for existing plumbing routing and determine the most efficient path for new lines. The project typically takes 1-2 days. Cost for the plumbing extension is $800-$2,000 on top of the vanity and top cost. It's one of the best upgrades for master bathrooms — eliminates morning traffic jams and adds real resale value.`,
      },
      {
        question: `What vanity styles are popular in ${loc.city}?`,
        answer: `Floating vanities are the #1 request from ${loc.city} homeowners right now — especially in master baths. They create a sleek, modern look and make the floor space feel larger. Natural wood tones (walnut, white oak) are dominating over painted finishes. Quartz tops are the most popular surface — non-porous and maintenance-free. For guest and hall bathrooms, 30"-36" freestanding vanities in transitional styles remain popular. Vessel sinks have a devoted following for powder rooms. For ${loc.city}'s older ${loc.housingStyles[0].toLowerCase()} homes, mission-style and Craftsman-inspired vanities that complement the home's character are consistently requested.`,
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get a Vanity Installation Quote in ${loc.city}`,
        `Upgrade Your ${loc.city} Bathroom Vanity`,
        `Let's Find the Right Vanity for Your ${loc.city} Bathroom`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll measure your ${loc.city} bathroom, check the plumbing layout, and help you choose the right vanity style and countertop for your space. You'll get an all-inclusive installed price — vanity, top, sink, faucet, plumbing, and wall repair. No hidden costs.`,
        `Vanity selection involves more than aesthetics — your bathroom's plumbing routing, floor space, and door swing all factor in. Our free ${loc.city} consultation covers precise measurements, style recommendations, and a complete installed price covering vanity, countertop, sink, faucet, plumbing, and any wall repair behind the old unit.`,
        `We've installed hundreds of vanities across ${loc.county} County and know exactly which configurations work in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} bathrooms. Schedule a free consultation and get an all-inclusive quote — no hidden charges, no surprise add-ons. Vanity, top, sink, faucet, plumbing connection, and wall repair are all included in one price.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Upgrading the vanity as part of a larger bathroom renovation? We handle the entire project — vanity, tile, shower, and fixtures. Bundled pricing saves 5-8%.`,
  },

  'kitchen-layout-design': {
    title: 'Kitchen Layout Design',
    slug: 'kitchen-layout-design',
    category: 'kitchen',
    room: 'kitchen',
    shortDescription: 'Optimize your kitchen flow with expert space planning and design.',
    costMultiplierLow: 0.003,
    costMultiplierHigh: 0.01,
    costTiers: {
      budget: { label: 'Layout Consultation', description: 'Professional space plan, work triangle optimization, 3D rendering' },
      average: { label: 'Layout + Structural Work', description: 'Wall removal, island addition, electrical/plumbing relocation' },
      premium: { label: 'Complete Layout Redesign', description: 'Open-concept conversion, structural beam, full infrastructure reroute' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Most kitchen frustrations aren't about finishes — they're about layout. ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes were designed for how people cooked 40-60 years ago: isolated galley kitchens, no island, limited counter space, and zero connection to the living areas. We specialize in rethinking kitchen layouts to match modern life — open sightlines, functional work triangles, and space that flows.`,
        `The layout is the single biggest factor in how your kitchen works — and ${loc.city}'s ${loc.medianHomeAge}-year-old homes got it wrong by modern standards. Closed galley kitchens, no island, cramped work triangles. We redesign kitchen spaces from the ground up: structural analysis, 3D renderings, engineering for wall removal, and construction that delivers the open, functional kitchen your home was always meant to have.`,
        `Before choosing cabinets or countertops, ${loc.city} homeowners need to answer a more fundamental question: does the kitchen layout actually work? In ${loc.housingStyles[0].toLowerCase()} homes built ${loc.medianHomeAge} years ago, the answer is almost always no. We specialize in the structural and design work that transforms compartmentalized kitchens into connected, functional spaces.`,
        `Kitchen layout design is where the most impactful decisions happen — and where shortcuts cost the most. ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes present specific structural challenges that require engineering expertise, not just design sense. We combine both: professional space planning, structural analysis, 3D visualization, and construction execution under one roof.`,
      ], h);
    },
    mainHeading: (loc) => `Kitchen Layout Design for ${loc.city}'s Unique Homes`,
    mainParagraph1: (loc, fmt) =>
      `Layout changes are the most impactful — and most complex — part of any kitchen remodel. Moving walls, relocating plumbing, rerouting electrical, and adding structural beams requires engineering, permits, and coordination between multiple trades. But the result is transformative: an open, functional kitchen that becomes the center of your home. For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, kitchen layout projects range from ${fmt(Math.round(loc.medianHomeValue * 0.003 / 1000) * 1000)} for a professional design consultation with 3D renderings to ${fmt(Math.round(loc.medianHomeValue * 0.01 / 1000) * 1000)} for structural work including wall removal, beam installation, and full infrastructure rerouting.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `Every kitchen layout project starts with understanding your workflow. We map how you cook, where you prep, how many people use the kitchen simultaneously, and where you want sightlines. The work triangle (sink-stove-fridge) is foundational, but modern kitchens also need to accommodate multiple cooks, landing zones near every appliance, and counter space that does double duty as homework stations and serving areas. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, the most common layout change is opening a galley kitchen to an adjacent dining or living room — this typically involves removing a non-load-bearing wall or installing a structural beam to replace a load-bearing one. We work with a licensed structural engineer on every load-bearing wall project.`,
    projectsHeading: (loc) => `Popular Kitchen Layout Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes present specific layout challenges. Here are the kitchen layout changes we design and build most often for local homeowners.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('kitchen') || lower.includes('layout') || lower.includes('open') || lower.includes('island') || lower.includes('galley') || lower.includes('floor plan');
    },
    costSubheading: (loc) =>
      `Kitchen layout design costs in ${loc.city} depend on whether you're just planning or also executing structural changes:`,
    costDisclaimer: (loc, fmt) =>
      `Layout design costs for ${loc.city} include professional space planning, 3D renderings, and material specifications. Structural work costs include engineering, permits, construction, and finishing. A structural engineer's analysis ($500-$1,500) is required before any load-bearing wall work and is included in our quotes. LVL beams and steel beams have different price points depending on span length — we'll specify the right solution for your home's structure.`,
    permitText: (loc) =>
      `Any kitchen layout change involving structural walls, plumbing relocation, or electrical rerouting in ${loc.city} requires permits. Removing a load-bearing wall requires a structural engineering report and a building permit. Moving the sink requires a plumbing permit. Adding circuits or relocating outlets requires an electrical permit. We handle all of it — engineering, drawings, permit filing, and inspection scheduling. It's included in the project cost, not an add-on. ${loc.city}'s building department typically takes 3-6 weeks for plan review on structural projects.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does a kitchen layout redesign cost in ${loc.city}, WA?`,
        answer: `A professional kitchen design consultation with measured drawings, 3D renderings, and a detailed specification document starts at ${fmt(costLow)} in ${loc.city}. If you're executing the layout changes — wall removal, island plumbing, electrical rerouting — the construction typically adds ${fmt(avgCost)} to ${fmt(costHigh)} on top of the design fee (which gets credited toward the build). Opening a galley kitchen with a non-load-bearing wall removal runs about $3,000-$8,000 in construction. A load-bearing wall removal with an LVL or steel beam is $8,000-$18,000 depending on span length. Adding an island with a sink and electrical adds $5,000-$12,000 for the infrastructure work alone.`,
      },
      {
        question: `Can I open up my ${loc.city} galley kitchen?`,
        answer: `Almost certainly — we do it regularly in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes. The first step is determining whether the wall between your kitchen and adjacent room is load-bearing. If it's not, removal is straightforward — a few days of work. If it is load-bearing (common in ${loc.medianHomeAge}-year-old homes), we work with a structural engineer to design a beam that carries the load. An LVL (laminated veneer lumber) beam or steel beam gets installed in the ceiling, hidden behind drywall, and the wall comes out. The result is the open-concept flow everyone wants. We've done hundreds of these conversions in ${loc.county} County homes and know exactly what to expect.`,
      },
      {
        question: `What is the kitchen work triangle and does it still matter?`,
        answer: `The work triangle — the path between your sink, stove, and refrigerator — has been the foundation of kitchen design since the 1940s. It still matters, but modern kitchens have evolved beyond it. Today we design around "work zones": a prep zone (sink + cutting area), a cooking zone (stove + spice storage + landing space), a cleaning zone (sink + dishwasher + trash), and a serving zone (counter space + plates). In ${loc.city}'s smaller ${loc.housingStyles[0].toLowerCase()} kitchens, optimizing these zones within the existing footprint can transform usability without moving a single wall. We use 3D design software to model your specific kitchen and test different configurations before any construction starts.`,
      },
      {
        question: `How long does a kitchen layout renovation take in ${loc.city}?`,
        answer: `The design phase takes 2-3 weeks: measurements, consultations, drafting, 3D renderings, and revisions. Permitting in ${loc.county} County adds 3-6 weeks for structural work. Construction timelines depend on scope: a non-load-bearing wall removal takes 3-5 days. A load-bearing wall removal with beam installation takes 5-10 days. Adding island plumbing and electrical adds 3-5 days. A complete layout overhaul — wall removal, new island, plumbing relocation, electrical upgrades — takes 3-6 weeks of construction. Total project timeline from first meeting to finished kitchen is typically 10-16 weeks.`,
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Start Your ${loc.city} Kitchen Layout Redesign`,
        `Reimagine Your ${loc.city} Kitchen Layout`,
        `Can That Wall Come Out? Let's Find Out`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll visit your ${loc.city} kitchen, listen to what frustrates you about the current layout, take precise measurements, and show you what's possible — including whether that wall can come out. Professional design consultation, 3D renderings, and a realistic budget. No charge, no obligation.`,
        `Every great kitchen remodel starts with the right layout. Our free consultation in your ${loc.city} home includes precise measurements, structural assessment, and a candid conversation about what's achievable within your space and budget. We'll follow up with 3D renderings so you can visualize the transformation before committing to construction.`,
        `Most ${loc.city} homeowners who contact us have one question: can we open up the kitchen? During your free in-home consultation, we'll determine exactly that — assessing load-bearing walls, HVAC routing, and structural options. You'll get a professional opinion backed by engineering, not guesswork, plus 3D renderings and a realistic construction estimate.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Planning a complete kitchen overhaul? Layout design is the first step — we then execute the full remodel: cabinets, countertops, tile, appliances, and finishes.`,
  },

  'custom-cabinetry': {
    title: 'Custom Cabinetry',
    slug: 'custom-cabinetry',
    category: 'kitchen',
    room: 'kitchen',
    shortDescription: 'Handcrafted cabinets built to your exact specifications and style.',
    costMultiplierLow: 0.012,
    costMultiplierHigh: 0.04,
    costTiers: {
      budget: { label: 'Semi-Custom Cabinets', description: 'Modified stock sizes, soft-close, choice of door style and finish' },
      average: { label: 'Custom Cabinets', description: 'Built-to-spec dimensions, premium wood, specialized storage inserts' },
      premium: { label: 'Bespoke Cabinetry', description: 'Furniture-grade construction, exotic woods, integrated appliance panels' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Custom cabinetry is built to your kitchen's exact dimensions — not forced into standard 3-inch increments like stock cabinets. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes with non-standard room sizes, out-of-square walls, and unique architectural features, custom cabinets eliminate the filler strips and dead space that stock cabinets can't avoid. Every inch of your kitchen works harder.`,
        `Stock cabinets come in fixed sizes. Your ${loc.city} kitchen does not. Custom cabinetry is built to the exact dimensions of your space — no filler strips, no wasted corners, no compromises on storage. With ${loc.medianHomeAge}-year-old ${loc.housingStyles[0].toLowerCase()} homes where nothing is perfectly square, custom is often the only way to get a truly finished result.`,
        `The difference between custom and stock cabinetry is precision. Stock cabinets are mass-produced in 3-inch increments and padded with filler strips wherever they don't fit. Custom cabinets for your ${loc.city} home are fabricated to 1/16-inch measurements — every door, drawer, and box built for your specific kitchen. The result is more storage, cleaner lines, and furniture-grade quality.`,
        `${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes deserve better than factory-made cabinets with filler strips. Custom cabinetry transforms non-standard ceiling heights, out-of-square walls, and unique architectural details from installation challenges into design features. Built from premium hardwoods with dovetail joinery and soft-close hardware — these cabinets outlast the home.`,
      ], h);
    },
    mainHeading: (loc) => `Custom Cabinetry for ${loc.city} Kitchens`,
    mainParagraph1: (loc, fmt) =>
      `Stock cabinets come in 3-inch increments: 12", 15", 18", 21", 24", 27", 30", 33", 36". If your ${loc.city} kitchen wall measures 97 inches, stock cabinets will leave a 1-inch gap somewhere, filled with a filler strip. Do that across an entire kitchen and you can lose 6-12 inches of usable cabinet space. Custom cabinetry is fabricated to your exact wall dimensions — down to 1/16 of an inch. For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, custom cabinetry typically runs ${fmt(Math.round(loc.medianHomeValue * 0.012 / 1000) * 1000)} to ${fmt(Math.round(loc.medianHomeValue * 0.04 / 1000) * 1000)} — a significant investment, but one that maximizes every inch of storage and delivers furniture-grade quality that stock can't match.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `Our custom cabinets are built with 3/4" plywood boxes (never particle board), dovetail drawer boxes, full-extension soft-close drawer slides (Blum Tandem or equivalent), and concealed European hinges with soft-close. Door styles range from flat slab and Shaker to inset beaded and raised panel — all fabricated from your choice of wood species: maple, cherry, walnut, white oak, alder, or painted MDF for color finishes. We integrate specialized storage — pull-out spice racks, tray dividers, mixer lifts, corner Susans, pull-out trash/recycling, and custom drawer inserts — all built into the cabinet design from the start, not added as afterthoughts. For ${loc.city}'s older ${loc.housingStyles[0].toLowerCase()} homes, custom cabinets can be designed to complement period architectural details while adding modern functionality.`,
    projectsHeading: (loc) => `Popular Custom Cabinetry Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `From full kitchen cabinet suites to built-in pantries and butler's pantries, here are the custom cabinetry projects we build most often for ${loc.city} homeowners.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('cabinet') || lower.includes('custom') || lower.includes('kitchen') || lower.includes('pantry') || lower.includes('built-in');
    },
    costSubheading: (loc) =>
      `Custom cabinetry costs in ${loc.city} depend on wood species, door style, finish type, and the amount of specialized storage. For a typical 20-linear-foot kitchen:`,
    costDisclaimer: (loc, fmt) =>
      `Custom cabinetry pricing for ${loc.city} includes design, fabrication, delivery, and professional installation. All cabinets feature 3/4" plywood construction, soft-close hardware, and your choice of wood species and door style. Specialized inserts (pull-out shelves, spice racks, tray dividers, mixer lifts) are priced individually based on type. Painted finishes add $3,000-$6,000 vs. stained finishes due to the multi-step spray process. Lead time from design approval to installation is typically 8-12 weeks.`,
    permitText: (loc) =>
      `Cabinet installation itself doesn't require a permit in ${loc.city}. However, if your custom cabinetry project involves electrical work (under-cabinet lighting, interior cabinet lighting, appliance circuits) or plumbing changes (sink relocation), those trades require permits. We coordinate all permits when they're needed — it's included in the project scope.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does custom cabinetry cost in ${loc.city}, WA?`,
        answer: `Custom kitchen cabinets in ${loc.city} range from ${fmt(costLow)} for a semi-custom approach (modified stock sizes with upgraded materials and soft-close hardware) to ${fmt(costHigh)} for full bespoke cabinetry with exotic hardwoods, inset doors, furniture-grade finishes, and integrated appliance panels. A typical full-kitchen custom cabinet project with maple or cherry construction, Shaker doors, and standard specialized storage runs about ${fmt(avgCost)}. Compare that to stock cabinets at ${fmt(Math.round(loc.medianHomeValue * 0.005 / 1000) * 1000)}-${fmt(Math.round(loc.medianHomeValue * 0.01 / 1000) * 1000)} — custom costs 2-3x more but uses every inch of space and lasts decades.`,
      },
      {
        question: `How long does custom cabinetry take from design to installation in ${loc.city}?`,
        answer: `The complete timeline is typically 14-20 weeks. Design phase: 2-3 weeks for measurements, design consultations, 3D renderings, and revisions. Approval and ordering: 1 week to finalize materials, door style, finish, and hardware. Fabrication: 8-12 weeks depending on complexity and shop workload. Installation: 3-5 days for a full kitchen. We schedule installation as soon as fabrication is confirmed so your calendar is locked in well in advance. If your project includes countertops, we template after cabinets are installed — add 2-3 weeks for countertop fabrication and install.`,
      },
      {
        question: `Custom vs. semi-custom vs. stock cabinets — what's the difference?`,
        answer: `Stock cabinets are mass-produced in fixed sizes (3" increments) with limited door styles and finishes. Lead time is 1-3 weeks and cost is lowest. Semi-custom cabinets start from stock dimensions but can be modified in size, and offer more door/finish options plus better hardware. Lead time is 4-8 weeks. Custom cabinets are built from scratch to your exact dimensions with any wood species, door style, finish, and storage configuration you want. Lead time is 8-12 weeks. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes with non-standard room dimensions and out-of-square walls, custom or semi-custom cabinets eliminate the awkward filler strips and dead corners that plague stock installs.`,
      },
      {
        question: `What wood species are most popular for custom cabinets in ${loc.city}?`,
        answer: `Maple leads the pack in ${loc.city} — it's a tight-grained hardwood that takes stain and paint beautifully, and it's durable enough for decades of daily use. White oak is surging in popularity for its prominent grain pattern that works perfectly in modern and Craftsman-style kitchens. Cherry is a classic choice for traditional kitchens — it darkens naturally over time, which many homeowners love. Walnut is the premium choice for contemporary kitchens — the rich dark brown tone is stunning but comes at a 40-60% premium over maple. For painted cabinets, we use MDF panels with solid wood face frames — MDF takes paint more evenly than natural wood and won't show grain through the finish over time.`,
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get a Custom Cabinetry Consultation in ${loc.city}`,
        `Design Custom Cabinets for Your ${loc.city} Kitchen`,
        `Every Inch Matters — Let's Build Your Perfect Kitchen`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll visit your ${loc.city} kitchen, take detailed measurements, discuss your style preferences and storage needs, and create a custom design with 3D renderings. You'll see exactly how your new cabinets will look and function before a single board is cut. Free design consultation.`,
        `Custom cabinetry starts with understanding your kitchen and how you use it. Our free consultation includes precision measurements of your ${loc.city} kitchen, a discussion of wood species, door styles, and storage needs, followed by 3D renderings that show your custom cabinets in your actual space before fabrication begins.`,
        `We design and build cabinets that fit your ${loc.city} kitchen like they were always meant to be there — because they were. Schedule a free in-home design session and get detailed measurements, material options, 3D visualizations, and a transparent quote for furniture-grade cabinetry built to your exact specifications.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Doing a complete kitchen remodel? Custom cabinets pair perfectly with our countertop installation and kitchen layout design services. Bundled pricing available.`,
  },

  'flooring-installation': {
    title: 'Flooring Installation',
    slug: 'flooring-installation',
    category: 'general',
    room: 'home',
    shortDescription: 'Hardwood, LVP, tile, and natural stone flooring installation.',
    costMultiplierLow: 0.004,
    costMultiplierHigh: 0.018,
    costTiers: {
      budget: { label: 'Budget Flooring', description: 'LVP or laminate, standard installation, basic transitions' },
      average: { label: 'Mid-Range Flooring', description: 'Engineered hardwood or premium LVP, custom transitions, furniture moving' },
      premium: { label: 'Premium Flooring', description: 'Solid hardwood, natural stone, radiant heat, custom patterns' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Flooring sets the foundation for every room in your home. We install luxury vinyl plank (LVP), engineered hardwood, solid hardwood, porcelain tile, natural stone, and laminate throughout ${loc.city} homes. In the PNW climate, material selection matters — we'll steer you toward options that handle our moisture levels and temperature swings without cupping, warping, or cracking.`,
        `New flooring transforms every room it touches — and in ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, that transformation is often overdue. We install LVP, engineered hardwood, solid hardwood, porcelain tile, and natural stone with a focus on PNW-appropriate materials that resist the moisture challenges other regions don't face.`,
        `Flooring installation in the Pacific Northwest is not the same as anywhere else. Humidity swings, tracked-in rain, and radiant heating all affect material performance. We guide ${loc.city} homeowners toward flooring options proven to perform in this climate — then install them with the substrate prep and moisture management that ensures long-term success.`,
        `${loc.city} homeowners replacing carpet, damaged hardwood, or outdated vinyl have more high-quality options than ever. LVP delivers waterproof durability. Engineered hardwood provides real wood beauty with PNW-climate stability. Porcelain tile handles any room, any moisture level. We install all of them with precision subfloor prep that prevents the squeaks, gaps, and failures that plague shortcuts.`,
      ], h);
    },
    mainHeading: (loc) => `Flooring Options for ${loc.city} Homes`,
    mainParagraph1: (loc, fmt) =>
      `The Pacific Northwest's climate creates specific challenges for flooring. With humidity levels swinging from 45% in summer to 85%+ in winter, solid hardwood can cup and gap seasonally if not properly acclimated and installed with the right expansion gaps. That's why engineered hardwood and luxury vinyl plank (LVP) have become the dominant choices in ${loc.city}. LVP is 100% waterproof, dimensionally stable, and today's premium products (COREtec, Shaw Floorte, Mohawk RevWood) are virtually indistinguishable from real wood. For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, flooring projects range from ${fmt(Math.round(loc.medianHomeValue * 0.004 / 1000) * 1000)} for a main-floor LVP install to ${fmt(Math.round(loc.medianHomeValue * 0.018 / 1000) * 1000)} for whole-house solid hardwood or natural stone.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `Our flooring installation process starts with subfloor assessment. In ${loc.city}'s ${loc.medianHomeAge}-year-old homes, we commonly find: original hardwood under carpet (which may be refinishable), plywood subflooring that needs leveling, concrete slabs with moisture issues (tested with calcium chloride or relative humidity probes), and outdated vinyl or linoleum that may contain asbestos (pre-1986 homes). We test and address every issue before any new flooring goes down. Proper subfloor prep is 70% of a successful flooring installation — it's where shortcuts cause squeaks, lippage, and premature failure.`,
    projectsHeading: (loc) => `Popular Flooring Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `From whole-house LVP installations to kitchen-and-bath tile, here are the flooring projects ${loc.city} homeowners are choosing most.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('floor') || lower.includes('hardwood') || lower.includes('tile') || lower.includes('lvp') || lower.includes('vinyl') || lower.includes('carpet');
    },
    costSubheading: (loc) =>
      `Flooring costs in ${loc.city} depend on material, square footage, subfloor condition, and complexity. Typical ranges per square foot installed:`,
    costDisclaimer: (loc, fmt) =>
      `Flooring pricing for ${loc.city} includes material, underlayment, installation, transitions between rooms, and basic furniture moving. Subfloor leveling adds $1-3/sqft if needed. Old flooring removal adds $1-2/sqft for carpet, $2-4/sqft for tile. Baseboard removal and reinstallation is included. Custom patterns (herringbone, chevron) add 20-30% to installation labor. We measure your home precisely and quote the total installed price — no per-sqft guessing.`,
    permitText: (loc) =>
      `Flooring installation in ${loc.city} does not require a building permit. It's classified as a cosmetic upgrade. The only exception is if you're adding radiant floor heating — the electrical work for the heating mats requires an electrical permit. If your flooring project uncovers structural subfloor issues that need repair, those may require permits depending on scope. We'll advise you if we find anything that needs permitting.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does flooring installation cost in ${loc.city}, WA?`,
        answer: `For a typical ${loc.city} home, flooring costs range from ${fmt(costLow)} for 500-800 sqft of LVP or laminate to ${fmt(costHigh)} for whole-house solid hardwood or natural stone. LVP runs $6-12/sqft installed, engineered hardwood $10-18/sqft, solid hardwood $12-22/sqft, porcelain tile $10-20/sqft, and natural stone $18-40/sqft. The average ${loc.city} flooring project — main-floor LVP or engineered hardwood, approximately 800-1,200 sqft — comes in around ${fmt(avgCost)}. Old flooring removal and subfloor prep are included in these estimates.`,
      },
      {
        question: `What flooring is best for the PNW climate in ${loc.city}?`,
        answer: `Luxury vinyl plank (LVP) and engineered hardwood are the top two choices for ${loc.city}'s climate. LVP is 100% waterproof, handles humidity swings without expansion issues, and is ideal for kitchens, bathrooms, and basements. Premium LVP from COREtec or Shaw Floorte is $6-12/sqft installed and lasts 20-25 years. Engineered hardwood has a real wood top layer bonded to a stable plywood core — it handles our PNW humidity swings much better than solid hardwood. For solid hardwood fans, we recommend white oak (most stable domestic species) with a 7-10 day acclimation period in your home before installation, plus proper expansion gaps at every wall.`,
      },
      {
        question: `How long does flooring installation take in ${loc.city}?`,
        answer: `LVP installation moves fast: 300-500 sqft per day. A main-floor install of 800-1,000 sqft takes 2-3 days. Engineered hardwood is similar — 2-3 days for a main floor. Solid hardwood takes longer: 200-300 sqft per day, plus sanding and finishing adds 3-5 days (including cure time between coats). Tile flooring runs 100-200 sqft per day depending on tile size and pattern. For ${loc.city}'s ${loc.medianHomeAge}-year-old homes, add 1-2 days for subfloor prep — leveling, moisture testing, and old flooring removal. We block off furniture-free staging areas and work room by room so you're never completely displaced.`,
      },
      {
        question: `Should I replace carpet with hardwood or LVP in ${loc.city}?`,
        answer: `Both are excellent upgrades — the choice depends on your priorities. LVP: waterproof, scratch-resistant (great for pets), lower cost ($6-12/sqft installed), virtually zero maintenance, and 20-25 year lifespan. Engineered or solid hardwood: real wood beauty and character, can be refinished multiple times over 50+ years, adds more resale value ($3-5/sqft more than LVP in appraisal data), but requires more care with spills and scratches. For main living areas in ${loc.city} homes, we install hardwood more often. For kitchens, bathrooms, mudrooms, and basements, LVP is the clear winner. Many homeowners do a mix — hardwood in living/dining/bedrooms, LVP in wet areas — with a matched color for seamless flow.`,
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get a Flooring Installation Quote in ${loc.city}`,
        `New Floors for Your ${loc.city} Home — Free Estimate`,
        `Let's Choose the Right Flooring for Your ${loc.city} Home`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll come to your ${loc.city} home, measure every room, assess the subfloor condition, bring material samples, and give you a detailed installed price. We can show you how different materials look in your home's actual lighting. Free in-home consultation.`,
        `Material selection, subfloor condition, and room-specific requirements all factor into your flooring project. Our free ${loc.city} consultation covers every detail: precise measurements, substrate assessment, material samples you can compare in your actual lighting, and a complete installed price with no surprise line items.`,
        `Flooring is too important to choose from a catalog. We bring samples directly to your ${loc.city} home, assess the subfloor in every room, and recommend materials that perform in our PNW climate. Your quote includes everything — material, underlayment, installation, transitions, and furniture coordination. One price, fully transparent.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Doing a kitchen or bathroom remodel? Flooring is always part of the equation. We coordinate flooring with your cabinet, countertop, and tile work for seamless results.`,
  },

  'aging-in-place': {
    title: 'Aging-in-Place Remodeling',
    slug: 'aging-in-place',
    category: 'general',
    room: 'home',
    shortDescription: 'Accessible remodeling for comfort and safety at every stage of life.',
    costMultiplierLow: 0.006,
    costMultiplierHigh: 0.035,
    costTiers: {
      budget: { label: 'Basic Accessibility', description: 'Grab bars, lever handles, non-slip flooring, comfort-height toilet' },
      average: { label: 'Mid-Range Accessibility', description: 'Zero-threshold shower, widened doorways, ADA vanity, lighting upgrades' },
      premium: { label: 'Comprehensive Aging-in-Place', description: 'Full ADA bathroom, kitchen modifications, smart home integration, ramp' },
    },
    heroText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Aging-in-place remodeling lets you stay in your ${loc.city} home safely and comfortably as your needs change. We specialize in accessibility modifications that look beautiful — not institutional. From zero-threshold showers and grab bars that double as towel bars to widened doorways and comfort-height everything, we create spaces that work for every stage of life.`,
        `Stay in the ${loc.city} home you love — safely, comfortably, and independently. Our aging-in-place modifications are designed to look like intentional design choices, not medical equipment. Zero-threshold showers, decorative grab bars, comfort-height fixtures, and widened doorways that enhance your home while preparing it for every stage of life.`,
        `Your ${loc.city} home can adapt to your needs rather than the other way around. As Certified Aging-in-Place Specialists, we transform bathrooms, kitchens, and entries with modifications that are as beautiful as they are functional — because accessibility and great design are not mutually exclusive.`,
        `${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes weren't built with aging in mind, but they can be adapted. We specialize in modifications that reduce fall risk, improve mobility, and extend independent living by 10-20 years — all while maintaining or enhancing your home's visual appeal and market value.`,
      ], h);
    },
    mainHeading: (loc) => `Aging-in-Place Remodeling for ${loc.city} Homes`,
    mainParagraph1: (loc, fmt) =>
      `Most ${loc.city} homeowners want to stay in their homes as they age — and smart modifications can make that possible for decades longer than an unmodified home. The bathroom is the #1 priority: it's where 80% of in-home falls happen. A zero-threshold (curbless) shower, strategically placed grab bars, non-slip tile flooring, a comfort-height toilet, and adequate lighting can reduce fall risk by up to 60%. For ${loc.city} homes valued around ${fmt(loc.medianHomeValue)}, aging-in-place projects range from ${fmt(Math.round(loc.medianHomeValue * 0.006 / 1000) * 1000)} for targeted modifications to ${fmt(Math.round(loc.medianHomeValue * 0.035 / 1000) * 1000)} for comprehensive whole-home accessibility conversions.`,
    mainParagraph2: (loc) => loc.description,
    mainParagraph3: (loc) =>
      `Our approach is different from most contractors: we're Certified Aging-in-Place Specialists (CAPS) trained by the National Association of Home Builders. We assess your home through the lens of current and future mobility — not just today's needs. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, common modifications include: bathroom conversions (zero-threshold showers, grab bars, walk-in tubs), kitchen adjustments (varied counter heights, pull-out shelves, lever handles, touchless faucets), doorway widening (36" minimum clear width), lighting upgrades (motion-activated, increased brightness), and entry modifications (ramps, handrails, zero-step entries). Everything is designed to look like intentional design choices, not aftermarket medical equipment.`,
    projectsHeading: (loc) => `Popular Aging-in-Place Projects in ${loc.city}`,
    projectsSubheading: (loc) =>
      `From bathroom safety upgrades to whole-home accessibility, here are the aging-in-place projects most requested by ${loc.city} homeowners.`,
    projectFilter: (p) => {
      const lower = p.toLowerCase();
      return lower.includes('aging') || lower.includes('accessible') || lower.includes('ada') || lower.includes('grab bar') || lower.includes('walk-in') || lower.includes('shower') || lower.includes('bathroom');
    },
    costSubheading: (loc) =>
      `Aging-in-place costs in ${loc.city} vary widely based on scope — from targeted safety modifications to comprehensive whole-home conversions:`,
    costDisclaimer: (loc, fmt) =>
      `Aging-in-place pricing for ${loc.city} includes all materials, labor, and finishing. Grab bar installation requires in-wall blocking for safety — we never rely on drywall anchors alone. Zero-threshold showers require floor modification for proper drainage slope. Doorway widening in ${loc.medianHomeAge}-year-old homes may involve header modifications. We coordinate with occupational therapists when needed to ensure modifications match specific mobility requirements. Many aging-in-place modifications qualify for VA benefits, Medicaid waivers, or local grants — we can point you to the right resources.`,
    permitText: (loc) =>
      `Aging-in-place modifications in ${loc.city} may or may not require permits depending on scope. Grab bars and lever handles don't need permits. Zero-threshold shower conversions require a plumbing permit. Doorway widening that involves structural headers requires a building permit. Ramp construction may need both building and ADA compliance review. Electrical modifications (motion-sensing lights, additional outlets) require electrical permits. We handle all permitting and always build to or exceed ADA/ANSI A117.1 accessibility standards regardless of permit requirements.`,
    faqs: (loc, fmt, costLow, costHigh, avgCost) => [
      {
        question: `How much does aging-in-place remodeling cost in ${loc.city}, WA?`,
        answer: `Costs vary significantly based on scope. Targeted modifications — grab bars, lever handles, non-slip flooring, comfort-height toilet — start at ${fmt(costLow)}. A mid-range project with a zero-threshold shower conversion, ADA-compliant vanity, and widened doorways runs about ${fmt(avgCost)}. A comprehensive whole-home conversion with full bathroom and kitchen accessibility, widened hallways, ramp construction, and smart home integration reaches ${fmt(costHigh)}. For ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, bathroom modifications are the most impactful per dollar spent — they address the highest-risk area of the home where 80% of in-home falls occur.`,
      },
      {
        question: `What are the most important aging-in-place modifications for a ${loc.city} home?`,
        answer: `Priority #1 is the bathroom: zero-threshold shower entry (no curb to step over), grab bars at the toilet and in the shower (mounted into wall studs or blocking, never drywall anchors), non-slip tile flooring, comfort-height toilet (17-19" seat height vs. standard 15"), and lever-handle faucets. Priority #2 is lighting: motion-activated night lights along the path from bedroom to bathroom, increased wattage in all living areas, and rocker-style light switches at 42" height. Priority #3 is entry: at least one zero-step entry to the home, ideally the one used daily. For ${loc.city}'s ${loc.medianHomeAge}-year-old ${loc.housingStyles[0].toLowerCase()} homes, these modifications can extend safe independent living by 10-20 years.`,
      },
      {
        question: `Do grab bars have to look institutional?`,
        answer: `Absolutely not — that's one of the biggest misconceptions about aging-in-place remodeling. Modern grab bars come in decorative finishes (brushed nickel, matte black, oil-rubbed bronze) that match your bathroom fixtures. Many double as towel bars, shelves, or shower caddies — your guests won't even notice they're safety features. Brands like Moen Home Care, Delta, and Ponte Giulio make bars that are ADA-rated for 500 lbs but look like boutique hotel hardware. We install every bar into solid wood blocking inside the wall — not drywall anchors — so they'll hold for decades. The days of stainless steel hospital-style bars are long gone.`,
      },
      {
        question: `What is a zero-threshold shower and can it be installed in my ${loc.city} home?`,
        answer: `A zero-threshold (curbless) shower has no step or lip at the entry — the floor slopes gently from the bathroom into the shower for drainage. It eliminates the #1 tripping hazard in the bathroom. Installing one in an existing home requires lowering the shower floor to create the drainage slope, which means modifying the floor framing. In ${loc.city}'s ${loc.housingStyles[0].toLowerCase()} homes, this is usually straightforward — we cut the subfloor to create a recessed area, install a Schluter Kerdi linear drain system, and tile the floor continuously from the bathroom into the shower. The result looks sleek and modern while being completely accessible. A wheelchair-accessible version needs a 36"x36" minimum clear floor area — we design to exceed ADA minimums.`,
      },
    ],
    ctaHeading: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `Get an Aging-in-Place Consultation in ${loc.city}`,
        `Make Your ${loc.city} Home Work for Every Stage of Life`,
        `Safety, Comfort, Independence — Starting Today`,
      ], h);
    },
    ctaText: (loc, hash) => {
      const h = hash ?? cityHash(loc.slug);
      return pickVariant([
        `We'll visit your ${loc.city} home and assess it through an accessibility lens — identifying the modifications that will have the biggest impact on safety and independence. We'll prioritize recommendations by urgency and budget. Our Certified Aging-in-Place Specialists understand both the construction and the human factors. Free consultation, no pressure.`,
        `Our CAPS-certified team evaluates your ${loc.city} home for current and future accessibility needs — not just today's challenges but the ones likely to emerge in the next 5-10 years. We prioritize recommendations by safety impact and budget, then present a phased plan you can implement on your schedule. Free assessment, no obligation.`,
        `Every aging-in-place consultation starts with a thorough walkthrough of your ${loc.city} home. We evaluate bathroom safety, hallway widths, entry accessibility, lighting adequacy, and kitchen ergonomics — then create a prioritized modification plan with transparent pricing. Our Certified Aging-in-Place Specialists bring both construction expertise and an understanding of the human factors that make the difference between a functional modification and one that truly improves daily life.`,
      ], h);
    },
    crossLinkText: (loc) =>
      `Need a full bathroom remodel with accessibility features built in? Or kitchen modifications for easier daily use? We integrate aging-in-place design into any remodeling project.`,
  },
};

export function getServiceContent(slug: string): ServiceContentData {
  const content = serviceContentMap[slug];
  if (!content) {
    throw new Error(`No service content data found for slug: "${slug}". Valid slugs: ${Object.keys(serviceContentMap).join(', ')}`);
  }
  return content;
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(serviceContentMap);
}
