import React, { useState } from 'react';
import { MessageSquare, Send, ArrowLeft, Palette, Ruler, Layers, PenTool, Hash, FileText, CheckCircle2 } from 'lucide-react';
import { Conversation, ChatMessage, CustomizationRequest, Language, UserRole } from '../types';
import { translate } from '../services/translations';

interface ChatMessagingProps {
  conversations: Conversation[];
  currentUserId: string;
  currentUserRole: UserRole;
  currentUserName: string;
  language: Language;
  onSendMessage: (conversationId: string, text: string, customizationRequest?: CustomizationRequest) => void;
  onStartConversation: (artisanId: string, artisanName: string, productId?: string, productTitle?: string) => void;
}

export const ChatMessaging: React.FC<ChatMessagingProps> = ({
  conversations,
  currentUserId,
  currentUserRole,
  currentUserName,
  language,
  onSendMessage,
  onStartConversation,
}) => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showCustomizationForm, setShowCustomizationForm] = useState(false);
  const [customization, setCustomization] = useState<CustomizationRequest>({});
  const t = (key: string) => translate(language, key);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleSend = () => {
    if (!activeConversationId || !messageText.trim()) return;
    onSendMessage(activeConversationId, messageText.trim());
    setMessageText('');
  };

  const handleSendCustomization = () => {
    if (!activeConversationId) return;
    const summary = [
      customization.color ? `${t('chat.color')} ${customization.color}` : '',
      customization.size ? `${t('chat.size')} ${customization.size}` : '',
      customization.material ? `${t('chat.material')} ${customization.material}` : '',
      customization.design ? `${t('chat.design')} ${customization.design}` : '',
      customization.quantity ? `${t('chat.quantity')} ${customization.quantity}` : '',
      customization.otherRequirements ? `${t('chat.other')} ${customization.otherRequirements}` : '',
    ].filter(Boolean).join(', ');

    const text = `📋 ${t('chat.customizationRequest')}: ${summary}`;
    onSendMessage(activeConversationId, text, customization);
    setShowCustomizationForm(false);
    setCustomization({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col h-[calc(100dvh-180px)] min-h-[380px] max-h-[720px] w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-stone-900 p-4 text-white flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{t('chat.title')}</h3>
            <p className="text-[11px] text-stone-400">{t('chat.conversations')}</p>
          </div>
        </div>
        <span className="text-[11px] bg-white/10 text-stone-200 px-2.5 py-0.5 rounded-full border border-white/15 flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {conversations.length} {t('chat.conversations')}
        </span>
      </div>

      {/* Body: Conversation List + Chat View */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Conversation List (Left Side) */}
        <div className={`${activeConversation ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-64 bg-stone-50/50 border-r border-stone-200 overflow-y-auto`}>
          {conversations.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <div className="text-4xl">💬</div>
              <p className="text-xs font-semibold text-stone-700">{t('chat.noConversations')}</p>
              <p className="text-[11px] text-stone-500">{t('chat.startConversation')}</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const otherName = currentUserRole === 'buyer' ? conv.artisanName : conv.buyerName;
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3 text-left border-b border-stone-200 transition-colors ${
                    activeConversationId === conv.id ? 'bg-white border-l-3 border-l-stone-900 shadow-2xs' : 'hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 truncate">{otherName}</span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-stone-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  {conv.productTitle && (
                    <span className="text-[10px] text-stone-600 font-medium truncate block mt-0.5">
                      📦 {conv.productTitle}
                    </span>
                  )}
                  {lastMsg && (
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {lastMsg.senderName}: {lastMsg.text}
                    </p>
                  )}
                  <span className="text-[9px] text-stone-400 block mt-0.5">{conv.lastMessageAt}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Chat View (Right Side) */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-3 py-2 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="sm:hidden p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="font-bold text-xs text-stone-900">
                    {currentUserRole === 'buyer' ? activeConversation.artisanName : activeConversation.buyerName}
                  </span>
                  {activeConversation.productTitle && (
                    <span className="text-[10px] text-stone-500 block truncate">
                      📦 {activeConversation.productTitle}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Online
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-stone-50/50">
              {activeConversation.messages.map((msg) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-2xs ${
                      isMine
                        ? 'bg-stone-900 text-white rounded-br-xs'
                        : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-xs'
                    }`}>
                      <div className="flex items-center justify-between mb-0.5 text-[9px] opacity-70">
                        <span className="font-bold">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                      {/* Customization Request Card */}
                      {msg.customizationRequest && (
                        <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 space-y-1">
                          <span className="text-[10px] font-bold text-stone-800 uppercase flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {t('chat.customizationRequest')}
                          </span>
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            {msg.customizationRequest.color && (
                              <span className="flex items-center gap-1"><Palette className="w-2.5 h-2.5 text-stone-400" /> {t('chat.color')} {msg.customizationRequest.color}</span>
                            )}
                            {msg.customizationRequest.size && (
                              <span className="flex items-center gap-1"><Ruler className="w-2.5 h-2.5 text-stone-400" /> {t('chat.size')} {msg.customizationRequest.size}</span>
                            )}
                            {msg.customizationRequest.material && (
                              <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5 text-stone-400" /> {t('chat.material')} {msg.customizationRequest.material}</span>
                            )}
                            {msg.customizationRequest.design && (
                              <span className="flex items-center gap-1"><PenTool className="w-2.5 h-2.5 text-stone-400" /> {t('chat.design')} {msg.customizationRequest.design}</span>
                            )}
                            {msg.customizationRequest.quantity && (
                              <span className="flex items-center gap-1"><Hash className="w-2.5 h-2.5 text-stone-400" /> {t('chat.quantity')} {msg.customizationRequest.quantity}</span>
                            )}
                          </div>
                          {msg.customizationRequest.otherRequirements && (
                            <p className="text-[10px] text-stone-600 mt-0.5">
                              {t('chat.other')} {msg.customizationRequest.otherRequirements}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customization Form */}
            {showCustomizationForm && (
              <div className="p-3.5 bg-[#FAF8F5] border-t border-stone-200 space-y-2">
                <span className="text-[10px] font-bold text-stone-800 uppercase flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {t('chat.customizationRequest')}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customization.color || ''}
                    onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                    placeholder={t('chat.color')}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-800 focus:ring-2 focus:ring-stone-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customization.size || ''}
                    onChange={(e) => setCustomization({ ...customization, size: e.target.value })}
                    placeholder={t('chat.size')}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-800 focus:ring-2 focus:ring-stone-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customization.material || ''}
                    onChange={(e) => setCustomization({ ...customization, material: e.target.value })}
                    placeholder={t('chat.material')}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-800 focus:ring-2 focus:ring-stone-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customization.design || ''}
                    onChange={(e) => setCustomization({ ...customization, design: e.target.value })}
                    placeholder={t('chat.design')}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-800 focus:ring-2 focus:ring-stone-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={customization.quantity || ''}
                    onChange={(e) => setCustomization({ ...customization, quantity: Number(e.target.value) })}
                    placeholder={t('chat.quantity')}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-800 focus:ring-2 focus:ring-stone-400 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  value={customization.otherRequirements || ''}
                  onChange={(e) => setCustomization({ ...customization, otherRequirements: e.target.value })}
                  placeholder={t('chat.other')}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-800 focus:ring-2 focus:ring-stone-400 focus:outline-none resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCustomizationForm(false)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-[11px] font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSendCustomization}
                    className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {t('chat.sendCustomization')}
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-2.5 bg-white border-t border-stone-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCustomizationForm(!showCustomizationForm)}
                  className={`p-2 rounded-xl transition-all ${
                    showCustomizationForm
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  title={t('chat.customizationRequest')}
                >
                  <FileText className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chat.typeMessage')}
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden sm:flex items-center justify-center p-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl">💬</div>
              <p className="text-sm font-semibold text-stone-700">{t('chat.startConversation')}</p>
              <p className="text-xs text-stone-500">{t('chat.noConversations')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};