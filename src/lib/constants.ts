export const SITE = {
  name: 'Best Kitchen and Bathroom Remodeling',
  shortName: 'Best KB Remodeling',
  domain: 'kitchenandbathroomremodelingpros.com',
  url: 'https://kitchenandbathroomremodelingpros.com',
  phone: '(206) 666-4370',
  phoneRaw: '+12066664370',
  email: 'info@kitchenandbathroomremodelingpros.com',
  address: {
    street: '701 5th Ave 42nd Floor, Suite 4272',
    city: 'Seattle',
    state: 'WA',
    zip: '98104',
    full: '701 5th Ave 42nd Floor, Suite 4272, Seattle, WA 98104',
  },
  coordinates: {
    lat: 47.6050,
    lng: -122.3308,
  },
  hours: 'Available 24/7 — Call Anytime',
  yearFounded: 2010,
  description:
    "Seattle's top-rated kitchen and bathroom remodeling company. Award-winning craftsmanship, transparent pricing, and free estimates. Serving Seattle, Bellevue, Kirkland, and the greater Puget Sound area.",
  social: {
    google: 'https://g.page/kitchenandbathroomremodelingpros',
    facebook: 'https://facebook.com/kitchenandbathroomremodelingpros',
    instagram: 'https://instagram.com/kbremodelpros',
    houzz: 'https://houzz.com/pro/kbremodelpros',
    yelp: 'https://yelp.com/biz/kitchen-bathroom-remodeling-pros-seattle',
  },
  warranty: '5-Year',
  projects: 500,
  reviews: {
    count: 230,
    rating: 4.9,
  },
} as const;

export const NAV_LINKS = {
  services: {
    label: 'Services',
    href: '/services/',
    children: {
      kitchen: [
        { label: 'Kitchen Remodeling', href: '/services/kitchen-remodeling/' },
        { label: 'Cabinet Refacing', href: '/services/cabinet-refacing/' },
        { label: 'Countertop Installation', href: '/services/countertop-installation/' },
        { label: 'Kitchen Layout Design', href: '/services/kitchen-layout-design/' },
        { label: 'Custom Cabinetry', href: '/services/custom-cabinetry/' },
      ],
      bathroom: [
        { label: 'Bathroom Remodeling', href: '/services/bathroom-remodeling/' },
        { label: 'Shower Remodeling', href: '/services/shower-remodeling/' },
        { label: 'Bathtub Replacement', href: '/services/bathtub-replacement/' },
        { label: 'Vanity Installation', href: '/services/vanity-installation/' },
        { label: 'Tile Installation', href: '/services/tile-installation/' },
      ],
      general: [
        { label: 'Flooring Installation', href: '/services/flooring-installation/' },
        { label: 'Aging-in-Place', href: '/services/aging-in-place/' },
      ],
    },
  },
  areas: {
    label: 'Areas We Serve',
    href: '/areas-served/',
  },
  gallery: { label: 'Gallery', href: '/gallery/' },
  costGuides: { label: 'Cost Guides', href: '/cost-guides/' },
  blog: { label: 'Blog', href: '/blog/' },
  reviews: { label: 'Reviews', href: '/reviews/' },
  about: { label: 'About', href: '/about/' },
  faq: { label: 'FAQ', href: '/faq/' },
  contact: { label: 'Contact', href: '/contact/' },
} as const;

