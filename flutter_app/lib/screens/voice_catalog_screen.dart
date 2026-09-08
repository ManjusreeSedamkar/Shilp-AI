import 'package:flutter/material.dart';
import '../services/ai_voice_service.dart';
import '../services/dynamic_pricing_service.dart';

class VoiceCatalogScreen extends StatefulWidget {
  const VoiceCatalogScreen({super.key});

  @override
  State<VoiceCatalogScreen> createState() => _VoiceCatalogScreenState();
}

class _VoiceCatalogScreenState extends State<VoiceCatalogScreen> {
  bool isRecording = false;
  String spokenText = '';
  Map<String, dynamic>? extractedAttributes;
  final AIVoiceService _voiceService = AIVoiceService();

  void _simulateVoiceInput(String sample) {
    setState(() {
      spokenText = sample;
      extractedAttributes = AIVoiceService.extractAttributesFromSpeech(sample);
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1A2744),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Row(
              children: [
                Icon(Icons.mic, color: Color(0xFFFED789), size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Multilingual Voice Auto-Cataloger', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Speak in your regional language to create instant listings', style: TextStyle(color: Colors.white70, fontSize: 11)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Big Mic Button
          Center(
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    setState(() => isRecording = !isRecording);
                    if (isRecording) {
                      _simulateVoiceInput('यह पारंपरिक पोचमपल्ली रेशम की साड़ी है। 5 दिन लगे और 2500 रुपये कच्चा माल लगा।');
                    }
                  },
                  child: Container(
                    width: 96,
                    height: 96,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFFD95F03), Color(0xFFFED789)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFD95F03).withOpacity(0.35),
                          blurRadius: 20,
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                    child: Icon(
                      isRecording ? Icons.mic : Icons.mic_none,
                      color: Colors.white,
                      size: 44,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  isRecording ? '🔴 Listening in Hindi / Regional...' : 'Tap to Speak about your product',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Extracted Card
          if (extractedAttributes != null) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.black12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('AI Extracted Smart Attributes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 10),
                  Text('• Craft: ${extractedAttributes!['titleHi']}', style: const TextStyle(fontSize: 12)),
                  Text('• Material: ${extractedAttributes!['primaryMaterial']}', style: const TextStyle(fontSize: 12)),
                  Text('• Crafting Time: ${extractedAttributes!['productionDays']} days', style: const TextStyle(fontSize: 12)),
                  Text('• Raw Material Cost: ₹${extractedAttributes!['rawMaterialCost']}', style: const TextStyle(fontSize: 12)),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F766E),
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(42),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('🎉 Listing Published to MoSJE Smart Catalog!')),
                      );
                    },
                    icon: const Icon(Icons.check, size: 18),
                    label: const Text('Publish to MoSJE Marketplace'),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
