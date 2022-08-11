import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../settings.service';
import { AlertService } from 'src/app/admin/site/alert.service';
import { ConfirmService } from 'src/app/admin/site/confirm.service';

@Component({
	selector: 'app-settings-detail-page',
	templateUrl: './settings-detail-page.component.html',
	styleUrls: ['./settings-detail-page.component.scss']
})
export class SettingsDetailPageComponent implements OnInit {
	salesforceEnv: Object;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public settingsService: SettingsService,
		private alertService: AlertService,
		private confirmService: ConfirmService
	) {}

	async ngOnInit() {
		var ret = await this.settingsService.getSalesforceEnv();
		this.salesforceEnv = ret.name;
	}

	async onConnectToSalesforceBtn() {
		this.confirmService
			.confirm({
				text: 'Connect to SalesForce.  Continue?'
			})
			.then(async (answer) => {
				if (!answer) return;
				await this.settingsService.connectToSalesforce();
				this.alertService.info('Salesforce connected.');
				this.router.navigate(['/admin/settings']);
			});
	}
}
