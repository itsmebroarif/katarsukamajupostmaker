import React from 'react';
import { Slide, SlideType } from '../../types';
import {
  Type,
  AlignLeft,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Phone,
  Instagram,
  MapPin,
  QrCode,
  Palette,
  CheckCircle2,
  Lock,
  EyeOff,
} from 'lucide-react';

interface SmartFormProps {
  slide: Slide;
  onChange: (updatedSlide: Slide) => void;
  onOpenAssetLibrary?: () => void;
}

export const SmartForm: React.FC<SmartFormProps> = ({
  slide,
  onChange,
  onOpenAssetLibrary,
}) => {
  const updateField = <K extends keyof Slide>(field: K, value: Slide[K]) => {
    onChange({
      ...slide,
      [field]: value,
    });
  };

  const handleListItemChange = (index: number, value: string) => {
    const list = [...(slide.listItems || [])];
    list[index] = value;
    updateField('listItems', list);
  };

  const addListItem = () => {
    const list = [...(slide.listItems || []), 'Poin baru'];
    updateField('listItems', list);
  };

  const removeListItem = (index: number) => {
    const list = (slide.listItems || []).filter((_, idx) => idx !== index);
    updateField('listItems', list);
  };

  const slideTypeOptions: { type: SlideType; label: string }[] = [
    { type: 'intro', label: 'Intro / Cover' },
    { type: 'content', label: 'Informasi / List' },
    { type: 'statistic', label: 'Angka & Statistik' },
    { type: 'quote', label: 'Kutipan / Quote' },
    { type: 'cta', label: 'CTA & Kontak' },
    { type: 'outro', label: 'Outro / Penutup' },
  ];

  const predefinedGradients = [
    { name: 'Merah Karang Taruna', val: 'linear-gradient(135deg, #D62828 0%, #1D1D1D 100%)' },
    { name: 'Kemerdekaan Bold', val: 'linear-gradient(135deg, #D62828 0%, #8B0000 100%)' },
    { name: 'Emas Karsa', val: 'linear-gradient(135deg, #F77F00 0%, #FCBF49 100%)' },
    { name: 'Peduli Hijau', val: 'linear-gradient(135deg, #2A9D8F 0%, #264653 100%)' },
    { name: 'Biru Organisasi', val: 'linear-gradient(135deg, #1D3557 0%, #457B9D 100%)' },
    { name: 'Malam Luxury', val: 'linear-gradient(135deg, #121826 0%, #1E293B 100%)' },
  ];

  return (
    <div className="p-4 sm:p-5 space-y-6 text-slate-100 text-xs">
      {/* Slide Type Picker */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span>Tipe Slide</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateField('locked', !slide.locked)}
              className={`p-1 rounded ${slide.locked ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500'}`}
              title="Kunci Slide"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateField('hidden', !slide.hidden)}
              className={`p-1 rounded ${slide.hidden ? 'text-red-400 bg-red-500/10' : 'text-slate-500'}`}
              title="Sembunyikan Slide"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {slideTypeOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => updateField('type', opt.type)}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                slide.type === opt.type
                  ? 'bg-red-600 border-red-500 text-white font-bold shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Teks & Informasi Slide
        </h4>

        {/* Badge / Label */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Badge / Label Atas</span>
          </label>
          <input
            type="text"
            value={slide.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            placeholder="Contoh: INFO RESMI, AGENDA, PENTING"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-red-400" />
            <span>Judul Utama Slide</span>
          </label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Tuliskan judul slide..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none font-bold"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300">Sub-Judul / Kategori</label>
          <input
            type="text"
            value={slide.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Penjelasan singkat judul..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none"
          />
        </div>

        {/* Body Paragraph */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-sky-400" />
            <span>Isi Teks / Deskripsi</span>
          </label>
          <textarea
            rows={3}
            value={slide.body || ''}
            onChange={(e) => updateField('body', e.target.value)}
            placeholder="Tuliskan isi detail slide di sini..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white placeholder-slate-600 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Statistic Fields */}
        {slide.type === 'statistic' && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <span className="font-bold text-amber-400 block">Metrik / Angka Highlight</span>
            <div className="space-y-2">
              <input
                type="text"
                value={slide.statNumber || ''}
                onChange={(e) => updateField('statNumber', e.target.value)}
                placeholder="Angka besar (misal: Rp 5.000.000 / 100+ Warga)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-amber-300 outline-none"
              />
              <input
                type="text"
                value={slide.statLabel || ''}
                onChange={(e) => updateField('statLabel', e.target.value)}
                placeholder="Label keterangan angka"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 outline-none"
              />
            </div>
          </div>
        )}

        {/* Bullet List Items */}
        {(slide.type === 'content' || slide.type === 'intro') && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daftar Poin Pilihan</span>
              </label>
              <button
                onClick={addListItem}
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Poin</span>
              </button>
            </div>

            <div className="space-y-2">
              {(slide.listItems || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListItemChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                  />
                  <button
                    onClick={() => removeListItem(idx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Specific Fields */}
        {slide.type === 'cta' && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <span className="font-bold text-sky-400 block">Informasi Kontak & Akses</span>

            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={slide.ctaPhone || ''}
                  onChange={(e) => updateField('ctaPhone', e.target.value)}
                  placeholder="Nomor WhatsApp & Nama Kontak"
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <input
                  type="text"
                  value={slide.ctaIg || ''}
                  onChange={(e) => updateField('ctaIg', e.target.value)}
                  placeholder="@akun.instagram.karangtaruna"
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <input
                  type="text"
                  value={slide.ctaLocation || ''}
                  onChange={(e) => updateField('ctaLocation', e.target.value)}
                  placeholder="Lokasi Balai / Pertemuan"
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={slide.ctaQrText || ''}
                  onChange={(e) => updateField('ctaQrText', e.target.value)}
                  placeholder="Teks petunjuk Scan QR Code"
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background & Styling Controls */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Gaya & Tampilan Slide</span>
        </h4>

        {/* Gradient Presets */}
        <div className="space-y-1.5">
          <span className="text-slate-400">Preset Warna Gradient:</span>
          <div className="grid grid-cols-2 gap-2">
            {predefinedGradients.map((g, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onChange({
                    ...slide,
                    bgType: 'gradient',
                    bgGradient: g.val,
                  });
                }}
                className="h-8 rounded-xl border border-slate-700 overflow-hidden relative group text-left px-2 flex items-center shadow-sm"
                style={{ background: g.val }}
              >
                <span className="text-[10px] font-bold text-white drop-shadow truncate">
                  {g.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Asset Image Upload / Selector */}
        {onOpenAssetLibrary && (
          <div className="pt-2">
            <button
              onClick={onOpenAssetLibrary}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Gunakan Aset Gambar / Logo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
