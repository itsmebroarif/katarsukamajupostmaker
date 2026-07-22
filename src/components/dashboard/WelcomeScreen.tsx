import React, { useState } from 'react';
import { Project, AppStats } from '../../types';
import { STARTER_TEMPLATES, StarterTemplate } from '../../constants/templates';
import { DAILY_TIPS } from '../../constants/starterAssets';
import { ProjectCard } from './ProjectCard';
import {
  Plus,
  LayoutTemplate,
  FolderDown,
  Image as ImageIcon,
  Palette,
  Search,
  Sparkles,
  Zap,
  HardDrive,
  Lightbulb,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface WelcomeScreenProps {
  projects: Project[];
  stats: AppStats;
  onNewProject: () => void;
  onSelectTemplate: (template: StarterTemplate) => void;
  onEditProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onExportZip: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onImportZip: () => void;
  onOpenTemplatesModal: () => void;
  onOpenAssetLibrary: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  projects,
  stats,
  onNewProject,
  onSelectTemplate,
  onEditProject,
  onDuplicateProject,
  onExportZip,
  onDeleteProject,
  onImportZip,
  onOpenTemplatesModal,
  onOpenAssetLibrary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tipIndex, setTipIndex] = useState(0);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 👋 Hero Banner & Welcome Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border border-red-900/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selamat Datang • Karang Taruna Post Maker v1.0</span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Membuat Konten Media Sosial <span className="text-red-500">Cepat, Konsisten</span> & Offline!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Solusi desain internal Karang Taruna. Tanpa ketergantungan software berat, cukup isi form sederhana dan ekspor carousel resolusi tinggi.
            </p>
          </div>

          {/* ⚡ Quick Actions Toolbar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNewProject}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/40 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>🆕 Buat Project Baru</span>
            </button>

            <button
              onClick={onOpenTemplatesModal}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LayoutTemplate className="w-4 h-4 text-sky-400" />
              <span>📄 Starter Template</span>
            </button>

            <button
              onClick={onOpenAssetLibrary}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>🖼 Asset Library</span>
            </button>

            <button
              onClick={onImportZip}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FolderDown className="w-4 h-4 text-emerald-400" />
              <span>📦 Import ZIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📈 Stats & Daily Tips Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stat 1: Total Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{stats.totalProjects}</span>
            <p className="text-xs text-slate-400 font-medium">Total Project Tersimpan</p>
          </div>
        </div>

        {/* Stat 2: Active Drafts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{stats.totalDrafts}</span>
            <p className="text-xs text-slate-400 font-medium">Draft Auto-Saved</p>
          </div>
        </div>

        {/* Stat 3: Storage Usage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{formatBytes(stats.storageUsedBytes)}</span>
            <p className="text-xs text-slate-400 font-medium">Penyimpanan Lokal OPFS</p>
          </div>
        </div>

        {/* 📌 Tips Hari Ini Card */}
        <div
          onClick={nextTip}
          className="group cursor-pointer bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-md hover:border-amber-500/50 transition-colors"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                📌 Tips Hari Ini
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-amber-400">Ganti »</span>
            </div>
            <p className="text-xs text-slate-300 italic line-clamp-2 leading-relaxed">
              "{DAILY_TIPS[tipIndex]}"
            </p>
          </div>
        </div>
      </div>

      {/* 📂 Project Gallery Section */}
      <div className="space-y-4">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>📂 Daftar Project Karang Taruna</span>
              <span className="text-xs font-normal text-slate-400">({filteredProjects.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Project yang sedang dibuat atau pernah disimpan offline</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul project..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-white">Belum Ada Project</h3>
              <p className="text-xs text-slate-400">
                Klik tombol "Buat Project Baru" atau pilih Starter Template di bawah untuk mulai berkreasi.
              </p>
            </div>
            <button
              onClick={onNewProject}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/30 inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Project Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onEditProject}
                onDuplicate={onDuplicateProject}
                onExportZip={onExportZip}
                onDelete={onDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🎁 Starter Templates Showcase */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Starter Templates Siap Pakai</span>
            </h2>
            <p className="text-xs text-slate-400">Pilih skenario konten yang paling sesuai dengan kebutuhan kegiatan Anda</p>
          </div>
          <button
            onClick={onOpenTemplatesModal}
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <span>Lihat Semua ({STARTER_TEMPLATES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STARTER_TEMPLATES.slice(0, 3).map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                  {tpl.badge}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-red-400 pt-2 border-t border-slate-800">
                <span>Gunakan Template Ini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
