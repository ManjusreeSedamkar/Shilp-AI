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

## ✨ Key Features & Capabilities

### 1. 📸 AI Computer Vision Studio & Photographic Enhancement
Turns raw, dimly lit workshop photos into studio-grade e-commerce listings while preserving the **exact authentic craft**:
* **100% Product Authenticity**: Preserves the original craft without redrawing, recoloring, or AI hallucinations. Patterns, weaves, embroidery, and textures remain completely identical to the real product.
* **Complete Background Clutter Removal**: Uses multi-tiered neural and topological segmentation to eliminate messy room backgrounds (beds, clothes, walls, floors, tools) without creating white patches or internal holes.
* **Studio-Grade Backdrop**: Replaces clutter with clean, elegant studio backdrops (*Pure White, Warm Ivory Studio, Soft Gray, or Transparent PNG*).
* **Photographic Light & Tone Correction**:
  * **Dynamic Range Auto-Levels**: Evaluates 2nd to 98th percentile foreground luminance, lifting dingy shadows into radiant clarity.
  * **Highlight-Protected Brightness Lift**: Default `+15%` brightening that safeguards metallic zari and glossy finishes from blowout.
  * **S-Curve Dynamic Contrast**: Default `+22%` contrast enhancement for crisp folds and rich depth.
  * **Natural Dye Vibrance / Saturation**: Default `+22%` saturation boost enriching natural pigments (indigo, madder, turmeric, zari) without artificial color casts.
  * **Texture Sharpening (Unsharp Mask)**: Enhances weave detail and chisel marks cleanly.
* **Interactive Fine-Tuning Sliders**:
  * Live sliders for **Brightness** (`-30%` to `+50%`), **Contrast** (`-20%` to `+50%`), and **Saturation** (`-20%` to `+50%`).
  * **✨ Reset to AI Optimal**: 1-click restore to AI-recommended photographic settings.
  * **Lightning-Fast (15ms) Latency**: In-memory cutout segmentation caching allows real-time slider updates without re-processing masks.
* **Interactive Dual Before/After Showcase**:
  * Dual-card layout matching e-commerce verification standards with the **5 Quality Badges**:
    1. ✂️ *Background Removal (बैकग्राउंड हटाना)*
    2. ☀️ *Better Lighting (बेहतर लाइटिंग)*
    3. 🎨 *Natural Color Correction (प्राकृतिक रंग सुधार)*
    4. 📐 *Proper Positioning & Cropping (उचित स्थिति व क्रॉपिंग)*
    5. ✨ *Enhanced Quality (संवर्धित गुणवत्ता)*
  * Interactive draggable split slider for side-by-side inspection.

---

### 2. 🎙️ Multilingual Voice-First Cataloging
Artisans do not have to type long product forms:
* Simply tap the microphone and speak naturally in **Hindi** or **English**:
  > *"यह बनारसी रेशम की साड़ी है। 5 दिन लगे और ₹2,500 कच्चा माल लगा।"*  
  > *(Or: "This is a handwoven Banarasi silk saree. It took me 5 days to make with 2500 rupees in raw materials.")*
* **Automatic NLP Attribute Extraction**:
  * Automatically identifies the craft category, materials used, production days, and raw material costs.
  * Checks and applies authentic **Geographical Indication (GI Tag)** heritage identifiers.
* **Bilingual Storytelling**:
  * Generates an evocative cultural narrative in Hindi honoring the artisan's tradition.
  * Generates an SEO-optimized English product listing with meta search keywords for global buyers.
* **Voice Feedback**: The AI Copilot speaks back to the artisan with audio confirmation via Web SpeechSynthesis.

---

### 3. ⚖️ Fair Value Pricing Engine (Guaranteed Living Wage)
Protects artisans from selling below cost or being exploited:
* **Living Daily Wage Standard**: Integrates verified daily wage baselines (₹750 – ₹950/day based on skill and state guidelines).
* **Transparent Cost Breakdown**:
  * **Fair Retail Price** = (Raw Material Cost × 1.15) + (Labor Days × Daily Wage) + Heritage Margin
* **GI Craft Heritage Multiplier**: Adds a 1.15x to 1.35x premium for rare, certified heritage crafts.
* **Wholesale Volume Tiers**:
  * Retail (1–9 units): Base Fair Price
  * Wholesale Bulk (10–49 units): 18% discount
  * Institutional / Export (50+ units): 28% discount
* **Interactive Sliders**: Artisans can adjust raw material costs and craft duration in real-time to see their transparent wage and profit breakdown.

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
| **Production Build** | `npm run build` | **`✓ built in ~11s`** |
| **Dev Server HTTP Health**| `GET http://localhost:5173/` | **`200 OK`** |

---

## 🤝 Contributing & License

Contributions, feedback, and suggestions to support rural Indian craftspeople are welcome!
* Feel free to open an **Issue** or submit a **Pull Request**.
* Released under the **MIT License**.
