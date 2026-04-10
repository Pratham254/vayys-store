"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

const TRANSLATIONS = {
  en: {
    storeName: "Sharma Ji Ki Dukaan",
    storeSub: "Live shop helper · Open",
    today: "Today",
    popular: "Popular right now",
    greeting:
      "Namaste! Type whatever you need, full list also works. I’ll understand and build your cart.",
    add: "Add",
    select: "Choose",
    smart: "You may want this",
    choose: "Choose exact option",
    cartTitle: "Your cart",
    more: "More items",
    done: "Done",
    checking: "Checking...",
    stockCheck: "Checking price and stock...",
    understanding: "Understanding...",
    noMatch: "I could not understand properly. Try like 1 kg atta, 2 milk, 6 eggs.",
    clearAndChoose: "Clear items were added to cart. Choose exact option for the rest.",
    multipleOptions: "Multiple options found. Choose the correct one below.",
    partialClear: "I added what was clear. Please write a few items more clearly.",
    matchedAdded: "Got it. Best matching items were added to cart.",
    addedSuffix: "added to cart",
    addFirst: "Add some items first, then tap Done.",
    chooseDelivery: "Okay. Now choose delivery method.",
    exactOptionsSub: "Exact options in one line",
    typingSub: "Quick matches based on typing",
    deliveryTitle: "How do you want the order?",
    selfPickup: "Self Pickup",
    ready10: "Ready in 10 mins",
    free: "Free",
    homeDelivery: "Home Delivery",
    deliveryInfo: "₹20 • 30–40 mins",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    continue: "Continue →",
    phoneTitle: "Enter phone number",
    detailsTitle: "Enter delivery details",
    phonePlaceholder: "Phone number",
    addressPlaceholder: "Complete address",
    validPhoneAlert: "Enter a valid phone number",
    addressAlert: "Enter address",
    placeOrder: "Place Order",
    choosePayment: "Choose Payment →",
    paymentTitle: "Choose payment",
    cod: "Cash on Delivery",
    codSub: "Pay when order arrives",
    upi: "UPI Payment",
    upiSub: "Fast and secure",
    previousOrders: "Previous Orders",
    placed: "Placed",
    orderPlaced: "Order Placed",
    preparing: "Order is being prepared",
    pickupLabel: "Self Pickup",
    deliveryLabel: "Home Delivery",
    deliveryEta: "Will arrive in 30–40 mins",
  },
  hi: {
    storeName: "शर्मा जी की दुकान",
    storeSub: "लाइव दुकान हेल्पर · अभी खुली",
    today: "आज",
    popular: "अभी लोकप्रिय",
    greeting:
      "नमस्ते! जो चाहिए बस टाइप करो, पूरी लिस्ट भी चलेगी। मैं समझकर कार्ट बना दूँगा।",
    add: "जोड़ें",
    select: "चुनें",
    smart: "शायद ये चाहिए",
    choose: "सही ऑप्शन चुनें",
    cartTitle: "आपका कार्ट",
    more: "और आइटम",
    done: "हो गया",
    checking: "चेक कर रहा हूँ...",
    stockCheck: "रेट और स्टॉक चेक कर रहा हूँ...",
    understanding: "समझ रहा हूँ...",
    noMatch: "ठीक से समझ नहीं आया। ऐसे लिखें: 1 किलो आटा, 2 दूध, 6 अंडे।",
    clearAndChoose: "साफ़ आइटम कार्ट में डाल दिए। बाकी के लिए सही ऑप्शन चुनें।",
    multipleOptions: "कई ऑप्शन मिले। नीचे से सही वाला चुनें।",
    partialClear: "जो साफ़ था वो जोड़ दिया। कुछ आइटम और साफ़ लिखें।",
    matchedAdded: "समझ गया। सबसे अच्छे मैच कार्ट में जोड़ दिए।",
    addedSuffix: "कार्ट में जुड़ गया",
    addFirst: "पहले कुछ आइटम कार्ट में जोड़ें, फिर हो गया दबाएँ।",
    chooseDelivery: "ठीक है। अब डिलीवरी तरीका चुनें।",
    exactOptionsSub: "एक लाइन में सही ऑप्शन",
    typingSub: "टाइपिंग के हिसाब से जल्दी मैच",
    deliveryTitle: "ऑर्डर कैसे चाहिए?",
    selfPickup: "सेल्फ पिकअप",
    ready10: "10 मिनट में तैयार",
    free: "फ्री",
    homeDelivery: "होम डिलीवरी",
    deliveryInfo: "₹20 • 30–40 मिनट",
    orderSummary: "ऑर्डर सारांश",
    subtotal: "सबटोटल",
    delivery: "डिलीवरी",
    total: "कुल",
    continue: "आगे बढ़ें →",
    phoneTitle: "फोन नंबर डालें",
    detailsTitle: "डिलीवरी डिटेल डालें",
    phonePlaceholder: "फोन नंबर",
    addressPlaceholder: "पूरा पता",
    validPhoneAlert: "सही फोन नंबर डालें",
    addressAlert: "पता डालें",
    placeOrder: "ऑर्डर करें",
    choosePayment: "पेमेंट चुनें →",
    paymentTitle: "पेमेंट चुनें",
    cod: "कैश ऑन डिलीवरी",
    codSub: "ऑर्डर आने पर पे करें",
    upi: "UPI पेमेंट",
    upiSub: "तेज़ और सुरक्षित",
    previousOrders: "पिछले ऑर्डर",
    placed: "ऑर्डर हुआ",
    orderPlaced: "ऑर्डर हो गया",
    preparing: "ऑर्डर तैयार हो रहा है",
    pickupLabel: "सेल्फ पिकअप",
    deliveryLabel: "होम डिलीवरी",
    deliveryEta: "30–40 मिनट में आएगा",
  },
} as const;


const PRODUCT_COLORS = [
  "#f7f2ea",
  "#e8f3fc",
  "#fdf4e0",
  "#edf8f2",
  "#fff2ee",
  "#f1eeff",
];

const CATEGORY_ALIASES: Record<string, string[]> = {
  atta: ["atta", "aata", "ata", "flour", "wheat", "aashirvaad", "ashirvad", "आटा"],
  rice: ["rice", "chawal", "chaawal", "chaval", "chwaal", "basmati", "चावल", "राइस"],
  milk: ["milk", "doodh", "dudh", "dood", "दूध", "amul", "tetra"],
  eggs: ["egg", "eggs", "anda", "ande", "andaa", "अंडा", "अंडे"],
  salt: ["salt", "namak", "nmk", "नमक"],
  sugar: ["sugar", "chini", "cheeni", "chinni", "chinee", "shakkar", "sakkar", "चीनी"],
  oil: ["oil", "tel", "तेल", "mustard oil", "refined", "sarso tel", "sarson tel"],
  maggi: ["maggi", "maggie", "noodles", "मैगी"],
  surf: ["surf", "detergent", "washing powder", "powder", "excel", "सर्फ"],
  dal: ["dal", "daal", "dall", "दाल", "lentils"],
  bread: ["bread", "brad", "ब्रेड"],
  tea: ["tea", "chai", "chai patti", "chai pati", "chaipatti", "tea powder", "tea leaves", "चाय", "चाय पत्ती"],
  ghee: ["ghee", "ghi", "घी", "desi ghee"],
  biscuit: ["biscuit", "biscuits", "biskit", "cookie", "cookies", "बिस्कुट"],
  soap: ["soap", "sabun", "saboon", "साबुन"],
  shampoo: ["shampoo", "sampoo", "शैम्पू"],
  turmeric: ["haldi", "turmeric", "हल्दी"],
  chilli: ["mirchi", "chilli", "chili", "red chilli", "लाल मिर्च", "मिर्च"],
  coriander: ["dhania", "dhaniya", "coriander", "धनिया"],
};


