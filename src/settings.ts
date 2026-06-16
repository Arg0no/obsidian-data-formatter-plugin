import { App, PluginSettingTab, Setting } from 'obsidian';
import DataFormatterPlugin from './main';

export interface DataFormatterPluginSettings {
	path: string;
}

export const DEFAULT_SETTINGS: DataFormatterPluginSettings = {
	path: '',
};

export class DataFormatterSettingTab extends PluginSettingTab {
	plugin: DataFormatterPlugin;

	constructor(app: App, plugin: DataFormatterPlugin) {
		super(app,plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Data path')
			.setDesc('Path for the json file')
			.addText((text) => {
				text
					.setPlaceholder('Enter path with file name')
					.setValue(this.plugin.settings.path)
					.onChange(async (newPath) => {
						const oldPath = this.plugin.settings.path;
						this.plugin.settings.path = newPath;
						this.plugin.jsonFileManager.updatePath(oldPath, newPath);
						await this.plugin.saveSettings();
					})
			})
	}
	
}
