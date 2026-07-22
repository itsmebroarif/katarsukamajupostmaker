import React, { useState } from 'react';
import { Asset } from '../../types';
import { DEFAULT_ASSETS, ICON_PACK } from '../../constants/starterAssets';
import { X, Image as ImageIcon, Upload, Trash2, Plus, Sparkles, Check } from 'lucide-react';

interface AssetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAssets: Asset[];
  onUploadAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onSelectAsset?: (url: string) => void;
}

export const AssetLibraryModal: React.FC<AssetLibraryModalProps> = ({
  isOpen,
  onClose,
  userAssets,
  onUploadAsset,
  onDeleteAsset,
  onSelectAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'logos' | 'icons' | 'my_uploads'>('all');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        name: file.name,
        type: 'user_upload',
        url: url,
        size: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString(),
      };
      onUploadAsset(newAsset);
    };
    reader.readAsDataURL(file);
  };

  const allAssetsList = [...DEFAULT_ASSETS, ...userAssets];

  const filteredAssets =
    activeTab === 'all'
      ? allAssetsList
      : activeTab === 'logos'
      ? allAssetsList.filter((a) => a.type === 'logo')
      : activeTab === 'my_uploads'
      ? userAssets
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Perpustakaan Aset Karang Taruna</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola logo, latar belakang, dan berkas gambar lokal yang tersimpan offline.
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

        {/* Tab & Upload Bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Semua Aset
            </button>
            <button
              onClick={() => setActiveTab('logos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'logos'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Logo Resmi
            </button>
            <button
              onClick={() => setActiveTab('icons')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'icons'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Icon Pack
            </button>
            <button
              onClick={() => setActiveTab('my_uploads')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'my_uploads'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Upload Saya ({userAssets.length})
            </button>
          </div>

          <label className="cursor-pointer px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Aset Baru</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'icons' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ICON_PACK.map((icon) => (
                <div
                  key={icon.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 hover:border-amber-500/50 transition-colors"
                >
                  <span className="text-3xl">{icon.label.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-white">{icon.name}</span>
                </div>
              ))}
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-400">Belum ada aset gambar tersimpan di kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg p-3 flex flex-col items-center justify-between text-center"
                >
                  <div className="relative w-full h-32 flex items-center justify-center bg-slate-900 rounded-xl overflow-hidden p-2">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="w-full mt-3">
                    <p className="text-xs font-semibold text-white truncate">{asset.name}</p>
                    <span className="text-[10px] text-slate-500 uppercase">{asset.type}</span>
                  </div>

                  {onSelectAsset && (
                    <button
                      onClick={() => {
                        onSelectAsset(asset.url);
                        onClose();
                      }}
                      className="w-full mt-2 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Gunakan Gambar</span>
                    </button>
                  )}

                  {asset.type === 'user_upload' && (
                    <button
                      onClick={() => onDeleteAsset(asset.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
