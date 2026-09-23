import { CraftCategory, Language, ProductListing } from '../types';
import { translate } from './translations';
import { getStoredTranslation, queuePhrasesForTranslation } from './hybridTranslation';

/**
 * Common Craft Techniques static translations for popular Indian languages.
 * Hybrid runtime translation handles any remaining languages and techniques.
 */
const COMMON_TECHNIQUES: Record<string, Partial<Record<Language, string>>> = {
  'Double Ikat Pit-Loom Weaving': {
    hi: 'डबल इकत पिट-लूम हथकरघा बुनाई',
    te: 'డబుల్ ఇకత్ పిట్-లూమ్ చేనేత నేత',
    ta: 'இரட்டை இக்கத் குழி-தறி நெசவு',
    bn: 'ডাবল ইক্যাত পিট-লুম তাঁত বুনন',
    mr: 'डबल इकत खड्डा-माग हातमाग विणकाम',
    gu: 'ડબલ ઇકત પીટ-લૂમ હાથવણાટ'
  },
  'Lost-Wax Casting (Cire Perdue)': {
    hi: 'प्राचीन मोम-सांचा कांस्य ढलाई (ढोकरा)',
    te: 'పురాతన మైనపు అచ్చు కాంస్య పోత (సిరే పెర్డ్యూ)',
    ta: 'பண்டைய மெழுகு வார்ப்பு வெண்கல கலை',
    bn: 'প্রাচীন মোমের ছাঁচ ঢালাই (ধোকরা)',
    mr: 'प्राचीन मेण-साचा कांस्य ओतकाम (ढोकरा)',
    gu: 'પ્રાચીન મીણ-બીબાં કાંસ્ય ઢાળકામ (ઢોકરા)'
  },
  'Ancient Lost-Wax Casting (Cire Perdue)': {
    hi: 'प्राचीन मोम-सांचा कांस्य ढलाई (ढोकरा)',
    te: 'పురాతన మైనపు అచ్చు కాంస్య పోత',
    ta: 'பண்டைய மெழுகு வார்ப்பு கலை',
    bn: 'প্রাচীন মোম-ছাঁচ ব্রোঞ্জ ঢালাই',
    mr: 'प्राचीन मेण-साचा कांस्य ओतकाम',
    gu: 'પ્રાચીન મીણ-બીબાં કાંસ્ય ઢાળકામ'
  },
  'Wheel-Thrown & Hand-Etched Clay Firing': {
    hi: 'चाक पर ढली व हाथ से नक्काशीदार मिट्टी भट्टी पकाई',
    te: 'కుమ్మరి చక్రం & చేతితో చెక్కిన మట్టి కాల్చడం',
    ta: 'சக்கர சுழற்சி & கைவினை மண்பாண்ட சுடுதல்',
    bn: 'চাকার সাহায্যে তৈরি ও হাতে নকশা করা মাটির পাত্র',
    mr: 'चाकावर घडवलेली व हाताने कोरीव काम केलेली माती भाजणी',
    gu: 'ચાકડા પર ઢાળેલ અને હાથથી કોતરેલ માટીકામ'
  },
  'Twig & Nib Hand-Painting with Botanical Dyes': {
    hi: 'बांस की तीली व वानस्पतिक रंगों से हस्त-चित्रकारी',
    te: 'వెదురు పుల్లలు & సహజ రంగులతో చేతి చిత్రకళ',
    ta: 'மூங்கில் குச்சிகள் & இயற்கை சாயங்கள் கொண்டு கை ஓவியம்',
    bn: 'বাঁশের কাঠি ও প্রাকৃতিক উদ্ভিজ্জ রঙের হস্তচিত্রকলা',
    mr: 'बांबूच्या काडीने व नैसर्गिक रंगांनी केलेली हस्तचित्रे',
    gu: 'વાંસની સળી અને વનસ્પતિ રંગોથી હસ્ત-ચિત્રકામ'
  },
  'Twig & Nib Hand-Painting with Botanical Pigments': {
    hi: 'बांस की तीली व वानस्पतिक रंगों से हस्त-चित्रकारी',
    te: 'వెదురు పుల్లలు & సహజ రంగులతో చేతి చిత్రకళ',
    ta: 'மூங்கில் குச்சிகள் & இயற்கை சாயங்கள் கொண்டு கை ஓவியம்',
    bn: 'বাঁশের কাঠি ও প্রাকৃতিক উদ্ভিজ্জ রঙের হস্তচিত্রকলা',
    mr: 'बांबूच्या काडीने व नैसर्गिक रंगांनी केलेली हस्तचित्रे',
    gu: 'વાંસની સળી અને વનસ્પતિ રંગોથી હસ્ત-ચિત્રકામ'
  },
  'Kadhwa Handloom Weaving with Tested Zari': {
    hi: 'शुद्ध कढ़वा हथकरघा बुनाई व प्रमाणित जरी',
    te: 'పరీక్షించిన జరీతో కద్వా చేనేత నేత',
    ta: 'பரிசோதிக்கப்பட்ட ஜரியுடன் கத்வா கைத்தறி நெசவு',
    bn: 'পরীক্ষিত জরি সহ কধোয়া তাঁত বুনন',
    mr: 'प्रमाणित जरीसह कढवा हातमाग विणकाम',
    gu: 'પ્રમાણિત જરી સાથે કઢવા હાથવણાટ'
  },
  'Hand-Spun Weaving & Sozni Needle Embroidery': {
    hi: 'हस्त-कताई बुनाई व सोज़नी सुई कशीदाकारी',
    te: 'చేతితో వడికిన నేత & సోజ్నీ సూది ఎంబ్రాయిడరీ',
    ta: 'கைநூல் நெசவு & சோஸ்னி ஊசி எம்ப்ராய்டரி',
    bn: 'হাতে কাটা সুতোর বুনন ও সোজনি সুচিশিল্প',
    mr: 'हात-कातलेले विणकाम व सोजनी सुई भरतकाम',
    gu: 'હાથ-કાંતેલ વણાટ અને સોઝની સોય ભરતકામ'
  },
  'Hand-Chiseled Relief Wood Carving': {
    hi: 'छेनी से हाथ द्वारा नक्काशीदार काष्ठ शिल्प',
    te: 'చేతి ఉలితో చెక్కిన రిలీఫ్ కలప చెక్కడాలు',
    ta: 'கை உளி கொண்டு செதுக்கப்பட்ட மரச் சிற்பம்',
    bn: 'হাত-ছেনি দিয়ে খোদাই করা কাঠের শিল্প',
    mr: 'हाताने छिन्नीने कोरलेले लाकडी शिल्प',
    gu: 'હાથથી છીણી વડે કોતરેલ લાકડાનું શિલ્પ'
  },
  'Traditional Handloom Weaving': {
    hi: 'पारंपरिक हथकरघा बुनाई',
    te: 'సాంప్రదాయ చేనేత నేత',
    ta: 'பாரம்பரிய கைத்தறி நெசவு',
    bn: 'ঐতিহ্যবাহী তাঁত বুনন',
    mr: 'पारंपारिक हातमाग विणकाम',
    gu: 'પરંપરાગત હાથવણાટ'
  },
  'Double Ikat Handloom': {
    hi: 'डबल इकत हथकरघा',
    te: 'డబుల్ ఇకత్ చేనేత',
    ta: 'இரட்டை இக்கத் கைத்தறி',
    bn: 'ডাবল ইক্যাত তাঁত',
    mr: 'डबल इकत हातमाग',
    gu: 'ડબલ ઇકત હાથવણાટ'
  }
};