const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\baur\b/g, ","],
  [/और/g, ","],
  [/\band\b/g, ","],
  [/\bplus\b/g, ","],
  [/&/g, ","],
  [/\bek\b/g, "1"],
  [/एक/g, "1"],
  [/\bdo\b/g, "2"],
  [/दो/g, "2"],
  [/\bteen\b/g, "3"],
  [/तीन/g, "3"],
  [/\bchar\b/g, "4"],
  [/चार/g, "4"],
  [/\bpaanch\b/g, "5"],
  [/पांच/g, "5"],
  [/\baadha\b/g, "0.5"],
  [/\badha\b/g, "0.5"],
  [/आधा/g, "0.5"],
  [/\bpav\b/g, "0.25"],
  [/पाव/g, "0.25"],
  [/\bkilo\b/g, "kg"],
  [/किलो/g, "kg"],
  [/किलोग्राम/g, "kg"],
  [/\bkilogram\b/g, "kg"],
  [/\bgrams?\b/g, "g"],
  [/ग्राम/g, "g"],
  [/\blitres?\b/g, "l"],
  [/\bliters?\b/g, "l"],
  [/लीटर/g, "l"],
  [/\bmillilitres?\b/g, "ml"],
  [/\bmilliliters?\b/g, "ml"],
  [/मिलीलीटर/g, "ml"],
  [/\bpackets?\b/g, "pack"],
  [/पैकेट/g, "pack"],
  [/पैक/g, "pack"],
  [/\bshakkar\b/g, "sugar"],
  [/\bsakkar\b/g, "sugar"],
  [/\bcheeni\b/g, "sugar"],
  [/\bchinni\b/g, "sugar"],
  [/\bchini\b/g, "sugar"],
  [/\bdudh\b/g, "milk"],
  [/\bdood\b/g, "milk"],
  [/\baata\b/g, "atta"],
  [/\bata\b/g, "atta"],
  [/\bchaawal\b/g, "rice"],
  [/\bchaval\b/g, "rice"],
  [/\bchwaal\b/g, "rice"],
  [/\bmaggie\b/g, "maggi"],
  [/\bbrad\b/g, "bread"],
  [/दर्जन/g, "dozen"],
  [/पीस/g, "pcs"],
  [/नग/g, "pcs"],
];
const PHRASE_ALIASES: Array<[RegExp, string]> = [
  [/\bchai\s*patti\b/g, "tea"],
  [/\bchai\s*pati\b/g, "tea"],
  [/\bchai\s*patta\b/g, "tea"],
  [/\bchaipatti\b/g, "tea"],
  [/चाय\s*पत्ती/g, "tea"],
  [/चायपत्ती/g, "tea"],

  [/\bsarso\s*tel\b/g, "mustard oil"],
  [/\bsarson\s*tel\b/g, "mustard oil"],
  [/सरसों\s*तेल/g, "mustard oil"],

  [/\bwashing\s*powder\b/g, "detergent"],
  [/धोने\s*का\s*पाउडर/g, "detergent"],

  [/\bdesi\s*ghee\b/g, "ghee"],
  [/देसी\s*घी/g, "ghee"],

  [/\blal\s*mirch\b/g, "chilli"],
  [/लाल\s*मिर्च/g, "chilli"],

  [/\bchai\b/g, "tea"],
  [/चाय/g, "tea"],

  [/\bsabun\b/g, "soap"],
  [/\bsaboon\b/g, "soap"],
  [/साबुन/g, "soap"],

  [/\bdhaniya\b/g, "coriander"],
  [/\bdhania\b/g, "coriander"],
  [/धनिया/g, "coriander"],

  [/\bhaldi\b/g, "turmeric"],
  [/हल्दी/g, "turmeric"],
];
const SPOKEN_WORD_MAP: Record<string, string> = {
  chinni: "sugar",
  chini: "sugar",
  cheeni: "sugar",
  chinee: "sugar",
  shakkar: "sugar",
  sakkar: "sugar",
  doodh: "milk",
  dudh: "milk",
  dood: "milk",
  aata: "atta",
  ata: "atta",
  chaawal: "rice",
  chaval: "rice",
  chwaal: "rice",
  andaa: "egg",
  ande: "eggs",
  nmk: "salt",
  maggie: "maggi",
  brad: "bread",
};

const DONE_COMMANDS = [
  "done",
  "bas",
  "ho gaya",
  "ho gya",
  "checkout",
  "proceed",
  "next",
  "ok done",
  "theek hai",
  "thik hai",
];

type Lang = "en" | "hi";
type DeliveryType = "pickup" | "delivery" | null;
type OrderStep = "summary" | "details" | "payment";

type Product = {
  id: number | string;
  price: number;
  stock?: number | null;
  master_products?: {
    name?: string;
    image?: string;
    unit?: string;
  } | null;
};

type CartItem = {
  product: Product;
  qty: number;
};

type ParsedItem = {
  raw: string;
  cleanName: string;
  category: string;
  qty: number;
  sizeValue: number | null;
  sizeUnit: string | null;
};

type PendingChoice = {
  id: string;
  label: string;
  requestText: string;
  qty: number;
  products: Product[];
};

type BotMessage =
  | { type: "loading"; text: string }
  | { type: "added"; text: string }
  | {
      type: "ai";
      text: string;
      items: Array<{ name: string; unit?: string; qty: number }>;
      unresolved: string[];
    }
  | null;

type CompletedOrder = {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  deliveryType: Exclude<DeliveryType, null>;
  paymentMethod: string | null;
  phone: string;
  address: string;
  etaText: string;
  placedAt: string;
};

const normalizeToken = (token: string) => {
  const clean = token.trim().toLowerCase();
  return SPOKEN_WORD_MAP[clean] || clean;
};

const normalizeText = (text: string) => {
  let safe = text.toLowerCase();

  PHRASE_ALIASES.forEach(([pattern, replacement]) => {
    safe = safe.replace(pattern, replacement);
  });

  REPLACEMENTS.forEach(([pattern, replacement]) => {
    safe = safe.replace(pattern, replacement);
  });

  safe = safe
    .replace(/[^\w\s\u0900-\u097f.+/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return safe
    .split(" ")
    .map(normalizeToken)
    .join(" ")
    .trim();
};


const tokenizeText = (text: string) =>
  normalizeText(text)
    .split(" ")
    .map(normalizeToken)
    .filter(Boolean);

    const levenshteinDistance = (a: string, b: string) => {
      const dp = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
      );
    
      for (let i = 0; i <= a.length; i++) dp[i][0] = i;
      for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
        }
      }
    
      return dp[a.length][b.length];
    };
    

    const isLooseTokenMatch = (a: string, b: string) => {
      if (!a || !b) return false;
    
      if (a === b) return true;
      if (a.includes(b) || b.includes(a)) return true;
      if (a.startsWith(b) || b.startsWith(a)) return true;
    
      const maxLen = Math.max(a.length, b.length);
      const lenDiff = Math.abs(a.length - b.length)
    
      if (lenDiff > 2) return false;
    
      const distance = levenshteinDistance(a, b);
    
      if (maxLen <= 4) return distance <= 1;
      if (maxLen <= 7) return distance <= 2;
      return distance <= 3;
    };

const cleanName = (text: string) =>
  normalizeText(text)
    .replace(/\b\d+(?:\.\d+)?\b/g, " ")
    .replace(/\b(kg|g|l|ml|pack|pcs|dozen)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const detectCategory = (text: string) => {
  const safe = normalizeText(text);
  for (const [category, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((alias) => safe.includes(normalizeText(alias)))) return category;
  }
  return cleanName(safe);
};

const extractPackInfo = (text?: string) => {
  const safe = normalizeText(text || "");
  const match = safe.match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml|pack|pcs|dozen)\b/);

  if (!match) {
    return { value: null as number | null, unit: null as string | null };
  }

  return {
    value: Number(match[1]),
    unit: match[2],
  };
};

const getUnitFamily = (unit?: string | null) => {
  if (!unit) return null;
  if (unit === "kg" || unit === "g") return "weight";
  if (unit === "l" || unit === "ml") return "volume";
  if (unit === "pcs" || unit === "dozen") return "count";
  if (unit === "pack") return "pack";
  return unit;
};

const toBaseUnits = (value: number, unit: string) => {
  if (unit === "kg") return value * 1000;
  if (unit === "g") return value;
  if (unit === "l") return value * 1000;
  if (unit === "ml") return value;
  if (unit === "dozen") return value * 12;
  if (unit === "pcs") return value;
  if (unit === "pack") return value;
  return value;
};

const CATEGORY_TOKEN_MAP = Object.entries(CATEGORY_ALIASES).reduce<Record<string, string>>(
  (acc, [category, aliases]) => {
    aliases.forEach((alias) => {
      normalizeText(alias)
        .split(" ")
        .filter(Boolean)
        .forEach((token) => {
          if (!acc[token]) acc[token] = category;
        });
    });
    return acc;
  },
  {}
);

