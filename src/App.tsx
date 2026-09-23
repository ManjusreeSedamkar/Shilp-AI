import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileFrame } from './components/MobileFrame';
import { ArtisanDashboard } from './components/ArtisanDashboard';
import { ArtisanStudio } from './components/ArtisanStudio';
import { VoiceCatalogerModal } from './components/VoiceCatalogerModal';
import { ArtisanCopilot } from './components/ArtisanCopilot';
import { DynamicPricingCard } from './components/DynamicPricingCard';
import { BuyerPortal } from './components/BuyerPortal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { ChatMessaging } from './components/ChatMessaging';
import { ReviewsSection } from './components/ReviewsSection';
import { ArtisanCardModal } from './components/ArtisanCardModal';
import { AuthModal, AuthUser } from './components/AuthModal';
import { CheckoutModal, PlacedOrder } from './components/CheckoutModal';
import { TutorialPage } from './components/TutorialPage';
import { INITIAL_PRODUCTS, CURRENT_ARTISAN } from './data/craftPresets';
import { ProductListing, UserRole, Language, Conversation, ChatMessage, CustomizationRequest, ProductReview } from './types';
import { Home, Camera, Mic, Bot, IndianRupee, Sparkles, CheckCircle2, ShoppingBag, MessageSquare, Star, ShieldCheck, Video } from 'lucide-react';
import { translate, LANGUAGE_METADATA } from './services/translations';
import { getProductTitle, getProductDescription } from './services/displayTranslation';
import { LanguageAutoTranslator } from './components/LanguageAutoTranslator';
import { fetchProductsFromFirestore, saveProductToFirestore } from './services/firebase';

// Sample initial conversations
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    buyerId: 'buyer-201',
    buyerName: 'Vikram Mehta (FabIndia)',
    artisanId: CURRENT_ARTISAN.id,
    artisanName: CURRENT_ARTISAN.name,
    productId: INITIAL_PRODUCTS[0]?.id,
    productTitle: INITIAL_PRODUCTS[0]?.titleEn,
    lastMessageAt: '10:45 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-101',
        senderId: 'buyer-201',
        senderRole: 'buyer',
        senderName: 'Vikram Mehta',
        text: 'Namaste! We are procuring 35 Pochampally sarees for the upcoming Shilp Utsav. Can we request a custom indigo colorway?',
        timestamp: '10:30 AM',
        isRead: true,
        customizationRequest: {
          color: 'Deep Natural Indigo with Silver Zari',
          size: 'Standard 6.3m with Blouse Piece',
          material: 'Pure Mulberry Silk (100%)',
          quantity: 35,
          notes: 'Required for Shilp Samagam Delhi exhibition display.'
        }
      },
      {
        id: 'msg-2',
        conversationId: 'conv-101',
        senderId: CURRENT_ARTISAN.id,
        senderRole: 'artisan',
        senderName: CURRENT_ARTISAN.name,
        text: 'Namaste Vikram ji! Yes, we can weave the deep indigo design using vegetable dye. For 35 pieces, we can complete in 45 days at wholesale rate ₹6,800/pc.',
        timestamp: '10:45 AM',
        isRead: false
      }
    ]
  }
];

// Sample initial reviews
const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: INITIAL_PRODUCTS[0]?.id || 'prod-1',
    buyerId: 'buyer-201',
    buyerName: 'Vikram Mehta',
    rating: 5,
    comment: 'Authentic Pochampally silk with exquisite double ikat precision. Direct purchase from master artisan Narasimha Rao ji ensures authentic craft preservation.',
    createdAt: '24 Aug 2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: INITIAL_PRODUCTS[0]?.id || 'prod-1',
    buyerId: 'buyer-202',
    buyerName: 'Ananya Deshmukh',
    rating: 5,
    comment: 'The colors and texture are stunning. Fast delivery with MoSJE verification seal. Highly recommended!',
    createdAt: '28 Aug 2026',
    verifiedPurchase: true
  }
];

