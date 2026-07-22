import React, { useState } from 'react';
import { STARTER_TEMPLATES, StarterTemplate } from '../../constants/templates';
import { X, LayoutTemplate, Layers, Check, Sparkles } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: StarterTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Semua Template' },
    { id: 'pengumuman', label: 'Pengumuman' },
    { id: 'kegiatan', label: 'Kegiatan & Kerja Bakti' },
    { id: 'hari_besar', label: 'HUT RI & Hari Besar' },
    { id: 'organisasi', label: 'Organisasi' },
    { id: 'umkm', label: 'UMKM & Bazaar' },
    { id: 'donasi', label: 'Donasi & Social' },
    { id: 'blank', label: 'Blank / Custom' },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? STARTER_TEMPLATES
      : STARTER_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Pilih Starter Template</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mulai membuat postingan tanpa halaman kosong dengan struktur Karang Taruna siap pakai.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="group cursor-pointer bg-slate-950 border border-slate-800 hover:border-red-500/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold uppercase tracking-wider">
                    {tpl.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{tpl.slideCount} Slide</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-red-400 group-hover:text-red-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gunakan Template
                </span>
                <div className="w-7 h-7 rounded-lg bg-red-600/20 group-hover:bg-red-600 text-red-400 group-hover:text-white flex items-center justify-center transition-colors">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
