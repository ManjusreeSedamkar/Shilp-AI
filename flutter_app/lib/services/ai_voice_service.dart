import 'package:flutter_tts/flutter_tts.dart';

class AIVoiceService {
  final FlutterTts _tts = FlutterTts();

  AIVoiceService() {
    _initTts();
  }

  void _initTts() async {
    await _tts.setSpeechRate(0.5);
    await _tts.setVolume(1.0);
    await _tts.setPitch(1.0);
  }

  Future<void> speak(String text, {String lang = 'hi-IN'}) async {
    await _tts.setLanguage(lang);
    await _tts.speak(text);
  }

  Future<void> stop() async {
    await _tts.stop();
  }

  static Map<String, dynamic> extractAttributesFromSpeech(String text) {
    final lower = text.toLowerCase();

    int rawCost = 1500;
    final costMatch = RegExp(r'(?:₹|rs\.?|rupees|रुपये|खर्च)\s*(\d+)').firstMatch(text);
    if (costMatch != null) {
      rawCost = int.tryParse(costMatch.group(1)!) ?? 1500;
    }

    int days = 3;
    final daysMatch = RegExp(r'(\d+)\s*(?:days?|दिन)').firstMatch(text);
    if (daysMatch != null) {
      days = int.tryParse(daysMatch.group(1)!) ?? 3;
    }

    String category = 'Textiles & Handloom';
    String technique = 'Double Ikat Pit-Loom Weaving';
    String material = '100% Pure Mulberry Silk';
    String titleEn = 'Handwoven Pochampally Double Ikat Silk Saree';
    String titleHi = 'हस्तनिर्मित पोचमपल्ली डबल इकत रेशम साड़ी';

    if (lower.contains('dhokra') || lower.contains('ढोकरा') || lower.contains('brass') || lower.contains('पीतल')) {
      category = 'Metalcraft & Dhokra';
      technique = 'Lost-Wax Casting (Cire Perdue)';
      material = 'Bell-Metal Alloy';
      titleEn = 'Bastar Tribal Dhokra Lost-Wax Figurine';
      titleHi = 'बस्तर जनजातीय ढोकरा कांस्य मूर्ति';
    } else if (lower.contains('terracotta') || lower.contains('टेराकोटा') || lower.contains('clay') || lower.contains('मिट्टी')) {
      category = 'Clay & Terracotta';
      technique = 'Wheel-Thrown Clay Firing';
      material = 'River Alluvial Clay';
      titleEn = 'Bankura Terracotta Royal Decorative Urn';
      titleHi = 'बांकुरा टेराकोटा नक्काशीदार कलश';
    }

    return {
      'category': category,
      'craftTechnique': technique,
      'primaryMaterial': material,
      'rawMaterialCost': rawCost,
      'productionDays': days,
      'titleEn': titleEn,
      'titleHi': titleHi,
    };
  }
}
