// ─── Color Palette Types & Data ───────────────────────────────────────────────
export type PaletteCategory = 'all' | 'warm' | 'cool' | 'neutral' | 'seasonal' | 'earthy';

export type ColorPalette = {
  id: string;
  name: string;
  category: Exclude<PaletteCategory, 'all'>;
  colors: string[];
  tags: string[];
  description: string;
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: '1',
    name: 'Autumn Harvest',
    category: 'warm',
    colors: ['#8B4513', '#CD5C5C', '#D2691E', '#F4A460', '#FFDEAD'],
    tags: ['autumn', 'earthy', 'warm'],
    description: 'Rich earthy tones inspired by the autumn harvest season. Perfect for knitwear and outerwear collections.',
  },
  {
    id: '2',
    name: 'Ocean Breeze',
    category: 'cool',
    colors: ['#0A3D62', '#1A6B8A', '#2980B9', '#74B9FF', '#DFF6FF'],
    tags: ['ocean', 'marine', 'cool'],
    description: 'Calming blue tones from deep ocean to light sea foam. Ideal for summer textile ranges.',
  },
  {
    id: '3',
    name: 'Spring Blossom',
    category: 'seasonal',
    colors: ['#FF758C', '#FF7EB3', '#FFA1C9', '#FFD1DC', '#FFF0F5'],
    tags: ['spring', 'floral', 'pastel'],
    description: 'Delicate pink hues inspired by spring cherry blossoms. Great for lingerie and light dresses.',
  },
  {
    id: '4',
    name: 'Forest Canopy',
    category: 'earthy',
    colors: ['#1B4332', '#2D6A4F', '#40916C', '#74C69D', '#B7E4C7'],
    tags: ['nature', 'forest', 'green'],
    description: 'Deep forest greens from dark canopy to fresh leaves. Ideal for eco-conscious collections.',
  },
  {
    id: '5',
    name: 'Desert Sand',
    category: 'neutral',
    colors: ['#7F5539', '#9C6644', '#B08968', '#DDB892', '#E9C46A'],
    tags: ['desert', 'neutral', 'warm'],
    description: 'Sandy neutrals evoking vast desert landscapes. Timeless versatility for any wardrobe.',
  },
  {
    id: '6',
    name: 'Royal Indigo',
    category: 'cool',
    colors: ['#1A0533', '#4A1E8F', '#7C3AED', '#A78BFA', '#DDD6FE'],
    tags: ['luxury', 'royal', 'purple'],
    description: 'Majestic purples from deep violet to soft lavender. Excellent for evening and luxury wear.',
  },
  {
    id: '7',
    name: 'Sunrise Glow',
    category: 'warm',
    colors: ['#E63946', '#F4721E', '#F7A531', '#FBBF24', '#FEF3C7'],
    tags: ['sunrise', 'vibrant', 'warm'],
    description: 'Fiery sunrise colors. Perfect for statement pieces and bold seasonal collections.',
  },
  {
    id: '8',
    name: 'Winter Frost',
    category: 'seasonal',
    colors: ['#2D3561', '#4361EE', '#4CC9F0', '#ADE8F4', '#E0FBFC'],
    tags: ['winter', 'icy', 'cool'],
    description: 'Cool icy blues perfect for winter textile collections and cold-weather accessories.',
  },
  {
    id: '9',
    name: 'Terracotta Dreams',
    category: 'earthy',
    colors: ['#6B2D0E', '#C1440E', '#E07B54', '#F4A27F', '#FDE5D6'],
    tags: ['terracotta', 'clay', 'earthy'],
    description: 'Clay-inspired terracotta palette. A must for bohemian and artisan textile designs.',
  },
  {
    id: '10',
    name: 'Sage & Stone',
    category: 'neutral',
    colors: ['#4A5568', '#718096', '#9CA3AF', '#D1D5DB', '#F9FAFB'],
    tags: ['sage', 'minimal', 'neutral'],
    description: 'Understated grey-green tones for timeless minimalist fashion collections.',
  },
];

