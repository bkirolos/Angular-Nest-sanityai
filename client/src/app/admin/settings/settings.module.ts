import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SettingsDetailPageComponent } from './settings-detail-page/settings-detail-page.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
	declarations: [SettingsDetailPageComponent],
	imports: [CommonModule, FormsModule, SettingsRoutingModule]
})
export class SettingsModule {}
