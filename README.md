# SHILP-AI (शिल्प-AI)
### *From Craft to Commerce, Powered by AI*

**Organization**: Ministry of Social Justice and Empowerment (MoSJE), Government of India  
**Department**: Department of Social Justice and Empowerment  
**Category**: Software  
**Theme**: Heritage & Culture  

---

## 📌 Problem Statement Overview
Marginalized communities—including micro-entrepreneurs, weavers, and traditional craftspeople—receive financial assistance to establish small-scale handicraft units. However, their primary sales avenue remains periodic physical fairs (*Shilp Samagam, Surajkund Mela, Dilli Haat*). 

**The Challenge**:
1. **Low Digital Literacy & Language Barriers**: Artisans struggle to navigate complex e-commerce portals in English.
2. **Photography Deficiencies**: Cluttered workshop backgrounds and poor lighting fail e-commerce quality thresholds.
3. **Exploitative Pricing**: Lack of visibility into dynamic market pricing forces artisans to sell below fair-wage rates to middlemen.

**The Solution**: **SHILP-AI** serves as their autonomous **"Virtual Business Manager"**, empowering artisans to digitize inventory through simple voice notes and photographs, automatically optimizing listings with computer vision, multilingual NLP, and fair-wage machine learning pricing linked directly to B2B buyers and government marketplaces (*GeM, Shilp Samagam, TRIFED*).

---

## 🏗️ System Architecture & Workflow

```
              ARTISAN
                 │
                 ▼
        📸 Capture Product
                 │
                 ▼
        🤖 AI Image Studio
        ├─ Background removal (chroma & edge segmentation)
        ├─ Lighting & white balance correction
        ├─ Soft ground drop-shadow
        └─ 1:1 E-commerce square framing
                 │
                 ▼
        🎙️ Voice Description
        (Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati, English)
                 │
                 ▼
        🤖 AI Auto-Cataloger
        ├─ Web Speech Recognition → Text
        ├─ NLP attribute extraction (craft, material, days, cost)
        ├─ Hindi cultural narrative description
        └─ English SEO-optimized listing with meta search keywords
                 │
                 ▼
        💰 Dynamic Pricing AI
        ├─ Raw material cost (+15% wastage buffer)
        ├─ Fair Artisan Daily Wage standard (₹750 - ₹950/day * crafting days)
        ├─ GI Craft Heritage multiplier (1.15x - 1.35x)
        ├─ Market benchmark range (FabIndia, Jaypore, Amazon Karigar)
        └─ B2B wholesale volume tiers (Retail, 10-49 units: -18%, 50+ units: -28%)
                 │
                 ▼
          📦 SMART CATALOG
                 │
        ┌────────┴────────┐
        ▼                 ▼
   B2B BUYERS       GOVT MARKETPLACE (GeM / Shilp Samagam)
        │                 │
        └────────┬────────┘
                 ▼
           💵 DIRECT FAIR REVENUE (DBT)
```

---

## ⭐ Standout Feature: AI Artisan Copilot

Rather than forcing low-literacy artisans through complex web forms:
1. The artisan taps a single microphone button:
   > 🎤 *"This is a handwoven Pochampally saree. It took me five days to make. The silk cost ₹2,500."*  
   > *(या हिन्दी में: "यह पारंपरिक पोचमपल्ली रेशम की साड़ी है। 5 दिन लगे और ₹2,500 कच्चा माल लगा।")*
2. **The Copilot instantly extracts**:
   - **Product**: Handwoven Pochampally Double Ikat Saree
   - **Material**: 100% Pure Mulberry Silk & Natural Zari
   - **Craft**: Double Ikat Pit-Loom Weaving (GI Certified)
   - **Crafting Time**: 5 days
   - **Raw Cost**: ₹2,500
   - **Recommended Price**: ₹8,480 (Guarantees ₹3,750 fair labor wage + ₹1,855 artisan profit)
   - **Wholesale Price**: ₹6,950 / pc (10+ units)
3. **The Copilot speaks back** in Hindi or English using Speech Synthesis (TTS) and prepares the product card ready for 1-click publishing!

---

## 🚀 Quickstart Guide

### 1. Interactive Full-Stack Web PWA (Live Now on port 3000)
Run the application locally:
```bash
cd shilp-ai
npm install
npm run dev
# or for production preview:
npm run preview
```
Visit: **`http://localhost:3000`**

#### Key Interactive Demos:
- **Artisan Mode**: Test the **AI Image Studio** with interactive before/after split slider, sample craft presets, background removal, and studio lighting toggles.
- **Voice Cataloger**: Click the big mic button or try one of the pre-loaded regional voice recordings to watch the NLP engine extract attributes in real time.
- **AI Copilot**: Chat or speak with the virtual business manager with audio readout.
- **Fair Pricing Assistant**: Move the raw cost and production day sliders to inspect the transparent labor breakdown and wholesale volume tiers.
- **B2B & MoSJE Portal Mode**: Switch to the Buyer View to explore wholesale discovery, GI Tag filters, and submit a live B2B Request For Quote (RFQ).
- **Mobile App Frame**: Click **"Mobile App View"** in the top navigation bar to toggle between the desktop layout and a native smartphone simulator frame!

---

### 2. Cross-Platform Flutter Mobile Codebase (`flutter_app/`)
The native cross-platform Flutter application is located in `shilp-ai/flutter_app/`:
```bash
cd shilp-ai/flutter_app
flutter pub get
flutter run
```
**Architecture**:
- `lib/models/`: `product_model.dart`, `pricing_model.dart`
- `lib/services/`: `ai_voice_service.dart`, `dynamic_pricing_service.dart`
- `lib/screens/`:
  - `artisan_home_screen.dart` (MoSJE beneficiary card, action tiles, audio summary)
  - `ai_studio_screen.dart` (Camera capture, background segmentation, studio preview)
  - `voice_catalog_screen.dart` (Speech-to-text, attribute extraction)
  - `copilot_screen.dart` (Conversational AI assistant)
  - `buyer_discovery_screen.dart` (B2B bulk sourcing & RFQ modal)

---

## 🎯 Impact Goals for Ministry of Social Justice & Empowerment (MoSJE)
1. **Year-Round Digital Sales Channel**: Removes dependency on once-a-year physical trade fairs.
2. **Zero Digital Literacy Barrier**: Complete voice-first and audio-feedback interaction.
3. **Guaranteed Fair Living Wages**: Built-in benchmark prevents middleman price suppression.
4. **Direct Benefit Transfer (DBT)**: Seamless linkage to verified artisan bank accounts.
