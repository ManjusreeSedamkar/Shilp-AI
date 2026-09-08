import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, User, ArrowRight, CheckCircle2, Settings, Loader2, Play, Square } from 'lucide-react';
import { CopilotMessage, ProductListing, Language } from '../types';
import { ArtisanCopilotService } from '../services/copilotService';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';
import { askGemini, hasGeminiApiKey } from '../services/geminiService';
import { getSpeechLangCode, translate } from '../services/translations';
import { CRAFT_PRESETS } from '../data/craftPresets';
import { ApiSettingsModal } from './ApiSettingsModal';

interface ArtisanCopilotProps {
  language?: Language;
  onPublishListing?: (listing: ProductListing) => void;
}

export const ArtisanCopilot: React.FC<ArtisanCopilotProps> = ({
  language = 'en',
  onPublishListing
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    ArtisanCopilotService.getInitialGreeting(language === 'hi' ? 'hi' : 'en')
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingMessageId, setIsSpeakingMessageId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = (key: string) => translate(language, key);
  const isHindi = language === 'hi';
  const hasGemini = hasGeminiApiKey();

  // Scroll to bottom on message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getSpeechLangCode(language);

      recognition.onresult = (event: any) => {
        const transcriptText = event.results[0][0].transcript;
        setIsRecording(false);
        if (transcriptText) {
          handleSendMessage(transcriptText);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Stop any active speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Cancel current speech if any
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeakingMessageId(null);
    }

    const userMessage: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'artisan',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      let replyText = '';
      let replyAudioText = '';
      let actionCard = undefined;

      // 1. Try Gemini API first if configured
      if (hasGeminiApiKey()) {
        try {
          const geminiReply = await askGemini(
            text,
            language,
            `You are SHILP-AI Copilot, an empathetic, expert virtual business manager supporting Indian marginalized artisans, weavers, and craftspersons. ` +
            `Explain app procedures, help with smart catalogs, advise on wholesale negotiation, discuss fair pricing (at least ₹750/day wage), and explain government schemes (MoSJE, PM Vishwakarma, Shilp Samagam). ` +
            `Keep answers concise, actionable, and structured with bullet points. Always reply in the requested language.`
          );
          replyText = geminiReply;
          replyAudioText = geminiReply.slice(0, 200); // First 200 chars for voice
        } catch (apiErr) {
          console.warn('Gemini API call failed, falling back to local copilot:', apiErr);
        }
      }

      // 2. Fallback to local intelligent rule/intent engine if Gemini was not used or failed
      if (!replyText) {
        const localResult = ArtisanCopilotService.processArtisanInput(
          text,
          newHistory,
          isHindi ? 'hi' : 'en'
        );
        replyText = localResult.reply.text;
        replyAudioText = localResult.reply.audioText || localResult.reply.text;
        actionCard = localResult.reply.actionCard;
      }

      const copilotReply: CopilotMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: replyText,
        audioText: replyAudioText,
        actionCard,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, copilotReply]);

      // Auto-read response if speech synthesis is enabled
      handlePlayVoice(copilotReply);
    } catch (err) {
      console.error('Copilot processing error:', err);
      const fallbackMsg: CopilotMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: language === 'hi' 
          ? 'माफ़ कीजिए, उत्तर तैयार करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'I encountered an issue generating a response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        setIsRecording(true);
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech recognition not available:', err);
        // Fallback simulated input for demo
        setTimeout(() => {
          setIsRecording(false);
          const sample = isHindi ? CRAFT_PRESETS[0].sampleVoiceHindi : CRAFT_PRESETS[0].sampleVoiceEnglish;
          handleSendMessage(sample);
        }, 1500);
      }
    }
  };

  // Toggle Play / Stop Voice for an AI response
  const handleToggleVoice = (msg: CopilotMessage) => {
    if (isSpeakingMessageId === msg.id) {
      // User requested STOP
      handleStopVoice();
    } else {
      // User requested PLAY / START
      handlePlayVoice(msg);
    }
  };

  const handleStopVoice = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingMessageId(null);
  };

  const handlePlayVoice = async (msg: CopilotMessage) => {
    handleStopVoice(); // Stop any other message currently playing
    setIsSpeakingMessageId(msg.id);

    const textToSpeak = msg.audioText || msg.text;
    const langCode = getSpeechLangCode(language);

    try {
      await VoiceCatalogerEngine.speak(textToSpeak, langCode as any);
    } catch (err) {
      console.warn('Speech playback error:', err);
    } finally {
      setIsSpeakingMessageId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col h-[650px] sm:h-[700px] overflow-hidden">
      {/* Copilot Header */}
      <div className="bg-gradient-to-r from-saffron-700 via-stone-900 to-navy-900 p-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-500 to-amber-400 flex items-center justify-center text-white font-bold shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-stone-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">
                {t('dashboard.copilot')}
              </h3>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-medium text-amber-200">
                {hasGemini ? 'Gemini 2.0 AI' : 'Copilot AI'}
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              {hasGemini ? 'Powered by Google Gemini Live Intelligence' : 'Artisan Business & Smart Catalog Assistant'}
            </p>
          </div>
        </div>

        {/* Status Pill & Settings Button */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Online
          </span>
          <button
            onClick={() => setShowSettings(true)}
            title="Configure Gemini API Key"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'artisan';
          const isCurrentlyPlaying = isSpeakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-sm text-xs ${
                  isUser
                    ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                }`}
              >
                {/* Header: Sender & Voice Play/Stop Controls */}
                <div className="flex items-center justify-between mb-1.5 text-[10px] opacity-80 border-b border-stone-100/50 pb-1">
                  <span className="font-bold flex items-center gap-1">
                    {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-saffron-600" />}
                    {isUser ? (isHindi ? 'आप (कारीगर)' : 'You (Artisan)') : 'SHILP Copilot AI'}
                  </span>

                  {/* Play / Stop Voice Button for Every AI Response */}
                  {!isUser && (
                    <button
                      onClick={() => handleToggleVoice(msg)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition-all ${
                        isCurrentlyPlaying
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                          : 'bg-saffron-50 text-saffron-800 hover:bg-saffron-100 border border-saffron-200'
                      }`}
                      title={isCurrentlyPlaying ? 'Stop Voice' : 'Listen with AI Voice'}
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <Square className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                          <span>Stop</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-saffron-600" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Message Text Body */}
                <p className="leading-relaxed whitespace-pre-line text-xs font-normal">
                  {msg.text}
                </p>

                {/* Action Card: Listing Ready Embedded Card */}
                {msg.actionCard?.type === 'listing_ready' && msg.actionCard.data && (
                  <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={msg.actionCard.data.originalImage}
                        alt="Product"
                        className="w-14 h-14 rounded-lg object-cover border border-stone-200 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          {isHindi ? 'सूची तैयार है' : 'Listing Ready'}
                        </span>
                        <h4 className="font-bold text-xs truncate">
                          {isHindi ? msg.actionCard.data.titleHi : msg.actionCard.data.titleEn}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
                          <span className="font-bold text-stone-900">
                            ₹{msg.actionCard.data.pricing?.suggestedRetailPrice?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-stone-500">
                            ({msg.actionCard.data.productionDays} {isHindi ? 'दिन' : 'days'})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                      <span className="text-[10px] text-stone-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        GI & MoSJE Ready
                      </span>
                      <button
                        onClick={() => onPublishListing?.(msg.actionCard!.data)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <span>{isHindi ? 'मार्केटप्लेस में जोड़ें' : 'Publish Listing'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <span className="block text-[9px] mt-1 text-right opacity-60">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center space-x-2 text-stone-600 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-saffron-600" />
              <span>{hasGemini ? 'Gemini 2.0 Thinking...' : 'Copilot Analyzing...'}</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3 py-2 bg-stone-100/70 border-t border-stone-200 flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[10px] font-bold text-stone-500 whitespace-nowrap">
          {isHindi ? 'सुझाव:' : 'Quick Help:'}
        </span>
        <button
          onClick={() => handleSendMessage(isHindi ? 'यह ऐप कैसे काम करता है और उत्पाद कैसे जोड़ें?' : 'How does this app work and what are the steps?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 text-stone-700 hover:text-saffron-800 text-[11px] font-medium border border-stone-200 shadow-2xs transition-colors flex items-center gap-1"
        >
          <span>📱</span>
          <span>{isHindi ? 'ऐप कैसे इस्तेमाल करें?' : 'How to use app?'}</span>
        </button>
        <button
          onClick={() => handleSendMessage(isHindi ? 'खरीदार 20 साड़ियों के लिए ₹4,000 की पेशकश कर रहा है, क्या मुझे स्वीकार करना चाहिए?' : 'Buyer offering ₹4,000 for 20 sarees, should I accept?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] font-medium border border-stone-200 shadow-2xs transition-colors flex items-center gap-1"
        >
          <span>💡</span>
          <span>{isHindi ? 'थोक मोलभाव सलाह' : 'Wholesale negotiation'}</span>
        </button>
        <button
          onClick={() => handleSendMessage(isHindi ? 'शिल्प समागम और दिल्ली हाट मेले में स्टॉल कैसे मिलेगा?' : 'How do I get a stall in Shilp Samagam exhibitions?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-800 text-[11px] font-medium border border-stone-200 shadow-2xs transition-colors flex items-center gap-1"
        >
          <span>🏛️</span>
          <span>{isHindi ? 'शिल्प समागम स्टॉल' : 'Shilp Samagam stalls'}</span>
        </button>
        <button
          onClick={() => handleSendMessage(isHindi ? 'क्या हस्तशिल्प बेचने के लिए जीएसटी नंबर अनिवार्य है?' : 'Do I need GST registration to sell handicrafts online?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-stone-700 hover:text-blue-800 text-[11px] font-medium border border-stone-200 shadow-2xs transition-colors flex items-center gap-1"
        >
          <span>💳</span>
          <span>{isHindi ? 'जीएसटी नियम' : 'GST rules'}</span>
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-2.5 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
            title="Speak with microphone"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isRecording
                ? (isHindi ? 'सुन रहा हूँ... बोलिए' : 'Listening... speak now')
                : (isHindi ? 'शिल्प, कीमत या ऐप के बारे में पूछें...' : 'Ask Copilot anything about craft, pricing or app...')
            }
            className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-saffron-600 hover:bg-saffron-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* API Settings Modal */}
      <ApiSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};
