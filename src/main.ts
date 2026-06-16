import {
	FileSystemAdapter,
	Notice,
	Plugin,
} from 'obsidian';

import * as path from 'path';

import {
	DEFAULT_SETTINGS,
	DataFormatterPluginSettings,
	DataFormatterSettingTab,
} from './settings';

import { 
	JsonFileFormat 
} from './JsonFileFormat';

import { 
	JsonFileManager 
} from './fileManager';

import { 
	marked 
} from "marked";

export default class DataFormatterPlugin extends Plugin {
	settings!: DataFormatterPluginSettings;
	jsonFileManager!: JsonFileManager;

	async onload() {
		await this.loadSettings();

		this.jsonFileManager = new JsonFileManager(
			() => this.settings.path
		)

		this.addCommand({
			id: 'format-published-notes',
			name: 'Format published notes to specified file',
			callback: async () => {
				try {
					await this.UpdateJSONFromNotes();
					new Notice('JSON file saved');
				} catch (e) {
					console.error('DataFormatter: échec de la sauvegarde', e);
					new Notice(`Erreur lors de la sauvegarde : ${e instanceof Error ? e.message : e}`);
				}
			}
 		});

		this.addSettingTab(new DataFormatterSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<DataFormatterPluginSettings>,
		);

		if (!this.settings.path) {
			const base = this.getVaultBasePath();
			this.settings.path = base ? path.join(base, 'export.json') : 'export.json';
		}
	}

	private getVaultBasePath(): string {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}
		return '';
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	
	private async UpdateJSONFromNotes() {
		const files = this.app.vault.getMarkdownFiles().filter((file) => {
			const metadata = this.app.metadataCache.getFileCache(file);
			return metadata?.frontmatter?.publish === true;
		});

		new Notice(`${files.length} notes trouvées`);

		if (files.length === 0) return;

		const notes = await Promise.all(files.map(async (file) => {
			const content = await this.app.vault.read(file);
			const metadata = this.app.metadataCache.getFileCache(file);

			return {
				id: slugify(file.basename),
				title: file.basename,
				wordCount: content.split(/\s+/).length,
				contentMD: content,
				contentHTML: await convertToHTML(content),
				properties: metadata?.frontmatter ?? {},
				links: metadata?.links?.map(l => l.link) ?? [],
				lastUpdated: new Date(file.stat.mtime).toISOString()
			}
		}));

		const data: JsonFileFormat = {
			lastUpdated: new Date().toISOString(),
			notesCount: notes.length,
			notes: notes,
		}

		this.jsonFileManager.save(data);
	}
}

function slugify(str: string): string {
	return str
	.toLowerCase()
	.normalize("NFD")
	.replace(/[\u0300-\u036f]/g, "")  
	.replace(/[^a-z0-9\s-]/g, "")      
	.trim()
	.replace(/\s+/g, "-");
}

function preprocessMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---\n/, "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, link, alias) => {
      return `[${alias}](/notes/${slugify(link)})`;
    })
    .replace(/\[\[([^\]]+)\]\]/g, (_, link) => {
      return `[${link}](/notes/${slugify(link)})`;
    });
}

async function convertToHTML(contentMd: string): Promise<string> {
  const preprocessed = preprocessMarkdown(contentMd);
  return await marked(preprocessed);
}