import 'package:flutter/material.dart';
import 'ai_studio_screen.dart';
import 'voice_catalog_screen.dart';
import 'copilot_screen.dart';

class ArtisanHomeScreen extends StatefulWidget {
  final String locale;
  const ArtisanHomeScreen({super.key, required this.locale});

  @override
  State<ArtisanHomeScreen> createState() => _ArtisanHomeScreenState();
}

class _ArtisanHomeScreenState extends State<ArtisanHomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final isHindi = widget.locale == 'hi';

    final screens = [
      _buildDashboard(isHindi),
      const AIStudioScreen(),
      const VoiceCatalogScreen(),
      const CopilotScreen(),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            selectedIcon: const Icon(Icons.home),
            label: isHindi ? 'होम' : 'Home',
          ),
          NavigationDestination(
            icon: const Icon(Icons.camera_alt_outlined),
            selectedIcon: const Icon(Icons.camera_alt),
            label: isHindi ? 'फोटो स्टूडियो' : 'AI Studio',
          ),
          NavigationDestination(
            icon: const Icon(Icons.mic_none),
            selectedIcon: const Icon(Icons.mic),
            label: isHindi ? 'वॉयस कैटलॉग' : 'Voice',
          ),
          NavigationDestination(
            icon: const Icon(Icons.smart_toy_outlined),
            selectedIcon: const Icon(Icons.smart_toy),
            label: isHindi ? 'कोपायलट' : 'Copilot',
          ),
        ],
      ),
    );
  }

  Widget _buildDashboard(bool isHindi) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // MoSJE Beneficiary Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFD95F03), Color(0xFF1A2744)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white,
                  child: ClipOval(
                    child: Image.network(
                      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
                      fit: BoxFit.cover,
                      width: 56,
                      height: 56,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isHindi ? 'रामेश्वरम कोली' : 'Rameshwaram Koli',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        isHindi ? 'पोचमपल्ली इकत • तेलंगाना' : 'Pochampally Ikat • Telangana',
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white24,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'MoSJE Beneficiary #8841',
                          style: TextStyle(color: Color(0xFFFED789), fontSize: 10, fontFamily: 'monospace'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 4 Main Action Cards
          Text(
            isHindi ? 'एआई बिजनेस मैनेजर टूल्स' : 'AI Business Manager Tools',
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollButtonPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              _buildToolCard(
                icon: Icons.camera_enhance,
                title: isHindi ? '📸 फोटो स्टूडियो' : '📸 AI Studio',
                subtitle: isHindi ? 'पृष्ठभूमि हटाएं व साफ करें' : 'Remove BG & Lighting',
                color: const Color(0xFFFED789),
                onTap: () => setState(() => _currentIndex = 1),
              ),
              _buildToolCard(
                icon: Icons.mic,
                title: isHindi ? '🎙️ बोलकर कैटलॉग' : '🎙️ Voice Catalog',
                subtitle: isHindi ? 'अपनी भाषा में बोलें' : 'Voice to SEO Listing',
                color: const Color(0xFFBAE6FD),
                onTap: () => setState(() => _currentIndex = 2),
              ),
              _buildToolCard(
                icon: Icons.auto_awesome,
                title: isHindi ? '🤖 एआई कोपायलट' : '🤖 AI Copilot',
                subtitle: isHindi ? 'बोलें क्या बेचना है' : 'Conversational Manager',
                color: const Color(0xFFFDE68A),
                onTap: () => setState(() => _currentIndex = 3),
              ),
              _buildToolCard(
                icon: Icons.currency_rupee,
                title: isHindi ? '💰 उचित मूल्य' : '💰 Fair Pricing',
                subtitle: isHindi ? 'मजदूरी व थोक दरें' : 'Cost & Wholesale Tiers',
                color: const Color(0xFFA7F3D0),
                onTap: () => setState(() => _currentIndex = 3),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildToolCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.black12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, size: 24, color: Colors.black87),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
