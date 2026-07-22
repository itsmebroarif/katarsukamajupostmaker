import React, { useState } from 'react';
import { Project } from '../../types';
import { importProjectFromZip } from '../../services/zipExporter';
import { FolderDown, X, Upload, FileCheck, AlertCircle, Loader2 } from 'lucide-react';

interface ImportZipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedProject: Project) => void;
}

export const ImportZipModal: React.FC<ImportZipModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setErrorMsg(null);

    try {
      const imported = await importProjectFromZip(file);
      onImportSuccess(imported);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal mengimpor file ZIP. Pastikan format ZIP valid.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <FolderDown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Import Project ZIP</h2>
              <p className="text-xs text-slate-400">Pulihkan project Karang Taruna dari berkas ZIP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <label className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 transition-colors">
          <Upload className="w-8 h-8 text-amber-400 animate-bounce" />
          <div className="space-y-1">
            <span className="text-sm font-bold text-white block">
              Pilih Berkas ZIP Project
            </span>
            <span className="text-xs text-slate-400 block">
              Format .zip buatan Karang Taruna Post Maker
            </span>
          </div>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="hidden"
            disabled={isImporting}
          />
        </label>

        {isImporting && (
          <div className="p-3 bg-slate-950 rounded-2xl flex items-center gap-3 text-xs text-amber-400 font-bold">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Membaca dan mengekstrak isi ZIP...</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-xs text-red-300 font-medium">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
