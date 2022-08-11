import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings, SettingsDocument } from './settings.schema';
import { LoggerService } from '@app/utility';
import { DocumentService, mongoose } from '@app/database';

@Injectable()
export class SettingsService {
	private logger: LoggerService = new LoggerService('SettingsService');

	constructor(
		@InjectModel('Settings') public settingsModel: mongoose.Model<SettingsDocument>,
		private documentService: DocumentService
	) {
	}

	async getSettingsByName(name: string): Promise<SettingsDocument> {
		return this.settingsModel.findOne({ name: name }).exec();
	}


	async saveSettings(newSettings: Settings) {
		const oldSettings = await this.getSettingsByName(newSettings.name);

		if(!oldSettings) {
			return this.documentService.saveDocument(this.settingsModel, newSettings );
		} else {
			newSettings.createDate = oldSettings.createDate;
			newSettings.updateDate = new Date();
			return this.settingsModel.replaceOne({ _id: oldSettings._id }, newSettings );
		}
	}
}