// ─── Fabric Types & Data ──────────────────────────────────────────────────────
export type FabricCategory = 'all' | 'natural' | 'synthetic' | 'blended' | 'technical';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Fabric = {
  id: string;
  name: string;
  category: Exclude<FabricCategory, 'all'>;
  fiber: string;
  weave: string;
  weight: string;
  properties: string[];
  care: string[];
  uses: string[];
  emoji: string;
  description: string;
  difficulty: Difficulty;
  color: string;
};

export const FABRICS: Fabric[] = [
  {
    id: '1',
    name: 'Cotton',
    category: 'natural',
    fiber: 'Cellulose (plant)',
    weave: 'Plain / Twill',
    weight: 'Light to Heavy',
    properties: ['Breathable', 'Absorbent', 'Soft', 'Hypoallergenic'],
    care: ['Machine wash 30–60°C', 'Tumble dry low', 'Iron medium heat'],
    uses: ['T-shirts', 'Denim', 'Bed linen', 'Towels'],
    emoji: '🌿',
    description: 'The most widely used natural textile fiber. Soft, durable, and versatile for everyday wear and lifestyle applications.',
    difficulty: 'beginner',
    color: '#4CAF50',
  },
  {
    id: '2',
    name: 'Silk',
    category: 'natural',
    fiber: 'Protein (animal)',
    weave: 'Satin / Plain',
    weight: 'Light',
    properties: ['Lustrous', 'Strong', 'Temperature regulating', 'Smooth'],
    care: ['Hand wash cold', 'Dry clean preferred', 'Iron low heat'],
    uses: ['Evening wear', 'Scarves', 'Ties', 'Lingerie'],
    emoji: '✨',
    description: 'Prized for its natural sheen and smooth texture. One of the oldest and most luxurious textile fibers known to humankind.',
    difficulty: 'advanced',
    color: '#E91E63',
  },
  {
    id: '3',
    name: 'Wool',
    category: 'natural',
    fiber: 'Protein (animal)',
    weave: 'Twill / Plain',
    weight: 'Medium to Heavy',
    properties: ['Warm', 'Moisture-wicking', 'Fire resistant', 'Elastic'],
    care: ['Hand wash cold', 'Dry flat', 'Do not tumble dry'],
    uses: ['Coats', 'Sweaters', 'Blankets', 'Suits'],
    emoji: '🐑',
    description: 'Natural insulating fiber shorn from sheep. Exceptional warmth and moisture management for cold-weather garments.',
    difficulty: 'intermediate',
    color: '#795548',
  },
  {
    id: '4',
    name: 'Linen',
    category: 'natural',
    fiber: 'Cellulose (plant)',
    weave: 'Plain',
    weight: 'Light to Medium',
    properties: ['Highly breathable', 'Gets softer with age', 'Antibacterial', 'Eco-friendly'],
    care: ['Machine wash 40°C', 'Tumble dry low', 'Iron while damp'],
    uses: ['Shirts', 'Dresses', 'Table linen', 'Curtains'],
    emoji: '🌾',
    description: 'Made from flax plant fibers. One of the oldest fabrics, prized for summer wear and home textiles.',
    difficulty: 'beginner',
    color: '#D4A017',
  },
  {
    id: '5',
    name: 'Polyester',
    category: 'synthetic',
    fiber: 'Synthetic polymer',
    weave: 'Various',
    weight: 'Light to Heavy',
    properties: ['Wrinkle-resistant', 'Quick-dry', 'Durable', 'Color-fast'],
    care: ['Machine wash 30°C', 'Tumble dry low', 'Do not bleach'],
    uses: ['Sportswear', 'Outerwear', 'Upholstery', 'Fleece'],
    emoji: '🔬',
    description: 'Most used synthetic fabric globally. Excellent durability and easy care properties across applications.',
    difficulty: 'beginner',
    color: '#2196F3',
  },
  {
    id: '6',
    name: 'Nylon',
    category: 'synthetic',
    fiber: 'Polyamide',
    weave: 'Various',
    weight: 'Light to Medium',
    properties: ['Strong', 'Elastic', 'Abrasion-resistant', 'Quick-dry'],
    care: ['Machine wash 30°C', 'Hang dry', 'Low iron'],
    uses: ['Stockings', 'Sportswear', 'Bags', 'Parachutes'],
    emoji: '💪',
    description: 'First fully synthetic fiber. Known for outstanding strength and elasticity in demanding applications.',
    difficulty: 'beginner',
    color: '#9C27B0',
  },
  {
    id: '7',
    name: 'Denim',
    category: 'blended',
    fiber: 'Cotton / Cotton-Poly',
    weave: 'Twill (diagonal)',
    weight: 'Heavy',
    properties: ['Durable', 'Fades beautifully', 'Stiff initially', 'Versatile'],
    care: ['Wash inside out 30°C', 'Hang dry', 'Wash infrequently'],
    uses: ['Jeans', 'Jackets', 'Shirts', 'Bags'],
    emoji: '👖',
    description: 'Iconic twill-woven fabric with indigo dye. Becomes more characterful and unique with age and wear.',
    difficulty: 'intermediate',
    color: '#1565C0',
  },
  {
    id: '8',
    name: 'Modal',
    category: 'blended',
    fiber: 'Semi-synthetic (beech)',
    weave: 'Various',
    weight: 'Light to Medium',
    properties: ['Ultra-soft', 'Breathable', 'Color retentive', 'Eco-friendly'],
    care: ['Machine wash 40°C', 'Tumble dry low', 'Iron medium'],
    uses: ['Underwear', 'Loungewear', 'T-shirts', 'Bedding'],
    emoji: '🌳',
    description: 'Bio-based fiber from beech trees. Silkier than cotton with excellent drape and sustainable credentials.',
    difficulty: 'beginner',
    color: '#388E3C',
  },
  {
    id: '9',
    name: 'Gore-Tex',
    category: 'technical',
    fiber: 'ePTFE membrane + fabric',
    weave: 'Laminate',
    weight: 'Medium',
    properties: ['Waterproof', 'Windproof', 'Breathable', 'Lightweight'],
    care: ['Machine wash 40°C', 'Tumble dry medium', 'Re-treat DWR'],
    uses: ['Outdoor jackets', 'Hiking boots', 'Ski wear', 'Gloves'],
    emoji: '🏔️',
    description: 'Revolutionary technical membrane that keeps rain out while releasing body moisture. The gold standard for outdoor textiles.',
    difficulty: 'advanced',
    color: '#607D8B',
  },
  {
    id: '10',
    name: 'Velvet',
    category: 'blended',
    fiber: 'Silk / Cotton / Synthetic',
    weave: 'Cut pile',
    weight: 'Medium to Heavy',
    properties: ['Luxurious texture', 'Rich color depth', 'Soft', 'Drapes beautifully'],
    care: ['Dry clean only', 'Steam to revive', 'Store hanging'],
    uses: ['Evening wear', 'Curtains', 'Upholstery', 'Accessories'],
    emoji: '👑',
    description: 'Woven tufted fabric with a short dense pile. Renowned for its extraordinary depth of color and tactile softness.',
    difficulty: 'advanced',
    color: '#7B1FA2',
  },
];

