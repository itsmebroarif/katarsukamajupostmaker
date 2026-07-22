import Dexie, { Table } from 'dexie';
import { Project, Asset, AppStats } from '../types';
import { STARTER_TEMPLATES } from '../constants/templates';

class KarangTarunaDatabase extends Dexie {
  projects!: Table<Project, string>;
  assets!: Table<Asset, string>;
  drafts!: Table<{ id: string; projectId: string; projectData: Project; savedAt: string }, string>;

  constructor() {
    super('KarangTarunaPostMakerDB');
    this.version(1).stores({
      projects: 'id, title, category, themeId, updatedAt, archived',
      assets: 'id, name, type, createdAt',
      drafts: 'id, projectId, savedAt',
    });
  }
}

export const db = new KarangTarunaDatabase();

// Database Service Helper Functions
export const dbService = {
  async initDatabase(): Promise<void> {
    const count = await db.projects.count();
    if (count === 0) {
      // Seed default projects from starter templates
      const now = new Date().toISOString();
      const initialProjects: Project[] = STARTER_TEMPLATES.slice(0, 3).map((tpl, index) => ({
        ...tpl.projectData,
        id: `proj-starter-${index + 1}`,
        createdAt: now,
        updatedAt: new Date(Date.now() - index * 3600000).toISOString(),
      }));
      await db.projects.bulkAdd(initialProjects);
    }
  },

  async getAllProjects(includeArchived = false): Promise<Project[]> {
    if (includeArchived) {
      return await db.projects.orderBy('updatedAt').reverse().toArray();
    }
    return await db.projects
      .filter((p) => !p.archived)
      .sortBy('updatedAt')
      .then((arr) => arr.reverse());
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    return await db.projects.get(id);
  },

  async saveProject(project: Project): Promise<string> {
    const updated = {
      ...project,
      updatedAt: new Date().toISOString(),
    };
    await db.projects.put(updated);
    return project.id;
  },

  async deleteProject(id: string): Promise<void> {
    await db.projects.delete(id);
    await db.drafts.where('projectId').equals(id).delete();
  },

  async duplicateProject(id: string): Promise<Project | undefined> {
    const original = await db.projects.get(id);
    if (!original) return undefined;
    const now = new Date().toISOString();
    const duplicated: Project = {
      ...original,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${original.title} (Salinan)`,
      createdAt: now,
      updatedAt: now,
    };
    await db.projects.put(duplicated);
    return duplicated;
  },

  async saveDraft(project: Project): Promise<void> {
    await db.drafts.put({
      id: `draft-${project.id}`,
      projectId: project.id,
      projectData: project,
      savedAt: new Date().toISOString(),
    });
  },

  async getLatestDraft(projectId?: string): Promise<Project | undefined> {
    if (projectId) {
      const draft = await db.drafts.get(`draft-${projectId}`);
      return draft?.projectData;
    }
    const allDrafts = await db.drafts.orderBy('savedAt').reverse().toArray();
    return allDrafts[0]?.projectData;
  },

  async clearDraft(projectId: string): Promise<void> {
    await db.drafts.delete(`draft-${projectId}`);
  },

  async getAllAssets(): Promise<Asset[]> {
    return await db.assets.orderBy('createdAt').reverse().toArray();
  },

  async addAsset(asset: Asset): Promise<string> {
    await db.assets.put(asset);
    return asset.id;
  },

  async deleteAsset(id: string): Promise<void> {
    await db.assets.delete(id);
  },

  async getAppStats(): Promise<AppStats> {
    const totalProjects = await db.projects.count();
    const totalDrafts = await db.drafts.count();
    const assetsCount = await db.assets.count();

    // Approximate size calculation
    let estimatedBytes = 0;
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        estimatedBytes = estimate.usage || 0;
      }
    } catch {
      estimatedBytes = (totalProjects + totalDrafts + assetsCount) * 15000;
    }

    return {
      totalProjects,
      totalDrafts,
      templatesUsed: STARTER_TEMPLATES.length,
      storageUsedBytes: estimatedBytes,
    };
  },
};
