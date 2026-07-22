import React from 'react';
import { Project } from '../../types';
import {
  FileText,
  Copy,
  Trash2,
  Download,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExportZip: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDuplicate,
  onExportZip,
  onDelete,
}) => {
  const firstSlide = project.slides[0];

  const categoryLabels: Record<string, string> = {
    pengumuman: 'Pengumuman',
    kegiatan: 'Kegiatan',
    hari_besar: 'Hari Besar',
    organisasi: 'Organisasi',
    umkm: 'UMKM',
    pendidikan: 'Pendidikan',
    dokumentasi: 'Dokumentasi',
    donasi: 'Donasi',
    blank: 'Custom',
  };

  const formattedDate = new Date(project.updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      {/* Aspect Ratio Miniature Preview Box */}
      <div
        onClick={() => onEdit(project.id)}
        className="relative w-full h-48 bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center p-4 border-b border-slate-800/80"
      >
        {/* Render Mini Slide Card */}
        <div
          className="relative w-36 h-36 rounded-xl shadow-md p-3 flex flex-col justify-between text-white transition-transform duration-300 group-hover:scale-105"
          style={{
            background: firstSlide?.bgGradient || firstSlide?.bgColor || '#D62828',
          }}
        >
          {/* Logo Badge */}
          <div className="flex items-center justify-between text-[9px] font-bold tracking-wider opacity-90">
            <span className="bg-black/30 px-1.5 py-0.5 rounded uppercase">
              {project.orgName || 'Karang Taruna'}
            </span>
            <span className="text-amber-300">★</span>
          </div>

          {/* Mini Title */}
          <div className="my-auto text-center">
            {firstSlide?.badge && (
              <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/20 mb-1 uppercase">
                {firstSlide.badge}
              </span>
            )}
            <h4 className="text-xs font-black leading-tight line-clamp-2">
              {firstSlide?.title || project.title}
            </h4>
          </div>

          {/* Slide Count Indicator */}
          <div className="flex items-center justify-between text-[9px] text-white/80 border-t border-white/20 pt-1">
            <span>{project.slides.length} Slide</span>
            <span>{project.aspectRatio}</span>
          </div>
        </div>

        {/* Category Tag Overlay */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{categoryLabels[project.category] || 'General'}</span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3
            onClick={() => onEdit(project.id)}
            className="text-sm font-bold text-white hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {project.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            {project.captionText ? project.captionText : 'Tanpa deskripsi tambahan'}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-400">
            <Layers className="w-3.5 h-3.5" />
            <span>{project.slides.length} Slide</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onEdit(project.id)}
            className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Edit Post</span>
          </button>

          <button
            onClick={() => onExportZip(project)}
            title="Export ZIP & Gambar"
            className="p-2 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDuplicate(project.id)}
            title="Duplikat Project"
            className="p-2 text-slate-300 hover:text-sky-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(project.id)}
            title="Hapus Project"
            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