/**
 * Common Primary Materials static translations
 */
const COMMON_MATERIALS: Record<string, Partial<Record<Language, string>>> = {
  '100% Pure Mulberry Silk & Zari Thread': {
    hi: '100% शुद्ध मलबरी रेशम और जरी का धागा',
    te: '100% స్వచ్ఛమైన మల్బరీ పట్టు & జరీ దారం',
    ta: '100% தூய மல்பெரி பட்டு & ஜரி நூல்',
    bn: '১০০% খাঁটি তুঁত রেশম ও জরির সুতো',
    mr: '100% शुद्ध मलबरी रेशीम आणि जरीचा धागा',
    gu: '100% શુદ્ધ મલબરી રેશમ અને જરીનો દોરો'
  },
  'Pure Handloom Silk & Natural Dyes': {
    hi: 'शुद्ध हथकरघा रेशम और प्राकृतिक वानस्पतिक रंग',
    te: 'స్వచ్ఛమైన చేనేత పట్టు & సహజ రంగులు',
    ta: 'தூய கைத்தறி பட்டு & இயற்கை சாயங்கள்',
    bn: 'খাঁটি তাঁতের রেশম ও প্রাকৃতিক রং',
    mr: 'शुद्ध हातमाग रेशीम आणि नैसर्गिक रंग',
    gu: 'શુદ્ધ હાથવણાટ રેશમ અને કુદરતી રંગો'
  },
  'Cast Bell-Metal & Brass Alloy': {
    hi: 'कांस्य बेल-मेटल व पीतल मिश्र धातु',
    te: 'కంచు బెల్-మెటల్ & ఇత్తడి మిశ్రమం',
    ta: 'வெண்கலம் & பித்தளை கலவை உலோகம்',
    bn: 'কাঁসা বেল-মেটাল ও পিতলের সংকর ধাতু',
    mr: 'कांस्य बेल-मेटल आणि पितळ मिश्रधातू',
    gu: 'કાંસ્ય બેલ-મેટલ અને પિત્તળ મિશ્રધાતુ'
  },
  'Brass & Bell Metal Alloy': {
    hi: 'पीतल व कांस्य घंटी धातु मिश्र धातु',
    te: 'ఇత్తడి & కంచు మిశ్రమం',
    ta: 'பித்தளை & வெண்கல கலவை',
    bn: 'পিতল ও কাঁসার সংকর ধাতু',
    mr: 'पितळ आणि कांस्य धातू',
    gu: 'પિત્તળ અને કાંસ્ય મિશ્રધાતુ'
  },
  'River Alluvial Clay & Natural Ochre': {
    hi: 'नदी की जलोढ़ मिट्टी और प्राकृतिक गेरू रंग',
    te: 'నదీ ఒండ్రు మట్టి & సహజ కాషాయ రంగు',
    ta: 'ஆற்று வண்டல் களிமண் & இயற்கை காவி வண்ணம்',
    bn: 'নদীর পলল মাটি ও প্রাকৃতিক গিরিমাটি রং',
    mr: 'नदीची गाळाची माती आणि नैसर्गिक गेरू रंग',
    gu: 'નદીની કાંપવાળી માટી અને કુદરતી ગેરુ રંગ'
  },
  'Alluvial River Clay & Natural Mineral Ochre': {
    hi: 'नदी की जलोढ़ मिट्टी और प्राकृतिक खनिज गेरू',
    te: 'నదీ ఒండ్రు మట్టి & సహజ ఖనిజ రంగు',
    ta: 'ஆற்று வண்டல் களிமண் & இயற்கை கனிம வண்ணம்',
    bn: 'নদীর পলল মাটি ও প্রাকৃতিক খনিজ রং',
    mr: 'नदीची गाळाची माती आणि नैसर्गिक खनिज रंग',
    gu: 'નદીની કાંપવાળી માટી અને કુદરતી ખનિજ ગેરુ'
  },
  'Handmade Khadi Sheet & Natural Herbal Pigments': {
    hi: 'हस्तनिर्मित खादी शीट व प्राकृतिक हर्बल रंग',
    te: 'చేతితో చేసిన ఖాదీ షీట్ & సహజ మూలికా రంగులు',
    ta: 'கைவினை கதர் தாள் & இயற்கை மூலிகை வண்ணங்கள்',
    bn: 'হস্তনির্মিত খাদি কাগজ ও প্রাকৃতিক ভেষজ রং',
    mr: 'हस्तनिर्मित खादी कागद आणि नैसर्गिक वनस्पती रंग',
    gu: 'હાથબનાવટ ખાદી શીટ અને કુદરતી ઔષધીય રંગો'
  },
  'Handmade Khadi Sheet & Organic Herbal Pigments': {
    hi: 'हस्तनिर्मित खादी शीट व जैविक हर्बल रंग',
    te: 'చేతితో చేసిన ఖాదీ కాగితం & సహజ మూలికా రంగులు',
    ta: 'கைவினை கதர் தாள் & இயற்கை மூலிகை வண்ணங்கள்',
    bn: 'হস্তনির্মিত খাদি কাগজ ও প্রাকৃতিক ভেষজ রং',
    mr: 'हस्तनिर्मित खादी कागद आणि सेंद्रिय वनस्पती रंग',
    gu: 'હાથબનાવટ ખાદી શીટ અને જૈવિક ઔષધીય રંગો'
  },
  '100% Grade-A Changthangi Cashmere Wool': {
    hi: '100% ग्रेड-ए चांगथांगी कश्मीरी पश्मीना ऊन',
    te: '100% గ్రేడ్-ఎ చాంగ్‌థాంగి కాశ్మీరీ ఉన్ని',
    ta: '100% தரம்-ஏ சாங்தாங்கி காஷ்மீர் கம்பளி',
    bn: '১০০% গ্রেড-এ চাংথাঙ্গি কাশ্মিরী পশম',
    mr: '100% ग्रेड-ए चांगथांगी काश्मिरी पश्मिना लोकर',
    gu: '100% ગ્રેડ-એ ચાંગથાંગી કાશ્મીરી પશ્મીના ઊન'
  },
  'Seasoned Teakwood & Sheesham': {
    hi: 'परिपक्व सागौन व शीशम की ठोस लकड़ी',
    te: 'పక్వత చెందిన టేకు & శీశమ్ కలప',
    ta: 'பக்குவப்படுத்தப்பட்ட தேக்கு & ஈட்டி மரம்',
    bn: 'পরিপক্ক সেগুন ও শিশু কাঠ',
    mr: 'परिपक्व सागवान आणि शीशम लाकूड',
    gu: 'પરિપક્વ સાગ અને સીસમ લાકડું'
  },
  '100% Pure Mulberry Silk & Gold Tested Zari': {
    hi: '100% शुद्ध मलबरी रेशम और स्वर्ण परीक्षित जरी',
    te: '100% స్వచ్ఛమైన మల్బరీ పట్టు & బంగారు పరీక్షిత జరీ',
    ta: '100% தூய மல்பெரி பட்டு & தங்க பரிசோதிக்கப்பட்ட ஜரி',
    bn: '১০০% খাঁটি তুঁত রেশম ও স্বর্ণ পরীক্ষিত জরি',
    mr: '100% शुद्ध मलबरी रेशीम आणि सुवर्ण प्रमाणित जरी',
    gu: '100% શુદ્ધ મલબરી રેશમ અને ગોલ્ડ ટેસ્ટેડ જરી'
  }
};

