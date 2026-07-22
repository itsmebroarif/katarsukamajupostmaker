import React, { useState, useEffect, useRef } from 'react';
import { Project, Asset, AppStats } from './types';
import { dbService } from './services/db';
import { exportProjectToZip, ExportProgress } from './services/zipExporter';
import { STARTER_TEMPLATES, StarterTemplate } from './constants/templates';
import { Header } from './components/common/Header';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { WelcomeScreen } from './components/dashboard/WelcomeScreen';
import { TemplateModal } from './components/dashboard/TemplateModal';
import { AssetLibraryModal } from './components/dashboard/AssetLibraryModal';
import { EditorLayout } from './components/editor/EditorLayout';
import { DownloadWizardModal } from './components/editor/DownloadWizardModal';
import { ImportZipModal } from './components/editor/ImportZipModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<AppStats>({
    totalProjects: 0,
    totalDrafts: 0,
    templatesUsed: 0,
    storageUsedBytes: 0,
  });

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals & Dialogs
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDownloadWizardOpen, setIsDownloadWizardOpen] = useState(false);

  // Confirm Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Export State
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const activeSlideRef = useRef<HTMLDivElement | null>(null);

  // Load Projects & Initialize Database
  useEffect(() => {
    const loadData = async () => {
      try {
        await dbService.initDatabase();
        const loadedProjects = await dbService.getAllProjects();
        setProjects(loadedProjects);

        const assets = await dbService.getAllAssets();
        setUserAssets(assets);

        const currentStats = await dbService.getAppStats();
        setStats(currentStats);
      } catch (err) {
        console.error('Database initialization error', err);
      }
    };
    loadData();
  }, []);

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Project Actions
  const handleCreateNewProject = async (template?: StarterTemplate) => {
    const tpl = template || STARTER_TEMPLATES[0];
    const now = new Date().toISOString();

    const newProject: Project = {
      ...tpl.projectData,
      id: `proj-${Date.now()}`,
      title: template ? tpl.name : 'Project Karang Taruna Baru',
      createdAt: now,
      updatedAt: now,
    };

    await dbService.saveProject(newProject);
    setProjects(await dbService.getAllProjects());
    setActiveProject(newProject);
    setView('editor');
    addToast('Project baru berhasil dibuat!', 'success');

    // Trigger celebration confetti
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  const handleUpdateProject = async (updated: Project) => {
    setActiveProject(updated);
    await dbService.saveProject(updated);
    await dbService.saveDraft(updated);
    setProjects(await dbService.getAllProjects());
  };

  const handleEditProject = async (id: string) => {
    const proj = await dbService.getProjectById(id);
    if (proj) {
      setActiveProject(proj);
      setView('editor');
    }
  };

  const handleDuplicateProject = async (id: string) => {
    const duplicated = await dbService.duplicateProject(id);
    if (duplicated) {
      setProjects(await dbService.getAllProjects());
      addToast('Project berhasil diduplikat!', 'success');
    }
  };

  const handleDeleteProject = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Hapus Project Permanent?',
      message: 'Project ini akan dihapus dari penyimpanan offline dan tidak dapat dipulihkan.',
      onConfirm: async () => {
        await dbService.deleteProject(id);
        setProjects(await dbService.getAllProjects());
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        addToast('Project berhasil dihapus.', 'info');
      },
    });
  };

  // Asset Management
  const handleUploadAsset = async (asset: Asset) => {
    await dbService.addAsset(asset);
    setUserAssets(await dbService.getAllAssets());
    addToast('Aset gambar berhasil diunggah!', 'success');
  };

  const handleDeleteAsset = async (id: string) => {
    await dbService.deleteAsset(id);
    setUserAssets(await dbService.getAllAssets());
    addToast('Aset dihapus.', 'info');
  };

  // ZIP Export Execution
  const handleExecuteExportZip = async () => {
    if (!activeProject) return;

    setIsExporting(true);
    setExportProgress({
      step: 'preparing',
      message: 'Mempersiapkan dokumen project...',
      percent: 10,
    });

    try {
      const slideRefs = [activeSlideRef.current];
      const blob = await exportProjectToZip(activeProject, slideRefs, (prog) => {
        setExportProgress(prog);
      });

      // Download file blob
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProject.title.toLowerCase().replace(/\s+/g, '-')}-karangtaruna.zip`;
      a.click();
      URL.revokeObjectURL(url);

      addToast('ZIP Project berhasil diunduh!', 'success');

      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      console.error('Export failed', err);
      addToast('Gagal membuat ZIP. Pastikan gambar dapat dimuat.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      {/* Header (Only show on Dashboard or as sticky header) */}
      {view === 'dashboard' && (
        <Header
          onNewProject={() => handleCreateNewProject()}
          onOpenTemplates={() => setIsTemplateModalOpen(true)}
          onImportZip={() => setIsImportModalOpen(true)}
          activeView={view}
          onGoHome={() => setView('dashboard')}
        />
      )}

      {/* Main View Router */}
      <main>
        {view === 'dashboard' ? (
          <WelcomeScreen
            projects={projects}
            stats={stats}
            onNewProject={() => handleCreateNewProject()}
            onSelectTemplate={(tpl) => handleCreateNewProject(tpl)}
            onEditProject={handleEditProject}
            onDuplicateProject={handleDuplicateProject}
            onExportZip={(p) => {
              setActiveProject(p);
              setIsDownloadWizardOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            onImportZip={() => setIsImportModalOpen(true)}
            onOpenTemplatesModal={() => setIsTemplateModalOpen(true)}
            onOpenAssetLibrary={() => setIsAssetModalOpen(true)}
          />
        ) : (
          activeProject && (
            <EditorLayout
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              onExportZip={() => setIsDownloadWizardOpen(true)}
              onGoBack={() => setView('dashboard')}
              userAssets={userAssets}
              onUploadAsset={handleUploadAsset}
              onDeleteAsset={handleDeleteAsset}
              onShowToast={addToast}
              slideRef={(node) => {
                activeSlideRef.current = node;
              }}
            />
          )
        )}
      </main>

      {/* Toast Notification Manager */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Confirmation Dialog Modal */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Starter Templates Picker Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(tpl) => handleCreateNewProject(tpl)}
      />

      {/* Asset Library Modal */}
      <AssetLibraryModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        userAssets={userAssets}
        onUploadAsset={handleUploadAsset}
        onDeleteAsset={handleDeleteAsset}
      />

      {/* Import ZIP Modal */}
      <ImportZipModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={async (imported) => {
          await dbService.saveProject(imported);
          setProjects(await dbService.getAllProjects());
          setActiveProject(imported);
          setView('editor');
          addToast('Project berhasil diimport dari ZIP!', 'success');
        }}
      />

      {/* Download Wizard Modal */}
      {activeProject && (
        <DownloadWizardModal
          isOpen={isDownloadWizardOpen}
          project={activeProject}
          progress={exportProgress}
          isExporting={isExporting}
          onStartExport={handleExecuteExportZip}
          onClose={() => {
            setIsDownloadWizardOpen(false);
            setExportProgress(null);
          }}
        />
      )}
    </div>
  );
}