const splitIntoSegments = (text: string) => {
  const normalized = normalizeText(text)
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*\+\s*/g, ",");

  const initialParts = normalized.split(",").map((part) => part.trim()).filter(Boolean);
  const finalParts: string[] = [];

  initialParts.forEach((part) => {
    const tokens = part.split(" ").filter(Boolean);
    let current: string[] = [];
    let currentCategory: string | null = null;

    tokens.forEach((token) => {
      const tokenCategory = CATEGORY_TOKEN_MAP[token] || null;
      const isNumber = /^\d+(\.\d+)?$/.test(token);

      if (isNumber && currentCategory && current.length > 0) {
        finalParts.push(current.join(" "));
        current = [token];
        currentCategory = null;
        return;
      }

      if (tokenCategory && currentCategory && tokenCategory !== currentCategory && current.length > 0) {
        finalParts.push(current.join(" "));
        current = [token];
        currentCategory = tokenCategory;
        return;
      }

      current.push(token);

      if (tokenCategory && !currentCategory) {
        currentCategory = tokenCategory;
      }
    });

    if (current.length > 0) {
      finalParts.push(current.join(" "));
    }
  });

  return finalParts;
};

const parseInput = (text: string): ParsedItem[] => {
  return splitIntoSegments(text).map((part) => {
    const qtyMatch = part.match(/(^|\s)(\d+)(?=\s|$)/);
    const pack = extractPackInfo(part);

    return {
      raw: part,
      cleanName: cleanName(part) || part,
      category: detectCategory(part),
      qty: qtyMatch ? Number(qtyMatch[2]) : 1,
      sizeValue: pack.value,
      sizeUnit: pack.unit,
    };
  });
};

const getCartQty = (cartProducts: CartItem[], productId: Product["id"]) =>
  cartProducts.find((item) => item.product.id === productId)?.qty || 0;

const buildReplyText = (
  copy: typeof TRANSLATIONS.en,
  addedCount: number,
  pendingCount: number,
  unresolvedCount: number
) => {
  if (!addedCount && !pendingCount) return copy.noMatch;
  if (addedCount && pendingCount) return copy.clearAndChoose;
  if (pendingCount) return copy.multipleOptions;
  if (unresolvedCount) return copy.partialClear;
  return copy.matchedAdded;
};

const buildSmartPackPlan = (
  inputItem: ParsedItem,
  matches: { product: Product; score: number }[]
) => {
  if (!inputItem.sizeUnit || !inputItem.sizeValue) return null;

  const family = getUnitFamily(inputItem.sizeUnit);
  if (!family) return null;

  const requestedBase = toBaseUnits(inputItem.sizeValue, inputItem.sizeUnit);

  const options = matches
    .map((match) => {
      const pack = extractPackInfo(match.product.master_products?.unit);
      if (!pack.unit || !pack.value) return null;

      const packFamily = getUnitFamily(pack.unit);
      if (packFamily !== family) return null;

      return {
        product: match.product,
        score: match.score,
        amount: toBaseUnits(pack.value, pack.unit),
      };
    })
    .filter(Boolean) as { product: Product; score: number; amount: number }[];

  if (!options.length) return null;

  const uniqueByAmount = new Map<number, { product: Product; score: number; amount: number }>();
  options.forEach((option) => {
    const existing = uniqueByAmount.get(option.amount);
    if (!existing || option.score > existing.score) {
      uniqueByAmount.set(option.amount, option);
    }
  });

  const deduped = Array.from(uniqueByAmount.values()).sort((a, b) => b.amount - a.amount);
  const biggestPack = deduped[0]?.amount || 0;
  const limit = requestedBase + biggestPack;

  const dp: Array<null | { packs: number; prev: number; optionIndex: number }> = Array(limit + 1).fill(null);
  dp[0] = { packs: 0, prev: -1, optionIndex: -1 };

  for (let i = 0; i <= limit; i++) {
    if (!dp[i]) continue;

    for (let optionIndex = 0; optionIndex < deduped.length; optionIndex++) {
      const next = i + deduped[optionIndex].amount;
      if (next > limit) continue;

      const nextPacks = (dp[i]?.packs || 0) + 1;
      if (!dp[next] || nextPacks < (dp[next]?.packs || Infinity)) {
        dp[next] = {
          packs: nextPacks,
          prev: i,
          optionIndex,
        };
      }
    }
  }

  let bestTarget = -1;
  let bestOvershoot = Infinity;
  let bestPackCount = Infinity;

  for (let i = requestedBase; i <= limit; i++) {
    if (!dp[i]) continue;

    const overshoot = i - requestedBase;
    const packCount = dp[i]!.packs;

    if (
      overshoot < bestOvershoot ||
      (overshoot === bestOvershoot && packCount < bestPackCount)
    ) {
      bestTarget = i;
      bestOvershoot = overshoot;
      bestPackCount = packCount;
    }
  }

  if (bestTarget === -1) return null;

  const counts = new Map<string | number, { product: Product; qty: number }>();
  let cursor = bestTarget;

  while (cursor > 0 && dp[cursor]) {
    const step = dp[cursor]!;
    const chosen = deduped[step.optionIndex];
    const existing = counts.get(chosen.product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      counts.set(chosen.product.id, {
        product: chosen.product,
        qty: 1,
      });
    }

    cursor = step.prev;
  }

  return Array.from(counts.values());
};

const GroceryShopkeeperIcon = ({ size = 30 }: { size?: number }) => (
  <svg className="shopkeeper-art" width={size} height={size} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="57" rx="21" ry="4" fill="rgba(0,0,0,0.08)" />
    <path d="M18 22C18.8 12.8 25.1 8 32 8C38.9 8 45.2 12.8 46 22H18Z" fill="#1F1B35" />
    <path d="M17 22.2C18.8 17.1 24.2 14 32 14C39.8 14 45.2 17.1 47 22.2L43.2 22.8C41.6 18.9 37.6 16.9 32 16.9C26.4 16.9 22.4 18.9 20.8 22.8L17 22.2Z" fill="#2D264A" />
    <ellipse cx="32" cy="26.5" rx="13" ry="12.8" fill="#F2B27C" />
    <path d="M22.2 24.6C23.8 22.8 26 21.8 28.5 21.8" stroke="#2D264A" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M41.8 24.6C40.2 22.8 38 21.8 35.5 21.8" stroke="#2D264A" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="27.2" cy="27" r="1.5" fill="#1F2937" />
    <circle cx="36.8" cy="27" r="1.5" fill="#1F2937" />
    <path d="M25.4 33.2C27.2 35.2 29.4 36.2 32 36.2C34.6 36.2 36.8 35.2 38.6 33.2" stroke="#8A3C16" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M24 31.6C26.1 29.2 28.8 28 32 28C35.2 28 37.9 29.2 40 31.6" stroke="#5B2A12" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30.4 19.2L32 15.8L33.6 19.2H30.4Z" fill="#D97706" />
    <path d="M18 39C20.5 34.6 25.2 32 32 32C38.8 32 43.5 34.6 46 39L49.5 45.6H14.5L18 39Z" fill="#F97316" />
    <path d="M19 42.2C21.8 38.8 26 36.9 32 36.9C38 36.9 42.2 38.8 45 42.2" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 36L17.2 52.5C16.9 54 17.9 55.3 19.4 55.5L31.5 57.5C31.8 57.6 32.2 57.6 32.5 57.5L44.6 55.5C46.1 55.3 47.1 54 46.8 52.5L44 36H20Z" fill="#C69C6D" />
    <path d="M23 36C23.6 31.8 27 29 32 29C37 29 40.4 31.8 41 36" stroke="#A67C52" strokeWidth="2.3" strokeLinecap="round" />
    <rect x="24.5" y="28.4" width="5.8" height="9.6" rx="1.1" fill="#FB7185" />
    <rect x="31.2" y="27.2" width="6.8" height="10.8" rx="1.1" fill="#FCD34D" />
    <rect x="39" y="29.2" width="3.8" height="8.8" rx="1.1" fill="#60A5FA" />
    <rect x="40.1" y="26.8" width="1.6" height="3.1" rx="0.8" fill="#2563EB" />
    <path d="M20.8 49C24.2 47.2 27.8 46.4 32 46.4C36.2 46.4 39.8 47.2 43.2 49" stroke="#A67C52" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M18 39.8C16.4 41 15.2 42.8 14.5 45.6" stroke="#F2B27C" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M46 39.8C47.6 41 48.8 42.8 49.5 45.6" stroke="#F2B27C" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);

const ProductIllustration = ({ index }: { index: number }) => {
  const illustrations = [
    <svg key={0} width="42" height="42" viewBox="0 0 42 42" fill="none">
      <ellipse cx="21" cy="29" rx="12" ry="8" fill="#e6d8c0" />
      <ellipse cx="15" cy="20" rx="6.5" ry="8.5" fill="#ede3cf" transform="rotate(-12 15 20)" />
      <ellipse cx="27" cy="21" rx="6.5" ry="8.5" fill="#eae0cd" transform="rotate(8 27 21)" />
      <ellipse cx="21" cy="18" rx="5.5" ry="7.5" fill="#f4ede2" />
      <ellipse cx="21" cy="17" rx="3.5" ry="5" fill="#faf5ef" />
    </svg>,
    <svg key={1} width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="13" y="13" width="16" height="20" rx="3.5" fill="#b8ddf5" />
      <rect x="14" y="10" width="14" height="7" rx="2.5" fill="#8ecbf0" />
      <rect x="16" y="7" width="10" height="5" rx="2" fill="#6ab8ea" />
    </svg>,
    <svg key={2} width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="10" y="16" width="22" height="18" rx="3" fill="#f0d498" />
      <ellipse cx="21" cy="16" rx="9" ry="4.5" fill="#e8c060" />
      <rect x="10" y="16" width="22" height="5" fill="#d4a830" />
    </svg>,
    <svg key={3} width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="13" y="11" width="16" height="22" rx="3" fill="#a8dfc0" />
      <rect x="13" y="11" width="16" height="7" rx="3" fill="#58ba88" />
      <rect x="17" y="9" width="8" height="4" rx="2" fill="#3d9e6c" />
    </svg>,
    <svg key={4} width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="11" y="14" width="20" height="20" rx="3" fill="#f8b8a0" />
      <rect x="11" y="14" width="20" height="7" rx="3" fill="#e05e30" />
      <rect x="17" y="9" width="8" height="7" rx="2" fill="#c84820" />
    </svg>,
    <svg key={5} width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="12" y="12" width="18" height="22" rx="3" fill="#c4b6f2" />
      <rect x="12" y="12" width="18" height="7" rx="3" fill="#7c6cdc" />
      <ellipse cx="21" cy="15.5" rx="4" ry="1.5" fill="rgba(255,255,255,0.2)" />
    </svg>,
  ];

  return illustrations[index % illustrations.length];
};

const PlusIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path d="M4 1v6M1 4h6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ProMicIcon = ({ listening }: { listening: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="9"
      y="3"
      width="6"
      height="11"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.8"
      fill={listening ? "currentColor" : "none"}
      fillOpacity={listening ? 0.12 : 0}
    />
    <path
      d="M7.5 11.5C7.5 14.2614 9.73858 16.5 12.5 16.5C15.2614 16.5 17.5 14.2614 17.5 11.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M12.5 16.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 20H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const BotAvatar = () => (
  <div className="bot-avatar">
    <img src="/shops.jpg" alt="shopkeeper" />
  </div>
);

