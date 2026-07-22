import React, { useState } from 'react';
import { Project, Slide, Asset } from '../../types';
import { STARTER_THEMES } from '../../constants/themes';
import { Toolbar } from './Toolbar';
import { CanvasPreview } from './CanvasPreview';
import { SlideTimeline } from './SlideTimeline';
import { SmartForm } from './SmartForm';
import { CaptionEditor } from './CaptionEditor';
import { AssetLibraryModal } from '../dashboard/AssetLibraryModal';
import {
  FileEdit,
  Palette,
  Image as ImageIcon,
  MessageSquareText,
  Sparkles,
} from 'lucide-react';

interface EditorLayoutProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onExportZip: () => void;
  onGoBack: () => void;
  userAssets: Asset[];
  onUploadAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
  slideRef?: (node: HTMLDivElement | null) => void;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  project,
  onUpdateProject,
  onExportZip,
  onGoBack,
  userAssets,
  onUploadAsset,
  onDeleteAsset,
  onShowToast,
  slideRef,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'form' | 'theme' | 'assets' | 'caption'>('form');
  const [frameMode, setFrameMode] = useState<'pure' | 'device' | 'instagram'>('pure');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  const activeSlide: Slide = project.slides[activeSlideIndex] || project.slides[0];

  const handleUpdateActiveSlide = (updatedSlide: Slide) => {
    const updatedSlides = [...project.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    onUpdateProject({
      ...project,
      slides: updatedSlides,
    });
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: 'content',
      title: 'Judul Slide Baru',
      subtitle: 'Sub-judul keterangan',
      bgType: 'solid',
      bgColor: '#FFFFFF',
      body: 'Tuliskan poin penting di sini...',
      listItems: ['Poin pertama', 'Poin kedua'],
    };

    onUpdateProject({
      ...project,
      slides: [...project.slides, newSlide],
    });
    setActiveSlideIndex(project.slides.length);
    onShowToast('Slide baru ditambahkan!', 'success');
  };

  const handleDuplicateSlide = (index: number) => {
    const target = project.slides[index];
    const duplicated: Slide = {
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Salinan)`,
    };
    const updatedSlides = [...project.slides];
    updatedSlides.splice(index + 1, 0, duplicated);

    onUpdateProject({
      ...project,
      slides: updatedSlides,
    });
    setActiveSlideIndex(index + 1);
    onShowToast('Slide berhasil diduplikat!', 'success');
  };

  const handleDeleteSlide = (index: number) => {
    if (project.slides.length <= 1) {
      onShowToast('Minimal 1 slide tersisa!', 'error');
      return;
    }
    const updatedSlides = project.slides.filter((_, idx) => idx !== index);
    onUpdateProject({
      ...project,
      slides: updatedSlides,
    });
    setActiveSlideIndex(Math.max(0, index - 1));
    onShowToast('Slide berhasil dihapus!', 'success');
  };

  const handleReorderSlides = (newSlides: Slide[]) => {
    onUpdateProject({
      ...project,
      slides: newSlides,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      {/* Top Bar */}
      <Toolbar
        project={project}
        onUpdateProject={onUpdateProject}
        frameMode={frameMode}
        onChangeFrameMode={setFrameMode}
        onExportZip={onExportZip}
        onGoBack={onGoBack}
      />

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Inspector Panel */}
        <div className="w-full sm:w-96 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-slate-800 p-2 bg-slate-950">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'form'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Form Content</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'theme'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Tema Warna</span>
            </button>

            <button
              onClick={() => setActiveTab('assets')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'assets'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Aset Logo</span>
            </button>

            <button
              onClick={() => setActiveTab('caption')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                activeTab === 'caption'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Caption & IG</span>
            </button>
          </div>

          {/* Tab Panels Body */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'form' && (
              <SmartForm
                slide={activeSlide}
                onChange={handleUpdateActiveSlide}
                onOpenAssetLibrary={() => setIsAssetModalOpen(true)}
              />
            )}

            {activeTab === 'theme' && (
              <div className="p-4 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">Pilih Starter Theme Karang Taruna</h3>
                <div className="space-y-3">
                  {STARTER_THEMES.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => onUpdateProject({ ...project, themeId: theme.id })}
                      className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                        project.themeId === theme.id
                          ? 'bg-slate-800 border-red-500 ring-2 ring-red-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">{theme.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.secondary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Font: {theme.headingFont.split(',')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="p-4 space-y-4 text-xs">
                <div className="space-y-2">
                  <h3 className="font-bold text-white">Opsi Logo Karang Taruna</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['default', 'white', 'black', 'none'].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          onUpdateProject({ ...project, logoType: type as any })
                        }
                        className={`p-2 rounded-xl text-xs font-semibold capitalize border ${
                          project.logoType === type
                            ? 'bg-red-600 text-white border-red-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {type === 'default' ? 'Merah Standar' : type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsAssetModalOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Buka Perpustakaan Aset</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'caption' && (
              <CaptionEditor
                project={project}
                onUpdateProject={onUpdateProject}
                onShowToast={onShowToast}
              />
            )}
          </div>
        </div>

        {/* Center Live Canvas Stage */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-auto p-4 relative">
          <CanvasPreview
            project={project}
            activeSlideIndex={activeSlideIndex}
            frameMode={frameMode}
            slideRef={slideRef}
          />
        </div>
      </div>

      {/* Bottom Timeline */}
      <SlideTimeline
        slides={project.slides}
        activeSlideIndex={activeSlideIndex}
        onSelectSlide={setActiveSlideIndex}
        onAddSlide={handleAddSlide}
        onDuplicateSlide={handleDuplicateSlide}
        onDeleteSlide={handleDeleteSlide}
        onReorderSlides={handleReorderSlides}
      />

      {/* Asset Manager Modal */}
      <AssetLibraryModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        userAssets={userAssets}
        onUploadAsset={onUploadAsset}
        onDeleteAsset={onDeleteAsset}
        onSelectAsset={(url) => {
          handleUpdateActiveSlide({
            ...activeSlide,
            mediaUrl: url,
          });
          onShowToast('Gambar diterapkan pada slide!', 'success');
        }}
      />
    </div>
  );
};
