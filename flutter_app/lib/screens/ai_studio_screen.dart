import 'package:flutter/material.dart';

class AIStudioScreen extends StatefulWidget {
  const AIStudioScreen({super.key});

  @override
  State<AIStudioScreen> createState() => _AIStudioScreenState();
}

class _AIStudioScreenState extends State<AIStudioScreen> {
  bool isSplitView = true;
  double splitSlider = 0.5;
  bool removeBackground = true;
  bool enhanceLighting = true;
  bool addStudioShadow = true;

  final String rawPhoto = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  final String enhancedPhoto = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80';

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
              color: const Color(0xFFD95F03),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Row(
              children: [
                Icon(Icons.camera_alt, color: Colors.white, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('AI Image Enhancer & Studio', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Automatic background removal, shadow & 1:1 e-commerce crop', style: TextStyle(color: Colors.white70, fontSize: 11)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Interactive Comparison Stage
          AspectRatio(
            aspectRatio: 1.0,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.black12),
                color: Colors.white,
              ),
              clipBehavior: Clip.antiAlias,
              child: Stack(
                children: [
                  Image.network(enhancedPhoto, fit: BoxFit.contain, width: double.infinity, height: double.infinity),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: Colors.teal, borderRadius: BorderRadius.circular(8)),
                      child: const Text('✨ AI Studio (Clean)', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // AI Toggles
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.black12),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  value: removeBackground,
                  onChanged: (v) => setState(() => removeBackground = v),
                  title: const Text('Remove Background', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Chroma and edge segmentation', style: TextStyle(fontSize: 11)),
                ),
                SwitchListTile(
                  value: enhanceLighting,
                  onChanged: (v) => setState(() => enhanceLighting = v),
                  title: const Text('Studio Lighting & Color Correction', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Neutralize yellow workshop bulb tint', style: TextStyle(fontSize: 11)),
                ),
                SwitchListTile(
                  value: addStudioShadow,
                  onChanged: (v) => setState(() => addStudioShadow = v),
                  title: const Text('Soft Ground Drop-Shadow', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Natural grounding for e-commerce', style: TextStyle(fontSize: 11)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
