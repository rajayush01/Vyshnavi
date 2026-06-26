// ============================================================
//  VYSHNAVI DAIRY PRODUCTS — Single Source of Truth
//  All components should import from this file.
// ============================================================

// --------------- TYPE DEFINITIONS ---------------

export interface ProductVariant {
  size: string;
  price?: number;
  perUnit?: string; // e.g. "₹2090/L"
  discount?: string;
  originalPrice?: number;
  packType?: string; // "jar" | "pouch" | "bucket" | "glass" | "cup"
}

export interface ProductItem {
  id: number;
  name: string;
  /** Primary display image — import and pass at usage site */
  image: string;
  description: string;        // short tagline, used in Portfolio hero
  content: string;            // body copy for detail panel
  variants: ProductVariant[];
  gallery: string[];          // additional images (import at usage site)
  tag?: "Best Seller" | "New Launch";
  rating?: number;
  reviews?: number;
}

export interface ProductCategory {
  key: string;
  name: string;
  /** Tailwind background colour for DairyProductShowcase cards */
  color: string;
  /** Accent hex used in HorizontalProductScroll tag badges */
  accentHex: string;
  tagline: string;
  subtitle: string;
  items: ProductItem[];
}

// --------------- PLACEHOLDER IMAGE HELPER ---------------
// Replace these with real `import` statements in the consuming component.
// We use empty strings here so TypeScript is happy; the consuming file
// re-exports a version with real images injected.
const PH = "";   // placeholder

// --------------- CATEGORY DATA ---------------

