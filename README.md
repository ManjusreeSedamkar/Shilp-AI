# 🪔 SHILP-AI (शिल्प-AI)
### *From Traditional Craft to Global Commerce — Powered by Autonomous AI*

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.16-38B2AC.svg)](https://tailwindcss.com/)
[![Capacitor Android](https://img.shields.io/badge/Capacitor-Android-119EFF.svg)](https://capacitorjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.19.0-FFCA28.svg)](https://firebase.google.com/)

---

## 📌 What is Shilp-AI?

**Shilp-AI** is an autonomous **"Virtual Business Manager"** designed specifically for traditional Indian artisans, handloom weavers, potters, and rural micro-entrepreneurs. 

India is home to over 7 million traditional artisans producing exquisite handicrafts (Banarasi silk, Terracotta, Madhubani art, Dhokra brass, Blue Pottery, etc.). However, they face significant barriers in reaching modern e-commerce markets:
1. **Low Digital Literacy & Language Barriers**: Rural artisans often cannot navigate complicated, English-centric e-commerce seller portals.
2. **Poor Product Photography**: Photos taken inside dimly-lit, cluttered village workshops (showing walls, beds, clothes, shadows) get rejected by major e-commerce platforms.
3. **Exploitative Middlemen**: Lacking market visibility, artisans frequently sell authentic handmade heritage items for a fraction of their worth to brokers and middlemen.

**Shilp-AI solves this end-to-end**: An artisan simply snaps a photo and speaks into their phone in their mother tongue (Hindi, English, etc.). The AI automatically enhances the photograph into a studio-grade e-commerce listing, extracts craft details, calculates fair-wage pricing, and publishes the product to global buyers and B2B marketplaces.

---

## 🖼️ Before & After Photographic Enhancement (100% Authentic Product)

The core principle of Shilp-AI's Computer Vision studio is **Photo Editing Only — Zero Regeneration**:

> **"The product remains 100% identical to the real physical craft — same saree, exact colors, patterns, embroidery, texture, folds, shape, size, and position. We never regenerate, redraw, recolor, or distort the artisan's genuine work."**

| 📷 Before (Original Workshop Photo) | ✨ After (Professional Studio Edit) |
| :---: | :---: |
| <img src="public/crafts/saree_raw_photo.png" width="320" alt="Original Workshop Photo" /> | <img src="public/crafts/saree_enhanced_studio.png" width="320" alt="Professional Studio Edit" /> |
| *Dim room, cluttered bed, dark wardrobe, murky shadows* | *100% identical saree, clean studio backdrop, lifted exposure & zari radiance* |

### The 5 E-Commerce Quality Standards Met:
1. ✂️ **Background Removal (बैकग्राउंड हटाना)**: The entire cluttered room (walls, bed, clothes, floor, shadows) is removed cleanly without punching holes through the saree or leaving white patches.
2. ☀️ **Better Lighting (बेहतर लाइटिंग)**: Auto-levels dynamic range stretch brings out hidden folds and gold zari luster without blowing out highlights.
3. 🎨 **Natural Color Correction (प्राकृतिक रंग सुधार)**: Authentic silk dye (magenta-purple) and metallic gold zari luster are preserved naturally without artificial tinting or color shifts.
4. 📐 **Proper Positioning & Cropping (उचित स्थिति व क्रॉपिंग)**: Centered and straightened on standard square e-commerce framing with soft ground depth.
5. ✨ **Enhanced Quality (संवर्धित गुणवत्ता)**: Unsharp mask edge sharpening highlights intricate weave threads and embroidery with reduced sensor noise.

---

## ✨ Key Features & Modules

### 1. 📸 AI Computer Vision Studio & Live Sliders
* **Topological BFS & Neural Segmentation**: Combines in-browser WebAssembly neural segmentation (`@imgly/background-removal`) with a fallback Saliency BFS contour engine and morphological hole-closing to eliminate background clutter without internal white patches.
* **Interactive Fine-Tuning Sliders**:
  * ☀️ **Brightness** (`-30%` to `+50%`): Lift shadows with highlight protection.
  * 🌓 **Contrast** (`-20%` to `+50%`): S-curve contrast for deep folds and crisp details.
  * 🎨 **Saturation / Vibrance** (`-20%` to `+50%`): Enrich natural vegetable and mineral dyes.
  * **✨ Reset to AI Optimal**: 1-click restore to AI-recommended photographic settings.
* **15ms Instant Response**: In-memory cutout segmentation caching enables instant real-time slider feedback without re-segmenting.
* **Interactive Comparison Views**: Toggle between **Showcase View** (with the 5 Badges) and **Split Slider View** (interactive draggable divider).

---

### 2. 🎙️ Multilingual Voice-First Cataloging
* **Zero Form Typing**: Artisans simply speak into their microphone in **Hindi** or **English**:
  > *"यह बनारसी रेशम की साड़ी है। 5 दिन लगे और ₹2,500 कच्चा माल लगा।"*  
  > *(Or: "This is a handwoven Banarasi silk saree. It took me 5 days to make with 2500 rupees in raw materials.")*
* **Automatic NLP Attribute Extraction**: Identifies craft category, materials used, production days, raw cost, and verified **Geographical Indication (GI Tag)** heritage identifiers.
* **Bilingual Storytelling**: Generates evocative cultural storytelling in Hindi and SEO-optimized listings in English.
* **Spoken Audio Feedback**: The AI Copilot speaks back with voice confirmation via Web SpeechSynthesis.

---

### 3. ⚖️ Fair Value Pricing Engine (Guaranteed Living Wage)
* **Living Daily Wage Standard**: Integrates verified daily wage baselines (₹750 – ₹950/day based on skill and state guidelines).
* **Transparent Cost Breakdown**:
  $$\text{Fair Retail Price} = (\text{Raw Material Cost} \times 1.15) + (\text{Labor Days} \times \text{Daily Wage}) + \text{Heritage Artisan Margin}$$
* **GI Craft Heritage Multiplier**: Adds a 1.15x to 1.35x premium for certified authentic heritage crafts.
* **Wholesale Volume Tiers**:
  * Retail (1–9 units): Base Fair Price
  * Wholesale Bulk (10–49 units): 18% discount
  * Institutional / Export (50+ units): 28% discount
* **Interactive Sliders**: Artisans can adjust material costs and craft days to see their transparent labor earnings and margin breakdown.

---

### 4. 🏛️ Artisan Management Dashboard
* **MoSJE Beneficiary Card**: Displays verified artisan registration, GI craft badge, and artisan location.
* **5 Quick Action Tiles**:
  * 🎙️ *Voice Auto-Cataloger (आवाज से उत्पाद जोड़ें)*
  * 📸 *AI Image Studio (फोटो स्टूडियो संवर्धन)*
  * ⚖️ *Fair Pricing Calculator (उचित मूल्य कैलकुलेटर)*
  * 🤖 *AI Copilot Advisor (एआई सहायक से पूछें)*
  * 💬 *Buyer Inquiries & Quotes (थोक खरीदार पूछताछ)*
* **Business Analytics**: Track total listed crafts, completed orders, pending RFQ quotes, and monthly earnings.
* **Inventory Health & Reorder Alerts**: Automatic alerts for low-stock crafts and reorder planning.

---

### 5. 🛍️ Global Buyer Marketplace & Sourcing Portal
* **GI Heritage Filter & State Exploration**: Filter authentic Indian crafts by state (Uttar Pradesh, Gujarat, Odisha, Rajasthan, Telangana, etc.) and craft type (Textiles, Pottery, Metalwork, Woodcraft).
* **3-Way Photographic Inspection**:
  * `[ ✨ AI Enhanced ]`: Studio-grade clean listing photo.
  * `[ ▥ Before / After ]`: Verified side-by-side comparison showing background removal and lighting correction.
  * `[ 📷 Original ]`: Raw photo taken in the artisan's workshop for complete transparency.
* **Direct Artisan Chat**: Real-time messaging between buyers and artisans with translation support.
* **B2B Bulk RFQ (Request For Quote)**: Institutional buyers can request custom samples, volume quotes, and delivery timelines directly from the artisan.

---

### 6. 🤖 Artisan Copilot
* A built-in AI business assistant that understands conversational voice and text prompts.
* Provides instant business advice, answers questions about shipping, raw material sourcing, craft fairs, and government schemes, and reads responses aloud.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18** + **TypeScript** | High-performance, type-safe UI architecture |
| **Styling & Design** | **Tailwind CSS 3.4** | Modern, warm minimal aesthetic (`#FAF8F5` cream palette) |
| **Bundler & Dev Server**| **Vite 6** | Instant Hot Module Replacement (HMR) and optimized builds |
| **Computer Vision** | **@imgly/background-removal** | In-browser WebAssembly / WebGPU neural foreground segmentation |
| **Image Processing** | **HTML5 Canvas 2D + Sharp** | Auto-levels tone curve, S-curve contrast, unsharp mask, Saliency BFS |
| **Mobile Runtime** | **Capacitor 8** | Native Android container with camera and hardware access |
| **Speech Technology** | **Web Speech Recognition & Synthesis** | Voice-to-text cataloging and spoken audio feedback |
| **Database & Cloud** | **Firebase Firestore & Storage** | Real-time craft catalog, order tracking, and image storage |
| **Icons** | **Lucide React** | Clean, minimalist iconography |

---

## 📁 Directory Structure

```
shilp-ai/
├── android/                   # Native Android project (Capacitor)
├── public/
│   └── crafts/                # High-res sample craft presets & studio benchmarks
├── src/
│   ├── components/
│   │   ├── ArtisanCopilot.tsx      # Voice & text AI business advisor
│   │   ├── ArtisanDashboard.tsx    # Artisan home screen, action tiles & analytics
│   │   ├── ArtisanStudio.tsx       # AI photo enhancer with sliders & showcase
│   │   ├── BuyerPortal.tsx         # B2B buyer marketplace & wholesale RFQ
│   │   ├── CatalogGrid.tsx         # Responsive product grid with GI tags
│   │   ├── ChatMessaging.tsx       # Direct artisan-buyer real-time messaging
│   │   ├── DynamicPricingCard.tsx  # Interactive wage & pricing calculator
│   │   ├── Navbar.tsx              # Top navigation with role & language switcher
│   │   ├── ProductCard.tsx         # Product listing card with pricing & tags
│   │   ├── ProductDetailModal.tsx  # Product details with 3-way photo inspection
│   │   ├── ReviewsSection.tsx      # Verified buyer reviews & rating breakdown
│   │   └── VoiceCatalogerModal.tsx # Multilingual voice recording & attribute extractor
│   ├── data/
│   │   └── craftPresets.ts         # Authentic regional craft datasets (Banarasi, Terracotta, etc.)
│   ├── services/
│   │   ├── firebase.ts             # Firebase client initialization & fallback store
│   │   ├── imageStudio.ts          # Studio CV engine, BFS segmentation, tone curves & cache
│   │   ├── pricingEngine.ts        # Fair wage calculator & volume discount logic
│   │   └── xgboostPricingModel.ts  # ML pricing benchmarks for artisan crafts
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (Product, RFQ, Artisan, Language)
│   ├── App.tsx                     # Main application container & tab router
│   ├── index.css                   # Tailwind theme, typography & smooth animation styles
│   └── main.tsx                    # Application entry point
├── capacitor.config.json      # Capacitor Android configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Custom palette (warm cream, saffron, earthy stone)
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
* **Node.js**: `v18.0.0` or higher (tested on Node v20)
* **npm**: `v9.0.0` or higher

### Installation & Launch

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ManjusreeSedamkar/Shilp-AI.git
   cd Shilp-AI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will start immediately at **`http://localhost:5173`** (or the port specified in your terminal).

4. **Build for Production**:
   ```bash
   npm run build
   ```
   Builds the optimized production bundle into the `dist/` directory.

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 📱 Mobile App Setup (Android)

Shilp-AI includes full Capacitor Android configuration for installation on mobile devices.

### Prerequisites for Mobile
* [Android Studio](https://developer.android.com/studio) installed.
* Android SDK (API 30+) installed.

### Steps to Build and Run on Android

1. **Build the Web Assets**:
   ```bash
   npm run build
   ```

2. **Sync with Android Project**:
   ```bash
   npx cap sync android
   ```

3. **Open the Project in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Run on Device / Emulator**:
   * Connect your Android smartphone via USB (with **USB Debugging** enabled), or start an Android Virtual Device (AVD).
   * In Android Studio, click **Run ▶** to install and launch Shilp-AI on your phone.
   * To build an installable APK: Select **Build > Build Bundle(s) / APK(s) > Build APK(s)** in Android Studio.

---

## 🧪 Verification & Build Status

| Check | Command | Status |
| :--- | :--- | :--- |
| **TypeScript Compilation** | `tsc --noEmit` | **`Passed (0 errors)`** |
| **Production Build** | `npm run build` | **`✓ built in ~5.5s`** |
| **Dev Server HTTP Health**| `GET http://localhost:5173/` | **`200 OK`** |

---

## 🤝 Contributing & License

Contributions, feedback, and suggestions to support rural Indian craftspeople are welcome!
* Feel free to open an **Issue** or submit a **Pull Request**.
* Released under the **MIT License**.