export const SERVICES = [
  {
    title: 'Kitchen Remodeling',
    slug: 'kitchen-remodeling',
    category: 'kitchen' as const,
    shortDescription: 'Complete kitchen transformations from layout redesign to finishing touches.',
    icon: 'kitchen',
  },
  {
    title: 'Bathroom Remodeling',
    slug: 'bathroom-remodeling',
    category: 'bathroom' as const,
    shortDescription: 'Stunning bathroom renovations that blend style with functionality.',
    icon: 'bathroom',
  },
  {
    title: 'Cabinet Refacing',
    slug: 'cabinet-refacing',
    category: 'kitchen' as const,
    shortDescription: 'Transform your cabinets for a fraction of full replacement cost.',
    icon: 'cabinets',
  },
  {
    title: 'Countertop Installation',
    slug: 'countertop-installation',
    category: 'kitchen' as const,
    shortDescription: 'Premium quartz, granite, and marble countertop installation.',
    icon: 'countertop',
  },
  {
    title: 'Tile Installation',
    slug: 'tile-installation',
    category: 'bathroom' as const,
    shortDescription: 'Expert tile work for floors, walls, backsplashes, and showers.',
    icon: 'tile',
  },
  {
    title: 'Shower Remodeling',
    slug: 'shower-remodeling',
    category: 'bathroom' as const,
    shortDescription: 'Custom walk-in showers, glass enclosures, and modern upgrades.',
    icon: 'shower',
  },
  {
    title: 'Bathtub Replacement',
    slug: 'bathtub-replacement',
    category: 'bathroom' as const,
    shortDescription: 'Freestanding, soaking, and alcove tub installation and replacement.',
    icon: 'bathtub',
  },
  {
    title: 'Vanity Installation',
    slug: 'vanity-installation',
    category: 'bathroom' as const,
    shortDescription: 'Single, double, and floating vanity installation with custom options.',
    icon: 'vanity',
  },
  {
    title: 'Kitchen Layout Design',
    slug: 'kitchen-layout-design',
    category: 'kitchen' as const,
    shortDescription: 'Optimize your kitchen flow with expert space planning and design.',
    icon: 'layout',
  },
  {
    title: 'Custom Cabinetry',
    slug: 'custom-cabinetry',
    category: 'kitchen' as const,
    shortDescription: 'Handcrafted cabinets built to your exact specifications and style.',
    icon: 'cabinets',
  },
  {
    title: 'Flooring Installation',
    slug: 'flooring-installation',
    category: 'general' as const,
    shortDescription: 'Hardwood, LVP, tile, and natural stone flooring installation.',
    icon: 'flooring',
  },
  {
    title: 'Aging-in-Place',
    slug: 'aging-in-place',
    category: 'general' as const,
    shortDescription: 'Accessible remodeling for comfort and safety at every stage of life.',
    icon: 'accessible',
  },
] as const;

export const LOCATIONS_TIER1 = [
  { city: 'Seattle', slug: 'seattle', county: 'King', population: 750000 },
  { city: 'Bellevue', slug: 'bellevue', county: 'King', population: 153000 },
  { city: 'Kirkland', slug: 'kirkland', county: 'King', population: 92000 },
  { city: 'Redmond', slug: 'redmond', county: 'King', population: 73000 },
  { city: 'Renton', slug: 'renton', county: 'King', population: 106000 },
  { city: 'Kent', slug: 'kent', county: 'King', population: 136000 },
  { city: 'Federal Way', slug: 'federal-way', county: 'King', population: 99000 },
  { city: 'Tacoma', slug: 'tacoma', county: 'Pierce', population: 220000 },
  { city: 'Everett', slug: 'everett', county: 'Snohomish', population: 112000 },
  { city: 'Sammamish', slug: 'sammamish', county: 'King', population: 65000 },
] as const;

export const LOCATIONS_TIER2 = [
  { city: 'Bothell', slug: 'bothell', county: 'King/Snohomish', population: 50000 },
  { city: 'Woodinville', slug: 'woodinville', county: 'King', population: 13000 },
  { city: 'Issaquah', slug: 'issaquah', county: 'King', population: 40000 },
  { city: 'Mercer Island', slug: 'mercer-island', county: 'King', population: 26000 },
  { city: 'Burien', slug: 'burien', county: 'King', population: 52000 },
  { city: 'Shoreline', slug: 'shoreline', county: 'King', population: 57000 },
  { city: 'Lynnwood', slug: 'lynnwood', county: 'Snohomish', population: 41000 },
  { city: 'Edmonds', slug: 'edmonds', county: 'Snohomish', population: 42000 },
  { city: 'Auburn', slug: 'auburn', county: 'King', population: 87000 },
  { city: 'Puyallup', slug: 'puyallup', county: 'Pierce', population: 43000 },
  { city: 'Kenmore', slug: 'kenmore', county: 'King', population: 23000 },
  { city: 'Lake Forest Park', slug: 'lake-forest-park', county: 'King', population: 13500 },
  { city: 'Mountlake Terrace', slug: 'mountlake-terrace', county: 'Snohomish', population: 21000 },
  { city: 'Mukilteo', slug: 'mukilteo', county: 'Snohomish', population: 21000 },
  { city: 'Mill Creek', slug: 'mill-creek', county: 'Snohomish', population: 20000 },
  { city: 'Maple Valley', slug: 'maple-valley', county: 'King', population: 28000 },
  { city: 'Covington', slug: 'covington', county: 'King', population: 22000 },
  { city: 'Newcastle', slug: 'newcastle', county: 'King', population: 13000 },
] as const;

export const ALL_LOCATIONS = [...LOCATIONS_TIER1, ...LOCATIONS_TIER2];

export const COMBO_SERVICES = ['kitchen-remodeling', 'bathroom-remodeling'] as const;