/**
 * Returns the localized title of a product.
 * Supports all 21 languages via static dictionary, Devanagari family fallback,
 * and SARAL-AI-inspired dynamic runtime cache with automatic background batching.
 */
export function getProductTitle(product: ProductListing, lang: Language): string {
  if (lang === 'en') return product.titleEn;
  if (lang === 'hi' && product.titleHi) return product.titleHi;

  // Check hybrid runtime translation cache
  const cached = getStoredTranslation(lang, product.titleEn);
  if (cached) return cached;

  // Queue for background translation via Sarvam
  queuePhrasesForTranslation([product.titleEn], lang);

  return product.titleEn;
}

/**
 * Returns the localized description of a product.
 * Supports all 21 languages with caching and background queuing.
 */
export function getProductDescription(product: ProductListing, lang: Language): string {
  if (lang === 'en') return product.descriptionEn;
  if (lang === 'hi' && product.descriptionHi) return product.descriptionHi;

  // Check hybrid runtime translation cache
  const cached = getStoredTranslation(lang, product.descriptionEn);
  if (cached) return cached;

  // Queue for background translation via Sarvam
  queuePhrasesForTranslation([product.descriptionEn], lang);

  return product.descriptionEn;
}

/**
 * Returns the localized category string based on the canonical category value.
 * First checks static translations dictionary, then runtime cache, with automatic background queuing.
 */
