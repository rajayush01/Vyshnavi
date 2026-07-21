// ============================================================
//  VYSHNAVI DAIRY PRODUCTS — Single Source of Truth
//  All components import images + data from HERE. No local
//  IMAGE_MAP dictionaries anywhere else.
// ============================================================



import cowghee200ml1 from "../assets/Cow ghee/Cow ghee/200 ml/Copy of 1.png";
import cowghee200ml2 from "../assets/Cow ghee/Cow ghee/200 ml/Copy of 2.png";
import cowghee200ml3 from "../assets/Cow ghee/Cow ghee/200 ml/Copy of 3.png";
import cowghee200ml4 from "../assets/Cow ghee/Cow ghee/200 ml/Copy of 4.png";
import cowghee200ml5 from "../assets/Cow ghee/Cow ghee/200 ml/Copy of 5.png";
// --------------- TYPE DEFINITIONS ---------------

export interface ProductVariant {
  size: string;
  price?: number;
  perUnit?: string;
  discount?: string;
  originalPrice?: number;
  packType?: string;
  images?: string[];
}

export interface ProductItem {
  id: number;
  name: string;
  image: string;
  description: string;
  content: string;
  variants: ProductVariant[];
  gallery: string[];
  tag?: "Best Seller" | "New Launch";
  rating?: number;
  reviews?: number;
}

export interface ProductCategory {
  key: string;
  name: string;
  color: string;
  accentHex: string;
  tagline: string;
  subtitle: string;
  items: ProductItem[];
}

const PH = ""; // still used for products with genuinely no asset yet

// --------------- CATEGORY DATA ---------------

