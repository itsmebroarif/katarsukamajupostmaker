import React from 'react';
import { Project } from '../../types';
import { ExportProgress } from '../../services/zipExporter';
import {
  Download,
  X,
  CheckCircle2,
  FileText,
  FolderArchive,
  Layers,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface DownloadWizardModalProps {
  isOpen: boolean;
  project: Project;
  progress: ExportProgress | null;
  isExporting: boolean;
  onStartExport: () => void;
  onClose: () => void;
}

export const DownloadWizardModal: React.FC<DownloadWizardModalProps> = ({
  isOpen,
  project,
  progress,
  isExporting,
  onStartExport,
  onClose,
}) => {
  if (!isOpen) return null;

  const estimatedSizeMb = (0.8 * project.slides.length + 1.2).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Download Wizard ZIP</h2>
              <p className="text-xs text-slate-400">Export Paket Lengkap Project Karang Taruna</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Details Checklist Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Nama Project</span>
            <span className="font-bold text-white truncate max-w-[200px]">{project.title}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Kategori / Organisasi</span>
            <span className="font-semibold text-slate-200">{project.orgName}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Jumlah Slide Render</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {project.slides.length} Slide HD (PNG)
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Berkas Tambahan Bundled</span>
            <span className="font-semibold text-slate-200">
              CAPTION.md, README.md, metadata.json
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-400">Estimasi Ukuran ZIP</span>
            <span className="font-extrabold text-emerald-400">~{estimatedSizeMb} MB</span>
          </div>
        </div>

        {/* Progress Bar & Status (when exporting) */}
        {isExporting && progress && (
          <div className="space-y-3 p-4 bg-slate-950 border border-red-500/30 rounded-2xl animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-red-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                {progress.message}
              </span>
              <span className="text-white">{progress.percent}%</span>
            </div>

            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Export Complete State */}
        {progress?.step === 'done' && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Project berhasil dikompres ke ZIP! File otomatis terunduh.</span>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2.5 text-xs font-medium rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors disabled:opacity-50"
          >
            Tutup
          </button>

          {progress?.step !== 'done' && (
            <button
              onClick={onStartExport}
              disabled={isExporting}
              className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang Memproses...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Mulai Export ZIP</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
