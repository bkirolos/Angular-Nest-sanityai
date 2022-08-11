import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/shared/http.service';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	constructor(
		private http: HttpService
	) {
	}

	connectToSalesforce(): Promise<any> {
		return this.http.get(`/auth/oauth2`);
	}

	getSalesforceEnv(): Promise<any> {
		return this.http.get(`/auth/sfEnv`);
	}
}
