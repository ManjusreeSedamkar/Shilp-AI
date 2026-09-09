import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, SkipForward, Check, Camera, Mic, FileText, Package, MessageSquare, Bot } from 'lucide-react';
import { Language } from '../types';
import { translate } from '../services/translations';

interface OnboardingTutorialProps {
  language: Language;
  onClose: () => void;
}

const STEPS = [
  { icon: Camera, key: 'step1' },
  { icon: Mic, key: 'step2' },
  { icon: FileText, key: 'step3' },
  { icon: Package, key: 'step4' },
  { icon: MessageSquare, key: 'step5' },
  { icon: Bot, key: 'step6' },
];

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ language, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = (key: string) => translate(language, key);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92dvh] overflow-y-auto shadow-2xl border border-stone-200 animate-scaleIn my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-saffron-700 via-stone-900 to-navy-900 p-5 text-white relative">
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 text-white/70 hover:text-white flex items-center gap-1 text-xs font-semibold transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
            {t('common.skip')}
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl">
              🏺
            </div>
            <div>
              <h2 className="text-lg font-black">{t('onboarding.welcome')}</h2>
              <p className="text-xs text-stone-300">{t('onboarding.tagline')}</p>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-8 bg-saffron-400'
                    : idx < currentStep
                      ? 'w-3 bg-emerald-400'
                      : 'w-3 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0 shadow-inner">
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider">
                {t('common.step')} {currentStep + 1} / {STEPS.length}
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                {t(`onboarding.${step.key}Title`)}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mt-1.5">
                {t(`onboarding.${step.key}Desc`)}
              </p>
            </div>
          </div>

          {/* Step Illustration */}
          <div className="mt-5 p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center">
            <div className="text-5xl">{['📸', '🎙️', '📝', '📦', '💬', '🤖'][currentStep]}</div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t('common.back')}
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-saffron-600/25 transition-all"
          >
            <span>
              {currentStep === STEPS.length - 1 ? t('onboarding.letsGo') : t('common.next')}
            </span>
            {currentStep === STEPS.length - 1 ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};