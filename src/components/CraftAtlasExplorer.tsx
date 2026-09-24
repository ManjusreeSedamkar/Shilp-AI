import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ChevronRight, 
  Award, 
  Eye, 
  ExternalLink,
  ChevronDown,
  Search,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { useMobileMode } from './MobileFrame';

export interface CraftPin {
  id: string;
  category: 'textiles' | 'metalwork' | 'glass_beadwork' | 'miscellaneous' | 'woodcraft' | 'leather';
  categoryLabel: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  crafts: string[];
}

export interface StateHeritageData {
  id: string;
  name: string;
  hindiName: string;
  isUT?: boolean;
  viewBox: string;
  svgPath: string;
  pins: CraftPin[];
  summary: string;
  topCrafts: string[];
}

// Full database of Indian States & Union Territories with authentic craft pins
const STATE_HERITAGE_MAP: Record<string, StateHeritageData> = {
  'Madhya Pradesh': {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    viewBox: '0 0 500 380',
    svgPath: 'M 190 125 C 190 90, 205 60, 220 50 C 235 40, 245 60, 245 90 C 255 95, 275 110, 260 135 C 275 140, 305 135, 330 145 C 370 140, 420 155, 435 180 C 445 200, 410 215, 390 230 C 375 255, 360 270, 340 265 C 320 275, 275 270, 250 260 C 230 270, 195 265, 175 260 C 150 250, 130 250, 120 235 C 110 210, 130 185, 135 160 C 145 140, 170 140, 190 125 Z',
    pins: [
      {
        id: 'mp-metal',
        category: 'metalwork',
        categoryLabel: 'METALWORK',
        x: 48,
        y: 22,
        crafts: ['Tikamgarh Bell Metal (Brass Castings)', 'Bastar/Betul Dhokra Metalware']
      },
      {
        id: 'mp-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 28,
        y: 54,
        crafts: ['Chanderi Silk & Zari Weaving', 'Maheshwari Handloom Sarees', 'Bagh Natural Dye Block Print']
      },
      {
        id: 'mp-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 64,
        y: 44,
        crafts: ['Gond Chitrakala (Tribal Painting)', 'Pithora Ritual Wall Painting', 'Ujjain Batik Print']
      },
      {
        id: 'mp-glass',
        category: 'glass_beadwork',
        categoryLabel: 'GLASS AND BEADWORK',
        x: 52,
        y: 72,
        crafts: ['Jhabua Beaded Tribal Dolls', 'Gwalior Traditional Lac Ornaments', 'Stone Carving of Bhedaghat']
      }
    ],
    summary: 'The heart of India boasts Chanderi & Maheshwari handlooms, vibrant Gond tribal art, and ancient lost-wax bell metal casting.',
    topCrafts: ['Chanderi Saree', 'Bagh Print', 'Gond Art', 'Tikamgarh Brass']
  },
  'Maharashtra': {
    id: 'maharashtra',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    viewBox: '0 0 500 400',
    svgPath: 'M 140 100 C 220 90, 310 110, 420 130 C 440 180, 430 240, 370 290 C 310 320, 240 330, 190 310 C 160 280, 140 230, 130 180 C 125 140, 130 115, 140 100 Z',
    pins: [
      {
        id: 'mh-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 38,
        y: 36,
        crafts: ['Yeola Paithani Pure Silk & Gold Peacock Saree', 'Narayan Peth Handloom', 'Himroo Weaving of Aurangabad']
      },
      {
        id: 'mh-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 26,
        y: 62,
        crafts: ['Pinguli Chitrakathi Folk Painting & Puppetry', 'Warli Tribal Rice-Paste Wall Painting', 'Ganjifa Playing Cards']
      },
      {
        id: 'mh-leather',
        category: 'leather',
        categoryLabel: 'LEATHER & FOOTWEAR',
        x: 32,
        y: 80,
        crafts: ['Kolhapuri Vegetable-Tanned Leather Chappals', 'Hand-Braided Babool Bark Footwear']
      },
      {
        id: 'mh-metal',
        category: 'metalwork',
        categoryLabel: 'METALWORK',
        x: 62,
        y: 50,
        crafts: ['Nashik Copper & Brass Ware', 'Bidri Craft of Marathwada']
      }
    ],
    summary: 'Home to the regal Paithani sarees with peacock zari borders, rustic Warli art, Pinguli Chitrakathi folk puppetry, and artisan Kolhapuri leather sandals.',
    topCrafts: ['Paithani Silk Saree', 'Chitrakathi Painting', 'Kolhapuri Chappal', 'Warli Art']
  },
  'Rajasthan': {
    id: 'rajasthan',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    viewBox: '0 0 500 420',
    svgPath: 'M 210 60 C 270 70, 340 110, 380 160 C 410 220, 380 290, 330 340 C 260 370, 190 350, 140 300 C 100 240, 110 160, 150 100 C 175 75, 195 65, 210 60 Z',
    pins: [
      {
        id: 'rj-pottery',
        category: 'glass_beadwork',
        categoryLabel: 'CLAY & CERAMICS',
        x: 58,
        y: 35,
        crafts: ['Jaipur GI Blue Pottery (Persian Cobalt Glaze)', 'Molela Terracotta Votive Plaques', 'Pokhran Clay Pottery']
      },
      {
        id: 'rj-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 44,
        y: 56,
        crafts: ['Sanganeri & Bagru Hand-Block Print', 'Kota Doria Silk-Cotton Weaving', 'Bandhani Tie-Dye']
      },
      {
        id: 'rj-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 68,
        y: 65,
        crafts: ['Kishangarh & Miniature Painting', 'Phad Sacred Narrative Scrolls', 'Leather Mojari Footwear']
      },
      {
        id: 'rj-metal',
        category: 'metalwork',
        categoryLabel: 'METALWORK',
        x: 74,
        y: 42,
        crafts: ['Thewa 24K Gold Inlay on Glass', 'Jaipur Brass Engraving & Koftgari Weapon Inlay']
      }
    ],
    summary: 'A desert realm of regal Jaipur Blue Pottery, intricate Sanganeri block printing, Kota Doria weaves, and brilliant Thewa gold inlay.',
    topCrafts: ['Jaipur Blue Pottery', 'Sanganeri Print', 'Kota Doria Saree', 'Thewa Gold Jewelry']
  },
  'Uttar Pradesh': {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    viewBox: '0 0 500 360',
    svgPath: 'M 130 110 C 210 80, 310 90, 420 130 C 440 180, 410 240, 370 270 C 310 290, 240 280, 180 250 C 130 220, 110 160, 130 110 Z',
    pins: [
      {
        id: 'up-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 74,
        y: 60,
        crafts: ['Varanasi Banarasi Katan Silk & Real Zari', 'Lucknow Chikankari Shadow Needlework', 'Bhadohi Hand-Knotted Silk Carpets']
      },
      {
        id: 'up-metal',
        category: 'metalwork',
        categoryLabel: 'METALWORK',
        x: 38,
        y: 34,
        crafts: ['Moradabad Brass Etching & Artifacts', 'Aligarh Brass Hardware', 'Varanasi Bronze Murtis']
      },
      {
        id: 'up-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 52,
        y: 48,
        crafts: ['Kannauj Traditional Deg-Bhapka Attar Perfumes', 'Khurja Colorful Glazed Pottery', 'Saharanpur Wood Carving']
      },
      {
        id: 'up-glass',
        category: 'glass_beadwork',
        categoryLabel: 'GLASS AND BEADWORK',
        x: 44,
        y: 62,
        crafts: ['Firozabad Blown Glassware & Bangles', 'Varanasi Glass Beads']
      }
    ],
    summary: 'World-renowned for divine Banarasi Katan silk sarees with tested zari, Moradabad brassware, and delicate Lucknow Chikankari embroidery.',
    topCrafts: ['Banarasi Silk Saree', 'Moradabad Brass', 'Chikankari Kurta', 'Khurja Pottery']
  },
  'Karnataka': {
    id: 'karnataka',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    viewBox: '0 0 400 480',
    svgPath: 'M 170 60 C 230 70, 270 120, 270 190 C 280 270, 260 340, 220 410 C 170 420, 130 370, 120 300 C 115 220, 125 140, 145 90 C 155 70, 165 65, 170 60 Z',
    pins: [
      {
        id: 'ka-wood',
        category: 'woodcraft',
        categoryLabel: 'WOODCRAFT & TOYS',
        x: 52,
        y: 72,
        crafts: ['Channapatna Organic Lacquer Wooden Toys', 'Mysore Rosewood Inlay', 'Sandalwood Figurines']
      },
      {
        id: 'ka-metal',
        category: 'metalwork',
        categoryLabel: 'METALWORK',
        x: 62,
        y: 22,
        crafts: ['Bidriware Pure Silver Wire Inlay Decanters', 'Udupi Bell Metal Utensils']
      },
      {
        id: 'ka-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 48,
        y: 50,
        crafts: ['Mysore Pure Crepe Silk Sarees', 'Ilkal Chikki Paras Saree', 'Guledgudd Khana Blouse Weave']
      },
      {
        id: 'ka-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 36,
        y: 38,
        crafts: ['Kinhal Lacquered Wooden Idols', 'Navalgund Jamkhana Durries']
      }
    ],
    summary: 'The land of GI-certified Channapatna non-toxic wooden toys, pure Mysore silk, and royal Bidriware silver inlay.',
    topCrafts: ['Channapatna Toy Train', 'Bidriware Silver Pitcher', 'Mysore Silk Saree', 'Ilkal Saree']
  },
  'Jammu & Kashmir': {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    hindiName: 'जम्मू और कश्मीर',
    isUT: true,
    viewBox: '0 0 450 360',
    svgPath: 'M 180 80 C 260 70, 320 90, 360 130 C 370 180, 340 230, 290 270 C 230 280, 160 260, 130 210 C 110 160, 130 110, 180 80 Z',
    pins: [
      {
        id: 'jk-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 46,
        y: 42,
        crafts: ['Certified Kashmiri Changthangi Pashmina Shawls', 'Fine Needle Sozni Hand Embroidery', 'Kani Jamawar Loom Weaving']
      },
      {
        id: 'jk-wood',
        category: 'woodcraft',
        categoryLabel: 'WOODCRAFT',
        x: 62,
        y: 55,
        crafts: ['Walnut Wood Relief Carving (Khatamband)', 'Carved Cedar Screens']
      },
      {
        id: 'jk-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 36,
        y: 65,
        crafts: ['Kashmiri Papier-Mâché Gilded Artifacts', 'Silk-Knotted Oriental Carpets']
      }
    ],
    summary: 'Crowning Himalayan artistry: Grade-A Pashmina shawls, needle Sozni embroidery, and hand-carved walnut woodwork.',
    topCrafts: ['Pashmina Sozni Shawl', 'Papier-Mâché Vases', 'Walnut Wood Boxes', 'Kani Shawl']
  },
  'Odisha': {
    id: 'odisha',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    viewBox: '0 0 420 380',
    svgPath: 'M 200 90 C 270 80, 330 110, 350 170 C 360 230, 330 280, 270 310 C 200 320, 150 280, 130 230 C 120 170, 150 110, 200 90 Z',
    pins: [
      {
        id: 'od-paint',
        category: 'miscellaneous',
        categoryLabel: 'TRADITIONAL PAINTING',
        x: 62,
        y: 52,
        crafts: ['Raghurajpur Tala Pattachitra (Palm Leaf Etching)', 'Natural Pigment Cloth Scrolls']
      },
      {
        id: 'od-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 38,
        y: 40,
        crafts: ['Sambalpuri Bandha Double Ikat Weaving', 'Bomkai Saree', 'Kotpad Tribal Vegetable-Dyed Shawl']
      },
      {
        id: 'od-metal',
        category: 'metalwork',
        categoryLabel: 'METALWORK',
        x: 70,
        y: 35,
        crafts: ['Cuttack Tarakasi (Fine Silver Filigree)', 'Bhubaneswar Brass & Bell Metal']
      }
    ],
    summary: 'Sacred coastal heritage of Raghurajpur palm-leaf Pattachitra, Sambalpuri Bandha Ikat, and Cuttack silver filigree.',
    topCrafts: ['Pattachitra Scroll', 'Sambalpuri Ikat', 'Silver Filigree Box', 'Bomkai Silk']
  },
  'Gujarat': {
    id: 'gujarat',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    viewBox: '0 0 460 380',
    svgPath: 'M 140 100 C 220 90, 310 110, 360 160 C 370 210, 340 260, 290 300 C 220 310, 160 290, 130 240 C 110 190, 115 140, 140 100 Z',
    pins: [
      {
        id: 'gj-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 36,
        y: 32,
        crafts: ['Kutch Ajrakh 16-Stage Resist Block Printing', 'Patan Double Ikat Patola', 'Bandhani Tie-Dye']
      },
      {
        id: 'gj-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 28,
        y: 58,
        crafts: ['Nirona Rogan Castor Oil Painting', 'Kutch Rabari Mirror Needlework', 'Tangaliya Shawl']
      },
      {
        id: 'gj-wood',
        category: 'woodcraft',
        categoryLabel: 'WOODCRAFT',
        x: 64,
        y: 62,
        crafts: ['Sankheda Lacquered Wooden Furniture', 'Surat Zari Thread Work']
      }
    ],
    summary: 'A vibrant cradle of Kutch natural-dye Ajrakh block prints, Patan Patola, Rogan art, and mirrorwork embroidery.',
    topCrafts: ['Ajrakh Stole', 'Patan Patola Saree', 'Rogan Art Painting', 'Rabari Embroidery']
  },
  'Telangana': {
    id: 'telangana',
    name: 'Telangana',
    hindiName: 'तेलंगाना',
    viewBox: '0 0 440 380',
    svgPath: 'M 170 90 C 250 80, 330 110, 360 170 C 350 240, 310 290, 250 320 C 180 310, 130 260, 120 200 C 110 140, 140 100, 170 90 Z',
    pins: [
      {
        id: 'tg-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 44,
        y: 55,
        crafts: ['Pochampally Ikat Double Weave Silk', 'Gadwal Zari Border Sarees', 'Narayanpet Cotton Sarees']
      },
      {
        id: 'tg-paint',
        category: 'miscellaneous',
        categoryLabel: 'PAINTING & SCROLLS',
        x: 62,
        y: 40,
        crafts: ['Cheriyal Narrative Folk Scroll Painting', 'Nirmal Wooden Toys & Paintings']
      },
      {
        id: 'tg-metal',
        category: 'metalwork',
        categoryLabel: 'METALWORK',
        x: 35,
        y: 35,
        crafts: ['Pembarthi Brass Sheet Metal Art', 'Adilabad Dokra Lost-Wax Bell Metal']
      }
    ],
    summary: 'Celebrated for geometric Pochampally Ikat silk weaves, Cheriyal storytelling scrolls, and Pembarthi brass sheet metalwork.',
    topCrafts: ['Pochampally Ikat Saree', 'Cheriyal Scroll', 'Pembarthi Brass Shield', 'Gadwal Saree']
  },
  'Tamil Nadu': {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    viewBox: '0 0 400 460',
    svgPath: 'M 160 80 C 230 70, 290 120, 280 200 C 270 280, 240 370, 200 420 C 160 410, 140 340, 130 260 C 120 180, 130 120, 160 80 Z',
    pins: [
      {
        id: 'tn-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 60,
        y: 30,
        crafts: ['Kanchipuram Heavy Mulberry Silk Sarees', 'Madurai Sungudi Sarees', 'Chettinad Cotton Weaves']
      },
      {
        id: 'tn-metal',
        category: 'metalwork',
        categoryLabel: 'BRONZE CASTING',
        x: 48,
        y: 52,
        crafts: ['Swamimalai Chola Bronze Idols', 'Nachiarcoil Brass Lamps', 'Thanjavur Art Plates']
      },
      {
        id: 'tn-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 38,
        y: 72,
        crafts: ['Tanjore 22K Gold Foil Gem Paintings', 'Toda Tribal Embroidery', 'Pattamadai Pai Grass Mats']
      }
    ],
    summary: 'Ancient Dravidian temple craftsmanship featuring royal Kanchipuram silk, Swamimalai lost-wax bronze sculptures, and gilded Tanjore paintings.',
    topCrafts: ['Kanchipuram Silk', 'Swamimalai Bronze Nataraja', 'Tanjore Gold Painting', 'Sungudi Saree']
  },
  'West Bengal': {
    id: 'west-bengal',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    viewBox: '0 0 380 460',
    svgPath: 'M 180 60 C 230 80, 250 140, 240 220 C 250 300, 230 380, 190 420 C 150 400, 140 320, 130 240 C 120 160, 140 90, 180 60 Z',
    pins: [
      {
        id: 'wb-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 52,
        y: 44,
        crafts: ['Baluchari Figural Brocade Sarees', 'Jamdani Muslin Weaving', 'Kantha Running-Stitch Needlework']
      },
      {
        id: 'wb-terracotta',
        category: 'glass_beadwork',
        categoryLabel: 'TERRACOTTA & CLAY',
        x: 40,
        y: 62,
        crafts: ['Bankura Hollow Terracotta Horse', 'Kumartuli Clay Idols', 'Sholapith Pithwork']
      },
      {
        id: 'wb-misc',
        category: 'miscellaneous',
        categoryLabel: 'MISCELLANEOUS CRAFTS',
        x: 62,
        y: 28,
        crafts: ['Kalighat Folk Paintings', 'Purulia Chau Dance Masks', 'Dhokra of Dariapur']
      }
    ],
    summary: 'An artistic sanctuary of historic Baluchari mythological weaves, delicate Kantha needlework, and Bankura terracotta horses.',
    topCrafts: ['Baluchari Silk Saree', 'Bankura Horse', 'Kantha Stole', 'Chau Mask']
  },
  'Bihar': {
    id: 'bihar',
    name: 'Bihar',
    hindiName: 'बिहार',
    viewBox: '0 0 460 340',
    svgPath: 'M 130 110 C 220 90, 340 100, 410 130 C 430 180, 390 230, 340 260 C 260 270, 180 260, 130 220 C 100 170, 110 130, 130 110 Z',
    pins: [
      {
        id: 'br-paint',
        category: 'miscellaneous',
        categoryLabel: 'FOLK PAINTING',
        x: 58,
        y: 38,
        crafts: ['Madhubani / Mithila Bamboo Nib Painting', 'Manjusha Angika Folk Art', 'Tikuli Enamel Glass Art']
      },
      {
        id: 'br-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 72,
        y: 62,
        crafts: ['Bhagalpur Tussar Silk (Ahinsa Silk)', 'Sujani Quilted Embroidery']
      },
      {
        id: 'br-grass',
        category: 'woodcraft',
        categoryLabel: 'NATURAL FIBRE',
        x: 36,
        y: 52,
        crafts: ['Golden Sikki Wild River Grass Weaving', 'Brass Bells of Bihta']
      }
    ],
    summary: 'The holy land of Madhubani / Mithila line paintings, organic Bhagalpur Ahinsa silk, and golden Sikki grass handicrafts.',
    topCrafts: ['Madhubani Canvas', 'Bhagalpuri Tussar Saree', 'Sikki Grass Box', 'Sujani Shawl']
  },
  'Assam': {
    id: 'assam',
    name: 'Assam',
    hindiName: 'असम',
    viewBox: '0 0 500 320',
    svgPath: 'M 120 120 C 220 90, 350 90, 440 130 C 460 180, 420 220, 360 240 C 270 250, 180 230, 120 200 C 100 160, 110 130, 120 120 Z',
    pins: [
      {
        id: 'as-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 48,
        y: 45,
        crafts: ['Golden Muga Silk Mekhela Chador', 'Eri (Ahimsa) Peace Silk', 'Gamosa Woven Scarves']
      },
      {
        id: 'as-wood',
        category: 'woodcraft',
        categoryLabel: 'CANE & BAMBOO',
        x: 65,
        y: 55,
        crafts: ['Sarthebari Bell Metal Ware', 'Barpeta Cane & Bamboo Craft', 'Majuli Traditional Mask Making']
      }
    ],
    summary: 'The pristine home of naturally golden Muga silk, Sarthebari hand-beaten bell metal, and Majuli sacred masks.',
    topCrafts: ['Muga Silk Mekhela', 'Eri Silk Shawl', 'Sarthebari Bell Metal Bowl', 'Majuli Mask']
  },
  'Punjab': {
    id: 'punjab',
    name: 'Punjab',
    hindiName: 'पंजाब',
    viewBox: '0 0 400 380',
    svgPath: 'M 160 80 C 230 70, 300 100, 320 160 C 330 220, 290 280, 240 310 C 180 320, 130 270, 120 210 C 110 150, 130 100, 160 80 Z',
    pins: [
      {
        id: 'pb-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 45,
        y: 42,
        crafts: ['Phulkari Geometric Silk Needle Embroidery', 'Bagh Heavy Silk Stoles']
      },
      {
        id: 'pb-leather',
        category: 'leather',
        categoryLabel: 'LEATHER & FOOTWEAR',
        x: 58,
        y: 65,
        crafts: ['Muktsar & Patiala Embroidered Jutti', 'Hoshiarpur Wooden Inlay']
      }
    ],
    summary: 'Famous for the vibrant geometric silk embroidery of Phulkari dupattas and hand-embroidered leather Punjabi juttis.',
    topCrafts: ['Phulkari Dupatta', 'Patiala Jutti', 'Hoshiarpur Inlay Box']
  },
  'Kerala': {
    id: 'kerala',
    name: 'Kerala',
    hindiName: 'केरल',
    viewBox: '0 0 340 500',
    svgPath: 'M 150 60 C 190 80, 210 150, 200 240 C 190 330, 170 410, 140 450 C 120 420, 110 330, 115 240 C 120 140, 130 80, 150 60 Z',
    pins: [
      {
        id: 'kl-metal',
        category: 'metalwork',
        categoryLabel: 'METAL MIRROR & BRASS',
        x: 48,
        y: 55,
        crafts: ['Aranmula Kannadi Front-Surface Metal Mirror', 'Bell Metal Uruli & Nilavilakku']
      },
      {
        id: 'kl-textile',
        category: 'textiles',
        categoryLabel: 'TEXTILE CRAFTS',
        x: 52,
        y: 35,
        crafts: ['Balaramapuram Kasavu Gold Zari Saree', 'Kuthampully Handloom Sarees']
      },
      {
        id: 'kl-wood',
        category: 'woodcraft',
        categoryLabel: 'COIR & WOODCRAFT',
        x: 42,
        y: 75,
        crafts: ['Nettur Petti Rosewood Jewel Boxes', 'Natural Golden Coir Mats & Weaves']
      }
    ],
    summary: 'God’s own country of mysterious Aranmula front-surface metal mirrors, Balaramapuram Kasavu gold sarees, and Nettur Petti jewel caskets.',
    topCrafts: ['Aranmula Kannadi Mirror', 'Kasavu Gold Saree', 'Nettur Petti Box', 'Nilavilakku Lamp']
  }
};

