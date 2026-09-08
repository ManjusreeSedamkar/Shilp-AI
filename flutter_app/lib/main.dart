import 'package:flutter/material.dart';
import 'screens/artisan_home_screen.dart';
import 'screens/buyer_discovery_screen.dart';

void main() {
  runApp(const ShilpAiApp());
}

class ShilpAiApp extends StatefulWidget {
  const ShilpAiApp({super.key});

  @override
  State<ShilpAiApp> createState() => _ShilpAiAppState();
}

class _ShilpAiAppState extends State<ShilpAiApp> {
  bool isArtisanMode = true;
  String currentLocale = 'hi';

  void toggleMode() {
    setState(() {
      isArtisanMode = !isArtisanMode;
    });
  }

  void setLocale(String locale) {
    setState(() {
      currentLocale = locale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SHILP-AI | शिल्प-AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD95F03), // Saffron
          primary: const Color(0xFFD95F03),
          secondary: const Color(0xFF1A2744), // MoSJE Navy
          tertiary: const Color(0xFF0F766E), // Emerald
          surface: Colors.white,
        ),
        fontFamily: 'Roboto',
      ),
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xFF1A2744),
          foregroundColor: Colors.white,
          title: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFFD95F03),
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: const Text('श', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              ),
              const SizedBox(width: 8),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('SHILP-AI', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  Text(
                    'MoSJE • Govt of India',
                    style: TextStyle(fontSize: 10, color: Color(0xFFFED789)),
                  ),
                ],
              ),
            ],
          ),
          actions: [
            // Mode Switcher (Artisan / Buyer)
            TextButton.icon(
              onPressed: toggleMode,
              icon: Icon(
                isArtisanMode ? Icons.storefront : Icons.palette,
                color: Colors.white,
                size: 16,
              ),
              label: Text(
                isArtisanMode ? 'Switch to Buyer' : 'Switch to Artisan',
                style: const TextStyle(color: Colors.white, fontSize: 11),
              ),
            ),
          ],
        ),
        body: isArtisanMode
            ? ArtisanHomeScreen(locale: currentLocale)
            : BuyerDiscoveryScreen(locale: currentLocale),
      ),
    );
  }
}
