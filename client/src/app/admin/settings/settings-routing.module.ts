import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsDetailPageComponent } from './settings-detail-page/settings-detail-page.component';

const routes: Routes = [
	{ path: '', component: SettingsDetailPageComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule {}