export function App() {
  const [role, setRole] = useState<UserRole>('artisan');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('shilp_ai_language');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    localStorage.setItem('shilp_ai_language', language);
    // Document Language & RTL Support
    const dir = LANGUAGE_METADATA[language]?.direction || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [artisanTab, setArtisanTab] = useState<'dashboard' | 'studio' | 'voice' | 'copilot' | 'pricing' | 'chat' | 'reviews' | 'tutorials'>('dashboard');
  
  // Persistent Products State
  const [products, setProducts] = useState<ProductListing[]>(() => {
    try {
      const saved = localStorage.getItem('shilp_ai_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistent Conversations State
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('shilp_ai_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  // Persistent Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('shilp_ai_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Persistent Auth User State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('shilp_ai_current_user');
      if (saved) return JSON.parse(saved);
      // Default to artisan
      return {
        id: CURRENT_ARTISAN.id,
        name: CURRENT_ARTISAN.name,
        role: 'artisan',
        phoneOrEmail: CURRENT_ARTISAN.phone,
        beneficiaryId: CURRENT_ARTISAN.beneficiaryId,
        avatarUrl: CURRENT_ARTISAN.avatarUrl,
      };
    } catch {
      return null;
    }
  });

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [productToCheckout, setProductToCheckout] = useState<ProductListing | null>(null);
  const [stagedPhotoUrl, setStagedPhotoUrl] = useState<string | null>(null);
  const [stagedOriginalPhotoUrl, setStagedOriginalPhotoUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const t = (key: string) => translate(language, key);

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shilp_ai_products', JSON.stringify(products));
    } catch (err) {
      console.warn('Failed to persist products:', err);
    }
  }, [products]);

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shilp_ai_conversations', JSON.stringify(conversations));
    } catch (err) {
      console.warn('Failed to persist conversations:', err);
    }
  }, [conversations]);

  // Save reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shilp_ai_reviews', JSON.stringify(reviews));
    } catch (err) {
      console.warn('Failed to persist reviews:', err);
    }
  }, [reviews]);

  // Save auth user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('shilp_ai_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('shilp_ai_current_user');
      }
    } catch (err) {
      console.warn('Failed to persist auth user:', err);
    }
  }, [currentUser]);

  // Check onboarding status on mount
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('shilp_ai_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Synchronize product listings from Cloud Firestore
  useEffect(() => {
    fetchProductsFromFirestore()
      .then((remoteProducts) => {
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
        }
      })
      .catch((err) => console.warn('Firestore initial sync notice:', err));
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('shilp_ai_onboarding_seen', 'true');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Product Creation Callback
  const handleListingCreated = (newProduct: ProductListing) => {
    setProducts((prev) => [newProduct, ...prev]);
    setArtisanTab('dashboard');
    showToast(t('success.published'));
    saveProductToFirestore(newProduct).catch((err) =>
      console.warn('Background firestore sync notice:', err)
    );
  };

  // Staging Photo from Studio to Smart Catalog
  const handlePhotoSelectedFromStudio = (enhancedUrl: string, originalUrl?: string) => {
    setStagedPhotoUrl(enhancedUrl);
    if (originalUrl) {
      setStagedOriginalPhotoUrl(originalUrl);
    }
    setArtisanTab('voice');
    showToast(translate(language, 'success.published') || 'AI enhanced photo selected for Smart Catalog!');
  };

  // 1-to-1 Chat Messaging System
  const handleSendMessage = (conversationId: string, text: string, customizationRequest?: CustomizationRequest) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const senderRole = currentUser?.role || role;
    const senderName = currentUser?.name || (role === 'buyer' ? 'Vikram Mehta' : CURRENT_ARTISAN.name);
    const senderId = currentUser?.id || (role === 'buyer' ? 'buyer-201' : CURRENT_ARTISAN.id);

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderRole,
      senderName,
      text,
      timestamp,
      customizationRequest,
      isRead: false,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessageAt: timestamp,
            unreadCount: 0,
          };
        }
        return conv;
      })
    );
  };

  const handleStartConversation = (artisanId: string, artisanName: string, productId?: string, productTitle?: string) => {
    const currentBuyerId = currentUser?.id || 'buyer-201';
    const currentBuyerName = currentUser?.name || 'Vikram Mehta';

    const existing = conversations.find(
      (c) => c.buyerId === currentBuyerId && c.artisanId === artisanId && c.productId === productId
    );
    
    if (existing) {
      if (role === 'artisan') {
        setArtisanTab('chat');
      }
      return;
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      buyerId: currentBuyerId,
      buyerName: currentBuyerName,
      artisanId,
      artisanName,
      productId,
      productTitle,
      messages: [
        {
          id: `msg-${Date.now()}`,
          conversationId: `conv-${Date.now()}`,
          senderId: currentBuyerId,
          senderRole: 'buyer',
          senderName: currentBuyerName,
          text: `Namaste ${artisanName}! I am interested in discussing your craft "${productTitle || 'item'}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        }
      ],
      lastMessageAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 1,
    };

    setConversations((prev) => [newConversation, ...prev]);
    if (role === 'artisan') {
      setArtisanTab('chat');
    }
    showToast('Conversation started with artisan!');
  };

  // Reviews System
  const handleAddReview = (review: ProductReview) => {
    setReviews((prev) => [review, ...prev]);
    showToast(t('success.reviewSubmitted'));
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Purchase / Checkout Flow
  const handleOrderSuccess = (order: PlacedOrder) => {
    showToast(`Order #${order.id} placed! Artisan notified via SMS.`);
  };

  return (
    <>
      <LanguageAutoTranslator language={language} />
    <div className="min-h-screen min-h-[100dvh] bg-stone-100 text-stone-900 font-sans flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Universal Government & Application Navbar */}
      <Navbar
        role={role}
        setRole={(newRole) => {
          setRole(newRole);
          if (currentUser) {
            setCurrentUser({ ...currentUser, role: newRole });
          }
        }}
        language={language}
        setLanguage={setLanguage}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully.');
        }}
        onOpenCardModal={() => setShowCardModal(true)}
        onOpenTutorial={() => setShowOnboarding(true)}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center space-x-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* First-Time Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial language={language} onClose={handleOnboardingClose} />
      )}

      {/* MoSJE Digital Artisan Smart ID Card Modal */}
      <ArtisanCardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        language={language}
        artisan={CURRENT_ARTISAN}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setRole(user.role);
          showToast(`Welcome, ${user.name}!`);
        }}
        currentRole={role}
      />

      {/* Direct Artisan Checkout Modal */}
      {productToCheckout && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setProductToCheckout(null)}
          product={productToCheckout}
          language={language}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Main Content Area wrapped in optional Mobile Smartphone Simulator Frame */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden flex flex-col justify-start">
        <MobileFrame isMobileFrame={isMobileFrame}>
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-5 w-full max-w-full overflow-x-hidden flex-1 flex flex-col">
            {role === 'buyer' ? (
              /* Buyer / Government Portal View */
              <BuyerPortal
                products={products}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onStartConversation={handleStartConversation}
                language={language}
              />
            ) : (
              /* Artisan App View with Navigation */
              <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
                {/* Mobile / Low-Literacy Quick Switcher Bar */}
                <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-1 overflow-x-auto no-scrollbar w-full max-w-full touch-pan-x">
                  <button
                    onClick={() => setArtisanTab('dashboard')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'dashboard'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>{t('nav.home')}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('studio')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'studio'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t('nav.studio')}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('voice')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'voice'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{t('nav.voice')}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('copilot')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'copilot'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span>{t('nav.copilot')}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('pricing')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'pricing'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>{t('nav.pricing')}</span>
                  </button>

                  {/* Messages Tab */}
                  <button
                    onClick={() => setArtisanTab('chat')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'chat'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('chat.title')}</span>
                    {conversations.length > 0 && (
                      <span className="bg-stone-200 text-stone-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {conversations.length}
                      </span>
                    )}
                  </button>

                  {/* Reviews Tab */}
                  <button
                    onClick={() => setArtisanTab('reviews')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'reviews'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    <span>{t('review.title')}</span>
                  </button>

                  {/* Tutorials Tab */}
                  <button
                    onClick={() => setArtisanTab('tutorials')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      artisanTab === 'tutorials'
                        ? 'bg-stone-900 text-white shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{translate(language, 'nav.tutorials') || 'Tutorials'}</span>
                    <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-stone-200">
                      2
                    </span>
                  </button>
                </div>

                {/* Sub-Views */}
                <div className="flex-1">
                  {artisanTab === 'dashboard' && (
                    <ArtisanDashboard
                      products={products}
                      onOpenStudio={() => setArtisanTab('studio')}
                      onOpenVoice={() => setArtisanTab('voice')}
                      onOpenCopilot={() => setArtisanTab('copilot')}
                      onOpenPricing={() => setArtisanTab('pricing')}
                      onOpenTutorials={() => setArtisanTab('tutorials')}
                      onSelectProduct={(prod) => setSelectedProduct(prod)}
                      language={language}
                    />
                  )}

                  {artisanTab === 'tutorials' && (
                    <TutorialPage
                      onBack={() => setArtisanTab('dashboard')}
                      language={language}
                    />
                  )}

                  {artisanTab === 'studio' && (
                    <ArtisanStudio
                      onPhotoSelected={handlePhotoSelectedFromStudio}
                      language={language}
                    />
                  )}

                  {artisanTab === 'voice' && (
                    <VoiceCatalogerModal
                      language={language}
                      selectedPhotoUrl={stagedPhotoUrl || undefined}
                      originalPhotoUrl={stagedOriginalPhotoUrl || undefined}
                      onListingCreated={handleListingCreated}
                    />
                  )}

                  {artisanTab === 'copilot' && (
                    <ArtisanCopilot
                      language={language}
                      onPublishListing={handleListingCreated}
                    />
                  )}

                  {artisanTab === 'pricing' && (
                    <div className="max-w-2xl mx-auto">
                      <DynamicPricingCard language={language} />
                    </div>
                  )}

                  {artisanTab === 'chat' && (
                    <ChatMessaging
                      conversations={conversations}
                      currentUserId={currentUser?.id || CURRENT_ARTISAN.id}
                      currentUserRole={currentUser?.role || 'artisan'}
                      currentUserName={currentUser?.name || CURRENT_ARTISAN.name}
                      language={language}
                      onSendMessage={handleSendMessage}
                      onStartConversation={handleStartConversation}
                    />
                  )}

                  {artisanTab === 'reviews' && (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <ReviewsSection
                          key={product.id}
                          productId={product.id}
                          productTitle={product.titleEn}
                          reviews={getProductReviews(product.id)}
                          language={language}
                          currentBuyerName={currentUser?.name || 'Vikram Mehta'}
                          onAddReview={handleAddReview}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </MobileFrame>
      </main>

      {/* Product Detail & Inspection Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRequestQuote={() => {
            setSelectedProduct(null);
            setRole('buyer');
          }}
          onBuyNow={(prod) => {
            setSelectedProduct(null);
            setProductToCheckout(prod);
          }}
          onStartConversation={handleStartConversation}
          language={language}
          reviews={reviews}
          onAddReview={handleAddReview}
          currentBuyerName={currentUser?.name || 'Vikram Mehta'}
        />
      )}

      {/* Bottom Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">SHILP-AI</span>
            <span>•</span>
            <span>Ministry of Social Justice and Empowerment (MoSJE), Government of India</span>
          </div>
          <div className="text-[11px] text-stone-500">
            Heritage & Culture • AI-Driven Market Linkage for Marginalized Artisans
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default App;