export function getCategoryTranslation(category: CraftCategory | string, lang: Language): string {
  if (lang === 'en' || !category) return category;

  let key = 'dashboard.categoryOther';
  switch (category) {
    case 'Textiles & Handloom': key = 'dashboard.categoryTextiles'; break;
    case 'Clay & Terracotta': key = 'dashboard.categoryClay'; break;
    case 'Metalcraft & Dhokra': key = 'dashboard.categoryMetalcraft'; break;
    case 'Traditional Painting': key = 'dashboard.categoryPainting'; break;
    case 'Woodcraft & Carving': key = 'dashboard.categoryWood'; break;
    case 'Leather & Footwear': key = 'dashboard.categoryLeather'; break;
    case 'Handmade Jewelry': key = 'dashboard.categoryJewelry'; break;
    default: key = 'dashboard.categoryOther'; break;
  }

  const translated = translate(lang, key);
  if (translated && translated !== key && translated !== category) {
    return translated;
  }

  // Check hybrid runtime translation cache
  const cached = getStoredTranslation(lang, category);
  if (cached) return cached;

  // Queue category for translation
  queuePhrasesForTranslation([category], lang);

  return category;
}

/**
 * Returns the localized craft technique string.
 * Supports static technique dictionary for common Indian crafts,
 * then checks hybrid runtime translation cache, and enqueues unmapped techniques.
 */
