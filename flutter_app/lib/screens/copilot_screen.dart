import 'package:flutter/material.dart';

class CopilotScreen extends StatefulWidget {
  const CopilotScreen({super.key});

  @override
  State<CopilotScreen> createState() => _CopilotScreenState();
}

class _CopilotScreenState extends State<CopilotScreen> {
  final List<Map<String, String>> messages = [
    {
      'sender': 'copilot',
      'text': 'नमस्ते रामेश्वरम जी! 🙏 मैं आपका शिल्प-AI बिजनेस मैनेजर हूँ।\n\nबोलिए, आप आज क्या बेचना चाहते हैं? बस माइक दबाकर मुझे बताइए।',
    },
  ];
  final TextEditingController _controller = TextEditingController();

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      messages.add({'sender': 'artisan', 'text': text});
      messages.add({
        'sender': 'copilot',
        'text': 'शानदार! मैंने आपके उत्पाद का विवरण दर्ज कर लिया है:\n• निर्माण समय: 5 दिन\n• कच्चा माल: ₹2,500\n• अनुशंसित बिक्री मूल्य: ₹8,480\n• थोक मूल्य (10+ पीस): ₹6,950\n\nकैटलॉग में प्रकाशित करने के लिए तैयार है!',
      });
    });
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Copilot Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          color: const Color(0xFF1A2744),
          child: const Row(
            children: [
              CircleAvatar(
                backgroundColor: Color(0xFFD95F03),
                radius: 18,
                child: Icon(Icons.smart_toy, color: Colors.white, size: 20),
              ),
              SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('SHILP-AI Copilot', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                  Text('Virtual Business Manager for Artisans', style: TextStyle(color: Colors.white70, fontSize: 10)),
                ],
              ),
            ],
          ),
        ),

        // Chat messages
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: messages.length,
            itemBuilder: (context, idx) {
              final msg = messages[idx];
              final isUser = msg['sender'] == 'artisan';
              return Align(
                alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  constraints: const BoxConstraints(maxWidth: 280),
                  decoration: BoxDecoration(
                    color: isUser ? const Color(0xFFD95F03) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: isUser ? null : Border.all(color: Colors.black12),
                  ),
                  child: Text(
                    msg['text']!,
                    style: TextStyle(
                      color: isUser ? Colors.white : Colors.black87,
                      fontSize: 12,
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Quick Suggestions
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          child: Row(
            children: [
              ActionChip(
                label: const Text('🥻 Sell Pochampally Saree', style: TextStyle(fontSize: 11)),
                onPressed: () => _sendMessage('This is a handwoven Pochampally saree. It took me 5 days to make. The silk cost ₹2,500.'),
              ),
              const SizedBox(width: 8),
              ActionChip(
                label: const Text('🐂 Bastar Dhokra Art', style: TextStyle(fontSize: 11)),
                onPressed: () => _sendMessage('Bastar Dhokra brass Nandi figurine. 4 days work, raw material ₹1,200.'),
              ),
            ],
          ),
        ),

        // Input bar
        Container(
          padding: const EdgeInsets.all(8),
          color: Colors.white,
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.mic, color: Color(0xFFD95F03)),
                onPressed: () => _sendMessage('This is a handwoven Pochampally saree. It took me 5 days to make. The silk cost ₹2,500.'),
              ),
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: InputDecoration(
                    hintText: 'Speak or type product details...',
                    hintStyle: const TextStyle(fontSize: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Colors.grey.shade100,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.send, color: Color(0xFF1A2744)),
                onPressed: () => _sendMessage(_controller.text),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
