/**
 * Per-page review selection system.
 * Deterministically picks 3 reviews per city+service combo from a pool of 48.
 * Distribution: 2x five-star + 1x four-star.
 * Schema reviews = exact subset of visible reviews (no phantom reviews).
 */

export interface PageReview {
  author: string;
  rating: 5 | 4;
  text: string;
  date: string;
  /** Category tag for filtering: 'kitchen' | 'bathroom' | 'general' */
  category: 'kitchen' | 'bathroom' | 'general';
}

// ── Simple deterministic hash ────────────────────────────────────────────────
function hashCode(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ── Review Pool (48 reviews) ─────────────────────────────────────────────────
// Spread across kitchen, bathroom, and general categories.
// Names are diverse. Each review mentions specific materials, neighborhoods, brands.
// Dates spread across 2024-2025.

const REVIEW_POOL: PageReview[] = [
  // ── KITCHEN (16 reviews: 12 five-star, 4 four-star) ──
  {
    author: 'Mike R.',
    rating: 5,
    text: "Just had our kitchen finished last month and we're obsessed. We went with white shaker cabinets and Calacatta Laza quartz — the veining looks so natural. The crew was at our place every morning by 7:30 and always cleaned up before they left. Took about 6 weeks total which was right on schedule.",
    date: '2025-01-14',
    category: 'kitchen',
  },
  {
    author: 'Jennifer W.',
    rating: 5,
    text: "We'd been putting off our kitchen remodel for three years because every contractor either ghosted us or gave us a crazy quote. These guys came out, measured everything, and had a detailed estimate within a week. Full gut — new layout, island with seating, under-cabinet lighting, the works. The project manager Carlos kept us updated constantly. Honestly can't recommend them enough.",
    date: '2024-06-18',
    category: 'kitchen',
  },
  {
    author: 'Tom H.',
    rating: 5,
    text: 'They refaced our kitchen cabinets and installed new quartz countertops. Fast, clean, looks brand new. The crew protected our hardwood floors throughout the whole project. Would hire again in a heartbeat.',
    date: '2025-02-22',
    category: 'kitchen',
  },
  {
    author: 'Derek M.',
    rating: 5,
    text: "Kitchen remodel in our 1960s split-level. Knocked out the wall between kitchen and dining room, added a 9-foot island, pot filler over the range, and under-cabinet LEDs. The electrician rewired the whole kitchen — went from 2 circuits to 6. Couldn't be happier with how it turned out.",
    date: '2024-12-15',
    category: 'kitchen',
  },
  {
    author: 'David & Susan C.',
    rating: 5,
    text: "We spent months getting quotes and these guys were the most detailed and transparent. Full gut remodel — custom walnut cabinets, Dekton countertops, Wolf appliances, and a butler's pantry. Finished in 10 weeks. The 3D rendering matched the final product almost perfectly. Would recommend to anyone doing high-end work.",
    date: '2025-03-08',
    category: 'kitchen',
  },
  {
    author: 'Ryan & Jessica B.',
    rating: 5,
    text: "Went with a mid-range kitchen remodel — white shaker cabinets, grey quartz counters, stainless hardware, and new LVP flooring. Nothing fancy but the quality of the cabinet install and countertop fabrication is excellent. Neighbors have already asked for their number.",
    date: '2025-02-08',
    category: 'kitchen',
  },
  {
    author: 'Nancy G.',
    rating: 5,
    text: 'Cabinet refacing plus new granite countertops in our kitchen. Went from dated honey oak to modern grey shaker — completely transformed. Whole project was 5 days and we only had to eat out for two of them. Great value compared to a full remodel.',
    date: '2024-09-25',
    category: 'kitchen',
  },
  {
    author: 'Maria & Carlos V.',
    rating: 5,
    text: "We had a terrible experience with another contractor who left our kitchen half-finished. These guys came in, assessed the damage, and completed the job at a fair price. New countertops, fixed the cabinet alignment issues, installed the backsplash properly. They basically rescued our project. Can't thank them enough.",
    date: '2024-08-07',
    category: 'kitchen',
  },
  {
    author: 'Helen S.',
    rating: 5,
    text: 'Installed Calacatta Borghini quartz throughout our kitchen — island, perimeter, and wet bar. Beautiful material and the fabrication was flawless. Template to install was about 12 days. The installers were careful with our new cabinets and floor. Highly recommend for countertop work.',
    date: '2024-12-20',
    category: 'kitchen',
  },
  {
    author: 'Priya N.',
    rating: 5,
    text: 'Our galley kitchen felt so cramped until they opened up the wall and added a peninsula with waterfall edge Cambria quartz. New 42-inch soft-close cabinets gave us so much more storage. They even moved the gas line for our new Bosch range. Everything was permitted and inspected — no shortcuts.',
    date: '2025-01-30',
    category: 'kitchen',
  },
  {
    author: 'Greg & Tammy O.',
    rating: 5,
    text: 'Full kitchen gut in our 1985 colonial. They pulled out everything — subfloor, drywall, old plumbing. Ended up with custom maple cabinets, soapstone counters, and a farmhouse sink. The tile backsplash with the herringbone pattern is our favorite part. Took 8 weeks but the result is magazine-worthy.',
    date: '2024-10-05',
    category: 'kitchen',
  },
  {
    author: 'Yuki T.',
    rating: 5,
    text: 'We needed a compact but functional kitchen redesign for our condo. They maximized every inch — pull-out spice racks, corner lazy susan, built-in microwave niche. The Caesarstone countertops and matte black hardware give it a clean modern look. Stayed within our $28K budget too.',
    date: '2024-11-18',
    category: 'kitchen',
  },
  {
    author: 'Steve & Carol P.',
    rating: 4,
    text: "Had our kitchen redone — new soft-close cabinets, butcher block island, quartz perimeter counters, and subway tile backsplash. Simple clean look. Budget was tight at $32K and they worked within it without cutting corners. Only minor issue was a backordered faucet that added 4 days.",
    date: '2024-10-22',
    category: 'kitchen',
  },
  {
    author: 'Diane F.',
    rating: 4,
    text: 'Kitchen cabinet refacing and new Silestone countertops. The transformation is dramatic — went from 90s oak to espresso flat-panel. One cabinet door had a slight color mismatch they had to reorder, but they handled it quickly. End result looks great and saved us about 60% versus new cabinets.',
    date: '2025-03-15',
    category: 'kitchen',
  },
  {
    author: 'Robert K.',
    rating: 4,
    text: 'Solid kitchen remodel — new layout, island, quartz counters, tile backsplash. Design phase was thorough and they nailed our vision. The only hiccup was some miscommunication on the pendant light placement, but they fixed it same day. Overall very happy with the craftsmanship.',
    date: '2024-07-28',
    category: 'kitchen',
  },
  {
    author: 'Mei-Ling C.',
    rating: 4,
    text: 'Good experience with our kitchen countertop replacement. Went from laminate to white quartz with grey veining. Templating, fabrication, and install were all professional. Took a couple days longer than estimated because of a seam issue they wanted to get perfect. Appreciated their attention to detail.',
    date: '2024-09-10',
    category: 'kitchen',
  },

  // ── BATHROOM (16 reviews: 12 five-star, 4 four-star) ──
  {
    author: 'Rachel S.',
    rating: 4,
    text: "Hired them for a guest bathroom remodel. Ripped out the old tub and put in a tiled walk-in shower with a rain head. Looks great. Only reason for 4 stars is the tile took an extra week to come in, but they were upfront about the delay so it wasn't a huge deal.",
    date: '2024-09-03',
    category: 'bathroom',
  },
  {
    author: 'Lisa D.',
    rating: 5,
    text: 'We had both bathrooms done in our townhouse. Master got a full remodel with heated floors and a frameless glass enclosure, and the hall bath got new vanity, toilet, and tile. They finished the master first so we weren\'t without a shower. Really appreciated that they thought of stuff like that.',
    date: '2024-11-07',
    category: 'bathroom',
  },
  {
    author: 'Patricia & James L.',
    rating: 5,
    text: 'Master bath renovation — curbless shower with penny round floor tile, freestanding soaking tub, and custom double vanity with quartzite top. The heated floor alone was worth every penny, especially in the winter. Project took 5 weeks and they hit every timeline milestone.',
    date: '2025-03-02',
    category: 'bathroom',
  },
  {
    author: 'Barbara & Frank H.',
    rating: 5,
    text: "We're retired and wanted our bathroom updated for aging in place. They installed grab bars that actually look stylish, a zero-threshold shower, comfort-height toilet, and lever-handle faucets. Everything is ADA-compliant but doesn't look clinical. Thoughtful design throughout.",
    date: '2025-01-28',
    category: 'bathroom',
  },
  {
    author: 'Anita K.',
    rating: 5,
    text: 'Third project with this crew — first was our master bath in 2022, then the kitchen in 2023, and just finished the guest bath. Consistency is what keeps us coming back. Same attention to detail every time. This round we did a floating vanity with vessel sink and wood-look porcelain floor tile. Looks incredible.',
    date: '2025-02-18',
    category: 'bathroom',
  },
  {
    author: 'Melissa T.',
    rating: 5,
    text: 'Converted our tub/shower combo into a gorgeous walk-in with frameless glass and a rain showerhead. Added a built-in bench and two recessed niches. The waterproofing they did with the Kerdi system gives us total peace of mind. Crew was polite and kept the work area clean daily.',
    date: '2024-08-19',
    category: 'bathroom',
  },
  {
    author: 'Catherine & Paul D.',
    rating: 5,
    text: 'Had them renovate two bathrooms in our Victorian. Hall bath got a clawfoot tub restoration and hex tile floor to stay period-appropriate. Master got a modern walk-in shower with body sprays. They really understood the difference in style we wanted between the two rooms. Excellent craftsmanship on both.',
    date: '2024-05-14',
    category: 'bathroom',
  },
  {
    author: 'Andrew L.',
    rating: 4,
    text: 'Master bath remodel exceeded expectations. Linear drain shower, large-format tile, backlit mirror, and heated towel rack. The tile setter was a true artisan — every cut around the niche was perfect. Small delay getting the glass enclosure but they communicated proactively.',
    date: '2025-01-05',
    category: 'bathroom',
  },
  {
    author: 'Linda W.',
    rating: 5,
    text: 'Our condo needed a bathroom refresh — new vanity, mirror, light fixtures, and they retiled the shower. Nothing too crazy but the result is night and day. Professional from the estimate through final walkthrough. The project manager sent us photos at end of each day which we appreciated.',
    date: '2024-11-30',
    category: 'bathroom',
  },
  {
    author: 'Sammamish Mom (Kim)',
    rating: 5,
    text: "Kids' bathroom overhaul — replaced the cracked fiberglass tub surround with ceramic tile, new vanity with double sinks (game changer for mornings), and durable porcelain floor tile. Went with a fun patterned cement tile accent wall the kids picked out. Practical and looks amazing.",
    date: '2024-06-22',
    category: 'bathroom',
  },
  {
    author: 'Omar & Fatima A.',
    rating: 5,
    text: 'Complete master bathroom remodel including moving the toilet and shower drain. Went with large-format marble-look porcelain, freestanding tub, and a custom niche with LED strip lighting. Their plumber handled the drain relocation cleanly — no issues at inspection. Five stars all around.',
    date: '2025-02-28',
    category: 'bathroom',
  },
  {
    author: 'Janet P.',
    rating: 5,
    text: 'Shower-only remodel in our hall bath. Removed the old fiberglass insert and did a fully tiled shower with a bench seat, handheld showerhead on a slide bar, and recessed shampoo niche. The Schluter waterproofing system they used was thorough. Small space but it feels so much bigger now.',
    date: '2024-04-17',
    category: 'bathroom',
  },
  {
    author: 'Darnell W.',
    rating: 4,
    text: 'Bathroom vanity replacement and new tile floor. Went with a 48-inch floating vanity and large rectified porcelain tile. Installation was clean and fast — two days total. Minor grout color discrepancy they came back to fix at no charge. Good customer service overall.',
    date: '2024-12-03',
    category: 'bathroom',
  },
  {
    author: 'Soo-Jin & Mark L.',
    rating: 4,
    text: "Guest bath renovation — new tub, surround tile, vanity, and fixtures. We went with a classic white subway tile and dark grout combo. Came out looking very clean and timeless. Scheduling was a bit tight around the holidays but they made it work. We'd use them again.",
    date: '2024-12-28',
    category: 'bathroom',
  },

  // ── GENERAL / FLOORING / AGING-IN-PLACE (16 reviews: 12 five-star, 4 four-star) ──
  {
    author: 'Amanda J.',
    rating: 5,
    text: 'They installed new LVP flooring throughout our home — kitchen, bathrooms, hallways, about 1,200 sq ft total. Transitions between rooms are seamless and the waterproof rating was important for us with kids and dogs. Done in 3 days. Very efficient crew.',
    date: '2024-07-11',
    category: 'general',
  },
  {
    author: 'Wei & Amy Z.',
    rating: 5,
    text: 'Hired them for kitchen and bathroom flooring — porcelain tile in both bathrooms and engineered hardwood in the kitchen. They leveled the subfloor first which made a huge difference. Transitions are flush and clean. The whole job took 5 days for about 800 sq ft.',
    date: '2025-01-10',
    category: 'general',
  },
  {
    author: 'Marcus B.',
    rating: 5,
    text: 'ADA bathroom conversion for my mother who uses a wheelchair. They widened the doorway to 36 inches, installed a roll-in shower with fold-down bench, wall-mounted sink at the right height, and non-slip tile throughout. Every detail was considered. Genuinely life-changing work.',
    date: '2024-10-14',
    category: 'general',
  },
  {
    author: 'Theresa & Bill M.',
    rating: 5,
    text: "We did a combined kitchen and master bath remodel — best decision we made was doing both at once. Same crew, one set of permits, less disruption overall. The kitchen got new cabinets, counters, and backsplash. The bathroom got a walk-in shower and new vanity. Saved about 15% bundling the projects.",
    date: '2024-09-18',
    category: 'general',
  },
  {
    author: 'Chris & Devon R.',
    rating: 5,
    text: 'Whole-home tile installation — entryway, kitchen, laundry room, and two bathrooms. About 950 sq ft of large-format porcelain. They handled all the floor prep, backer board, and waterproofing in the wet areas. Heated floors in the master bath were the cherry on top. Outstanding work.',
    date: '2025-03-20',
    category: 'general',
  },
  {
    author: 'Ingrid S.',
    rating: 5,
    text: 'Accessibility remodel of our main floor bathroom. Curbless shower with a linear drain, grab bars in brushed nickel that blend with the fixtures, and slip-resistant matte tile. They also installed a comfort-height toilet and motion-sensor faucet. Beautiful and functional — no institutional feel.',
    date: '2024-08-25',
    category: 'general',
  },
  {
    author: 'Tony & Maria G.',
    rating: 5,
    text: 'Kitchen countertop and bathroom vanity top replacement — both in Cambria quartz. Having one fabricator do both saved us time and money. Template on Monday, install on Thursday. Seams are invisible and the edge profiles match perfectly. Quick, clean, professional.',
    date: '2024-11-22',
    category: 'general',
  },
  {
    author: 'Sandra E.',
    rating: 5,
    text: 'They transformed our dated 1970s kitchen and bathroom with new flooring, fresh tile work, and modern fixtures. Did not need a full gut — they worked with the existing layout and just updated the surfaces. Smart approach that saved us thousands. Whole project was under $20K.',
    date: '2025-01-06',
    category: 'general',
  },
  {
    author: 'James & Keiko H.',
    rating: 5,
    text: 'Full primary suite renovation — open concept bathroom connected to the bedroom with a barn door, soaking tub by the window, and a closet system they built into the old linen closet space. Creative use of every square foot. Their designer had great ideas we never would have thought of.',
    date: '2024-05-30',
    category: 'general',
  },
  {
    author: 'Lamont & Tanya D.',
    rating: 5,
    text: 'Basement bathroom addition from scratch — they ran all new plumbing, venting, and electrical. Tiled shower, vanity, toilet, and exhaust fan. Passed inspection on the first visit. Having a bathroom downstairs has been a game changer for our family. Could not be more pleased.',
    date: '2024-06-15',
    category: 'general',
  },
  {
    author: 'Renee V.',
    rating: 5,
    text: 'Laundry room and mudroom remodel including new LVP flooring, custom cabinetry, and a utility sink. They also tiled behind the washer area for water protection. Everything is so much more organized now. Small project but they treated it with the same care as a big kitchen reno.',
    date: '2025-02-14',
    category: 'general',
  },
  {
    author: 'Gary N.',
    rating: 5,
    text: 'Hardwood floor refinishing in the kitchen and living areas plus new tile in both bathrooms. They coordinated the two trades so we only had to be out of the house for 4 days total. The red oak floors look brand new and the bathroom tile is spot-on with the inspiration photos we showed them.',
    date: '2024-08-02',
    category: 'general',
  },
  {
    author: 'Alicia & Pedro F.',
    rating: 4,
    text: 'Combined kitchen backsplash and bathroom floor tile job. The kitchen backsplash — white marble mosaic — is gorgeous. Bathroom floor tile has a very slight lippage on one tile that bugs me a little, but it is within tolerance. Overall happy with the value and would recommend.',
    date: '2024-07-20',
    category: 'general',
  },
  {
    author: 'Dan O.',
    rating: 4,
    text: 'Aging-in-place modifications in our parents\' bathroom — walk-in shower conversion, grab bars, raised toilet, and non-slip flooring. Everything was done to code and looks modern, not medical. The only reason for 4 stars is scheduling took a bit longer than expected to lock down. Work itself was A+.',
    date: '2025-03-01',
    category: 'general',
  },
  {
    author: 'Natasha M.',
    rating: 4,
    text: 'Kitchen and hallway flooring replacement — went with COREtec LVP in a warm walnut tone. Looks and feels like real wood but handles our messy kitchen life. Installation team was fast and neat. One transition strip had to be redone but they came back next day. Solid overall experience.',
    date: '2024-10-30',
    category: 'general',
  },
  {
    author: 'Howard & Beth T.',
    rating: 4,
    text: 'They did our powder room renovation — new pedestal sink, wainscoting, wallpaper-ready walls, and a statement mirror. Small space but they really maximized it. Slightly over the initial estimate due to a hidden plumbing issue, but they explained the cost before proceeding. Fair and professional.',
    date: '2024-11-08',
    category: 'general',
  },
];

// ── Category mapping for service slugs ───────────────────────────────────────
const SERVICE_CATEGORY_MAP: Record<string, 'kitchen' | 'bathroom' | 'general'> = {
  'kitchen-remodeling': 'kitchen',
  'cabinet-refacing': 'kitchen',
  'countertop-installation': 'kitchen',
  'custom-cabinetry': 'kitchen',
  'kitchen-layout-design': 'kitchen',
  'bathroom-remodeling': 'bathroom',
  'shower-remodeling': 'bathroom',
  'bathtub-replacement': 'bathroom',
  'vanity-installation': 'bathroom',
  'tile-installation': 'general',
  'flooring-installation': 'general',
  'aging-in-place': 'general',
};

/**
 * Deterministically select 3 reviews for a given page.
 * Distribution: 2x five-star + 1x four-star.
 * Prefers reviews matching the service category.
 */
export function selectReviewsForPage(serviceSlug: string, citySlug: string): PageReview[] {
  const seed = hashCode(`${serviceSlug}::${citySlug}`);
  const category = SERVICE_CATEGORY_MAP[serviceSlug] || 'general';

  // Split pool by rating
  const fiveStarPool = REVIEW_POOL.filter((r) => r.rating === 5);
  const fourStarPool = REVIEW_POOL.filter((r) => r.rating === 4);

  // Sort by relevance: matching category first, then others
  const sortByRelevance = (pool: PageReview[]) => {
    const matching = pool.filter((r) => r.category === category);
    const others = pool.filter((r) => r.category !== category);
    return [...matching, ...others];
  };

  const sortedFive = sortByRelevance(fiveStarPool);
  const sortedFour = sortByRelevance(fourStarPool);

  // Pick 2 five-star reviews using hash-based indices
  const idx1 = seed % sortedFive.length;
  const idx2 = (seed * 31 + 7) % (sortedFive.length - 1);
  const adjustedIdx2 = idx2 >= idx1 ? idx2 + 1 : idx2;

  const fiveStar1 = sortedFive[idx1];
  const fiveStar2 = sortedFive[adjustedIdx2 % sortedFive.length];

  // Pick 1 four-star review
  const idx3 = (seed * 17 + 13) % sortedFour.length;
  const fourStar = sortedFour[idx3];

  return [fiveStar1, fiveStar2, fourStar];
}

/**
 * Deterministic review count per page (340-355 range).
 */
export function getReviewCountForPage(serviceSlug: string, citySlug: string): number {
  const seed = hashCode(`count::${serviceSlug}::${citySlug}`);
  return 340 + (seed % 16);
}

/**
 * Deterministic rating per page (4.7, 4.8, or 4.9).
 */
export function getRatingForPage(serviceSlug: string, citySlug: string): number {
  const seed = hashCode(`rating::${serviceSlug}::${citySlug}`);
  const options = [4.7, 4.8, 4.9];
  return options[seed % 3];
}
