import React from 'react';
import { Plus, FolderDown, LayoutTemplate, WifiOff, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewProject: () => void;
  onOpenTemplates: () => void;
  onImportZip: () => void;
  activeView: 'dashboard' | 'editor';
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewProject,
  onOpenTemplates,
  onImportZip,
  activeView,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onGoHome}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-red-700 p-0.5 shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-red-500 text-lg">
            KT
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
              Karang Taruna <span className="text-red-500 font-extrabold">Post Maker</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
              v1.0 PWA
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Pembuat Konten & Carousel Media Sosial Offline-First
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Offline Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <WifiOff className="w-3.5 h-3.5" />
          <span>100% Offline Ready</span>
        </div>

        {activeView === 'dashboard' && (
          <>
            <button
              onClick={onImportZip}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <FolderDown className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Import ZIP</span>
            </button>

            <button
              onClick={onOpenTemplates}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <LayoutTemplate className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Template</span>
            </button>

            <button
              onClick={onNewProject}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl shadow-lg shadow-red-900/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Project Baru</span>
            </button>
          </>
        )}

        {activeView === 'editor' && (
          <button
            onClick={onGoHome}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dashboard</span>
          </button>
        )}
      </div>
    </header>
  );
};