// Full list of 28 States and 8 Union Territories
const ALL_INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

const ALL_UNION_TERRITORIES = [
  'Andaman & Nicobar Islands',
  'Chandigarh',
  'Dadra & Nagar Haveli',
  'Daman & Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Interactive hotspot coordinates over the India Map graphic for state selection
const INDIA_MAP_HOTSPOTS: { name: string; x: number; y: number; width: number; height: number }[] = [
  { name: 'Maharashtra', x: 28, y: 55, width: 18, height: 16 },
  { name: 'Madhya Pradesh', x: 38, y: 44, width: 20, height: 14 },
  { name: 'Rajasthan', x: 22, y: 32, width: 18, height: 17 },
  { name: 'Gujarat', x: 14, y: 46, width: 16, height: 15 },
  { name: 'Uttar Pradesh', x: 42, y: 32, width: 19, height: 15 },
  { name: 'Karnataka', x: 28, y: 70, width: 13, height: 19 },
  { name: 'Jammu & Kashmir', x: 28, y: 12, width: 18, height: 15 },
  { name: 'Odisha', x: 55, y: 52, width: 13, height: 15 },
  { name: 'Tamil Nadu', x: 34, y: 82, width: 14, height: 16 },
  { name: 'West Bengal', x: 62, y: 46, width: 11, height: 16 },
  { name: 'Bihar', x: 58, y: 36, width: 12, height: 12 },
  { name: 'Telangana', x: 38, y: 64, width: 13, height: 12 },
  { name: 'Kerala', x: 31, y: 86, width: 10, height: 12 },
  { name: 'Andhra Pradesh', x: 38, y: 72, width: 15, height: 15 },
  { name: 'Punjab', x: 28, y: 26, width: 10, height: 10 },
  { name: 'Assam', x: 74, y: 36, width: 14, height: 12 }
];

interface CraftAtlasExplorerProps {
  onSelectStateFromAtlas?: (stateName: string) => void;
  onExploreCraftCategory?: (category: string) => void;
}

export const CraftAtlasExplorer: React.FC<CraftAtlasExplorerProps> = ({
  onSelectStateFromAtlas,
  onExploreCraftCategory
}) => {
  const { isMobileMode } = useMobileMode();
  const [selectedStateName, setSelectedStateName] = useState<string>('Madhya Pradesh');
  const [hoveredMapState, setHoveredMapState] = useState<string | null>(null);
  const [activeHoverPin, setActiveHoverPin] = useState<CraftPin | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<'map' | 'details'>('map');
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  // Fallback to dynamic state data or default
  const currentStateData = useMemo(() => {
    if (STATE_HERITAGE_MAP[selectedStateName]) {
      return STATE_HERITAGE_MAP[selectedStateName];
    }
    // Dynamic generated fallback for states without hardcoded vector
    return {
      id: selectedStateName.toLowerCase().replace(/\s+/g, '-'),
      name: selectedStateName,
      hindiName: selectedStateName,
      viewBox: '0 0 500 380',
      svgPath: 'M 190 125 C 190 90, 205 60, 220 50 C 235 40, 245 60, 245 90 C 255 95, 275 110, 260 135 C 275 140, 305 135, 330 145 C 370 140, 420 155, 435 180 C 445 200, 410 215, 390 230 C 375 255, 360 270, 340 265 C 320 275, 275 270, 250 260 C 230 270, 195 265, 175 260 C 150 250, 130 250, 120 235 C 110 210, 130 185, 135 160 C 145 140, 170 140, 190 125 Z',
      pins: [
        {
          id: 'gen-textile',
          category: 'textiles' as const,
          categoryLabel: 'REGIONAL HANDLOOM',
          x: 38,
          y: 45,
          crafts: [`Traditional ${selectedStateName} Handloom Weaves`, 'Organic Natural Fibres']
        },
        {
          id: 'gen-misc',
          category: 'miscellaneous' as const,
          categoryLabel: 'FOLK HERITAGE',
          x: 62,
          y: 58,
          crafts: [`Indigenous ${selectedStateName} Artisan Guilds`, 'GI Certified Crafts']
        }
      ],
      summary: `Verified master artisan clusters and traditional heritage crafts across ${selectedStateName}, registered with the Ministry of Social Justice and Empowerment.`,
      topCrafts: [`${selectedStateName} Handloom`, `${selectedStateName} Folk Craft`]
    };
  }, [selectedStateName]);

  const handleStateClick = (stateName: string) => {
    setSelectedStateName(stateName);
    setActiveHoverPin(null);
    if (isMobileMode) {
      setMobileActiveTab('details');
    }
  };

  const handleFilterCatalog = (stateName: string) => {
    onSelectStateFromAtlas?.(stateName);
    const catalogElement = document.getElementById('procurement-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find active hotspot for positioning the tooltip directly on top of the hovered/selected state
  const activeHotspot = useMemo(() => {
    const targetName = hoveredMapState || selectedStateName;
    return INDIA_MAP_HOTSPOTS.find(h => h.name.toLowerCase() === targetName.toLowerCase());
  }, [hoveredMapState, selectedStateName]);

  // Filtered states by search query
  const filteredStates = useMemo(() => {
    if (!stateSearchQuery.trim()) return ALL_INDIAN_STATES;
    return ALL_INDIAN_STATES.filter(s => s.toLowerCase().includes(stateSearchQuery.toLowerCase()));
  }, [stateSearchQuery]);

  return (
    <section 
      aria-label="National Craft Atlas and State Heritage Explorer"
      className="w-full bg-[#FCFAF7] dark:bg-[#070B14] border-b border-amber-500/20 py-5 sm:py-8 transition-colors select-none"
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2.5 sm:pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-[#8B1D1D] animate-ping shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] text-[#8B1D1D] dark:text-amber-400 font-bold truncate">
                Ministry of Textiles & MoSJE • Geographical Mapping
              </span>
            </div>
            <h2 className="text-sm sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
              {isMobileMode ? 'National Craft Atlas' : 'Interactive National Craft Atlas & State Heritage Explorer'}
            </h2>
          </div>

          {!isMobileMode && (
            <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] font-medium shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-[#8B1D1D] dark:text-amber-400" />
                <span>Tap any state on the map or list to inspect crafts</span>
              </span>
            </div>
          )}
        </div>

        {/* Mobile View Mode Tab Switcher */}
        {isMobileMode && (
          <div className="flex items-center p-1 bg-stone-200/80 dark:bg-stone-800 rounded-xl text-xs font-bold w-full">
            <button
              onClick={() => setMobileActiveTab('map')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileActiveTab === 'map'
                  ? 'bg-white dark:bg-stone-900 text-[#8B1D1D] dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <span>🗺️ India GI Map</span>
            </button>
            <button
              onClick={() => setMobileActiveTab('details')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileActiveTab === 'details'
                  ? 'bg-white dark:bg-stone-900 text-[#8B1D1D] dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <span>🏛️ {selectedStateName} Crafts</span>
            </button>
          </div>
        )}

        {/* MAIN TWO-COLUMN INTEGRATION (Or 100% full-width on mobile mode) */}
        <div className={isMobileMode ? "w-full flex flex-col space-y-4" : "grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"}>

          {/* =================================================================== */}
          {/* LEFT COLUMN: CRAFT ATLAS INDIA MAP                                  */}
          {/* =================================================================== */}
          <div className={`
            ${isMobileMode ? 'w-full' : 'lg:col-span-5'} bg-white dark:bg-[#0F172A] rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden
            ${isMobileMode && mobileActiveTab !== 'map' ? 'hidden' : 'flex'}
          `}>
            
            {/* Craft Atlas Header */}
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#475569] dark:text-stone-200 tracking-tight font-sans">
                  Craft Atlas
                </h3>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">
                  Select a state to explore its GI clusters
                </p>
              </div>
              <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                India GI Map
              </span>
            </div>

            {/* Interactive Quick State Selector Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-y border-stone-100 dark:border-stone-800 text-xs my-1">
              <span className="text-[10px] font-bold text-stone-400 shrink-0 uppercase tracking-wider">Quick State:</span>
              {ALL_INDIAN_STATES.slice(0, 14).map((st) => {
                const isSelected = selectedStateName.toLowerCase() === st.toLowerCase();
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStateClick(st)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B1D1D] text-white shadow-xs scale-105'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
            <div className="relative w-full aspect-[4/4.4] flex items-center justify-center my-auto overflow-hidden rounded-xl">
              
              {/* Authentic User-Provided Craft Atlas Textured Map */}
              <img
                src="/crafts/craft-atlas-india-map.png"
                alt="Craft Atlas India Map with Textile Motifs"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
              />

              {/* Interactive State Hotspot Zones */}
              <div className="absolute inset-0 z-10">
                {INDIA_MAP_HOTSPOTS.map((hotspot) => {
                  const isHovered = hoveredMapState === hotspot.name;
                  const isSelected = selectedStateName.toLowerCase() === hotspot.name.toLowerCase();

                  return (
                    <button
                      key={hotspot.name}
                      type="button"
                      onClick={() => handleStateClick(hotspot.name)}
                      onMouseEnter={() => setHoveredMapState(hotspot.name)}
                      onMouseLeave={() => setHoveredMapState(null)}
                      style={{
                        top: `${hotspot.y}%`,
                        left: `${hotspot.x}%`,
                        width: `${hotspot.width}%`,
                        height: `${hotspot.height}%`,
                      }}
                      className={`absolute rounded-xl transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-[#8B1D1D] bg-[#8B1D1D]/20 shadow-sm' 
                          : isHovered 
                            ? 'bg-amber-500/25 ring-1 ring-amber-500/60' 
                            : 'bg-transparent'
                      }`}
                      title={`Explore ${hotspot.name} crafts`}
                      aria-label={hotspot.name}
                    />
                  );
                })}
              </div>

              {/* Floating Tooltip Box matching Image 1 exactly: Positioned right above the active state */}
              {activeHotspot && (
                <div 
                  style={{
                    left: `${activeHotspot.x + activeHotspot.width / 2}%`,
                    top: `${Math.max(8, activeHotspot.y - 7)}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full z-30 pointer-events-none transition-all duration-150"
                >
                  <div className="relative bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-100 px-3.5 py-1 rounded-md shadow-xl font-black text-xs sm:text-sm tracking-tight whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B1D1D] animate-ping" />
                    <span>{hoveredMapState || selectedStateName}</span>
                    
                    {/* Downward triangle caret */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-stone-900 dark:border-t-stone-100" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom State Switcher Ribbon */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
              <span className="text-[11px] truncate max-w-[200px]">
                Selected: <strong className="text-[#8B1D1D] dark:text-amber-400">{selectedStateName}</strong>
              </span>
              <div className="flex items-center gap-2">
                {isMobileMode ? (
                  <button
                    onClick={() => setMobileActiveTab('details')}
                    className="text-[11px] font-bold text-[#8B1D1D] dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Crafts</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleFilterCatalog(selectedStateName)}
                    className="text-[11px] font-bold text-[#8B1D1D] dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View in Catalog</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* =================================================================== */}
          {/* RIGHT COLUMN: STATE CRAFT DETAILS VIEW                              */}
          {/* =================================================================== */}
          <div className={`
            ${isMobileMode ? 'w-full' : 'lg:col-span-7'} bg-white dark:bg-[#0F172A] rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between
            ${isMobileMode && mobileActiveTab !== 'details' ? 'hidden' : 'flex'}
          `}>
            
            {/* Top Navigation Bar: India • [State Name in Maroon] • Union Territories */}
            <div className="grid grid-cols-12 items-center pb-3 border-b border-stone-200/80 dark:border-stone-800 text-xs sm:text-sm">
              
              {/* Left breadcrumb: India */}
              <div className="col-span-3 text-left">
                <button
                  onClick={() => handleStateClick('Madhya Pradesh')}
                  className="font-bold text-stone-900 dark:text-stone-100 hover:text-[#8B1D1D] dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  India
                </button>
              </div>

              {/* Center: Selected State Name in Bold Red/Maroon */}
              <div className="col-span-6 text-center">
                <h3 className="font-extrabold text-base sm:text-xl text-[#8B1D1D] dark:text-red-400 tracking-tight font-serif truncate">
                  {currentStateData.name}
                </h3>
              </div>

              {/* Right: Union Territories Heading */}
              <div className="col-span-3 text-right">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px] sm:text-xs">
                  UT Clusters
                </span>
              </div>
            </div>

            {/* Quick State Search */}
            <div className="pt-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={stateSearchQuery}
                  onChange={(e) => setStateSearchQuery(e.target.value)}
                  placeholder="Quick search state or craft (e.g. Kerala, Bengal, UP)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#8B1D1D]"
                />
              </div>
            </div>

            {/* Middle Section: All States List (Left) • State Map + Pins (Center) • UT List (Right) */}
            <div className="grid grid-cols-12 gap-3 py-3 my-auto items-stretch">
              
              {/* 1. Sub-Column: All States (Scrollable List) */}
              <div className="col-span-12 sm:col-span-3 border-r border-stone-100 dark:border-stone-800/80 pr-2">
                <h4 className="font-bold text-xs text-[#8B1D1D] dark:text-red-400 mb-1.5">
                  States ({filteredStates.length})
                </h4>
                <div className="max-h-[280px] overflow-y-auto no-scrollbar space-y-0.5 text-xs select-none">
                  {filteredStates.map((st) => {
                    const isSelected = selectedStateName.toLowerCase() === st.toLowerCase();
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStateClick(st)}
                        className={`w-full text-left py-1 px-1.5 rounded-md transition-colors cursor-pointer truncate text-[11px] ${
                          isSelected
                            ? 'font-black text-[#8B1D1D] dark:text-red-400 uppercase tracking-wide bg-red-50 dark:bg-red-950/40'
                            : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sub-Column: State Outline Map with Craft Pins (Zero SVG Filter Lag) */}
              <div className="col-span-12 sm:col-span-6 flex flex-col items-center justify-center px-1 relative min-h-[280px]">
                
                {/* Center SVG State Silhouette - No CPU drop-shadow filter! Using GPU-accelerated CSS shadow */}
                <div className="relative w-full h-[240px] flex items-center justify-center drop-shadow-md">
                  <svg
                    viewBox={currentStateData.viewBox}
                    className="w-full h-full transform transition-transform duration-200"
                  >
                    <path
                      d={currentStateData.svgPath}
                      className="fill-[#EFE6DC] dark:fill-[#26201A] stroke-[#D6C7B6] dark:stroke-[#4A3D31] stroke-[1.5] transition-colors duration-200"
                    />
                  </svg>

                  {/* Interactive Regional Craft Pins */}
                  {currentStateData.pins.map((pin) => {
                    const isHovered = activeHoverPin?.id === pin.id;

                    return (
                      <div
                        key={pin.id}
                        style={{
                          top: `${pin.y}%`,
                          left: `${pin.x}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                        onMouseEnter={() => setActiveHoverPin(pin)}
                        onClick={() => setActiveHoverPin(isHovered ? null : pin)}
                      >
                        {/* Custom Motif matching Image 2 */}
                        <div className={`p-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 shadow-md border border-stone-200 dark:border-stone-700 transition-all duration-150 ${isHovered ? 'scale-125 ring-2 ring-[#8B1D1D]' : 'hover:scale-110'}`}>
                          {pin.category === 'textiles' && (
                            <div className="w-5 h-5 flex items-center justify-center text-[#8B1D1D] dark:text-amber-400">
                              <span className="text-sm font-bold">❖</span>
                            </div>
                          )}

                          {pin.category === 'metalwork' && (
                            <div className="w-5 h-5 flex items-center justify-center text-amber-600 dark:text-amber-400">
                              <span className="text-sm font-bold">🔱</span>
                            </div>
                          )}

                          {pin.category === 'miscellaneous' && (
                            <div className="w-5 h-5 flex items-center justify-center text-[#8B1D1D] dark:text-red-400">
                              <span className="text-sm font-bold">⦿</span>
                            </div>
                          )}

                          {pin.category === 'glass_beadwork' && (
                            <div className="w-5 h-5 flex items-center justify-center text-teal-600 dark:text-teal-400">
                              <span className="text-sm font-bold">🦚</span>
                            </div>
                          )}

                          {pin.category === 'woodcraft' && (
                            <div className="w-5 h-5 flex items-center justify-center text-amber-800 dark:text-amber-400">
                              <span className="text-sm font-bold">🪵</span>
                            </div>
                          )}

                          {pin.category === 'leather' && (
                            <div className="w-5 h-5 flex items-center justify-center text-orange-900 dark:text-amber-300">
                              <span className="text-sm font-bold">👞</span>
                            </div>
                          )}
                        </div>

                        {/* Hover Popup Card */}
                        {isHovered && (
                          <div 
                            className="absolute left-6 top-0 -translate-y-1/3 z-40 bg-white dark:bg-[#1A2035] border border-stone-300 dark:border-stone-700 rounded-lg p-3 shadow-2xl min-w-[210px] max-w-[260px] animate-fadeIn text-left pointer-events-auto"
                            onMouseLeave={() => setActiveHoverPin(null)}
                          >
                            <span className="text-[#8B1D1D] dark:text-red-400 font-bold text-[11px] tracking-wide uppercase block">
                              {pin.categoryLabel}
                            </span>

                            <div className="w-full h-[1px] bg-[#8B1D1D]/30 my-1.5" />

                            <ul className="space-y-1 text-xs text-stone-800 dark:text-stone-200">
                              {pin.crafts.map((craft, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                  <span className="text-[#8B1D1D] font-bold">•</span>
                                  <span>{craft}</span>
                                </li>
                              ))}
                            </ul>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFilterCatalog(selectedStateName);
                              }}
                              className="mt-2 text-[10px] font-bold text-[#8B1D1D] dark:text-amber-400 hover:underline flex items-center justify-between w-full pt-1.5 border-t border-stone-100 dark:border-stone-800 cursor-pointer"
                            >
                              <span>Explore in Catalog</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* State Summary Line */}
                <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center line-clamp-2 px-2 mt-1">
                  {currentStateData.summary}
                </p>

              </div>

              {/* 3. Sub-Column: Union Territories (Right List) */}
              <div className="col-span-12 sm:col-span-3 border-l border-stone-100 dark:border-stone-800/80 pl-2">
                <h4 className="font-bold text-xs text-[#8B1D1D] dark:text-red-400 mb-1.5">
                  Union Territories
                </h4>
                <div className="space-y-0.5 text-xs select-none">
                  {ALL_UNION_TERRITORIES.map((ut) => {
                    const isSelected = selectedStateName.toLowerCase().includes(ut.toLowerCase()) || 
                      (ut === 'Jammu and Kashmir' && selectedStateName.includes('Kashmir'));

                    return (
                      <button
                        key={ut}
                        type="button"
                        onClick={() => handleStateClick(ut === 'Jammu and Kashmir' ? 'Jammu & Kashmir' : ut)}
                        className={`w-full text-left py-1 px-1.5 rounded-md transition-colors cursor-pointer truncate text-[11px] ${
                          isSelected
                            ? 'font-black text-[#8B1D1D] dark:text-red-400 uppercase tracking-wide bg-red-50 dark:bg-red-950/40'
                            : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium'
                        }`}
                      >
                        {ut}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Row: Craft Category Legend */}
            <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 dark:text-stone-400">
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-1 font-medium">
                  <span className="text-[#8B1D1D] text-sm">❖</span>
                  <span className="text-[11px]">Textiles</span>
                </div>

                <div className="flex items-center gap-1 font-medium">
                  <span className="text-[#8B1D1D] text-sm">⦿</span>
                  <span className="text-[11px]">Painting</span>
                </div>

                <div className="flex items-center gap-1 font-medium">
                  <span className="text-teal-600 text-sm">🦚</span>
                  <span className="text-[11px]">Beadwork</span>
                </div>

                <div className="flex items-center gap-1 font-medium">
                  <span className="text-amber-600 text-sm">🔱</span>
                  <span className="text-[11px]">Metalwork</span>
                </div>
              </div>

              {/* Direct Repository Link Button */}
              <button
                type="button"
                onClick={() => handleFilterCatalog(selectedStateName)}
                className="px-3.5 py-1.5 rounded-lg bg-[#8B1D1D] hover:bg-[#701616] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <span>Filter for {selectedStateName}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