interface ProductCardProps {
  index: number;
  name: string;
  price: string;
  unit?: string;
  image?: string;
  count: number;
  loading?: boolean;
  loadingText?: string;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  addLabel: string;
  compact?: boolean;
  badge?: string;
  disabled?: boolean;
}

const ProductCard = ({
  index,
  name,
  price,
  unit,
  image,
  count,
  loading,
  loadingText,
  onAdd,
  onInc,
  onDec,
  addLabel,
  compact,
  badge,
  disabled,
}: ProductCardProps) => (
  <div className={`product-card${count > 0 ? " added" : ""}${compact ? " compact" : ""}${disabled ? " is-disabled" : ""}`}>
    {badge ? <div className="product-badge">{badge}</div> : null}

    <div className="product-img" style={{ background: PRODUCT_COLORS[index % PRODUCT_COLORS.length] }}>
      {image ? (
        <img
          src={image}
          alt={name}
          style={{
            width: compact ? "72px" : "85px",
            height: compact ? "72px" : "85px",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
        />
      ) : (
        <ProductIllustration index={index} />
      )}
    </div>

    <div className="product-body">
      <div className="product-name">{name}</div>
      <div className="product-price">{price}</div>
      <div className="product-unit">{unit}</div>

      {loading ? (
        <div className="loading-btn">
          <div className="loader"></div>
          {loadingText}
        </div>
      ) : count === 0 ? (
        <button className="add-btn" onClick={onAdd} disabled={disabled}>
          <PlusIcon />
          <span>{addLabel}</span>
        </button>
      ) : (
        <div className="add-btn stepper-btn">
          <button className="step-btn" onClick={onDec} disabled={disabled}>−</button>
          <span className="step-count">{count}</span>
          <button className="step-btn" onClick={onInc} disabled={disabled}>+</button>
        </div>
      )}
    </div>
  </div>
);

export default function Page() {
  const params = useParams();
  const deliveryRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [botMessage, setBotMessage] = useState<BotMessage>(null);
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [justPlacedOrder, setJustPlacedOrder] = useState<CompletedOrder | null>(null);
  const [pendingChoices, setPendingChoices] = useState<PendingChoice[]>([]);
  const [orderStage, setOrderStage] = useState("adding");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orderStep, setOrderStep] = useState<OrderStep>("summary");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [lang, setLang] = useState<Lang>("en");
  const [loadingProductId, setLoadingProductId] = useState<Product["id"] | null>(null);
  const [loadingText, setLoadingText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const prompts = [
    "Type karo… 1 kg atta + 1 kg chawal",
    "Hinglish works… 1 kilo chawal aur 1 kilo atta",
    "Try karo… 2 doodh 6 ande namak",
    "Try karo… bhai chinni aur doodh bhej do",
  ];

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    async function loadProducts() {
      const slug = Array.isArray(params?.id) ? params.id[0] : params?.id;

      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("slug", slug)
        .single();

      if (storeError) return;

      const { data: productData, error: productError } = await supabase
        .from("store_products")
        .select(`
          id,
          price,
          stock,
          master_products (
            name,
            image,
            unit
          )
        `)
        .eq("store_id", storeData.id);

      if (productError) return;
      const allProducts = (productData || []) as Product[];
      const randomPopularProducts = [...allProducts]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      
      setProducts(allProducts);
      setPopularProducts(randomPopularProducts);
    }

    loadProducts();
  }, [params?.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (orderStep === "details") {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
  
      if (orderStep === "payment") {
        paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
  
      if (orderStage === "delivery") {
        deliveryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
  
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 120);
  
    return () => clearTimeout(timer);
  }, [
    botMessage,
    cartProducts,
    pendingChoices,
    orderStage,
    orderStep,
    deliveryType,
    showSuggestions,
    searchQuery,
    completedOrders.length,
    justPlacedOrder?.id,
  ]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % prompts.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const liveSuggestions = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return [] as Product[];
  
    const queryTokens = tokenizeText(query);
  
    const ranked = [...products]
      .map((product) => {
        const rawName = product.master_products?.name || "";
        const rawUnit = product.master_products?.unit || "";
        const name = normalizeText(rawName);
        const unit = normalizeText(rawUnit);
        const nameTokens = tokenizeText(rawName);
        const unitTokens = tokenizeText(rawUnit);
        const category = detectCategory(name);
        const queryCategory = detectCategory(query);
  
        let score = 0;
  
        if (name.includes(query)) score += 70;
        if (unit.includes(query)) score += 20;
        if (category === queryCategory) score += 24;
  
        queryTokens.forEach((queryToken) => {
          const matchedName = nameTokens.some((nameToken) =>
            isLooseTokenMatch(queryToken, nameToken)
          );
          const matchedUnit = unitTokens.some((unitToken) =>
            isLooseTokenMatch(queryToken, unitToken)
          );
  
          if (matchedName) score += 14;
          if (matchedUnit) score += 8;
        });
  
        return { product, score };
      })
      .filter((item) => item.score > 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  
      return ranked
      .map((item) => item.product)
      .filter((product) => !cartProducts.some((cart) => cart.product.id === product.id));
    }, [products, searchQuery, cartProducts]);
  

  const pendingChoiceCards = useMemo(
    () =>
      pendingChoices.flatMap((choice) =>
        choice.products.map((product) => ({
          choiceId: choice.id,
          choiceLabel: choice.label,
          qty: choice.qty,
          product,
        }))
      ),
    [pendingChoices]
  );
  
  const subtotal = cartProducts.reduce((sum, item) => sum + (item.product.price || 0) * item.qty, 0);
  const deliveryCharge = deliveryType === "delivery" ? 20 : 0;
  const grandTotal = subtotal + deliveryCharge;

  const upsertCart = (product: Product, qty = 1) => {
    setCartProducts((prev) => {
      const existing = prev.findIndex((item) => item.product.id === product.id);

      if (existing === -1) return [...prev, { product, qty }];

      const next = [...prev];
      next[existing] = {
        ...next[existing],
        qty: next[existing].qty + qty,
      };
      return next;
    });
  };

  const updateCartQty = (productId: Product["id"], delta: number) => {
    setCartProducts((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const rankMatches = (inputItem: ParsedItem, sourceText: string) => {
    const query = normalizeText(sourceText);
    const queryTokens = tokenizeText(inputItem.raw || sourceText);
    const wantCheap = query.includes("cheap") || query.includes("lowest") || query.includes("sasta");
    const wantPremium = query.includes("best") || query.includes("premium") || query.includes("accha");

    return [...products]
      .map((product) => {
        const name = normalizeText(product.master_products?.name || "");
        const nameTokens = tokenizeText(product.master_products?.name || "");
        const category = detectCategory(name);
        const packInfo = extractPackInfo(product.master_products?.unit);

        let score = 0;


        if (name.includes(inputItem.cleanName)) score += 45;
        if (category === inputItem.category) score += 36;

        const rawProductName = product.master_products?.name || "";
const rawProductUnit = product.master_products?.unit || "";
const combinedText = normalizeText(`${rawProductName} ${rawProductUnit}`);

CATEGORY_ALIASES[inputItem.category]?.forEach((alias) => {
  const normalizedAlias = normalizeText(alias);
  if (normalizedAlias && combinedText.includes(normalizedAlias)) {
    score += 18;
  }
});


        queryTokens.forEach((queryToken) => {
          const matched = nameTokens.some((nameToken) =>
            isLooseTokenMatch(queryToken, nameToken)
          );
        
          if (matched) {
            score += 16;
          }
        });

        inputItem.cleanName.split(" ").forEach((token) => {
          if (token && name.includes(token)) score += 10;
        });

        if (inputItem.sizeUnit && packInfo.unit === inputItem.sizeUnit) score += 18;

        if (
          inputItem.sizeValue &&
          packInfo.value &&
          inputItem.sizeUnit &&
          packInfo.unit === inputItem.sizeUnit
        ) {
          score += Math.max(0, 20 - Math.abs(packInfo.value - inputItem.sizeValue) * 5);
        }

        if (wantCheap) score += 1000 - Number(product.price || 0);
        if (wantPremium) score += Number(product.price || 0);

        return { product, score };
      })
      .filter((item) => item.score > 16)
      .sort((a, b) => b.score - a.score);
  };

  const shouldAskChoice = (inputItem: ParsedItem, matches: { product: Product; score: number }[]) => {
    if (matches.length < 2) return false;

    const topScore = matches[0].score;
    const closeMatches = matches.filter((item) => topScore - item.score <= 8);
    const genericRequest =
      inputItem.cleanName === inputItem.category ||
      inputItem.cleanName.split(" ").length <= 2;

    return genericRequest && closeMatches.length > 1 && !(inputItem.sizeValue && inputItem.sizeUnit);
  };

  const handleAdd = async (product: Product, qty = 1) => {
    setLoadingProductId(product.id);
    setLoadingText(t.checking);
    setBotMessage({ type: "loading", text: t.stockCheck });

    await new Promise((r) => setTimeout(r, 280));

    upsertCart(product, qty);
    setLoadingProductId(null);
    setLoadingText("");

    setBotMessage({
      type: "added",
      text: `${product.master_products?.name || "Item"} ${t.addedSuffix}`,
    });
  };

  const handleSelectChoice = async (choiceId: string, product: Product, qty: number) => {
    await handleAdd(product, qty);
    setPendingChoices((prev) => prev.filter((item) => item.id !== choiceId));
    setSearchQuery("");
    setShowSuggestions(false);
  };
  const handleSuggestionAdd = async (product: Product, qty = 1) => {
    await handleAdd(product, qty);
    setSearchQuery("");
    setShowSuggestions(false);
  };
  const handleDoneIntent = () => {
    if (cartProducts.length === 0) {
      setBotMessage({
        type: "ai",
        text: t.addFirst,
        items: [],
        unresolved: [],
      });
      return;
    }

    setShowSuggestions(false);
    setOrderStage("delivery");
    setBotMessage({
      type: "ai",
      text: t.chooseDelivery,
      items: [],
      unresolved: [],
    });
  };

  const finalizeOrder = (chosenPayment: string | null) => {
    if (!deliveryType || cartProducts.length === 0) return;

    const placedOrder: CompletedOrder = {
      id: `OD${Math.floor(Math.random() * 100000)}`,
      items: cartProducts.map((item) => ({ ...item })),
      subtotal,
      deliveryCharge,
      total: grandTotal,
      deliveryType,
      paymentMethod: chosenPayment,
      phone,
      address,
      etaText: deliveryType === "pickup" ? t.ready10 : t.deliveryEta,
      placedAt: new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setCompletedOrders((prev) => [placedOrder, ...prev]);
    setJustPlacedOrder(placedOrder);

    setCartProducts([]);
    setPendingChoices([]);
    setOrderStage("adding");
    setDeliveryType(null);
    setShowSuggestions(false);
    setOrderStep("summary");
    setPhone("");
    setAddress("");
    setPaymentMethod(null);
    setSearchQuery("");

    setBotMessage({
      type: "ai",
      text: `${t.orderPlaced} #${placedOrder.id}`,
      items: [],
      unresolved: [],
    });
  };

  const handleUserMessage = async () => {
    if (!searchQuery.trim()) return;

    const normalizedQuery = normalizeText(searchQuery);

    if (DONE_COMMANDS.includes(normalizedQuery)) {
      setSearchQuery("");
      handleDoneIntent();
      return;
    }

    const parsedItems = parseInput(searchQuery);
    const addedItems: Array<{ name: string; unit?: string; qty: number }> = [];
    const nextPendingChoices: PendingChoice[] = [];
    const unresolved: string[] = [];

    setBotMessage({ type: "loading", text: t.understanding });

    await new Promise((r) => setTimeout(r, 300));

    parsedItems.forEach((inputItem, index) => {
      const matches = rankMatches(inputItem, searchQuery);

      if (!matches.length) {
        unresolved.push(inputItem.raw);
        return;
      }

      const bestProduct = matches[0].product;
      const bestPack = extractPackInfo(bestProduct.master_products?.unit);

      const requestedBase =
        inputItem.sizeUnit && inputItem.sizeValue
          ? toBaseUnits(inputItem.sizeValue, inputItem.sizeUnit)
          : null;

      const bestPackBase =
        bestPack.unit && bestPack.value
          ? toBaseUnits(bestPack.value, bestPack.unit)
          : null;

      const needsMultiPack =
        requestedBase !== null &&
        bestPackBase !== null &&
        requestedBase > bestPackBase;

      if (needsMultiPack) {
        const smartPlan = buildSmartPackPlan(inputItem, matches);

        if (smartPlan && smartPlan.length) {
          smartPlan.forEach((planItem) => {
            upsertCart(planItem.product, planItem.qty);

            addedItems.push({
              name: planItem.product.master_products?.name || "Item",
              unit: planItem.product.master_products?.unit,
              qty: planItem.qty,
            });
          });
          return;
        }
      }

      const cartQty = inputItem.sizeUnit ? 1 : Math.max(1, inputItem.qty);

      if (shouldAskChoice(inputItem, matches)) {
        nextPendingChoices.push({
          id: `${inputItem.category}-${index}-${Date.now()}`,
          label: inputItem.cleanName || inputItem.category,
          requestText: inputItem.raw,
          qty: cartQty,
          products: matches.slice(0, 10).map((item) => item.product),
        });
        return;
      }

      upsertCart(bestProduct, cartQty);

      addedItems.push({
        name: bestProduct.master_products?.name || "Item",
        unit: bestProduct.master_products?.unit,
        qty: cartQty,
      });
    });

    setPendingChoices(nextPendingChoices);
    setBotMessage({
      type: "ai",
      text: buildReplyText(t, addedItems.length, nextPendingChoices.length, unresolved.length),
      items: addedItems,
      unresolved,
    });
    setSearchQuery("");
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBotMessage({
        type: "ai",
        text: "Voice input is browser me support nahi hai.",
        items: [],
        unresolved: [],
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      setSearchQuery(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page-wrap {
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.82), transparent 30%),
            linear-gradient(180deg, #efede7 0%, #e6e1d8 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .phone {
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(255,255,255,0.5);
          overflow: hidden;
          width: 100%;
          max-width: 430px;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.08);
          border-radius: 28px;
        }

        .topbar {
          background: rgba(13,13,13,0.93);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(12px);
        }

      .store-mark {
  width: 46px;
  height: 46px;
  border-radius: 15px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 18px rgba(249,115,22,0.12);
  overflow: hidden;
}
.store-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  display: block;
}

        .shopkeeper-art {
          animation: shopFloat 2.8s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes shopFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }

        .topbar-info { flex: 1; min-width: 0; }

        .topbar-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .topbar-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .lang-pill {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.07);
          border: 0.5px solid rgba(255,255,255,0.12);
          border-radius: 22px;
          padding: 3px;
          gap: 2px;
          flex-shrink: 0;
        }

        .lang-opt {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.38);
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.18s;
          border: none;
          background: transparent;
        }

        .lang-opt.active {
          background: rgba(255,255,255,0.18);
          color: #fff;
        }

        .chat {
          flex: 1;
          padding: 14px 12px 96px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        .date-chip {
          text-align: center;
          font-size: 10px;
          color: #999;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .msg-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

      .bot-avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 18px rgba(249,115,22,0.12);
  border: 1px solid rgba(249,115,22,0.12);
  overflow: hidden;
}
.bot-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  display: block;
}

        .bubble {
          padding: 10px 12px;
          font-size: 13px;
          line-height: 1.5;
          border-radius: 16px;
        }

        .bubble.bot {
          border-radius: 8px 16px 16px 16px;
          color: #0d0d0d;
          padding: 10px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
          width: calc(100% - 42px);
        }

        .bubble-time {
          font-size: 10px;
          display: block;
          margin-top: 3px;
          color: #aaa;
        }

        .popular-label {
          font-size: 11px;
          color: #888;
        }

        .popular-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 9px;
          width: 100%;
        }

        .product-card {
          position: relative;
          border-radius: 16px;
          border: 0.5px solid rgba(0,0,0,0.08);
          background: #fff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          min-width: 148px;
          scroll-snap-align: start;
        }

        .product-card.compact {
          min-width: 0;
          width: 100%;
        }

        .product-card.is-disabled {
          opacity: 0.7;
          pointer-events: none;
        }

        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        .product-card.added {
          border-color: rgba(34,197,94,0.24);
          box-shadow: 0 8px 22px rgba(34,197,94,0.08);
        }

        .product-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 2;
          font-size: 9px;
          font-weight: 700;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 999px;
          padding: 3px 7px;
          color: #374151;
        }

        .product-img {
          height: 108px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
        }

        .product-card.compact .product-img {
          height: 90px;
          padding: 4px;
        }

        .product-body {
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .product-name {
          font-size: 13px;
          font-weight: 600;
          color: #111;
          line-height: 1.25;
          margin-bottom: 2px;
          margin-top: 4px;
          word-break: break-word;
        }

        .product-card.compact .product-name {
          font-size: 11px;
          min-height: 28px;
        }

        .product-price {
          font-size: 13px;
          color: #15803d;
          font-weight: 700;
          margin: 2px 0;
        }

        .product-card.compact .product-price {
          font-size: 11px;
        }

        .product-unit {
          font-size: 11px;
          color: #8a8a8a;
          margin-bottom: 6px;
          min-height: 14px;
        }

        .product-card.compact .product-unit {
          font-size: 10px;
          min-height: 24px;
        }

        .add-btn {
          width: 100%;
          height: 28px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          background: linear-gradient(135deg, #0d0d0d, #2b2b2b);
          color: #fff;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .add-btn:disabled,
        .step-btn:disabled,
        .capsule-btn:disabled,
        .place-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .product-card.compact .add-btn {
          height: 26px;
          font-size: 9px;
          border-radius: 8px;
        }

        .loading-btn {
          height: 28px;
          width: 100%;
          border-radius: 9px;
          background: #f5f5f5;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #333;
        }

        .loader {
          width: 10px;
          height: 10px;
          border: 2px solid #ddd;
          border-top: 2px solid #111;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .stepper-btn {
          background: #f5f5f3;
          border: 0.5px solid rgba(0,0,0,0.1);
          justify-content: space-between;
          padding: 0 4px;
          cursor: default;
        }

        .step-btn {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: rgba(0,0,0,0.07);
          border: none;
          color: #0d0d0d;
          font-size: 13px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-count {
          font-size: 11px;
          font-weight: 500;
          color: #0d0d0d;
        }

        .input-bar {
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(18px);
          padding: 10px 12px calc(14px + env(safe-area-inset-bottom));
          border-top: 0.5px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 20;
          box-shadow: 0 -4px 12px rgba(0,0,0,0.04);
        }

        .input-pill {
          flex: 1;
          background: #f5f5f3;
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 22px;
          padding: 11px 15px;
          font-size: 13px;
          color: #111;
          outline: none;
          min-width: 0;
        }

        .input-pill::placeholder {
          color: #9ca3af;
        }

        .icon-btn-ghost,
        .icon-btn-dark {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
          border: none;
        }

        .icon-btn-ghost {
          background: linear-gradient(135deg, #ffffff, #f3f4f6);
          border: 1px solid rgba(0,0,0,0.08);
          color: #111827;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
        }

        .icon-btn-ghost.mic-active {
          color: #111827;
          border-color: rgba(59,130,246,0.22);
          box-shadow: 0 0 0 6px rgba(59,130,246,0.12), 0 12px 24px rgba(59,130,246,0.12);
        }

        .icon-btn-dark {
          background: linear-gradient(135deg, #0d0d0d, #27272a);
          color: #fff;
          box-shadow: 0 8px 18px rgba(0,0,0,0.12);
        }

        .added-products {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 6px;
        }

        .added-animation {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #2e7d32;
        }

        .added-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2e7d32;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .cart-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .order-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 6px;
        }

        .capsule-btn {
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .capsule-btn.light {
          background: #f5f5f5;
          border: 1px solid rgba(0,0,0,0.08);
          color: #333;
        }

        .capsule-btn.dark {
          background: #0d0d0d;
          color: white;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .strip-section {
          margin-top: 12px;
        }

        .strip-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .strip-sub {
          font-size: 11px;
          color: #777;
          margin-bottom: 8px;
        }

        .horizontal-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 6px;
          scroll-snap-type: x mandatory;
        }

        .horizontal-strip::-webkit-scrollbar {
          display: none;
        }

        .summary-bubble {
          width: 100%;
          max-width: 100%;
        }

        .summary-title,
        .delivery-title,
        .history-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .summary-card,
        .history-card,
        .success-card {
          background: #fff;
          border-radius: 16px;
          padding: 12px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
        }

        .history-card {
          margin-top: 10px;
          background: linear-gradient(180deg, #fffdfa 0%, #f8f8f8 100%);
        }

        .history-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .history-id {
          font-size: 12px;
          font-weight: 700;
          color: #111827;
        }

        .history-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(0,0,0,0.06);
          color: #111827;
        }

        .history-meta {
          font-size: 11px;
          color: #777;
          margin-bottom: 10px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .summary-item img {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #f5f5f5;
          padding: 4px;
          object-fit: contain;
        }

        .summary-info { flex: 1; }
        .summary-name { font-size: 12px; font-weight: 600; }
        .summary-meta { font-size: 11px; color: #777; }
        .summary-price { font-weight: 600; }

        .summary-row,
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-top: 6px;
        }

        .summary-total {
          font-weight: 700;
          margin-top: 8px;
          font-size: 14px;
        }

        .summary-divider {
          height: 1px;
          background: #eee;
          margin: 10px 0;
        }

        .place-btn {
          margin-top: 12px;
          width: 100%;
          padding: 11px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0d0d0d, #2a2a2a);
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 13px;
          transition: 0.2s;
        }

        .delivery-options,
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .delivery-card,
        .pay-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .delivery-card.active,
        .pay-card.active {
          border: 1.5px solid #0d0d0d;
          background: #f9f9f9;
        }

        .delivery-left,
        .pay-left {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .delivery-name,
        .pay-name {
          font-size: 13px;
          font-weight: 600;
          color: #111;
        }

        .delivery-sub,
        .pay-sub {
          font-size: 11px;
          color: #777;
        }

        .delivery-right,
        .pay-check {
          font-size: 12px;
          font-weight: 600;
          color: #0d0d0d;
        }

        .pay-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0d0d0d;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input {
          width: 100%;
          padding: 11px;
          margin-top: 10px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          font-size: 13px;
          outline: none;
          transition: 0.2s;
        }

        .success-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .success-checkmark {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .success-heading {
          font-size: 15px;
          font-weight: 600;
        }

        .success-id {
          font-size: 11px;
          color: #777;
          margin-top: 2px;
        }

        .success-divider {
          height: 1px;
          background: #eee;
          margin: 12px 0;
        }

        .success-details {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #555;
        }

        .success-time {
          font-weight: 600;
          color: #111;
        }

        @media (max-width: 480px) {
          .page-wrap { padding: 0; }
          .phone {
            max-width: 100%;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>

      <div className="page-wrap">
        <div className="phone">
          <div className="topbar">
          <div className="store-mark">
  <img src="/shops.jpg" alt="shopkeeper" />
</div>

            <div className="topbar-info">
              <div className="topbar-name">{t.storeName}</div>
              <div className="topbar-sub">
                <div className="live-dot" />
                <span>{t.storeSub}</span>
              </div>
            </div>

            <div className="lang-pill">
              <button className={`lang-opt${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>
                EN
              </button>
              <button className={`lang-opt${lang === "hi" ? " active" : ""}`} onClick={() => setLang("hi")}>
                हि
              </button>
            </div>
          </div>

          <div className="chat">
            <div className="date-chip">{t.today}</div>

            <div className="msg-row">
              <BotAvatar />
              <div className="bubble bot">
                {t.greeting}
                <span className="bubble-time">9:41 AM</span>
              </div>
            </div>

            <div className="msg-row">
              <BotAvatar />
              <div className="bubble bot">
                <span className="popular-label">{t.popular}</span>
                <span className="bubble-time" style={{ marginBottom: 7 }}>9:41 AM</span>

                <div className="popular-grid">
                {popularProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      index={i}
                      compact
                      name={product.master_products?.name || "Product"}
                      price={`₹${product.price}`}
                      unit={product.master_products?.unit}
                      image={product.master_products?.image}
                      count={getCartQty(cartProducts, product.id)}
                      loading={loadingProductId === product.id}
                      loadingText={loadingText}
                      onAdd={() => {
                        handleAdd(product, 1);
                        setSearchQuery("");
                      }}
                      onInc={() => updateCartQty(product.id, 1)}
                      onDec={() => updateCartQty(product.id, -1)}
                      addLabel={t.add}
                    />
                  ))}
                </div>
              </div>
            </div>

            {completedOrders.length > 0 && (
              <div className="msg-row">
                <BotAvatar />
                <div className="bubble bot summary-bubble">
                <div className="history-title">{t.previousOrders}</div>

                  {completedOrders.map((order) => (
                    <div key={order.id} className="history-card">
                      <div className="history-head">
                        <div className="history-id">#{order.id}</div>
                        <div className="history-badge">{t.placed}</div>
                      </div>

                      <div className="history-meta">
                      {order.deliveryType === "pickup" ? t.pickupLabel : t.deliveryLabel} • {order.placedAt}
                      </div>

                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.product.id}`} className="summary-item">
                          <img src={item.product.master_products?.image || "/placeholder-product.png"} alt={item.product.master_products?.name || "Product"} />
                          <div className="summary-info">
                            <div className="summary-name">{item.product.master_products?.name}</div>
                            <div className="summary-meta">
                              ₹{item.product.price} × {item.qty}
                            </div>
                          </div>
                          <div className="summary-price">₹{item.product.price * item.qty}</div>
                        </div>
                      ))}

                      <div className="summary-divider"></div>

                      <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal}</span>
                      </div>

                      {order.deliveryCharge > 0 && (
                        <div className="summary-row">
                          <span>Delivery</span>
                          <span>₹{order.deliveryCharge}</span>
                        </div>
                      )}

                      <div className="summary-total">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {justPlacedOrder && (
              <div className="msg-row">
                <BotAvatar />
                <div className="bubble bot">
                  <div className="success-card">
                    <div className="success-top">
                      <div className="success-checkmark">✓</div>
                      <div>
                      <div className="success-heading">{t.orderPlaced}</div>
                        <div className="success-id">#{justPlacedOrder.id}</div>
                      </div>
                    </div>

                    <div className="success-divider"></div>

                    <div className="success-details">
                    <div>{t.preparing}</div>
                      <div className="success-time">{justPlacedOrder.etaText}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(botMessage || cartProducts.length > 0 || pendingChoiceCards.length > 0 || (searchQuery.trim() && liveSuggestions.length > 0)) ? (
              <div className="msg-row">
                <BotAvatar />
                <div className="bubble bot">
                  {botMessage?.type === "loading" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div className="loader"></div>
                      {botMessage.text}
                    </div>
                  )}

                  {botMessage?.type === "added" && (
                    <div className="added-animation">
                      <div className="added-check">✓</div>
                      <div>{botMessage.text}</div>
                    </div>
                  )}

                  {botMessage?.type === "ai" && (
                    <div>
                      <div style={{ fontSize: "13px", marginBottom: "8px", fontWeight: "600" }}>
                        {botMessage.text}
                      </div>

                      {botMessage.items.map((item, i) => (
                        <div key={i} style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>
                          ✓ {item.name} {item.unit ? `(${item.unit})` : ""} × {item.qty}
                        </div>
                      ))}

                      {botMessage.unresolved.length > 0 && (
                        <div style={{ fontSize: "12px", color: "#b45309", marginTop: "8px" }}>
                          Ye clear nahi hua: {botMessage.unresolved.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {cartProducts.length > 0 && (
                    <div className="cart-section">
                      <div className="summary-title" style={{ marginBottom: 0 }}>
                        {t.cartTitle}
                      </div>

                      <div className="added-products">
                        {cartProducts.map((item, index) => (
                          <ProductCard
                            key={item.product.id}
                            index={index}
                            name={item.product.master_products?.name || "Product"}
                            price={`₹${item.product.price}`}
                            unit={item.product.master_products?.unit}
                            image={item.product.master_products?.image}
                            count={item.qty}
                            onAdd={() => {}}
                            onInc={() => updateCartQty(item.product.id, 1)}
                            onDec={() => updateCartQty(item.product.id, -1)}
                            addLabel={t.add}
                          />
                        ))}
                      </div>

                      {pendingChoiceCards.length > 0 && (
                        <div className="strip-section">
                          <div className="strip-title">{t.choose}</div>
                          <div className="strip-sub">{t.exactOptionsSub}</div>

                          <div className="horizontal-strip">
                            {pendingChoiceCards.map((entry, i) => (
                              <ProductCard
                                key={`${entry.choiceId}-${entry.product.id}`}
                                index={i}
                                badge={entry.choiceLabel}
                                name={entry.product.master_products?.name || "Product"}
                                price={`₹${entry.product.price}`}
                                unit={entry.product.master_products?.unit}
                                image={entry.product.master_products?.image}
                                count={getCartQty(cartProducts, entry.product.id)}
                                onAdd={() => handleSelectChoice(entry.choiceId, entry.product, entry.qty)}
                                onInc={() => updateCartQty(entry.product.id, 1)}
                                onDec={() => updateCartQty(entry.product.id, -1)}
                                addLabel={t.select}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {searchQuery.trim() && liveSuggestions.length > 0 && (
                        <div className="strip-section">
                          <div className="strip-title">{t.smart}</div>
                          <div className="strip-sub">{t.typingSub}</div>

                          <div className="horizontal-strip">
                            {liveSuggestions.map((product, i) => (
                              <ProductCard
                                key={product.id}
                                index={i}
                                name={product.master_products?.name || "Product"}
                                price={`₹${product.price}`}
                                unit={product.master_products?.unit}
                                image={product.master_products?.image}
                                count={getCartQty(cartProducts, product.id)}
                                onAdd={() => handleSuggestionAdd(product, 1)}
                                onInc={() => updateCartQty(product.id, 1)}
                                onDec={() => updateCartQty(product.id, -1)}
                                addLabel={t.add}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {orderStage === "adding" && cartProducts.length > 0 && (
                        <div className="order-actions">
                         <button
  className="capsule-btn light"
  onClick={() => {
    setOrderStage("adding");
    setShowSuggestions((prev) => !prev);
  }}
>
  {showSuggestions ? "Close" : `+ ${t.more}`}
</button>

                          <button
                            className="capsule-btn dark"
                            onClick={() => {
                              setOrderStage("delivery");
                              setShowSuggestions(false);
                            }}
                          >
                           {t.done} →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {cartProducts.length === 0 && pendingChoiceCards.length > 0 && (
                    <div className="strip-section">
                      <div className="strip-title">{t.choose}</div>
                      <div className="strip-sub">Single line me exact options</div>

                      <div className="horizontal-strip">
                        {pendingChoiceCards.map((entry, i) => (
                          <ProductCard
                            key={`${entry.choiceId}-${entry.product.id}`}
                            index={i}
                            badge={entry.choiceLabel}
                            name={entry.product.master_products?.name || "Product"}
                            price={`₹${entry.product.price}`}
                            unit={entry.product.master_products?.unit}
                            image={entry.product.master_products?.image}
                            count={getCartQty(cartProducts, entry.product.id)}
                            onAdd={() => handleSelectChoice(entry.choiceId, entry.product, entry.qty)}
                            onInc={() => updateCartQty(entry.product.id, 1)}
                            onDec={() => updateCartQty(entry.product.id, -1)}
                            addLabel={t.select}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {cartProducts.length === 0 && searchQuery.trim() && liveSuggestions.length > 0 && (
                    <div className="strip-section">
                      <div className="strip-title">{t.smart}</div>
                      <div className="strip-sub">{t.typingSub}</div>

                      <div className="horizontal-strip">
                        {liveSuggestions.map((product, i) => (
                          <ProductCard
                            key={product.id}
                            index={i}
                            name={product.master_products?.name || "Product"}
                            price={`₹${product.price}`}
                            unit={product.master_products?.unit}
                            image={product.master_products?.image}
                            count={getCartQty(cartProducts, product.id)}
                            onAdd={() => handleSuggestionAdd(product, 1)}
                            onInc={() => updateCartQty(product.id, 1)}
                            onDec={() => updateCartQty(product.id, -1)}
                            addLabel={t.add}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {orderStage === "delivery" && !showSuggestions && (
              <div className="msg-row" ref={deliveryRef}>
                <BotAvatar />
                <div className="bubble bot summary-bubble">
                <div className="delivery-title">{t.deliveryTitle}</div>

                  <div className="delivery-options">
                    <div
                      className={`delivery-card ${deliveryType === "pickup" ? "active" : ""}`}
                      onClick={() => {
                        setDeliveryType("pickup");
                        setOrderStep("summary");
                      }}
                    >
                      <div className="delivery-left">
                      <div className="delivery-name">{t.selfPickup}</div>
                      <div className="delivery-sub">{t.ready10}</div>
                      </div>
                      <div className="delivery-right">{t.free}</div>
                    </div>

                    <div
                      className={`delivery-card ${deliveryType === "delivery" ? "active" : ""}`}
                      onClick={() => {
                        setDeliveryType("delivery");
                        setOrderStep("summary");
                      }}
                    >
                      <div className="delivery-left">
                      <div className="delivery-name">{t.homeDelivery}</div>
                      <div className="delivery-sub">{t.deliveryInfo}</div>
                      </div>
                      <div className="delivery-right">₹20</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showSuggestions && orderStage !== "delivery" && (
              <div className="msg-row">
                <BotAvatar />
                <div className="bubble bot summary-bubble">
                  <div className="strip-title">{t.more}</div>
                  <div className="horizontal-strip">
                    {products
                      .filter((p) => !cartProducts.some((c) => c.product.id === p.id))
                      .slice(0, 10)
                      .map((product, i) => (
                        <ProductCard
                          key={product.id}
                          index={i}
                          name={product.master_products?.name || "Product"}
                          price={`₹${product.price}`}
                          unit={product.master_products?.unit}
                          image={product.master_products?.image}
                          count={0}
                          onAdd={() => {
                            handleAdd(product, 1);
                            setShowSuggestions(false);
                          }}
                          onInc={() => {}}
                          onDec={() => {}}
                          addLabel={t.add}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {deliveryType && cartProducts.length > 0 && (
              <div className="msg-row">
                <BotAvatar />
                <div className="bubble bot summary-bubble">
                <div className="summary-title">{t.orderSummary}</div>

                  <div className="summary-card">
                    {cartProducts.map((item) => (
                      <div key={item.product.id} className="summary-item">
                        <img
                          src={item.product.master_products?.image || "/placeholder-product.png"}
                          alt={item.product.master_products?.name || "Product"}
                        />
                        <div className="summary-info">
                          <div className="summary-name">{item.product.master_products?.name}</div>
                          <div className="summary-meta">
                            ₹{item.product.price} × {item.qty}
                          </div>
                        </div>
                        <div className="summary-price">₹{item.product.price * item.qty}</div>
                      </div>
                    ))}

                    <div className="summary-divider"></div>

                    <div className="summary-row">
                    <span>{t.subtotal}</span>
                      <span>₹{subtotal}</span>
                    </div>

                    {deliveryType === "delivery" && (
                      <div className="summary-row">
                       <span>{t.delivery}</span>
                        <span>₹20</span>
                      </div>
                    )}

                    <div className="summary-total">
                    <span>{t.total}</span>
                      <span>₹{grandTotal}</span>
                    </div>

                    <button
                      disabled={orderStep !== "summary"}
                      className="place-btn"
                      onClick={() => setOrderStep("details")}
                    >
                    {t.continue}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {orderStep === "details" && cartProducts.length > 0 && (
              <div className="msg-row" ref={detailsRef}>
                <BotAvatar />
                <div className="bubble bot">
                  <div className="summary-title">
                  {deliveryType === "pickup" ? t.phoneTitle : t.detailsTitle}
                  </div>

                  <input
                    className="input"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  {deliveryType === "delivery" && (
                    <input
                      className="input"
                      placeholder={t.addressPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  )}

                  <button
                    className="place-btn"
                    onClick={() => {
                      if (phone.length !== 10) {
                        alert(t.validPhoneAlert);
                        return;
                      }

                      if (deliveryType === "delivery" && !address) {
                        alert(t.addressAlert);
                        return;
                      }

                      if (deliveryType === "pickup") {
                        finalizeOrder("pickup");
                      } else {
                        setOrderStep("payment");
                      }
                    }}
                  >
                   {deliveryType === "pickup" ? t.placeOrder : t.choosePayment}
                  </button>
                </div>
              </div>
            )}

            {orderStep === "payment" && deliveryType === "delivery" && cartProducts.length > 0 && (
              <div className="msg-row" ref={paymentRef}>
                <BotAvatar />
                <div className="bubble bot">
                <div className="summary-title">{t.paymentTitle}</div>

                  <div className="payment-options">
                    <div
                      className={`pay-card ${paymentMethod === "cod" ? "active" : ""}`}
                      onClick={() => {
                        setPaymentMethod("cod");
                        setTimeout(() => {
                          finalizeOrder("cod");
                        }, 300);
                      }}
                    >
                      <div className="pay-left">
                      <div className="pay-name">{t.cod}</div>
                      <div className="pay-sub">{t.codSub}</div>
                      </div>
                      {paymentMethod === "cod" && <div className="pay-check">✓</div>}
                    </div>

                    <div
                      className={`pay-card ${paymentMethod === "upi" ? "active" : ""}`}
                      onClick={() => {
                        setPaymentMethod("upi");

                        const upiId = "shop@upi";
                        const name = "Your Store";
                        const amount = grandTotal;
                        const url = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

                        window.location.href = url;

                        setTimeout(() => {
                          finalizeOrder("upi");
                        }, 3000);
                      }}
                    >
                      <div className="pay-left">
                      <div className="pay-name">{t.upi}</div>
                      <div className="pay-sub">{t.upiSub}</div>
                      </div>
                      {paymentMethod === "upi" && <div className="pay-check">✓</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="input-bar">
            <input
              className="input-pill"
              placeholder={prompts[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUserMessage();
                }
              }}
            />

            <button
              className={`icon-btn-ghost${isListening ? " mic-active" : ""}`}
              onClick={startVoice}
              aria-label="Start voice typing"
            >
              <ProMicIcon listening={isListening} />
            </button>

            <button className="icon-btn-dark" onClick={handleUserMessage}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