export const CATEGORIES: ProductCategory[] = [
  // ── MILK ─────────────────────────────────────────────────
  {
    key: "milk",
    name: "Milk",
    color: "bg-blue-50",
    accentHex: "#1d4ed8",
    tagline: "PURE & NATURAL",
    subtitle: "FARM FRESH DAILY",
    items: [
      {
        id: 101,
        name: "Mahagold Milk",
        image: PH,
        description: "Premium full-cream",
        content:
          "Mahagold is our flagship full-cream milk, rich in natural fat and brimming with farm-fresh flavour. Sourced from hand-selected herds and chilled within hours of milking.",
        variants: [{ size: "500 ml", packType: "pouch" }],
        gallery: [],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 312,
      },
      {
        id: 102,
        name: "Super Gold Milk",
        image: PH,
        description: "Superior standardised",
        content:
          "Standardised to consistent fat levels so every sip delivers the same creamy taste your family depends on. Perfect for tea, coffee, and everyday cooking.",
        variants: [{ size: "500 ml", packType: "pouch" }],
        gallery: [],
        rating: 4.8,
        reviews: 198,
      },
      {
        id: 103,
        name: "Gold Plus Milk",
        image: PH,
        description: "Bite-sized & wholesome",
        content:
          "Available in handy 125 ml and 500 ml packs, Gold Plus is ideal for on-the-go freshness without compromising on nutrition.",
        variants: [
          { size: "125 ml", packType: "pouch" },
          { size: "500 ml", packType: "pouch" },
        ],
        gallery: [],
      },
      {
        id: 104,
        name: "Gold Milk",
        image: PH,
        description: "Everyday goodness",
        content:
          "A trusted household staple with balanced fat content and a naturally sweet flavour profile. Gold Milk is the everyday choice for millions of families.",
        variants: [{ size: "500 ml", packType: "pouch" }],
        gallery: [],
      },
      {
        id: 105,
        name: "Standardised Milk",
        image: PH,
        description: "Consistent, reliable",
        content:
          "Standardised for uniform fat and SNF levels. Available in two pack sizes to suit both small households and larger families.",
        variants: [
          { size: "500 ml", packType: "pouch" },
          { size: "1000 ml", packType: "pouch" },
        ],
        gallery: [],
      },
      {
        id: 106,
        name: "Toned Taaza Milk",
        image: PH,
        description: "Light & refreshing",
        content:
          "Toned for a lighter feel while retaining full nutritional value. Taaza is the go-to choice for health-conscious households who want freshness without heaviness.",
        variants: [
          { size: "145 ml", packType: "pouch" },
          { size: "500 ml", packType: "pouch" },
          { size: "1000 ml", packType: "pouch" },
        ],
        gallery: [],
      },
      {
        id: 107,
        name: "Active Toned Milk",
        image: PH,
        description: "Fuel your day",
        content:
          "Fortified toned milk designed for active lifestyles. Lower fat, same great taste — the smart choice before or after your workout.",
        variants: [{ size: "500 ml", packType: "pouch" }],
        gallery: [],
      },
      {
        id: 108,
        name: "Double Toned Milk",
        image: PH,
        description: "Lightest of all",
        content:
          "Double-toned for the lowest fat content in our milk range. Ideal for calorie-watchers and those on medically advised low-fat diets.",
        variants: [
          { size: "165 ml", packType: "pouch" },
          { size: "450 ml", packType: "pouch" },
        ],
        gallery: [],
      },
      {
        id: 109,
        name: "Cow Milk",
        image: PH,
        description: "Straight from the cow",
        content:
          "Pure, unadulterated cow milk with its characteristic golden tinge and naturally occurring A2 proteins. Closest to what leaves the udder.",
        variants: [
          { size: "140 ml", packType: "pouch" },
          { size: "500 ml", packType: "pouch" },
        ],
        gallery: [],
        tag: "New Launch",
      },
    ],
  },

  // ── CURD ─────────────────────────────────────────────────
  {
    key: "curd",
    name: "Curd",
    color: "bg-green-50",
    accentHex: "#15803d",
    tagline: "CREAMY & PROBIOTIC",
    subtitle: "SET FRESH DAILY",
    items: [
      {
        id: 201,
        name: "Toned Milk Curd",
        image: PH,
        description: "Live-culture classic",
        content:
          "Set fresh every morning from our own toned milk. Rich in live probiotics, it supports gut health and makes the creamiest lassi or raita.",
        variants: [
          { size: "80 g", packType: "pouch" },
          { size: "120 g", packType: "pouch" },
          { size: "170 g", packType: "pouch" },
          { size: "100 g", packType: "cup" },
          { size: "450 g", packType: "pouch" },
          { size: "900 g", packType: "pouch" },
          { size: "1 kg", packType: "bucket" },
          { size: "5 kg", packType: "bucket" },
          { size: "10 kg", packType: "bucket" },
        ],
        gallery: [],
        tag: "Best Seller",
        rating: 4.8,
        reviews: 540,
      },
      {
        id: 202,
        name: "Double Toned Curd",
        image: PH,
        description: "Light & tangy",
        content:
          "All the probiotic benefit of our classic curd, made from double-toned milk for a lighter texture and lower calorie count. Perfect for diet-conscious families.",
        variants: [
          { size: "450 g", packType: "pouch" },
          { size: "900 g", packType: "pouch" },
          { size: "5 kg", packType: "bucket" },
          { size: "10 kg", packType: "bucket" },
        ],
        gallery: [],
      },
      {
        id: 203,
        name: "Standardised Curd",
        image: PH,
        description: "Thick & wholesome",
        content:
          "Set from standardised milk for a consistently rich texture. A reliable staple for everyday meals — thick enough to cut with a spoon.",
        variants: [{ size: "Multiple sizes", packType: "bucket" }],
        gallery: [],
      },
    ],
  },

  // ── BEVERAGES ────────────────────────────────────────────
  {
    key: "beverages",
    name: "Beverages",
    color: "bg-purple-50",
    accentHex: "#7e22ce",
    tagline: "REFRESHING & NATURAL",
    subtitle: "SIPPED SINCE DAWN",
    items: [
      {
        id: 301,
        name: "Buttermilk",
        image: PH,
        description: "Cooling classic",
        content:
          "Traditionally churned and lightly spiced, our buttermilk is the ultimate summer cooler. Packed with electrolytes and live cultures to refresh and restore.",
        variants: [{ size: "180 ml", packType: "pouch" }],
        gallery: [],
        tag: "Best Seller",
        rating: 4.7,
        reviews: 280,
      },
      {
        id: 302,
        name: "Vanilla Lassi",
        image: PH,
        description: "Sweet & dreamy",
        content:
          "Thick, cold, and sweetened with real vanilla. Our Vanilla Lassi is a dessert disguised as a drink — perfect with or after a meal.",
        variants: [
          { size: "180 ml", packType: "pouch" },
          { size: "200 ml", packType: "glass" },
        ],
        gallery: [],
      },
      {
        id: 303,
        name: "Mango Lassi",
        image: PH,
        description: "Tropical delight",
        content:
          "Made with Alphonso mango pulp blended into thick curd. A seasonal favourite that's available year-round thanks to our cold-chain technology.",
        variants: [{ size: "200 ml", packType: "glass" }],
        gallery: [],
        tag: "New Launch",
      },
      {
        id: 304,
        name: "Special Badam Milk",
        image: PH,
        description: "Nutty & nourishing",
        content:
          "Premium Badam Milk enriched with saffron and cardamom. Each bottle is a traditional recipe made modern — indulgent, yet wholesome.",
        variants: [{ size: "200 ml", packType: "glass" }],
        gallery: [],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 175,
      },
      {
        id: 305,
        name: "Badam Milk",
        image: PH,
        description: "Everyday almond boost",
        content:
          "Classic almond-flavoured milk with real almond pieces. An everyday energy boost that children and adults love equally.",
        variants: [{ size: "200 ml", packType: "glass" }],
        gallery: [],
      },
      {
        id: 306,
        name: "Chocolate Milk",
        image: PH,
        description: "Rich cocoa pleasure",
        content:
          "Real cocoa blended with fresh whole milk. No artificial colours, no synthetic flavours — just pure chocolate bliss in a bottle.",
        variants: [{ size: "200 ml", packType: "glass" }],
        gallery: [],
      },
      {
        id: 307,
        name: "Pineapple Milk",
        image: PH,
        description: "Tropical freshness",
        content:
          "A unique tropical twist — pineapple essence meets the creaminess of fresh milk. Surprising, refreshing, and unmistakably Vyshnavi.",
        variants: [{ size: "200 ml", packType: "glass" }],
        gallery: [],
      },
      {
        id: 308,
        name: "Pista Milk",
        image: PH,
        description: "Luxuriously green",
        content:
          "Pistachio-flavoured milk with a distinctly rich and nutty character. A premium pick for those who appreciate the finer flavours of dairy.",
        variants: [{ size: "200 ml", packType: "glass" }],
        gallery: [],
      },
    ],
  },

  // ── PANEER ───────────────────────────────────────────────
  {
    key: "paneer",
    name: "Paneer",
    color: "bg-orange-50",
    accentHex: "#c2410c",
    tagline: "FRESH & SOFT",
    subtitle: "PRESSED TO PERFECTION",
    items: [
      {
        id: 401,
        name: "Malai Paneer",
        image: PH,
        description: "Velvety & rich",
        content:
          "Full-fat malai paneer pressed from fresh whole milk. Holds shape during cooking, soaks up masalas beautifully, and melts in the mouth. The chef's first choice.",
        variants: [
          { size: "200 g" },
          { size: "500 g" },
          { size: "1000 g" },
        ],
        gallery: [],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 412,
      },
      {
        id: 402,
        name: "Low Fat Paneer",
        image: PH,
        description: "Guilt-free protein",
        content:
          "All the protein of traditional paneer, at a fraction of the fat. Made from toned milk and cold-pressed for a firm, satisfying texture.",
        variants: [
          { size: "200 g" },
          { size: "1000 g" },
        ],
        gallery: [],
        tag: "New Launch",
      },
    ],
  },

  // ── BUTTER ───────────────────────────────────────────────
  {
    key: "butter",
    name: "Butter",
    color: "bg-yellow-50",
    accentHex: "#a16207",
    tagline: "CHURNED TO GOLD",
    subtitle: "TRADITIONAL MAKHAN",
    items: [
      {
        id: 501,
        name: "Butter 200 g",
        image: PH,
        description: "Table-ready gold",
        content:
          "Slow-churned from fresh cream. Spreads effortlessly straight from the fridge and brings a rich, grassy flavour to everything from toast to tadka.",
        variants: [{ size: "200 g" }],
        gallery: [],
        tag: "Best Seller",
        rating: 4.8,
        reviews: 320,
      },
      {
        id: 502,
        name: "Butter 500 g",
        image: PH,
        description: "Baker's favourite",
        content:
          "The go-to for avid bakers and professional kitchens. 500 g of the same premium churned butter in a value pack that lasts.",
        variants: [{ size: "500 g" }],
        gallery: [],
      },
    ],
  },

  // ── GHEE ─────────────────────────────────────────────────
  {
    key: "ghee",
    name: "Ghee",
    color: "bg-amber-50",
    accentHex: "#b45309",
    tagline: "LIQUID GOLD",
    subtitle: "BILONA CHURNED",
    items: [
      {
        id: 601,
        name: "Cow Ghee",
        image: PH,
        description: "A2-rich clarity",
        content:
          "Made from the milk of indigenous desi cows via the traditional bilona method. Rich in A2 beta-casein proteins, butyric acid, and a divine aroma that fills the kitchen.",
        variants: [
          { size: "12 ml", packType: "pouch" },
          { size: "50 ml", packType: "jar" },
          { size: "100 ml", packType: "jar" },
          { size: "200 ml", packType: "jar" },
          { size: "500 ml", packType: "jar" },
          { size: "1000 ml", packType: "jar" },
        ],
        gallery: [],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 876,
      },
      {
        id: 602,
        name: "Buffalo Ghee",
        image: PH,
        description: "Bold & buttery",
        content:
          "Crafted from buffalo cream, this ghee has a higher fat content and a deeply rich, nutty aroma. Ideal for festive cooking and traditional sweets.",
        variants: [
          { size: "200 ml", packType: "jar" },
          { size: "500 ml", packType: "jar" },
          { size: "1000 ml", packType: "jar" },
        ],
        gallery: [],
      },
      {
        id: 603,
        name: "Special Ghee",
        image: PH,
        description: "Signature blend",
        content:
          "Our master blenders' finest — a curated mix of cow and buffalo ghee for a balanced flavour profile that elevates both everyday meals and festive preparations.",
        variants: [
          { size: "12 ml", packType: "pouch" },
          { size: "50 ml", packType: "jar" },
          { size: "100 ml", packType: "jar" },
          { size: "200 ml", packType: "jar" },
          { size: "500 ml", packType: "jar" },
          { size: "1000 ml", packType: "jar" },
        ],
        gallery: [],
        tag: "New Launch",
      },
    ],
  },

  // ── SWEETS ───────────────────────────────────────────────
  {
    key: "sweets",
    name: "Sweets",
    color: "bg-pink-50",
    accentHex: "#be185d",
    tagline: "HANDCRAFTED MITHAIS",
    subtitle: "MADE WITH LOVE",
    items: [
      {
        id: 701,
        name: "Basundi",
        image: PH,
        description: "Slow-simmered silk",
        content:
          "Rich condensed milk dessert simmered for hours with saffron, cardamom, and crushed nuts. A festive classic, made fresh every batch — never from concentrate.",
        variants: [{ size: "250 g" }, { size: "500 g" }],
        gallery: [],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 203,
      },
      {
        id: 702,
        name: "Khova",
        image: PH,
        description: "Mawa magic",
        content:
          "Pure evaporated milk solids, traditionally called mawa. The building block of Indian sweets — used in halwa, barfis, and gulab jamun. Fresh, never frozen.",
        variants: [{ size: "200 g" }, { size: "500 g" }],
        gallery: [],
      },
      {
        id: 703,
        name: "Doodh Peda",
        image: PH,
        description: "Melt-in-mouth rounds",
        content:
          "Soft, cardamom-scented milk pedas made from fresh khova. Each piece is hand-shaped and lightly dusted with pistachio for a celebratory finish.",
        variants: [{ size: "250 g" }, { size: "500 g" }],
        gallery: [],
      },
      {
        id: 704,
        name: "Ajmeri Kalakand",
        image: PH,
        description: "Grainy & indulgent",
        content:
          "The iconic Ajmeri-style kalakand with a distinctive coarse-grained texture. Made from fresh chhena and cooked down with sugar and rose water until perfectly set.",
        variants: [{ size: "250 g" }, { size: "500 g" }],
        gallery: [],
        tag: "New Launch",
      },
    ],
  },
];

// --------------- LOOKUP HELPERS ---------------

/** Get a category by its key */
export const getCategoryByKey = (key: string): ProductCategory | undefined =>
  CATEGORIES.find((c) => c.key === key);

/** Get a flat list of all products across all categories */
export const getAllProducts = (): ProductItem[] =>
  CATEGORIES.flatMap((c) => c.items);

/** Get a product by its id */
export const getProductById = (id: number): ProductItem | undefined =>
  getAllProducts().find((p) => p.id === id);

// --------------- CATEGORY META (for nav / tabs) ---------------

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.name])
);