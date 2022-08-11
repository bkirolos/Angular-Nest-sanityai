import { DatabaseModule } from '@app/database';
import { UtilityModule } from '@app/utility';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { settingsSchema } from './settings.schema';
import { SettingsService } from './settings.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Settings',
				schema: settingsSchema
			}
		]),
		UtilityModule,
		DatabaseModule
	],
	exports: [SettingsService],
	providers: [SettingsService]
})
export class SettingsModule {}
