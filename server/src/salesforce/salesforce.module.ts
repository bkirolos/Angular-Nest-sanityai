import { Module } from '@nestjs/common';
import { SalesforceService } from './salesforce.service';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
	imports: [SettingsModule],
	providers: [SalesforceService],
	exports: [SalesforceService]
})
export class SalesforceModule {}
