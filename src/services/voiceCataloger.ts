import { CraftCategory, ProductListing } from '../types';
import { DynamicPricingEngine } from './pricingEngine';

/**
 * SHILP-AI Multilingual Voice Cataloger & NLP Engine
 * 
 * Supports Web Speech Recognition (Hindi, English, Telugu, Tamil, Bengali, Marathi)
 * Extracts structured product attributes from natural artisan spoken voice
 * Generates dual-language listings (Hindi narrative + English SEO-optimized)
 */

export interface ExtractedProductAttributes {
  titleEn: string;
  titleHi: string;
  category: CraftCategory;
  craftTechnique: string;
  primaryMaterial: string;
  productionDays: number;
  rawMaterialCost: number;
  color: string;
  descriptionEn: string;
  descriptionHi: string;
  seoKeywords: string[];
  targetBuyers: string[];
}

export class VoiceCatalogerEngine {
  /**
   * Parse spoken text in Hindi, English, or mixed Hinglish and extract structured attributes
   */
  static extractAttributesFromSpeech(transcript: string): ExtractedProductAttributes {
    const text = transcript.toLowerCase();

    // 1. Detect Raw Material Cost
    let rawMaterialCost = 1500; // Default
    const costMatch = transcript.match(/(?:₹|rs\.?|rupees|रुपये|खर्च|लागत|cost|price)\s*[:=]?\s*(\d+[\d,]*)/i) 
      || transcript.match(/(\d+[\d,]*)\s*(?:₹|rs\.?|rupees|रुपये)/i);
    if (costMatch && costMatch[1]) {
      const parsed = parseInt(costMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) rawMaterialCost = parsed;
    }

    // 2. Detect Production Days
    let productionDays = 3;
    const daysMatch = transcript.match(/(\d+)\s*(?:days?|दिन|दिनों)/i);
    if (daysMatch && daysMatch[1]) {
      const parsed = parseInt(daysMatch[1], 10);
      if (!isNaN(parsed) && parsed > 0) productionDays = parsed;
    }

    // 3. Detect Craft Category, Technique & Material
    let category: CraftCategory = 'Textiles & Handloom';
    let craftTechnique = 'Traditional Handloom Weaving';
    let primaryMaterial = 'Pure Handloom Silk & Natural Dyes';
    let color = 'Crimson & Golden Ochre';
    let titleEn = 'Handcrafted Artisan Heritage Product';
    let titleHi = 'हस्तनिर्मित कारीगर धरोहर उत्पाद';

    if (text.includes('saree') || text.includes('साड़ी') || text.includes('pochampally') || text.includes('पोचमपल्ली') || text.includes('ikat') || text.includes('silk') || text.includes('रेशम') || text.includes('handloom') || text.includes('हथकरघा')) {
      category = 'Textiles & Handloom';
      craftTechnique = 'Double Ikat Pit-Loom Weaving';
      primaryMaterial = '100% Pure Mulberry Silk & Zari Thread';
      color = 'Crimson Red & Mustard Gold';
      titleEn = 'Handwoven Pochampally Double Ikat Pure Silk Saree';
      titleHi = 'हस्तनिर्मित पोचमपल्ली डबल इकत शुद्ध रेशम साड़ी';
    } else if (text.includes('dhokra') || text.includes('ढोकरा') || text.includes('brass') || text.includes('पीतल') || text.includes('metal') || text.includes('कांस्य') || text.includes('मूर्ति') || text.includes('nandi') || text.includes('नंदी')) {
      category = 'Metalcraft & Dhokra';
      craftTechnique = 'Ancient Lost-Wax Casting (Cire Perdue)';
      primaryMaterial = 'Cast Bell-Metal & Brass Alloy';
      color = 'Antique Golden Patina';
      titleEn = 'Bastar Tribal Dhokra Lost-Wax Bell Metal Figurine';
      titleHi = 'बस्तर जनजातीय ढोकरा लॉस्ट-वैक्स कांस्य मूर्ति';
    } else if (text.includes('terracotta') || text.includes('टेराकोटा') || text.includes('clay') || text.includes('मिट्टी') || text.includes('pottery') || text.includes('कुम्हार') || text.includes('vase') || text.includes('कलश')) {
      category = 'Clay & Terracotta';
      craftTechnique = 'Wheel-Thrown & Hand-Etched Clay Firing';
      primaryMaterial = 'River Alluvial Clay & Natural Ochre';
      color = 'Rustic Terracotta Red';
      titleEn = 'Traditional Bankura Terracotta Handcrafted Urn';
      titleHi = 'पारंपरिक बांकुरा टेराकोटा नक्काशीदार कलश';
    } else if (text.includes('madhubani') || text.includes('मधुबनी') || text.includes('mithila') || text.includes('मिथिला') || text.includes('painting') || text.includes('चित्र') || text.includes('चित्रकला')) {
      category = 'Traditional Painting';
      craftTechnique = 'Twig & Nib Hand-Painting with Botanical Dyes';
      primaryMaterial = 'Handmade Khadi Sheet & Natural Herbal Pigments';
      color = 'Multicolor Natural Indigo & Turmeric';
      titleEn = 'Authentic Mithila Madhubani Tree of Life Folk Canvas';
      titleHi = 'प्रामाणिक मिथिला मधुबनी जीवन वृक्ष लोक चित्रकला';
    } else if (text.includes('pashmina') || text.includes('पश्मीना') || text.includes('shawl') || text.includes('शॉल') || text.includes('wool') || text.includes('ऊन')) {
      category = 'Textiles & Handloom';
      craftTechnique = 'Hand-Spun Weaving & Sozni Needle Embroidery';
      primaryMaterial = '100% Grade-A Changthangi Cashmere Wool';
      color = 'Natural Cream & Kashmiri Sozni';
      titleEn = 'Heritage Kashmiri Handwoven Pure Pashmina Shawl';
      titleHi = 'विरासत कश्मीरी हस्तनिर्मित शुद्ध पश्मीना शॉल';
    } else if (text.includes('wood') || text.includes('लकड़ी') || text.includes('carving') || text.includes('नक्काशी')) {
      category = 'Woodcraft & Carving';
      craftTechnique = 'Hand-Chiseled Relief Wood Carving';
      primaryMaterial = 'Seasoned Teakwood & Sheesham';
      color = 'Natural Warm Teak Finish';
      titleEn = 'Hand-Carved Heritage Wooden Artisan Sculpture';
      titleHi = 'हस्तनिर्मित पारंपरिक नक्काशीदार लकड़ी का शिल्प';
    }

    // 4. Generate Professional Hindi Narrative Description
    const descriptionHi = `सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE) के समर्थित कुशल कारीगर द्वारा निर्मित। यह ${titleHi} पारंपरिक ${craftTechnique} तकनीक द्वारा तैयार किया गया है। शुद्ध ${primaryMaterial} का उपयोग करते हुए इसे पूर्ण रूप से हाथ से तैयार करने में ${productionDays} दिन का समय लगा। यह उत्पाद भारत की समृद्ध सांस्कृतिक विरासत, प्रामाणिकता और सूक्ष्म शिल्प कौशल का प्रतीक है।`;

    // 5. Generate Professional SEO-Optimized English Description
    const descriptionEn = `Handcrafted with master heritage skill by a certified artisan beneficiary under the Ministry of Social Justice and Empowerment (MoSJE). This authentic ${titleEn} is created using traditional ${craftTechnique}. 
    
Key Highlights:
• Material: ${primaryMaterial}
• Handcrafting Time: Dedicated ${productionDays} days of artisan craftsmanship
• Color Palette: ${color}
• Heritage Technique: 100% Authentic indigenous method
• Sustainability: Eco-conscious, ethically made, fair-wage certified. Ideal for discerning art connoisseurs, ethical boutiques, and B2B wholesale orders.`;

    // 6. Generate Search Keywords & Target Buyers
    const seoKeywords = [
      titleEn.split(' ').slice(0, 3).join(' '),
      category,
      craftTechnique.split(' ')[0] + ' Craft',
      'Handmade in India',
      'MoSJE Artisan Product',
      'Fair Trade Handicraft',
      'Authentic ' + category.split(' ')[0]
    ];

    const targetBuyers = [
      'B2B Wholesale Buyers',
      'Handloom & Heritage Boutiques',
      'TRIFED & State Emporiums',
      'Corporate Gifting Companies',
      'International Cultural Importers'
    ];

    return {
      titleEn,
      titleHi,
      category,
      craftTechnique,
      primaryMaterial,
      productionDays,
      rawMaterialCost,
      color,
      descriptionEn,
      descriptionHi,
      seoKeywords,
      targetBuyers
    };
  }

  /**
   * Synthesize text-to-speech for low-literacy artisans
   */
  static speak(text: string, lang: 'hi-IN' | 'en-IN' = 'en-IN'): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported in this browser.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95; // Slightly slower for low-literacy clarity
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      // Try to find native voices
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      window.speechSynthesis.speak(utterance);
    });
  }

  static stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