// ─── Pattern Types & Data ─────────────────────────────────────────────────────
export type PatternCategory = 'all' | 'geometric' | 'floral' | 'abstract' | 'traditional' | 'modern';

export type Pattern = {
  id: string;
  name: string;
  category: Exclude<PatternCategory, 'all'>;
  origin: string;
  difficulty: Difficulty;
  colors: string[];
  description: string;
  emoji: string;
  uses: string[];
};

export const PATTERNS: Pattern[] = [
  {
    id: '1',
    name: 'Houndstooth',
    category: 'geometric',
    origin: 'Scotland',
    difficulty: 'intermediate',
    colors: ['#2C2C2C', '#F5F5F5'],
    description: 'Classic duotone broken check pattern with distinctive pointed four-pointed shapes. A timeless staple.',
    emoji: '◼◻',
    uses: ['Blazers', 'Trousers', 'Scarves', 'Caps'],
  },
  {
    id: '2',
    name: 'Paisley',
    category: 'traditional',
    origin: 'Persia / Scotland',
    difficulty: 'advanced',
    colors: ['#8B008B', '#DAA520', '#2F4F4F'],
    description: 'Droplet-shaped curved motif with intricate floral interior. A centuries-old symbol of wealth and status.',
    emoji: '🌀',
    uses: ['Neckties', 'Scarves', 'Wallpaper', 'Saris'],
  },
  {
    id: '3',
    name: 'Ikat',
    category: 'traditional',
    origin: 'Central Asia / SE Asia',
    difficulty: 'advanced',
    colors: ['#C0392B', '#F39C12', '#2980B9', '#27AE60'],
    description: 'Resist-dyeing technique applied to yarn before weaving, creating characteristic blurred geometric designs.',
    emoji: '🎨',
    uses: ['Dresses', 'Home textiles', 'Bags', 'Cushions'],
  },
  {
    id: '4',
    name: 'Chevron',
    category: 'geometric',
    origin: 'Universal',
    difficulty: 'beginner',
    colors: ['#E74C3C', '#ECF0F1'],
    description: 'Continuous V-shaped zigzag pattern. Bold, versatile, and easily adaptable to any colour scheme.',
    emoji: '🔺',
    uses: ['Activewear', 'Accessories', 'Home textiles', 'Jerseys'],
  },
  {
    id: '5',
    name: 'Batik',
    category: 'traditional',
    origin: 'Indonesia / Java',
    difficulty: 'advanced',
    colors: ['#4A0E0E', '#B5451B', '#E8C28C', '#1B4E3B'],
    description: 'Wax-resist dyeing technique applied to cloth, producing intricate and unique organic patterns.',
    emoji: '🏺',
    uses: ['Sarongs', 'Shirts', 'Dresses', 'Scarves'],
  },
  {
    id: '6',
    name: 'Tartan',
    category: 'traditional',
    origin: 'Scotland',
    difficulty: 'intermediate',
    colors: ['#2E4A1A', '#A83232', '#1E3A5F', '#F2F2F2'],
    description: 'Crisscrossed horizontal and vertical colour bands woven into fabric. Each clan has its own unique pattern.',
    emoji: '🏴',
    uses: ['Kilts', 'Blankets', 'Shirts', 'Accessories'],
  },
  {
    id: '7',
    name: 'Damask',
    category: 'floral',
    origin: 'Damascus, Syria',
    difficulty: 'advanced',
    colors: ['#8B0000', '#FFD700'],
    description: 'Reversible figured fabric with contrasting woven patterns, typically elaborate floral and foliage motifs.',
    emoji: '🌹',
    uses: ['Table linen', 'Upholstery', 'Curtains', 'Formal wear'],
  },
  {
    id: '8',
    name: 'Polka Dot',
    category: 'geometric',
    origin: 'Europe (19th C)',
    difficulty: 'beginner',
    colors: ['#FFFFFF', '#E74C3C'],
    description: 'Regular array of filled circles on a contrasting background. Playful, cheerful, and eternally fashionable.',
    emoji: '⚪',
    uses: ["Children's wear", 'Summer dresses', 'Accessories', 'Swimwear'],
  },
  {
    id: '9',
    name: 'Tie-Dye',
    category: 'abstract',
    origin: 'Multiple cultures',
    difficulty: 'beginner',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    description: 'Resist-dyeing by twisting, folding, or compressing cloth before dyeing. Every piece is completely unique.',
    emoji: '🌈',
    uses: ['T-shirts', 'Dresses', 'Scarves', 'Socks'],
  },
  {
    id: '10',
    name: 'Abstract Geo',
    category: 'modern',
    origin: 'Contemporary',
    difficulty: 'intermediate',
    colors: ['#2C3E50', '#E74C3C', '#F1C40F', '#ECF0F1'],
    description: 'Bold modern shapes and asymmetric geometric compositions driven by contemporary fashion aesthetics.',
    emoji: '◻',
    uses: ['Fashion', 'Sportswear', 'Home textiles', 'Art pieces'],
  },
  {
    id: '11',
    name: 'Floral Garden',
    category: 'floral',
    origin: 'Universal',
    difficulty: 'intermediate',
    colors: ['#FF79A8', '#7BC67E', '#FFD93D', '#6BCFDC', '#FFF5E4'],
    description: 'Naturalistic flower and leaf motifs scattered across fabric. A perennial favourite across all seasons.',
    emoji: '🌸',
    uses: ['Summer dresses', 'Curtains', 'Upholstery', 'Bags'],
  },
  {
    id: '12',
    name: 'Kente',
    category: 'traditional',
    origin: 'Ghana, West Africa',
    difficulty: 'advanced',
    colors: ['#FFD700', '#006400', '#8B0000', '#000000', '#FFFFFF'],
    description: 'Vibrant hand-woven cloth with deeply symbolic geometric patterns. Each colour carries specific cultural meaning.',
    emoji: '🌍',
    uses: ['Ceremonial wear', 'Sashes', 'Accessories', 'Art'],
  },
];

