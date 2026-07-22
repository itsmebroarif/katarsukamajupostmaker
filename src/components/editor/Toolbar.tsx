import React, { useState } from 'react';
import { Project, AspectRatio } from '../../types';
import { STARTER_THEMES } from '../../constants/themes';
import {
  Download,
  Smartphone,
  Instagram,
  Check,
  Palette,
  Sparkles,
  Edit2,
  ArrowLeft,
  Monitor,
} from 'lucide-react';

interface ToolbarProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  frameMode: 'pure' | 'device' | 'instagram';
  onChangeFrameMode: (mode: 'pure' | 'device' | 'instagram') => void;
  onExportZip: () => void;
  onGoBack: () => void;
  isSaving?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  project,
  onUpdateProject,
  frameMode,
  onChangeFrameMode,
  onExportZip,
  onGoBack,
  isSaving,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(project.title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleText.trim() && titleText !== project.title) {
      onUpdateProject({ ...project, title: titleText.trim() });
    }
  };

  const aspectRatios: { id: AspectRatio; label: string; desc: string }[] = [
    { id: '1:1', label: '1:1 Square', desc: 'Feed Instagram / FB' },
    { id: '4:5', label: '4:5 Portrait', desc: 'Carousel HP Terpopuler' },
    { id: '9:16', label: '9:16 Story', desc: 'IG Story / Reel Cover' },
    { id: '1.91:1', label: 'FB Landscape', desc: 'Facebook Feed' },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoBack}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Kembali ke Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-slate-950 border border-red-500 rounded-lg px-2.5 py-1 text-sm font-extrabold text-white outline-none"
            />
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="group cursor-pointer flex items-center gap-2"
            >
              <h2 className="text-sm sm:text-base font-extrabold text-white group-hover:text-red-400 transition-colors">
                {project.title}
              </h2>
              <Edit2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          {/* Auto Save Status */}
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Check className="w-3 h-3" />
            {isSaving ? 'Menyimpan...' : 'Tersimpan Offline'}
          </span>
        </div>
      </div>

      {/* Middle Controls: Aspect Ratio & Theme Picker */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => onUpdateProject({ ...project, aspectRatio: ratio.id })}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                project.aspectRatio === ratio.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={ratio.desc}
            >
              {ratio.id}
            </button>
          ))}
        </div>

        {/* Theme Selector Dropdown */}
        <div className="relative group">
          <button className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tema Palette</span>
          </button>

          {/* Theme Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 space-y-1">
            {STARTER_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onUpdateProject({ ...project, themeId: theme.id })}
                className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors ${
                  project.themeId === theme.id ? 'bg-red-600/20 text-red-400 font-bold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{theme.name}</span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Controls: Frame Mode & Export ZIP Button */}
      <div className="flex items-center gap-2">
        {/* Frame Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onChangeFrameMode('pure')}
            className={`p-1.5 rounded-lg transition-colors ${
              frameMode === 'pure' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Tampilan Canvas Murni"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeFrameMode('instagram')}
            className={`p-1.5 rounded-lg transition-colors ${
              frameMode === 'instagram' ? 'bg-slate-800 text-pink-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Simulasi Posting Instagram"
          >
            <Instagram className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeFrameMode('device')}
            className={`p-1.5 rounded-lg transition-colors ${
              frameMode === 'device' ? 'bg-slate-800 text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Bingkai HP"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Download ZIP Button */}
        <button
          onClick={onExportZip}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 font-extrabold text-xs text-white rounded-xl shadow-lg shadow-red-950/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export ZIP</span>
        </button>
      </div>
    </div>
  );
};
