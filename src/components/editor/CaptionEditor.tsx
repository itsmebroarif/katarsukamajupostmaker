import React, { useState } from 'react';
import { Project } from '../../types';
import { FileText, Copy, Check, Sparkles, Hash } from 'lucide-react';

interface CaptionEditorProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

export const CaptionEditor: React.FC<CaptionEditorProps> = ({
  project,
  onUpdateProject,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [newTag, setNewTag] = useState('');

  const defaultSuggestedHashtags = [
    'KarangTaruna',
    'KarangTarunaIndonesia',
    'PemudaBerkarya',
    'GotongRoyong',
    'PemudaPancasila',
    'OrganisasiPemuda',
    'IndonesiaMaju',
    'Sukamaju',
  ];

  const handleCopyCaption = () => {
    const fullHashtags = project.hashtags
      .map((h) => (h.startsWith('#') ? h : `#${h}`))
      .join(' ');
    const fullText = `${project.captionText}\n\n---\n${fullHashtags}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    onShowToast('Caption & Hashtag berhasil disalin!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const addHashtag = (tag: string) => {
    const clean = tag.replace(/^#/, '').trim();
    if (!clean || project.hashtags.includes(clean)) return;
    onUpdateProject({
      ...project,
      hashtags: [...project.hashtags, clean],
    });
    setNewTag('');
  };

  const removeHashtag = (tag: string) => {
    onUpdateProject({
      ...project,
      hashtags: project.hashtags.filter((h) => h !== tag),
    });
  };

  return (
    <div className="p-4 sm:p-5 space-y-6 text-slate-100 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            <span>Caption & Hashtag Instagram</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Caption ini akan dimasukkan otomatis ke dalam berkas CAPTION.md saat ekspor.
          </p>
        </div>

        <button
          onClick={handleCopyCaption}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 font-bold text-white rounded-xl shadow flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Tersalin!' : 'Copy Caption'}</span>
        </button>
      </div>

      {/* Caption Textarea */}
      <div className="space-y-2">
        <label className="font-bold text-slate-300">Isi Caption Postingan</label>
        <textarea
          rows={8}
          value={project.captionText}
          onChange={(e) => onUpdateProject({ ...project, captionText: e.target.value })}
          placeholder="Tuliskan caption lengkap di sini..."
          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-2xl text-xs text-white placeholder-slate-600 outline-none leading-relaxed font-sans resize-none"
        />
      </div>

      {/* Hashtag Manager */}
      <div className="space-y-3 pt-2">
        <label className="font-bold text-slate-300 flex items-center gap-1.5">
          <Hash className="w-4 h-4 text-amber-400" />
          <span>Hashtag Kategori ({project.hashtags.length})</span>
        </label>

        {/* Selected Hashtags Pills */}
        <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl min-h-16">
          {project.hashtags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[11px] flex items-center gap-1.5 group"
            >
              <span>#{tag}</span>
              <button
                onClick={() => removeHashtag(tag)}
                className="text-slate-500 hover:text-red-400 font-black ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add Custom Hashtag */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHashtag(newTag)}
            placeholder="Tambah hashtag baru (tanpa tanda #)..."
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
          />
          <button
            onClick={() => addHashtag(newTag)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl"
          >
            Tambah
          </button>
        </div>

        {/* Suggested Hashtags */}
        <div className="space-y-1.5 pt-2">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Rekomendasi Hashtag Karang Taruna:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {defaultSuggestedHashtags.map((sug) => (
              <button
                key={sug}
                onClick={() => addHashtag(sug)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors"
              >
                +#{sug}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