export const CATEGORIES: ProductCategory[] = [
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
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MGM1.png",
        description: "Premium full-cream",
        content:
          "Mahagold is our flagship full-cream milk, rich in natural fat and brimming with farm-fresh flavour. Sourced from hand-selected herds and chilled within hours of milking.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MGM1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MGM2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MGM3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MGM4.png"],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 312,
      },
      // {
      //   id: 102,
      //   name: "Super Gold Milk",
      //   image: PH,
      //   description: "Superior standardised",
      //   content:
      //     "Standardised to consistent fat levels so every sip delivers the same creamy taste your family depends on. Perfect for tea, coffee, and everyday cooking.",
      //   variants: [{ size: "500 ml", packType: "pouch", price: 28 }],
      //   gallery: [],
      //   rating: 4.8,
      //   reviews: 198,
      // },
      {
        id: 103,
        name: "Gold Rich (Purple)",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/GRP1.png",
        description: "Bite-sized & wholesome",
        content:
          "Available in handy 125 ml and 500 ml packs, Gold Plus is ideal for on-the-go freshness without compromising on nutrition.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/GRP1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/GRP2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/GRP3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/GRP4.png"],
      },
      // {
      //   id: 104,
      //   name: "Gold Milk",
      //   image: PH,
      //   description: "Everyday goodness",
      //   content:
      //     "A trusted household staple with balanced fat content and a naturally sweet flavour profile. Gold Milk is the everyday choice for millions of families.",
      //   variants: [{ size: "500 ml", packType: "pouch", price: 25 }],
      //   gallery: [],
      // },
      // {
      //   id: 105,
      //   name: "Standardised Milk",
      //   image: PH,
      //   description: "Consistent, reliable",
      //   content:
      //     "Standardised for uniform fat and SNF levels. Available in two pack sizes to suit both small households and larger families.",
      //   variants: [
      //     { size: "500 ml", packType: "pouch", price: 27 },
      //     { size: "1000 ml", packType: "pouch", price: 53 },
      //   ],
      //   gallery: [],
      // },
      {
        id: 106,
        name: "Taaza Toned Milk",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/TT1.png",
        description: "Light & refreshing",
        content:
          "Toned for a lighter feel while retaining full nutritional value. Taaza is the go-to choice for health-conscious households who want freshness without heaviness.",
        variants: [
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/TT1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/TT2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/TT3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/TT4.png"],
      },
      // {
      //   id: 107,
      //   name: "Active Toned Milk",
      //   image: PH,
      //   description: "Fuel your day",
      //   content:
      //     "Fortified toned milk designed for active lifestyles. Lower fat, same great taste — the smart choice before or after your workout.",
      //   variants: [{ size: "500 ml", packType: "pouch", price: 25 }],
      //   gallery: [],
      // },
      {
        id: 108,
        name: "Double Toned Milk",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/DT1.png",
        description: "Lightest of all",
        content:
          "Double-toned for the lowest fat content in our milk range. Ideal for calorie-watchers and those on medically advised low-fat diets.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/DT1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/DT2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/DT3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/DT4.png"],
      },
      {
        id: 109,
        name: "Chai Special Milk",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CS1.png",
        description: "Straight from the cow",
        content:
          "Pure, unadulterated cow milk with its characteristic golden tinge and naturally occurring A2 proteins. Closest to what leaves the udder.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CS1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CS2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CS3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CS4.png"],
        tag: "New Launch",
      },
    ],
  },

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
        name: "2 Mini Curd Pouch",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/2mcp1.png",
        description: "Live-culture classic",
        content:
          "Set fresh every morning from our own toned milk. Rich in live probiotics, it supports gut health and makes the creamiest lassi or raita.",
        variants: [
          // { size: "80 g", packType: "pouch", price: 10 },
          // { size: "120 g", packType: "pouch", price: 15 },
          // { size: "170 g", packType: "pouch", price: 20 },
          // { size: "100 g", packType: "cup", price: 12 },
          // { size: "450 g", packType: "pouch", price: 45 },
          // { size: "900 g", packType: "pouch", price: 85 },
          // { size: "1 kg", packType: "bucket", price: 95 },
          // { size: "5 kg", packType: "bucket", price: 460 },
          // { size: "10 kg", packType: "bucket", price: 900 },
        ],
        gallery: [
          "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/2mcp1.png",
          "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/2mcp2.png",
          "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/2mcp3.png",
        ],
        tag: "Best Seller",
        rating: 4.8,
        reviews: 540,
      },
      {
        id: 202,
        name: "Curd Pouch",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CP1.png",
        description: "Light & tangy",
        content:
          "All the probiotic benefit of our classic curd, made from double-toned milk for a lighter texture and lower calorie count. Perfect for diet-conscious families.",
        variants: [
        
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CP1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CP2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CP3.png"],
      },
      {
        id: 203,
        name: "Healthy Curd boc",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HC1.png",
        description: "Thick & wholesome",
        content:
          "Set from standardised milk for a consistently rich texture. A reliable staple for everyday meals — thick enough to cut with a spoon.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HC1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HC2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HC3.png"],
      },
      {
        id: 204,
        name: "Healthy Curd Pouch",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HCP1.png",
        description: "Thick & wholesome",
        content:
          "Set from standardised milk for a consistently rich texture. A reliable staple for everyday meals — thick enough to cut with a spoon.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HCP1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HCP2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/HCP3.png"],
      },
      {
        id: 205,
        name: "Mini Curd Pouch",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mcp1.png",
        description: "Thick & wholesome",
        content:
          "Set from standardised milk for a consistently rich texture. A reliable staple for everyday meals — thick enough to cut with a spoon.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mcp1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mcp2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mcp3.png"],
      },
      {
        id: 206,
        name: "Nutrilicious Curd",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/NC1.png",
        description: "Thick & wholesome",
        content:
          "Set from standardised milk for a consistently rich texture. A reliable staple for everyday meals — thick enough to cut with a spoon.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/NC1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/NC2.png"],
      },
    ],
  },

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
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM1.png",
        description: "Cooling classic",
        content:
          "Traditionally churned and lightly spiced, our buttermilk is the ultimate summer cooler. Packed with electrolytes and live cultures to refresh and restore.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM4.png"],
        tag: "Best Seller",
        rating: 4.7,
        reviews: 280,
      },
      {
        id: 302,
        name: "Lassi",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/l1.png",
        description: "Sweet & dreamy",
        content:
          "Thick, cold, and sweetened with real vanilla. Our Vanilla Lassi is a dessert disguised as a drink — perfect with or after a meal.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/l1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/l2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/l3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/l4.png"],
      },
      // {
      //   id: 303,
      //   name: "Mango Lassi",
      //   image: PH,
      //   description: "Tropical delight",
      //   content:
      //     "Made with Alphonso mango pulp blended into thick curd. A seasonal favourite that's available year-round thanks to our cold-chain technology.",
      //   variants: [{ size: "200 ml", packType: "glass", price: 30 }],
      //   gallery: [lassi1, lassi2, lassi3, lassi4],
      //   tag: "New Launch",
      // },
      {
        id: 304,
        name: "Badam Milk",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM2 (1).png",
        description: "Nutty & nourishing",
        content:
          "Premium Badam Milk enriched with saffron and cardamom. Each bottle is a traditional recipe made modern — indulgent, yet wholesome.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM1 (1).png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM2 (1).png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM3 (1).png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BM4 (1).png"],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 175,
      },
      {
        id: 305,
        name: "Special Badam Milk",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/SBM2.png",
        description: "Everyday almond boost",
        content:
          "Classic almond-flavoured milk with real almond pieces. An everyday energy boost that children and adults love equally.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/SBM1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/SBM2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/SBM3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/SBM4.png"],
      },
      {
        id: 306,
        name: "Chocolate Milk",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CM2.png",
        description: "Rich cocoa pleasure",
        content:
          "Real cocoa blended with fresh whole milk. No artificial colours, no synthetic flavours — just pure chocolate bliss in a bottle.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CM1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CM2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CM3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CM4.png"],
      },
      // {
      //   id: 307,
      //   name: "Pineapple Milk",
      //   image: PH,
      //   description: "Tropical freshness",
      //   content:
      //     "A unique tropical twist — pineapple essence meets the creaminess of fresh milk. Surprising, refreshing, and unmistakably Vyshnavi.",
      //   variants: [{ size: "200 ml", packType: "glass", price: 25 }],
      //   gallery: [],
      // },
      // {
      //   id: 308,
      //   name: "Pista Milk",
      //   image: PH,
      //   description: "Luxuriously green",
      //   content:
      //     "Pistachio-flavoured milk with a distinctly rich and nutty character. A premium pick for those who appreciate the finer flavours of dairy.",
      //   variants: [{ size: "200 ml", packType: "glass", price: 35 }],
      //   gallery: [],
      // },
    ],
  },

  {
    key: "paneer",
    name: "Malai Paneer",
    color: "bg-orange-50",
    accentHex: "#c2410c",
    tagline: "FRESH & SOFT",
    subtitle: "PRESSED TO PERFECTION",
    items: [
      {
        id: 401,
        name: "Malai Paneer(500gms)",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp5m3.png",
        description: "Velvety & rich",
        content:
          "Full-fat malai paneer pressed from fresh whole milk. Holds shape during cooking, soaks up masalas beautifully, and melts in the mouth. The chef's first choice.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp5m1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp5m2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp5m3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp5m4.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp5m5.png"],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 412,
      },
      {
        id: 402,
        name: "Malai Paneer(1000gms)",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp103.png",
        description: "Guilt-free protein",
        content:
          "All the protein of traditional paneer, at a fraction of the fat. Made from toned milk and cold-pressed for a firm, satisfying texture.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp101.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp102.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp103.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp104.png"],
        tag: "New Launch",
      },
      {
        id: 403,
        name: "Malai Paneer (Puffed) 200gms",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp2m3.png",
        description: "Guilt-free protein",
        content:
          "All the protein of traditional paneer, at a fraction of the fat. Made from toned milk and cold-pressed for a firm, satisfying texture.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp2m1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp2m2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp2m3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp2m4.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp2m5.png"],
        tag: "New Launch",
      },
      {
        id: 404,
        name: "Malai Paneer (Puffed) 1000gms",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp103.png",
        description: "Guilt-free protein",
        content:
          "All the protein of traditional paneer, at a fraction of the fat. Made from toned milk and cold-pressed for a firm, satisfying texture.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp101.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp102.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp103.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp104.png"],
        tag: "New Launch",
      },
      {
        id: 405,
        name: "Malai Paneer (Puffed) 500gms",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp500P1.png",
        description: "Guilt-free protein",
        content:
          "All the protein of traditional paneer, at a fraction of the fat. Made from toned milk and cold-pressed for a firm, satisfying texture.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp500P1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp500P2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp500P3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp500P4.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/mp500P5.png"],
        tag: "New Launch",
      },
      {
        id: 406,
        name: "Malai Paneer(200gms)",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MP200P1.png",
        description: "Guilt-free protein",
        content:
          "All the protein of traditional paneer, at a fraction of the fat. Made from toned milk and cold-pressed for a firm, satisfying texture.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MP200P1.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MP200P2.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MP200P3.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MP200P4.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/MP200P5.png"],
        tag: "New Launch",
      },
    ],
  },

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
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/Butter.png",
        description: "Table-ready gold",
        content:
          "Slow-churned from fresh cream. Spreads effortlessly straight from the fridge and brings a rich, grassy flavour to everything from toast to tadka.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/Butter.png"],
        tag: "Best Seller",
        rating: 4.8,
        reviews: 320,
      },
      // {
      //   id: 502,
      //   name: "Butter 500 g",
      //   image: m1,
      //   description: "Baker's favourite",
      //   content:
      //     "The go-to for avid bakers and professional kitchens. 500 g of the same premium churned butter in a value pack that lasts.",
      //   variants: [{ size: "500 g", price: 290 }],
      //   gallery: [m1],
      // },
    ],
  },

  {
    key: "khova",
    name: "Khova",
    color: "bg-brown-50",
    accentHex: "#964B00",
    tagline: "CHURNED TO GOLD",
    subtitle: "TRADITIONAL MAKHAN",
    items: [
      {
        id: 801,
        name: "Khova 1000 g",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k102.png",
        description: "Table-ready gold",
        content:
          "Slow-churned from fresh cream. Spreads effortlessly straight from the fridge and brings a rich, grassy flavour to everything from toast to tadka.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k101.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k102.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k103.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k104.png"],
        tag: "Best Seller",
        rating: 4.8,
        reviews: 320,
      },
      {
        id: 802,
        name: "Khova 500 g",
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k502.png",
        description: "Baker's favourite",
        content:
          "The go-to for avid bakers and professional kitchens. 500 g of the same premium churned butter in a value pack that lasts.",
        variants: [],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k501.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k502.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k503.png", "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/k504.png"],
      },
    ],
  },

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
        // image: cow1l_1, // default hero shot
        image: "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG5m1.png",
        description: "A2-rich clarity",
        content:
          "Made from the milk of indigenous desi cows via the traditional bilona method. Rich in A2 beta-casein proteins, butyric acid, and a divine aroma that fills the kitchen.",
        variants: [
          {
            size: "5 ml",
            packType: "pouch",
            price: 95,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG5m1.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG5m2.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG5m3.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG5m4.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG5m5.png",
            ],
          },
          {
            size: "100 ml",
            packType: "jar",
            price: 165,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CGHun1.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CGHun2.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CGHun3.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CGHun4.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CGHun5.png",
            ],
          },
          {
            size: "200 ml",
            packType: "jar",
            price: 315,
            images: [
              cowghee200ml1,
              cowghee200ml2,
              cowghee200ml3,
              cowghee200ml4,
              cowghee200ml5,
            ],
          },
          {
            size: "500 ml",
            packType: "jar",
            price: 730,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG500m1.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG500m2.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG500m3.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG500m4.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG500m5.png",
            ],
          },
          {
            size: "1 liter",
            packType: "jar",
            price: 1380,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG103.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG101.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG102.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG104.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG105.png",
            ],
          },
          {
            size: "5 liters",
            packType: "jar",
            price: 6650,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG501.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG502.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG503.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG504.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/CG505.png",
            ],
          },
        ],
        gallery: [
          
        ],
        // gallery: [cow1l_1, cow1l_2, cow1l_3, cow1l_4], // legacy field, mirrors default variant
        tag: "Best Seller",
        rating: 4.9,
        reviews: 876,
      },
      {
        id: 602,
        name: "Buffalo Ghee",
        image: "",
        description: "Bold & buttery",
        content:
          "Crafted from buffalo cream, this ghee has a higher fat content and a deeply rich, nutty aroma. Ideal for festive cooking and traditional sweets.",
        variants: [
          {
            size: "200 ml",
            packType: "jar",
            price: 285,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG2m1.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG2m2.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG2m3.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG2m4.png",
            ],
          },
          {
            size: "500 ml",
            packType: "jar",
            price: 660,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG5m2.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG5m1.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG5m3.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG5m4.png",
            ],
          },
          {
            size: "1 liter",
            packType: "jar",
            price: 1230,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG102.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG101.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG103.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG104.png",
            ],
          },
          {
            size: "5 liters",
            packType: "jar",
            price: 5900,
            images: [
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG501.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG502.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG503.png",
              "https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/BG504.png",
            ],
          },
        ],
        gallery: [],
        // gallery: [buf1l_1, buf1l_2, buf1l_3, buf1l_4],
      },

    ],
  },

  {
    key: "sweets",
    name: "Sweets Boxes",
    color: "bg-pink-50",
    accentHex: "#be185d",
    tagline: "HANDCRAFTED MITHAIS",
    subtitle: "MADE WITH LOVE",
    items: [
      {
        id: 701,
        name: "Sweet Box 300gm",
        image: PH,
        description: "Slow-simmered silk",
        content:
          "Rich condensed milk dessert simmered for hours with saffron, cardamom, and crushed nuts. A festive classic, made fresh every batch — never from concentrate.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/sweet3m1.png"],
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
        variants: [
          
        ],
        gallery: [],
      },
      {
        id: 703,
        name: "Sweet Box 1000gm",
        image: PH,
        description: "Melt-in-mouth rounds",
        content:
          "Soft, cardamom-scented milk pedas made from fresh khova. Each piece is hand-shaped and lightly dusted with pistachio for a celebratory finish.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/Sweet101.png"],
      },
      // {
      //   id: 704,
      //   name: "Ajmeri Kalakand",
      //   image: PH,
      //   description: "Grainy & indulgent",
      //   content:
      //     "The iconic Ajmeri-style kalakand with a distinctive coarse-grained texture. Made from fresh chhena and cooked down with sugar and rose water until perfectly set.",
      //   variants: [
      //     { size: "250 g", price: 200 },
      //     { size: "500 g", price: 380 },
      //   ],
      //   gallery: [],
      //   tag: "New Launch",
      // },
    ],
  },

  {
    key: "water",
    name: "Water Bottle",
    color: "bg-pink-50",
    accentHex: "#be185d",
    tagline: "HANDCRAFTED MITHAIS",
    subtitle: "MADE WITH LOVE",
    items: [
      {
        id: 901,
        name: "Water Botle 300ml",
        image: PH,
        description: "Slow-simmered silk",
        content:
          "Rich condensed milk dessert simmered for hours with saffron, cardamom, and crushed nuts. A festive classic, made fresh every batch — never from concentrate.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/water3m1.png"],
        tag: "Best Seller",
        rating: 4.9,
        reviews: 203,
      },
      {
        id: 902,
        name: "Water Bottle 500ml",
        image: PH,
        description: "Mawa magic",
        content:
          "Pure evaporated milk solids, traditionally called mawa. The building block of Indian sweets — used in halwa, barfis, and gulab jamun. Fresh, never frozen.",
        variants: [
          // { size: "200 g", price: 120 },
          // { size: "500 g", price: 280 },
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/Water5m1.png"],
      },
      {
        id: 903,
        name: "Water Bottle 1liter",
        image: PH,
        description: "Melt-in-mouth rounds",
        content:
          "Soft, cardamom-scented milk pedas made from fresh khova. Each piece is hand-shaped and lightly dusted with pistachio for a celebratory finish.",
        variants: [
          
        ],
        gallery: ["https://pub-5910ba650a5b4f4ba76486d5a3630c49.r2.dev/vaishnavi-data/water101.png"],
      },
    ],
  },
];

// --------------- LOOKUP HELPERS ---------------

export const getCategoryByKey = (key: string): ProductCategory | undefined =>
  CATEGORIES.find((c) => c.key === key);

export const getAllProducts = (): ProductItem[] =>
  CATEGORIES.flatMap((c) => c.items);

export const getProductById = (id: number): ProductItem | undefined =>
  getAllProducts().find((p) => p.id === id);

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.name]),
);
