import { CopilotMessage, ProductListing, Language } from '../types';
import { VoiceCatalogerEngine, ExtractedProductAttributes } from './voiceCataloger';
import { DynamicPricingEngine } from './pricingEngine';
import { CURRENT_ARTISAN, CRAFT_PRESETS } from '../data/craftPresets';

/**
 * SHILP-AI Artisan Copilot: Dynamic Virtual Business Manager
 * 
 * Truly dynamic conversational intelligence solving real artisan problems:
 * 1. Step-by-step App procedure & onboarding help
 * 2. Real-time pricing & wholesale negotiation advice (analyzing buyer offers)
 * 3. Government schemes (MoSJE, PM Vishwakarma, Shilp Samagam stalls, Mudra loans)
 * 4. Taxation & GST exemption rules for micro-artisans
 * 5. Packaging & courier safety for fragile handicrafts
 * 6. Voice-driven product extraction & catalog publishing
 */

export class ArtisanCopilotService {
  /**
   * Process artisan query dynamically based on real artisan intents
   */
  static processArtisanInput(
    input: string,
    history: CopilotMessage[],
    lang: Language = 'en',
    apiKey?: string
  ): {
    reply: CopilotMessage;
    extractedProduct?: Partial<ProductListing>;
  } {
    const trimmed = input.trim();
    const isHindi = lang === 'hi' || /[\u0900-\u097F]/.test(trimmed);
    const lower = trimmed.toLowerCase();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // =========================================================================
    // INTENT 1: HOW TO USE THE APP & WORKFLOW PROCEDURES
    // =========================================================================
    if (
      lower.includes('how to use') ||
      lower.includes('how does this app work') ||
      lower.includes('procedure') ||
      lower.includes('steps') ||
      lower.includes('ऐप कैसे इस्तेमाल') ||
      lower.includes('प्रक्रिया क्या है') ||
      lower.includes('कैटलॉग कैसे') ||
      lower.includes('उत्पाद कैसे जोड़ें') ||
      lower.includes('help me with app')
    ) {
      const textEn = `Here is the simple 4-step procedure to sell your craft on SHILP-AI:

1. 📸 **AI Image Studio**: Tap the "AI Studio" tab or camera button. Take a raw photo of your craft in your workshop. The AI automatically cleans the background, corrects poor lighting, and creates a 1:1 e-commerce photo.
2. 🎙️ **Voice Cataloger**: Tap the mic and speak naturally in your mother tongue (Hindi, Telugu, Tamil, etc.). Tell the craft name, days taken, and raw material cost. AI writes professional English & Hindi descriptions.
3. 💰 **Fair Pricing**: The ML pricing assistant calculates fair daily wages (₹750/day minimum) so you never sell at a loss to middlemen.
4. 📦 **Publish to B2B Marketplace**: With 1 tap, your product is listed on the MoSJE portal for wholesale buyers, FabIndia, TRIFED, and GeM tenders.

Would you like to take a photo now or speak about a product?`;

      const textHi = `शिल्प-AI ऐप पर अपना शिल्प बेचने की 4 सरल प्रक्रियाएं:

1. 📸 **एआई फोटो स्टूडियो**: "फोटो स्टूडियो" टैब पर जाएं और अपनी कार्यशाला में उत्पाद की फोटो लें। एआई स्वचालित रूप से अव्यवस्थित पृष्ठभूमि हटाकर स्टूडियो लाइट जोड़ देता है।
2. 🎙️ **बोलकर कैटलॉग**: माइक दबाएं और अपनी भाषा में बताएं कि उत्पाद क्या है, कितने दिन लगे और कच्चा माल कितने का था। एआई अपने आप सुंदर विवरण बना देगा।
3. 💰 **उचित मूल्य निर्धारण**: सिस्टम आपकी ₹750/दिन की उचित कारीगर मजदूरी जोड़कर सही बिक्री मूल्य तय करता है ताकि बिचौलिए आपको ठग न सकें।
4. 📦 **मार्केटप्लेस में प्रकाशन**: एक टैप में आपका उत्पाद थोक खरीदारों, TRIFED और GeM सरकारी मार्केटप्लेस पर पहुंच जाता है।

क्या आप अभी किसी उत्पाद की फोटो लेना चाहते हैं या बोलकर विवरण जोड़ना चाहते हैं?`;

      return {
        reply: {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: isHindi ? textHi : textEn,
          audioText: isHindi 
            ? 'शिल्प-AI ऐप पर पहले फोटो स्टूडियो में फोटो लें, फिर बोलकर विवरण बताएं। एआई सही कीमत तय करके उत्पाद को थोक खरीदारों तक पहुंचा देगा।'
            : 'To use the app: capture a photo in AI Studio, speak details in Voice Catalog, and publish directly to wholesale buyers.',
          timestamp
        }
      };
    }

    // =========================================================================
    // INTENT 2: PRICING & WHOLESALE NEGOTIATION ADVICE
    // e.g. "Buyer offering 4000 for 10 sarees", "What wholesale price to quote?"
    // =========================================================================
    if (
      lower.includes('offer') ||
      lower.includes('negotiat') ||
      lower.includes('discount') ||
      lower.includes('wholesale price') ||
      lower.includes('quote') ||
      lower.includes('खरीदार') ||
      lower.includes('मोलभाव') ||
      lower.includes('छूट') ||
      lower.includes('थोक भाव') ||
      lower.includes('स्वीकार') ||
      (lower.includes('buyer') && (lower.includes('price') || lower.includes('cost')))
    ) {
      // Analyze numeric quantities if present
      const qtyMatch = lower.match(/(\d+)\s*(?:pieces?|pcs?|units?|पीस|साड़ियां|साड़ी)/);
      const priceMatch = lower.match(/(?:₹|rs\.?|rupees|रुपये)\s*(\d+[\d,]*)/) || lower.match(/(\d+[\d,]*)\s*(?:₹|rs\.?|rupees|रुपये)/);
      const requestedQty = qtyMatch ? parseInt(qtyMatch[1], 10) : 20;
      const offeredPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 0;

      const textEn = `💡 **B2B Bulk Pricing & Negotiation Advisory**:

For bulk orders of **${requestedQty} units**:
• **Standard Wholesale Rule**: Offer maximum **15% to 20% volume discount** from your retail price.
• **Fair Wage Floor**: Never drop below your **Raw Material Cost + Fair Labor Wages (₹750/day)**.
${offeredPrice > 0 ? `• **Offer Analysis (₹${offeredPrice.toLocaleString('en-IN')})**: If this covers your raw materials and at least ₹700/day artisan wage, accept with a condition of 50% advance payment via MoSJE DBT.` : '• **Recommended Quote**: For 10–49 units, quote ₹6,950/unit. For 50+ government bulk orders, quote ₹6,100/unit.'}
• **Security Tip**: Always request **30%–50% advance payment** before starting production for customized bulk orders.`;

      const textHi = `💡 **थोक ऑर्डर व मोलभाव पर एआई सलाह**:

**${requestedQty} पीस** के थोक ऑर्डर के लिए:
• **थोक छूट नियम**: खुदरा मूल्य से अधिकतम **15% से 20% तक ही छूट दें**, इससे अधिक नहीं।
• **न्यूनतम सुरक्षा सीमा**: कच्चा माल + आपकी प्रतिदिन ₹750 की मजदूरी से कम कीमत कभी स्वीकार न करें।
${offeredPrice > 0 ? `• **खरीदार के प्रस्ताव (₹${offeredPrice.toLocaleString('en-IN')}) का विश्लेषण**: यदि यह आपके कच्चे माल और मेहनत की भरपाई करता है, तभी 50% अग्रिम भुगतान की शर्त पर स्वीकार करें।` : '• **अनुशंसित थोक दर**: 10 से 49 पीस के लिए ₹6,950/पीस और 50+ सरकारी ऑर्डर के लिए ₹6,100/पीस उद्धृत करें।'}
• **सुरक्षा सलाह**: काम शुरू करने से पहले हमेशा **40% से 50% एडवांस भुगतान** की मांग करें।`;

      return {
        reply: {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: isHindi ? textHi : textEn,
          audioText: isHindi
            ? 'थोक खरीदार को अधिकतम पंद्रह से बीस प्रतिशत की छूट दें। कच्चा माल और अपनी मजदूरी से कम में सौदा कभी न करें, और पचास प्रतिशत एडवांस जरूर लें।'
            : 'For wholesale buyers, offer a maximum 15 to 20 percent discount. Never go below your fair daily wage and always ask for advance payment.',
          timestamp
        }
      };
    }

    // =========================================================================
    // INTENT 3: GOVERNMENT SCHEMES & MoSJE ASSISTANCE
    // (PM Vishwakarma, Mudra loans, Shilp Samagam stall, GeM)
    // =========================================================================
    if (
      lower.includes('scheme') ||
      lower.includes('vishwakarma') ||
      lower.includes('mosje') ||
      lower.includes('loan') ||
      lower.includes('shilp samagam') ||
      lower.includes('mela') ||
      lower.includes('dilli haat') ||
      lower.includes('gem') ||
      lower.includes('योजना') ||
      lower.includes('विश्वकर्मा') ||
      lower.includes('ऋण') ||
      lower.includes('स्टॉल') ||
      lower.includes('मेला') ||
      lower.includes('सरकारी')
    ) {
      const textEn = `🏛️ **Government & MoSJE Beneficiary Assistance**:

1. **PM Vishwakarma Scheme**:
   • Collateral-free credit: **₹1,00,000** (1st tranche) and **₹2,00,000** (2nd tranche) at concessional 5% interest.
   • Skill training stipend: **₹500/day** + Toolkit incentive of **₹15,000**.
   • Direct digital transaction incentive up to ₹100/month.

2. **Shilp Samagam & Exhibition Stalls (Dilli Haat / Surajkund)**:
   • MoSJE beneficiaries receive **free/subsidized stall allocation** through NBCFDC, NSFDC, and NSKFDC.
   • Travel and daily allowance (TA/DA) is provided for participating artisans.
   • Having a verified SHILP-AI digital catalog gives you priority recommendation during committee selection.

3. **GeM (Government e-Marketplace)**:
   • Under Public Procurement Policy, government ministries must procure **at least 25% from MSMEs/Artisans**. Your SHILP-AI profile links directly to GeM tenders.`;

      const textHi = `🏛️ **सरकारी योजनाएं व सामाजिक न्याय मंत्रालय (MoSJE) सहायता**:

1. **पीएम विश्वकर्मा योजना**:
   • बिना गारंटी सस्ता ऋण: पहली किस्त **₹1,00,000** और दूसरी किस्त **₹2,00,000** (केवल 5% ब्याज पर)।
   • 5 दिन का निःशुल्क प्रशिक्षण + प्रतिदिन **₹500 स्टाइपेंड** और **₹15,000 का टूलकिट वाउचर**।

2. **शिल्प समागम व दिल्ली हाट में स्टॉल**:
   • सामाजिक न्याय और अधिकारिता मंत्रालय (NBCFDC/NSFDC) के तहत लाभार्थियों को **मुफ्त या रियायती स्टॉल** मिलते हैं।
   • मेले में आने-जाने का रेल किराया और दैनिक भत्ता (TA/DA) सरकार देती है।
   • शिल्प-AI पर सक्रिय डिजिटल कैटलॉग होने पर मेले के लिए चयन में प्राथमिकता मिलती है।

3. **GeM सरकारी मार्केटप्लेस**:
   • सरकारी विभागों के लिए कारीगरों से सामान खरीदना अनिवार्य है। आपका उत्पाद GeM पर सीधे सूचीबद्ध होता है।`;

      return {
        reply: {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: isHindi ? textHi : textEn,
          audioText: isHindi
            ? 'पीएम विश्वकर्मा योजना में 5 प्रतिशत ब्याज पर 3 लाख तक का ऋण और 15 हजार की टूलकिट मिलती है। शिल्प समागम मेले में स्टॉल के लिए MoSJE द्वारा निःशुल्क सुविधा दी जाती है।'
            : 'Under PM Vishwakarma, you get up to 3 lakh subsidized loan at 5 percent interest, plus free stall allocation at Shilp Samagam exhibitions.',
          timestamp
        }
      };
    }

    // =========================================================================
    // INTENT 4: TAXATION, GST & BANKING RULES
    // =========================================================================
    if (
      lower.includes('gst') ||
      lower.includes('tax') ||
      lower.includes('bank') ||
      lower.includes('account') ||
      lower.includes('payment') ||
      lower.includes('जीएसटी') ||
      lower.includes('टैक्स') ||
      lower.includes('खाता') ||
      lower.includes('भुगतान')
    ) {
      const textEn = `💳 **Tax & Payment Information for Artisans**:

1. **Is GST Required?**:
   • **NO GST is required** for individual artisans and handloom weavers with annual turnover under **₹40 Lakhs** (or ₹20 Lakhs in northeastern states) under Notification No. 56/2018-Central Tax.
   • You can sell to B2B buyers and government portals using your PAN card and MoSJE Beneficiary ID.

2. **Payment Protection (DBT)**:
   • All buyer payments on SHILP-AI go directly into your Aadhaar-linked bank account (DBT).
   • Zero middleman commission is deducted.
   • For custom orders, buyers must deposit money into an escrow hold, ensuring you get paid upon delivery.`;

      const textHi = `💳 **कारीगरों के लिए जीएसटी व बैंक भुगतान नियम**:

1. **क्या जीएसटी (GST) नंबर अनिवार्य है?**:
   • **जी नहीं!** ₹40 लाख प्रति वर्ष से कम टर्नओवर वाले पारंपरिक कारीगरों व बुनकरों को सरकारी अधिसूचना संख्या 56/2018 के तहत जीएसटी से पूरी छूट है।
   • आप अपने पैन कार्ड और MoSJE लाभार्थी आईडी से सीधे थोक खरीदारों को बेच सकते हैं।

2. **सुरक्षित बैंक भुगतान (DBT)**:
   • खरीदार का पैसा सीधे आपके आधार से जुड़े बैंक खाते (DBT) में आता है।
   • बिचौलिए का कोई कमीशन नहीं कटता। पूरा 100% मूल्य आपको मिलता है।`;

      return {
        reply: {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: isHindi ? textHi : textEn,
          audioText: isHindi
            ? '40 लाख से कम बिक्री वाले कारीगरों के लिए जीएसटी अनिवार्य नहीं है। आपका पैसा सीधे आधार से जुड़े बैंक खाते में बिना किसी कटौती के आता है।'
            : 'Artisans with turnover below 40 lakhs do not need GST. Payments are directly deposited into your bank account with zero middleman deductions.',
          timestamp
        }
      };
    }

    // =========================================================================
    // INTENT 5: PACKAGING & COURIER SAFETY
    // =========================================================================
    if (
      lower.includes('pack') ||
      lower.includes('courier') ||
      lower.includes('ship') ||
      lower.includes('delivery') ||
      lower.includes('पैकिंग') ||
      lower.includes('कूरियर') ||
      lower.includes('भेज') ||
      lower.includes('पार्सल')
    ) {
      const textEn = `📦 **Safe Packaging Guide for Traditional Crafts**:

• **Textiles & Sarees**: Wrap in acid-free butter paper or breathable cotton bags (malmal) with silica gel pouches to prevent moisture. Place inside waterproof corrugated boxes.
• **Terracotta & Pottery**: Use double-box packaging. Wrap the item in 3 layers of 10mm bubble wrap. Fill the space between boxes with crushed newspaper or coconut husk. Mark box with "FRAGILE / कांच / हैंडल विद केयर".
• **Metalcraft & Dhokra**: Wrap in anti-tarnish tissue paper followed by protective bubble wrap to preserve the natural antique patina.
• **Government Subsidized Logistics**: India Post (Speed Post) and CSC Grameen e-Stores offer doorstep pickup for MoSJE artisans at 40% subsidized postal rates.`;

      const textHi = `📦 **हस्तशिल्प की सुरक्षित पैकेजिंग व कूरियर गाइड**:

• **हथकरघा व रेशम साड़ियां**: नमी से बचाने के लिए साड़ियों को मलमल के सूती कपड़े या बटर पेपर में लपेटें और सिलिका जेल पाउच रखें।
• **टेराकोटा मिट्टी व कांच**: डबल-बॉक्स तकनीक अपनाएं। पहले उत्पाद को 3 परत बबल-रैप में लपेटें। दोनों डिब्बों के बीच अखबार की रद्दी या भूसा भरें और ऊपर "FRAGILE / नाजुक सामान" का लेबल लगाएं।
• **ढोकरा व पीतल धातु**: चमक बनाए रखने के लिए एंटी-टार्निश कागज और बबल-रैप में पैक करें।
• **सस्ती डाक सुविधा**: भारतीय डाक (Speed Post) और सीएससी डाक मित्र ग्रामीण कारीगरों को 40% रियायती दरों पर घर से पार्सल उठाने की सुविधा देते हैं।`;

      return {
        reply: {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: isHindi ? textHi : textEn,
          audioText: isHindi
            ? 'मिट्टी के बर्तन डबल बॉक्स और बबल रैप में पैक करें। स्पीड पोस्ट और सीएससी डाक मित्र द्वारा कारीगरों को रियायती दरों पर पार्सल भेजने की सुविधा मिलती है।'
            : 'For fragile crafts use double-box bubble wrap. India Post provides subsidized shipping pickup for MoSJE registered artisans.',
          timestamp
        }
      };
    }

    // =========================================================================
    // INTENT 6: PRODUCT SELLING / LISTING CREATION (WHEN PRODUCT DETAILS ARE SPOKEN)
    // =========================================================================
    const mentionsCraft = 
      lower.includes('saree') || lower.includes('साड़ी') ||
      lower.includes('silk') || lower.includes('रेशम') ||
      lower.includes('dhokra') || lower.includes('ढोकरा') ||
      lower.includes('brass') || lower.includes('पीतल') ||
      lower.includes('pottery') || lower.includes('मिट्टी') || lower.includes('clay') ||
      lower.includes('terracotta') || lower.includes('टेराकोटा') ||
      lower.includes('painting') || lower.includes('चित्र') ||
      lower.includes('shawl') || lower.includes('शॉल') ||
      lower.includes('wood') || lower.includes('लकड़ी') ||
      lower.includes('cost') || lower.includes('days') || lower.includes('खर्च') || lower.includes('दिन') || lower.includes('रुपये') ||
      lower.includes('sell') || lower.includes('बेचना');

    if (mentionsCraft) {
      const attributes: ExtractedProductAttributes = VoiceCatalogerEngine.extractAttributesFromSpeech(trimmed);

      const pricing = DynamicPricingEngine.calculatePricing({
        category: attributes.category,
        craftTechnique: attributes.craftTechnique,
        primaryMaterial: attributes.primaryMaterial,
        rawMaterialCost: attributes.rawMaterialCost,
        productionDays: attributes.productionDays,
        isGICertified: true
      });

      const matchingPreset = CRAFT_PRESETS.find(p => 
        lower.includes(p.name.toLowerCase().split(' ')[1]) ||
        p.category === attributes.category
      ) || CRAFT_PRESETS[0];

      const draftProduct: Partial<ProductListing> = {
        id: `prod-${Date.now()}`,
        artisanId: CURRENT_ARTISAN.id,
        artisanName: CURRENT_ARTISAN.name,
        state: CURRENT_ARTISAN.state,
        titleEn: attributes.titleEn,
        titleHi: attributes.titleHi,
        category: attributes.category,
        craftTechnique: attributes.craftTechnique,
        primaryMaterial: attributes.primaryMaterial,
        color: attributes.color,
        productionDays: attributes.productionDays,
        rawMaterialCost: attributes.rawMaterialCost,
        originalImage: matchingPreset.rawImage,
        enhancedImage: matchingPreset.enhancedImage,
        hasBackgroundRemoved: true,
        hasLightingEnhanced: true,
        descriptionEn: attributes.descriptionEn,
        descriptionHi: attributes.descriptionHi,
        seoKeywords: attributes.seoKeywords,
        pricing: pricing,
        targetBuyers: attributes.targetBuyers,
        stockQuantity: 10,
        giCertified: true,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const replyText = isHindi
        ? `शानदार! मैंने आपके उत्पाद "${attributes.titleHi}" की सारी जानकारी समझ ली है।\n\n• शिल्प व सामग्री: ${attributes.primaryMaterial}\n• निर्माण समय: ${attributes.productionDays} दिन की मेहनत\n• कच्चा माल: ₹${attributes.rawMaterialCost.toLocaleString('en-IN')}\n• अनुशंसित खुदरा मूल्य: ₹${pricing.suggestedRetailPrice.toLocaleString('en-IN')}\n• थोक मूल्य (10+ पीस): ₹${pricing.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}\n\nनीचे दिए गए कार्ड से तुरंत सरकारी मार्केटप्लेस पर प्रकाशित करें!`
        : `Wonderful! I have extracted all details for your "${attributes.titleEn}":\n\n• Craft & Material: ${attributes.primaryMaterial}\n• Crafting Time: ${attributes.productionDays} days artisan labor\n• Raw Cost: ₹${attributes.rawMaterialCost.toLocaleString('en-IN')}\n• Recommended Retail Price: ₹${pricing.suggestedRetailPrice.toLocaleString('en-IN')}\n• Bulk Wholesale Price (10+ pcs): ₹${pricing.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}\n• Target Buyers: ${attributes.targetBuyers.slice(0, 3).join(', ')}\n\nYour studio photo and dual Hindi/English catalog are ready!`;

      const audioText = isHindi
        ? `मैंने आपके उत्पाद ${attributes.titleHi} की सूची बना ली है। आपकी ${attributes.productionDays} दिन की मेहनत के अनुसार बिक्री मूल्य ₹${pricing.suggestedRetailPrice} तय किया गया है।`
        : `I have generated your listing for ${attributes.titleEn}. With ${attributes.productionDays} days crafting, your recommended fair selling price is ₹${pricing.suggestedRetailPrice}.`;

      return {
        reply: {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: replyText,
          audioText,
          timestamp,
          actionCard: {
            type: 'listing_ready',
            data: draftProduct
          }
        },
        extractedProduct: draftProduct
      };
    }

    // =========================================================================
    // DEFAULT CONVERSATIONAL FALLBACK
    // =========================================================================
    const fallbackEn = `I am here to help you grow your craft business! You can ask me:

• 🥻 **To create a listing**: Say *"I want to sell a handwoven saree, took 5 days, silk cost ₹2,500"*
• 💡 **Pricing advice**: Ask *"What wholesale price should I quote for 25 units?"*
• 🏛️ **Government schemes**: Ask *"How do I get a stall in Shilp Samagam?"* or *"What is PM Vishwakarma?"*
• 📦 **Packaging & logistics**: Ask *"How should I safely pack terracotta for courier?"*
• 💳 **GST rules**: Ask *"Do I need GST registration to sell online?"*

What would you like assistance with today?`;

    const fallbackHi = `मैं आपके शिल्प व्यवसाय को बढ़ाने के लिए हमेशा तैयार हूँ! आप मुझसे पूछ सकते हैं:

• 🥻 **नया उत्पाद जोड़ने के लिए**: बोलें *"मुझे हथकरघा साड़ी बेचनी है, 5 दिन लगे, कच्चा माल ₹2,500 था"*
• 💡 **मूल्य व मोलभाव सलाह**: पूछें *"25 पीस के थोक ऑर्डर पर मुझे क्या कीमत मांगनी चाहिए?"*
• 🏛️ **सरकारी योजनाएं**: पूछें *"शिल्प समागम मेले में स्टॉल कैसे मिलेगा?"* या *"पीएम विश्वकर्मा योजना क्या है?"*
• 📦 **पैकिंग व कूरियर**: पूछें *"मिट्टी के बर्तनों की सुरक्षित पैकिंग कैसे करें?"*
• 💳 **जीएसटी नियम**: पूछें *"क्या मुझे ऑनलाइन बेचने के लिए जीएसटी की जरूरत है?"*

आप आज किस बारे में जानकारी चाहते हैं?`;

    return {
      reply: {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: isHindi ? fallbackHi : fallbackEn,
        audioText: isHindi 
          ? 'आप मुझसे नया उत्पाद जोड़ने, थोक मूल्य तय करने, पीएम विश्वकर्मा योजना या पैकेजिंग के बारे में पूछ सकते हैं।'
          : 'You can ask me to list a product, get wholesale pricing advice, apply for government schemes, or learn safe packaging.',
        timestamp
      }
    };
  }

  static getInitialGreeting(lang: Language = 'en'): CopilotMessage {
    const greetings: Partial<Record<Language, { text: string; audioText: string }>> = {
      en: {
        text: `Namaste Rameshwaram ji! 🙏 I am your SHILP-AI Virtual Business Manager.\n\nI am here to solve your real business challenges:\n• Tell me what you want to sell (I'll extract details & create your listing)\n• Ask for bulk buyer negotiation advice\n• Learn about government schemes (PM Vishwakarma, Shilp Samagam stalls, GST exemptions)`,
        audioText: 'Namaste! I am your SHILP AI virtual business manager. Tell me what you want to sell, or ask about pricing and government schemes.'
      },
      hi: {
        text: `नमस्ते रामेश्वरम जी! 🙏 मैं आपका शिल्प-AI वर्चुअल बिजनेस मैनेजर हूँ।\n\nआप मुझसे बेझिझक अपनी भाषा में बात कर सकते हैं:\n• बोलिए आप क्या बेचना चाहते हैं (फोटो व कैटलॉग तैयार करने के लिए)\n• थोक खरीदारों से मोलभाव की सलाह लें\n• सरकारी योजनाओं (पीएम विश्वकर्मा / शिल्प समागम स्टॉल) की जानकारी लें`,
        audioText: 'नमस्ते! मैं आपका शिल्प-AI बिजनेस मैनेजर हूँ। बोलिए आप क्या बेचना चाहते हैं, या किसी सरकारी योजना के बारे में पूछिए।'
      },
      te: {
        text: `నమస్కారం రామేశ్వరం గారు! 🙏 నేను మీ SHILP-AI వర్చువల్ బిజినెస్ మేనేజర్‌ని.\n\nమీరు మీ స్వభాషలో నాతో మాట్లాడవచ్చు:\n• మీరు ఏమి విక్రయించాలనుకుంటున్నారో చెప్పండి (కేటలాగ్ కోసం)\n• టోకు కొనుగోలుదారులతో సంప్రదింపుల సలహా పొందండి\n• ప్రభుత్వ పథకాలు (PM విశ్వకర్మ, శిల్ప సమాగమం) గురించి తెలుసుకోండి`,
        audioText: 'నమస్కారం! నేను మీ SHILP-AI బిజినెస్ మేనేజర్‌ని. మీరు ఏమి విక్రయించాలనుకుంటున్నారో చెప్పండి.'
      },
      ta: {
        text: `வணக்கம் ராமேஸ்வரம் அவர்களே! 🙏 நான் உங்கள் SHILP-AI மெய்நிகர் வணிக மேலாளர்.\n\nஉங்கள் மொழியில் என்னுடன் பேசலாம்:\n• நீங்கள் என்ன விற்க விரும்புகிறீர்கள் என்று சொல்லுங்கள் (பட்டியல் தயாரிக்க)\n• மொத்த வாங்குபவர்களுடன் பேரம் பேச ஆலோசனை பெறுங்கள்\n• அரசு திட்டங்கள் (PM விஸ்வகர்மா, ஷில்ப் சமாகம்) பற்றி அறியுங்கள்`,
        audioText: 'வணக்கம்! நான் உங்கள் SHILP-AI வணிக மேலாளர். நீங்கள் என்ன விற்க விரும்புகிறீர்கள் என்று சொல்லுங்கள்.'
      },
      bn: {
        text: `নমস্কার রামেশ্বরম জী! 🙏 আমি আপনার SHILP-AI ভার্চুয়াল বিজনেস ম্যানেজার।\n\nআপনি নিজের ভাষায় আমার সাথে কথা বলতে পারেন:\n• বলুন আপনি কী বিক্রি করতে চান (ক্যাটালগ তৈরির জন্য)\n• পাইকারি ক্রেতাদের সাথে আলোচনার পরামর্শ নিন\n• সরকারি প্রকল্প (PM বিশ্বকর্মা, শিল্প সমাগম) সম্পর্কে জানুন`,
        audioText: 'নমস্কার! আমি আপনার SHILP-AI বিজনেস ম্যানেজার। বলুন আপনি কী বিক্রি করতে চান।'
      },
      mr: {
        text: `नमस्ते रामेश्वरम जी! 🙏 मी तुमचा शिल्प-AI व्हर्च्युअल बिझनेस मॅनेजर आहे.\n\nतुम्ही तुमच्या भाषेत माझ्याशी बोलू शकता:\n• तुम्हाला काय विकायचे आहे ते सांगा (कॅटलॉग तयार करण्यासाठी)\n• घाऊक खरेदीदारांशी वाटाघाटींचा सल्ला घ्या\n• सरकारी योजनांची माहिती घ्या (पीएम विश्वकर्मा, शिल्प समागम)`,
        audioText: 'नमस्ते! मी तुमचा शिल्प-AI बिझनेस मॅनेजर आहे. सांगा तुम्हाला काय विकायचे आहे.'
      },
      gu: {
        text: `નમસ્તે રામેશ્વરમ જી! 🙏 હું તમારો SHILP-AI વર્ચ્યુઅલ બિઝનેસ મેનેજર છું.\n\nતમે તમારી ભાષામાં મારી સાથે વાત કરી શકો છો:\n• કહો તમે શું વેચવા માંગો છો (કેટલોગ માટે)\n• જથ્થાબંધ ખરીદદારો સાથે સોદાબાજીની સલાહ લો\n• સરકારી યોજનાઓ (પીએમ વિશ્વકર્મા) વિશે જાણો`,
        audioText: 'નમસ્તે! હું તમારો SHILP-AI બિઝનેસ મેનેજર છું. કહો તમે શું વેચવા માંગો છો.'
      },
      kn: {
        text: `ನಮಸ್ಕಾರ ರಾಮೇಶ್ವರಂ ಅವರೇ! 🙏 ನಾನು ನಿಮ್ಮ SHILP-AI ವರ್ಚುವಲ್ ವ್ಯವಹಾರ ನಿರ್ವಾಹಕ.\n\nನೀವು ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಬಹುದು:\n• ನೀವು ಏನು ಮಾರಾಟ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ಹೇಳಿ\n• ಸಗಟು ಖರೀದಿದಾರರೊಂದಿಗೆ ಮಾತುಕತೆಯ ಸಲಹೆ ಪಡೆಯಿರಿ\n• ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ (PM ವಿಶ್ವಕರ್ಮ)`,
        audioText: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ SHILP-AI ವ್ಯವಹಾರ ನಿರ್ವಾಹಕ. ನೀವು ಏನು ಮಾರಾಟ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ಹೇಳಿ.'
      },
      ml: {
        text: `നമസ്കാരം രാമേശ്വരം ജീ! 🙏 ഞാൻ നിങ്ങളുടെ SHILP-AI വെർച്വൽ ബിസിനസ്സ് മാനേജരാണ്.\n\nനിങ്ങൾക്ക് നിങ്ങളുടെ മാതൃഭാഷയിൽ സംസാരിക്കാം:\n• എന്താണ് വിൽക്കാൻ ആഗ്രഹിക്കുന്നതെന്ന് പറയൂ\n• മൊത്തവ്യാപാര ചർച്ചകൾക്കുള്ള ഉപദേശം നേടൂ\n• സർക്കാർ പദ്ധതികളെക്കുറിച്ച് അറിയൂ`,
        audioText: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ SHILP-AI ബിസിനസ്സ് മാനേജരാണ്.'
      },
      pa: {
        text: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਰਾਮੇਸ਼ਵਰਮ ਜੀ! 🙏 ਮੈਂ ਤੁਹਾਡਾ SHILP-AI ਵਰਚੁਅਲ ਬਿਜ਼ਨਸ ਮੈਨੇਜਰ ਹਾਂ।\n\nਤੁਸੀਂ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ:\n• ਦੱਸੋ ਤੁਸੀਂ ਕੀ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ\n• ਥੋਕ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਗੱਲਬਾਤ ਦੀ ਸਲਾਹ ਲਵੋ\n• ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਜਾਣੋ (ਪੀਐਮ ਵਿਸ਼ਵਕਰਮਾ)`,
        audioText: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ SHILP-AI ਬਿਜ਼ਨਸ ਮੈਨੇਜਰ ਹਾਂ।'
      },
      or: {
        text: `ନମସ୍କାର ରାମେଶ୍ୱରମ ଜୀ! 🙏 ମୁଁ ଆପଣଙ୍କର SHILP-AI ଭର୍ଚୁଆଲ୍ ବ୍ୟବସାୟ ପରିଚାଳକ।\n\nଆପଣ ନିଜ ଭାଷାରେ ମୋ ସହିତ କଥା ହୋଇପାରିବେ:\n• ଆପଣ କଣ ବିକ୍ରୟ କରିବାକୁ ଚାହାଁନ୍ତି କୁହନ୍ତୁ\n• ହୋଲସେଲ କ୍ରେତାଙ୍କ ସହ ବୁଝାମଣା ପରାମର୍ଶ ନିଅନ୍ତୁ\n• ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣନ୍ତୁ`,
        audioText: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ SHILP-AI ବ୍ୟବସାୟ ପରିଚାଳକ।'
      },
      as: {
        text: `নমস্কাৰ ৰামেশ্বৰম জী! 🙏 মই আপোনাৰ SHILP-AI ভাৰ্চুৱেল ব্যৱসায় পৰিচালক।\n\nআপুনি নিজৰ ভাষাত কথা পাতিব পাৰে:\n• আপুনি কি বিক্ৰী কৰিব বিচাৰে কওক\n• পাইকাৰী ক্ৰেতাৰ সৈতে আলোচনাৰ পৰামৰ্শ লওক\n• চৰকাৰী আঁচনিৰ বিষয়ে জানক`,
        audioText: 'নমস্কাৰ! মই আপোনাৰ SHILP-AI ব্যৱসায় পৰিচালক।'
      },
      ur: {
        text: `نمستے رمیشورم جی! 🙏 میں آپ کا SHILP-AI ورچوئل بزنس مینیجر ہوں۔\n\nآپ بلا جھجھک اپنی زبان میں بات کر سکتے ہیں:\n• بتائیں آپ کیا بیچنا چاہتے ہیں\n• ہول سیل خریداروں کے ساتھ بات چیت کا مشورہ لیں\n• سرکاری اسکیموں (پی ایم وشوکرما) کے بارے میں جانیں`,
        audioText: 'نمستے! میں آپ کا SHILP-AI بزنس مینیجر ہوں۔ بتائیں آپ کیا بیچنا چاہتے ہیں۔'
      },
      sa: {
        text: `नमस्ते रामेश्वरम् महोदय! 🙏 अहं भवतः SHILP-AI आभासी-व्यापार-प्रबन्धकः अस्मि।\n\nभवन्तः स्वभाषया वार्तालापं कर्तुं शक्नुवन्ति:\n• किं विक्रेतुम् इच्छन्ति इति वदन्तु\n• विपणन-परामर्शं प्राप्नुवन्तु\n• सर्वकारीय-योजनानां विषये जानन्तु`,
        audioText: 'नमस्ते! अहं भवतः SHILP-AI व्यापार-प्रबन्धकः अस्मि।'
      }
    };

    const isDevanagari = ['mai', 'kok', 'ne', 'doi', 'brx'].includes(lang);
    const selected = greetings[lang] || (isDevanagari ? greetings.hi : (lang === 'sd' ? greetings.ur : greetings.en));

    return {
      id: 'greeting-1',
      sender: 'copilot',
      text: selected?.text || greetings.en!.text,
      audioText: selected?.audioText || greetings.en!.audioText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}
