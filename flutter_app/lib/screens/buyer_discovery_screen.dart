import 'package:flutter/material.dart';

class BuyerDiscoveryScreen extends StatelessWidget {
  final String locale;
  const BuyerDiscoveryScreen({super.key, required this.locale});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.verified, color: Colors.amber, size: 20),
                    SizedBox(width: 8),
                    Text('MoSJE & GeM Verified Artisan Market', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
                SizedBox(height: 8),
                Text(
                  'B2B Wholesale & Bulk Sourcing',
                  style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Text(
                  'Direct linkage with master weavers & artisans with zero middleman margin.',
                  style: TextStyle(color: Colors.white70, fontSize: 11),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Search Bar
          TextField(
            decoration: InputDecoration(
              hintText: 'Search by craft, GI Tag, state, artisan...',
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: Colors.black12),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Product Card Preview
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 1,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: Image.network(
                    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600',
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Pochampally Ikat Pure Silk Saree (GI Certified)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Artisan: Rameshwaram Koli • Telangana',
                        style: TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Retail MSRP', style: TextStyle(fontSize: 10, color: Colors.grey)),
                              Text('₹8,480', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFA7F3D0),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text('Bulk (10+ pcs): ₹6,950', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF065F46))),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F172A),
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(40),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: const Text('Request B2B Quote (RFQ)'),
                              content: const Text('Connect directly with artisan Rameshwaram Koli via WhatsApp or official MoSJE bulk procurement tender.'),
                              actions: [
                                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
                              ],
                            ),
                          );
                        },
                        icon: const Icon(Icons.business, size: 16),
                        label: const Text('Request Bulk RFQ'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
