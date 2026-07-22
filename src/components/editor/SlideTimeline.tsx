import React from 'react';
import { Slide } from '../../types';
import { Plus, Copy, Trash2, Lock, EyeOff, Layers } from 'lucide-react';

interface SlideTimelineProps {
  slides: Slide[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onReorderSlides: (newSlides: Slide[]) => void;
}

export const SlideTimeline: React.FC<SlideTimelineProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onReorderSlides,
}) => {
  const moveSlide = (from: number, to: number) => {
    if (to < 0 || to >= slides.length) return;
    const updated = [...slides];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onReorderSlides(updated);
    onSelectSlide(to);
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 shrink-0 px-2">
        <Layers className="w-4 h-4 text-red-500" />
        <span className="hidden sm:inline">Timeline Slide:</span>
      </div>

      {/* Slide Thumbnails List */}
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;

          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(idx)}
              className={`group relative shrink-0 cursor-pointer rounded-xl transition-all duration-200 border p-2 flex flex-col justify-between w-28 h-20 shadow-md ${
                isActive
                  ? 'bg-slate-800 border-red-500 shadow-red-950/40 ring-2 ring-red-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
              style={{
                background: isActive ? '#1E293B' : undefined,
              }}
            >
              {/* Header number badge & lock/hide flags */}
              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-white">#{idx + 1}</span>
                <div className="flex items-center gap-1">
                  {slide.locked && <Lock className="w-3 h-3 text-amber-400" />}
                  {slide.hidden && <EyeOff className="w-3 h-3 text-red-400" />}
                </div>
              </div>

              {/* Title preview */}
              <p className="text-[11px] font-bold text-white truncate my-auto">{slide.title}</p>

              {/* Quick Hover Controls */}
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {idx > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSlide(idx, idx - 1);
                    }}
                    title="Geser Kiri"
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    ◀
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateSlide(idx);
                  }}
                  title="Duplikat Slide"
                  className="p-1 rounded bg-slate-800 text-sky-400 hover:bg-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(idx);
                    }}
                    title="Hapus Slide"
                    className="p-1 rounded bg-slate-800 text-red-400 hover:bg-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {idx < slides.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSlide(idx, idx + 1);
                    }}
                    title="Geser Kanan"
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    ▶
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Slide Button */}
      <button
        onClick={onAddSlide}
        className="shrink-0 h-20 px-4 rounded-xl border border-dashed border-slate-700 hover:border-red-500 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
      >
        <Plus className="w-5 h-5 text-red-500" />
        <span className="text-[10px] font-bold">Tambah Slide</span>
      </button>
    </div>
  );
};