// ─── Textile Tips ─────────────────────────────────────────────────────────────
export type Tip = {
  id: string;
  title: string;
  content: string;
  category: string;
  emoji: string;
  readTime: string;
};

export const TEXTILE_TIPS: Tip[] = [
  {
    id: '1',
    title: 'Colour Wheel Fundamentals',
    content: 'The colour wheel is your best design tool. Complementary colours sit opposite each other and create dynamic contrast. Analogous colours sit side by side for harmonious, calming palettes.',
    category: 'Colour Theory',
    emoji: '🎨',
    readTime: '3 min',
  },
  {
    id: '2',
    title: 'Thread Count Explained',
    content: 'Thread count measures the number of threads per square inch in woven fabric. Higher count (400–800) generally means softer, smoother fabric. For cotton bed sheets, 300–500 is the sweet spot for quality and value.',
    category: 'Fabric Knowledge',
    emoji: '🔢',
    readTime: '2 min',
  },
  {
    id: '3',
    title: 'Warp vs Weft',
    content: 'Warp threads run vertically on the loom (lengthwise grain) and weft threads run horizontally (crosswise grain). The way these interlace determines the fabric structure. This is one of the most fundamental concepts in textile construction.',
    category: 'Weaving Basics',
    emoji: '🧵',
    readTime: '4 min',
  },
  {
    id: '4',
    title: 'Sustainable Fabric Choices',
    content: 'Organic cotton, Tencel/Lyocell, hemp, and recycled polyester are leading eco-friendly options. Consider the full lifecycle: fibre sourcing, dyeing chemistry, and end-of-life recyclability when choosing sustainable textiles.',
    category: 'Sustainability',
    emoji: '🌍',
    readTime: '5 min',
  },
  {
    id: '5',
    title: 'Understanding Selvedge',
    content: 'The selvedge (or selvage) is the self-finished edge of the fabric that prevents unravelling. It runs parallel to the warp and indicates the straight grain. Always align pattern pieces with the grain for correct drape.',
    category: 'Fabric Basics',
    emoji: '📏',
    readTime: '2 min',
  },
];
