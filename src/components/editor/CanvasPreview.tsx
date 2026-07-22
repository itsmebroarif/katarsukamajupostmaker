import React from 'react';
import { Project, Slide, Theme } from '../../types';
import { STARTER_THEMES } from '../../constants/themes';
import {
  Phone,
  Instagram,
  MapPin,
  Calendar as CalendarIcon,
  QrCode,
  Quote,
  CheckCircle2,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react';

interface CanvasPreviewProps {
  project: Project;
  activeSlideIndex: number;
  frameMode: 'pure' | 'device' | 'instagram';
  slideRef?: (node: HTMLDivElement | null) => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  project,
  activeSlideIndex,
  frameMode,
  slideRef,
}) => {
  const slide: Slide | undefined = project.slides[activeSlideIndex] || project.slides[0];
  const theme: Theme =
    STARTER_THEMES.find((t) => t.id === project.themeId) || STARTER_THEMES[0];

  if (!slide) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-slate-500">
        Slide tidak ditemukan.
      </div>
    );
  }

  // Aspect Ratios calculations
  const aspectStyleMap: Record<string, string> = {
    '1:1': 'aspect-square max-w-[500px]',
    '4:5': 'aspect-[4/5] max-w-[420px]',
    '9:16': 'aspect-[9/16] max-w-[340px]',
    '1.91:1': 'aspect-[1.91/1] max-w-[540px]',
  };

  const currentAspectClass = aspectStyleMap[project.aspectRatio] || aspectStyleMap['1:1'];

  // Background style computation
  const getBackgroundStyle = () => {
    if (slide.bgType === 'gradient' && slide.bgGradient) {
      return { background: slide.bgGradient };
    }
    if (slide.bgType === 'solid' && slide.bgColor) {
      return { backgroundColor: slide.bgColor };
    }
    if (slide.bgType === 'image' && slide.bgImageUrl) {
      return {
        backgroundImage: `url(${slide.bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` };
  };

  // Main Canvas Content Render
  const renderSlideInner = () => (
    <div
      ref={slideRef}
      id={`slide-canvas-${slide.id}`}
      style={{
        ...getBackgroundStyle(),
        fontFamily: theme.bodyFont,
        color: slide.bgColor === '#FFFFFF' || slide.bgColor === '#F8FAFC' ? '#1D1D1D' : '#FFFFFF',
      }}
      className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all select-none"
    >
      {/* Background Decorative Pattern / Wave Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Watermark & Logo */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3">
        <div className="flex items-center gap-2.5">
          {project.logoType !== 'none' && (
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md p-1 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
              <span className="font-black text-amber-300 text-xs tracking-tighter">KT</span>
            </div>
          )}
          <div>
            <h5
              style={{ fontFamily: theme.headingFont }}
              className="text-xs font-black uppercase tracking-wider leading-none"
            >
              {project.orgName || 'Karang Taruna'}
            </h5>
            <span className="text-[9px] opacity-75 font-medium tracking-wide">
              {project.author || 'Media Resmi Pemuda'}
            </span>
          </div>
        </div>

        {slide.badge && (
          <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
            {slide.badge}
          </span>
        )}
      </div>

      {/* Center Body Area */}
      <div className="relative z-10 my-auto py-4 space-y-4">
        {/* Intro / Content Titles */}
        <div className="space-y-1.5">
          {slide.subtitle && (
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {slide.subtitle}
            </p>
          )}
          <h2
            style={{ fontFamily: theme.headingFont }}
            className="text-xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-sm uppercase"
          >
            {slide.title}
          </h2>
        </div>

        {/* Slide Body text */}
        {slide.body && (
          <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-normal">
            {slide.body}
          </p>
        )}

        {/* Content List Items */}
        {slide.listItems && slide.listItems.length > 0 && (
          <ul className="space-y-2 pt-1">
            {slide.listItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-medium bg-black/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Statistic Display */}
        {slide.type === 'statistic' && slide.statNumber && (
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-1">
            <span
              style={{ fontFamily: theme.headingFont }}
              className="text-3xl sm:text-4xl font-black text-amber-300 block tracking-tight"
            >
              {slide.statNumber}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider">{slide.statLabel}</p>
          </div>
        )}

        {/* Quote Display */}
        {slide.type === 'quote' && (
          <div className="relative p-5 rounded-2xl bg-black/20 border-l-4 border-amber-400 space-y-2">
            <Quote className="w-6 h-6 text-amber-400/80" />
            <p className="text-sm italic font-medium">"{slide.body || slide.title}"</p>
            {slide.quoteAuthor && (
              <span className="text-xs font-bold text-amber-300 block text-right">
                — {slide.quoteAuthor}
              </span>
            )}
          </div>
        )}

        {/* Media / Image Display */}
        {slide.mediaUrl && (
          <div className="w-full max-h-48 rounded-2xl overflow-hidden shadow-lg border border-white/20">
            <img src={slide.mediaUrl} alt="Slide Media" className="w-full h-full object-cover" />
          </div>
        )}

        {/* CTA Contact Box */}
        {slide.type === 'cta' && (
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-1 gap-2 text-xs font-medium">
              {slide.ctaPhone && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/15 border border-white/20">
                  <Phone className="w-4 h-4 text-amber-300" />
                  <span>{slide.ctaPhone}</span>
                </div>
              )}

              {slide.ctaIg && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/15 border border-white/20">
                  <Instagram className="w-4 h-4 text-amber-300" />
                  <span>{slide.ctaIg}</span>
                </div>
              )}

              {slide.ctaLocation && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/15 border border-white/20">
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>{slide.ctaLocation}</span>
                </div>
              )}
            </div>

            {slide.ctaQrText && (
              <div className="p-3 rounded-xl bg-white text-slate-900 flex items-center gap-3 shadow-lg">
                <QrCode className="w-8 h-8 text-slate-900 shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold block">SCAN QR CODE</span>
                  <span className="text-slate-600">{slide.ctaQrText}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Watermark / Slide Navigation Counter */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2.5 text-[10px] opacity-80 font-semibold tracking-wider uppercase">
        <span>#PemudaBerkarya</span>
        <div className="flex items-center gap-1.5">
          <span>
            Slide {activeSlideIndex + 1} / {project.slides.length}
          </span>
        </div>
      </div>
    </div>
  );

  // Pure Canvas Mode
  if (frameMode === 'pure') {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <div className={`w-full ${currentAspectClass} rounded-2xl overflow-hidden shadow-2xl`}>
          {renderSlideInner()}
        </div>
      </div>
    );
  }

  // Instagram Frame Mode
  if (frameMode === 'instagram') {
    return (
      <div className="w-full flex items-center justify-center p-2 sm:p-4">
        <div className={`w-full ${currentAspectClass} bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-white flex flex-col`}>
          {/* Simulated IG Header */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800 bg-slate-900 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-[8px] text-amber-400">
                  KT
                </div>
              </div>
              <span className="font-bold text-slate-200">
                {project.orgName.toLowerCase().replace(/\s+/g, '.')}
              </span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          {/* Main Slide Image Canvas */}
          <div className="flex-1 overflow-hidden">{renderSlideInner()}</div>

          {/* Simulated IG Footer Controls */}
          <div className="p-3 border-t border-slate-800 bg-slate-900 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <MessageCircle className="w-4 h-4 text-slate-300" />
                <Send className="w-4 h-4 text-slate-300" />
              </div>
              {/* Carousel Dots */}
              <div className="flex items-center gap-1">
                {project.slides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeSlideIndex ? 'w-3 bg-red-500' : 'w-1.5 bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <Bookmark className="w-4 h-4 text-slate-300" />
            </div>

            <p className="text-[11px] font-bold text-slate-200">Liked by 1,248 pemuda & warga</p>
          </div>
        </div>
      </div>
    );
  }

  // Device Frame Mode
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="p-3 bg-slate-800 border-2 border-slate-700 rounded-[32px] shadow-2xl">
        <div className={`w-full ${currentAspectClass} rounded-[20px] overflow-hidden shadow-inner`}>
          {renderSlideInner()}
        </div>
      </div>
    </div>
  );
};