export function getCraftTechniqueTranslation(technique: string, lang: Language): string {
  if (lang === 'en' || !technique) return technique;

  // 1. Check common techniques static mapping
  const staticMatch = COMMON_TECHNIQUES[technique]?.[lang];
  if (staticMatch) return staticMatch;

  // 2. Check hybrid runtime cache
  const cached = getStoredTranslation(lang, technique);
  if (cached) return cached;

  // 3. Queue for background translation via Sarvam
  queuePhrasesForTranslation([technique], lang);

  return technique;
}

/**
 * Returns the localized primary material string.
 * Supports static material dictionary for common Indian craft materials,
 * checks hybrid runtime translation cache, and enqueues unmapped materials.
 */
export function getMaterialTranslation(material: string, lang: Language): string {
  if (lang === 'en' || !material) return material;

  // 1. Check common materials static mapping
  const staticMatch = COMMON_MATERIALS[material]?.[lang];
  if (staticMatch) return staticMatch;

  // 2. Check hybrid runtime cache
  const cached = getStoredTranslation(lang, material);
  if (cached) return cached;

  // 3. Queue for background translation via Sarvam
  queuePhrasesForTranslation([material], lang);

  return material;
}

/**
 * Localizes artisan bios, cultural stories, and heritage narratives across languages.
 */
export function getArtisanStoryTranslation(story: string, lang: Language): string {
  if (lang === 'en' || !story) return story;

  const cached = getStoredTranslation(lang, story);
  if (cached) return cached;

  queuePhrasesForTranslation([story], lang);
  return story;
}
