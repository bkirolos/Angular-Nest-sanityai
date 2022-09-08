import { LoggerService } from '@app/utility';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as JSForce from 'jsforce';

import { ApplicationResponseDocument } from 'src/application-response/application-response.schema';
import { ApplicationService } from 'src/application/application.service'

import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class SalesforceService {
	logger = new LoggerService('SalesforceService');
	connection: JSForce.Connection;
	configService: ConfigService;
	oauth2: JSForce.OAuth2;

	constructor(
		private _configService: ConfigService,
		private settingsService: SettingsService,
	) {
		this.configService = _configService;

	  this.oauth2 = new JSForce.OAuth2({
	  	loginUrl : this.configService.get('SALESFORCE_URL'),
 	    clientId: this.configService.get('SALESFORCE_CLIENT_ID'),
      clientSecret: this.configService.get('SALESFORCE_CLIENT_SECRET_ID'),
      redirectUri: `${this.configService.get('SALESFORCE_REDIRECT_URI')}`
    });

    this.createConnection();
	}

	async createConnection() {
	  const accessToken = await this.settingsService.getSettingsByName('accessToken')
	  const refreshToken = await this.settingsService.getSettingsByName('refreshToken')

	  const instanceUrl = await this.settingsService.getSettingsByName('instanceUrl')


    if(accessToken && instanceUrl) {
    			if (refreshToken && refreshToken.value) {
				this.connection = new JSForce.Connection({
				  oauth2 : this.oauth2,
				  instanceUrl : instanceUrl.value,
				  refreshToken : refreshToken.value,
				  accessToken : accessToken.value
				});
			}
			else {
				this.connection = new JSForce.Connection({
				  oauth2 : this.oauth2,
				  instanceUrl : instanceUrl.value,
				  accessToken : accessToken.value
				});
				this.logger.debug('Created new refresh token: ' + refreshToken);
  				this.settingsService.saveSettings({name: 'refreshToken', value: this.connection.refreshToken});
			}
	  }
	}

	async authorize(accessCode: string) {
		this.logger.debug('SalesforceService.authorize: start');

		this.connection = new JSForce.Connection({ oauth2 : this.oauth2 });

		const result = await this.connection.authorize(
			accessCode, 
			(err, userInfo) => {
  			if (err) {
  				return this.logger.error('SalesforceService.authorize: err=%o', err);
  			}
  			this.settingsService.saveSettings({name: 'accessToken', value: this.connection.accessToken});
  			this.settingsService.saveSettings({name: 'refreshToken', value: this.connection.refreshToken});
  			this.settingsService.saveSettings({name: 'instanceUrl', value: this.connection.instanceUrl});

				this.logger.debug('SalesforceService.authorize: userInfo=%o', userInfo);
		});
	}

	getOAuth2AuthorizationUrl() {
  	return this.oauth2.getAuthorizationUrl({});
  }

  oauth2SetAccesCode(accessCode) {
  	this.authorize(accessCode);
  }
 
	async addApplication(response: ApplicationResponseDocument) {
		const sfObject = this.buildSalesforceApplicationObject(response);
		const result = await this.connection.sobject("Application__c").create(
			sfObject, 
			(err, ret)  => {
			  if (err || !ret.success) { 
			  	return this.logger.error('SalesforceService.addApplication: err=%o ', err);
			  }
			  this.logger.debug('SalesforceService.addApplication: Created record id : %o', ret.id);
			}
		);
		if(result.success) {
			return result.id;
		}
		return null;
	}

	buildSalesforceApplicationObject(response: ApplicationResponseDocument): Object {
		let salesforceApplicationObject : any = {};

		response.questionAnswers.map((qa) => {
			const question = ApplicationService.findQuestionByQuestionKey(
				response.application, 
				qa.questionKey
			);

			if (!question) return;

			const salesforceKey = question?.salesforceKey;
			const questionKey = question?.key;
			
			switch(questionKey) {
				case 'jobTitle':
					salesforceApplicationObject['Title__c'] = qa.answer;
					break;
				case 'companyName':
					salesforceApplicationObject['Company_Name__c'] = qa.answer;
			}

			if (!salesforceKey) return;
			switch(salesforceKey) {
				case 'Previous_Address__c':
					salesforceApplicationObject['Previous_Address__c'] = response.questionAnswers.find((qa) => qa.questionKey === 'address.street1')?.answer;
					salesforceApplicationObject['Previous_Address_2__c'] = response.questionAnswers.find((qa) => qa.questionKey === 'address.street2')?.answer;
					salesforceApplicationObject['Previous_City__c'] = response.questionAnswers.find((qa) => qa.questionKey === 'address.city')?.answer;
					salesforceApplicationObject['Previous_State__c'] = response.questionAnswers.find((qa) => qa.questionKey === 'address.state')?.answer;
					salesforceApplicationObject['Previous_Postal_Code__c'] = response.questionAnswers.find((qa) => qa.questionKey === 'address.zipcode')?.answer;
					break;
				default:
					salesforceApplicationObject[salesforceKey] = qa.answer;
			}
		});

		salesforceApplicationObject.Name = 
		  salesforceApplicationObject.First_Name__c + ' ' + salesforceApplicationObject.Last_Name__c;

		salesforceApplicationObject.UTM_Campaign_Source__c = response.utmCodes?.utm_source
		salesforceApplicationObject.UTM_Campaign_Medium__c = response.utmCodes?.utm_medium
		salesforceApplicationObject.UTM_Campaign_Content__c = response.utmCodes?.utm_content
		salesforceApplicationObject.UTM_Campaign_Name__c = response.utmCodes?.utm_campaign
		salesforceApplicationObject.UTM_Campaign_Term__c = response.utmCodes?.utm_term

		salesforceApplicationObject.ga_session_id__c = response.gaSessionId;

		return salesforceApplicationObject;
	}
}
