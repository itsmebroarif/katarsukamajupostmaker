import JSZip from 'jszip';
import { toPng } from 'html-to-image';
import { Project } from '../types';

export interface ExportProgress {
  step: 'preparing' | 'rendering' | 'assets' | 'zipping' | 'done';
  message: string;
  percent: number;
}

export const generateCaptionMarkdown = (project: Project): string => {
  const hashtagsString = project.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');

  let text = `# 📌 ${project.title.toUpperCase()}\n\n`;
  text += `${project.captionText || 'Mari meriahkan kegiatan Karang Taruna!'}\n\n`;
  text += `---\n\n`;
  text += `### 🏷️ Hashtags\n${hashtagsString}\n\n`;
  text += `---\n\n`;
  text += `### 🗺️ Slide Overview (${project.slides.length} Slides)\n`;

  project.slides.forEach((slide, idx) => {
    text += `\n**Slide ${idx + 1} (${slide.type.toUpperCase()})**:\n`;
    text += `- Judul: ${slide.title}\n`;
    if (slide.subtitle) text += `- Sub-judul: ${slide.subtitle}\n`;
    if (slide.badge) text += `- Label: ${slide.badge}\n`;
    if (slide.body) text += `- Isi: ${slide.body}\n`;
    if (slide.ctaPhone) text += `- Kontak: ${slide.ctaPhone}\n`;
    if (slide.ctaLocation) text += `- Lokasi: ${slide.ctaLocation}\n`;
  });

  text += `\n\n---\n*Dibuat otomatis oleh Karang Taruna Post Maker v1.0*`;
  return text;
};

export const generateReadmeMarkdown = (project: Project): string => {
  return `# 📦 Project Bundle: ${project.title}

Dibuat pada: ${new Date(project.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
Organisasi: ${project.orgName}
Pembuat: ${project.author}
Aplikasi: Karang Taruna Post Maker v1.0

---

## 📂 Isi Folder Bundle ZIP

- \`project.json\` : File data utama project.
- \`draft.json\` : Snapshot draft terakhir.
- \`manifest.json\` : Informasi versi & struktur file.
- \`CAPTION.md\` : Teks caption Instagram lengkap beserta hashtag siap copy-paste!
- \`metadata.json\` : Ringkasan statistik & informasi slide.
- \`exports/png/\` : Gambar hasil render tiap slide (format HD PNG) siap diupload ke Instagram/Facebook.

---

## 🔄 Cara Import / Restore Ke Aplikasi

1. Buka aplikasi **Karang Taruna Post Maker**.
2. Di halaman Dashboard, klik tombol **"📦 Import ZIP"**.
3. Pilih file ZIP ini.
4. Project akan dipulihkan secara otomatis lengkap dengan seluruh slide & pengaturannya!

---
*Karang Taruna Indonesia - Pemuda Berkarya, Bangsa Maju.*
`;
};

export const generateMetadataJson = (project: Project) => {
  return {
    title: project.title,
    author: project.author,
    orgName: project.orgName,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    aspect_ratio: project.aspectRatio,
    category: project.category,
    theme_id: project.themeId,
    slide_count: project.slides.length,
    hashtags: project.hashtags,
    exported_by: 'Karang Taruna Post Maker v1.0',
  };
};

export const exportProjectToZip = async (
  project: Project,
  slideElementRefs: (HTMLElement | null)[],
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> => {
  const zip = new JSZip();

  // 1. Preparing
  onProgress?.({
    step: 'preparing',
    message: 'Mempersiapkan dokumen dan metadata project...',
    percent: 15,
  });

  zip.file('project.json', JSON.stringify(project, null, 2));
  zip.file('draft.json', JSON.stringify({ project, savedAt: new Date().toISOString() }, null, 2));
  zip.file(
    'manifest.json',
    JSON.stringify(
      {
        version: '1.0.0',
        app: 'Karang Taruna Post Maker',
        projectId: project.id,
        createdAt: project.createdAt,
      },
      null,
      2
    )
  );
  zip.file('CAPTION.md', generateCaptionMarkdown(project));
  zip.file('README.md', generateReadmeMarkdown(project));
  zip.file('metadata.json', JSON.stringify(generateMetadataJson(project), null, 2));

  // 2. Rendering Slide Canvas to Images
  const exportsFolder = zip.folder('exports');
  const pngFolder = exportsFolder?.folder('png');

  onProgress?.({
    step: 'rendering',
    message: 'Merennder slide menjadi gambar HD (PNG)...',
    percent: 30,
  });

  const totalSlides = project.slides.length;
  for (let i = 0; i < totalSlides; i++) {
    const el = slideElementRefs[i];
    const slideNum = String(i + 1).padStart(3, '0');

    if (el) {
      try {
        const dataUrl = await toPng(el, {
          quality: 0.95,
          pixelRatio: 2, // High resolution for social media
          cacheBust: true,
        });
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        pngFolder?.file(`slide-${slideNum}.png`, base64Data, { base64: true });
      } catch (err) {
        console.warn(`Failed rendering slide ${i + 1}`, err);
      }
    }

    const currentPercent = 30 + Math.round(((i + 1) / totalSlides) * 45);
    onProgress?.({
      step: 'rendering',
      message: `Render Slide ${i + 1} dari ${totalSlides}...`,
      percent: currentPercent,
    });
  }

  // 3. Zipping
  onProgress?.({
    step: 'zipping',
    message: 'Mengompres seluruh berkas ke dalam ZIP...',
    percent: 85,
  });

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    onProgress?.({
      step: 'zipping',
      message: `Kompresi ZIP: ${Math.round(metadata.percent)}%`,
      percent: 85 + Math.round((metadata.percent / 100) * 12),
    });
  });

  onProgress?.({
    step: 'done',
    message: 'ZIP Berhasil Dibuat!',
    percent: 100,
  });

  return content;
};

export const importProjectFromZip = async (zipFile: File): Promise<Project> => {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(zipFile);

  const projectFile = unzipped.file('project.json');
  if (!projectFile) {
    throw new Error('File ZIP tidak valid. Berkas project.json tidak ditemukan.');
  }

  const projectText = await projectFile.async('string');
  const project: Project = JSON.parse(projectText);

  // Update timestamps and generate new ID to avoid conflict
  project.id = `proj-imported-${Date.now()}`;
  project.title = `${project.title} (Hasil Import)`;
  project.updatedAt = new Date().toISOString();

  return project;
};
