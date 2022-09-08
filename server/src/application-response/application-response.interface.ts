import { Application } from '../application/application.interface';
import { User } from '../user/user.interface';

export interface ApplicationResponseQuestionAnswer {
	questionKey: string;
	answer: any;
	answerLabel?: string;
}

export interface UtmCodes {
	utm_source?: string;
	utm_medium?: string;
	utm_content?: string;
	utm_campaign?: string;
	utm_term?: string;
}

export type ApplicationResponseStatus = 'rejected' | 'submitted' | 'pending' | 'processed';

export interface ApplicationResponse {
	_id?: any;

	status: ApplicationResponseStatus;
	utmCodes: UtmCodes;
	lastPage?: string;
	ipAddress?: string;
	gaSessionId?: string;

	application: Application;
	questionAnswers: ApplicationResponseQuestionAnswer[];

	bullhornCandidateId?: number;
	bullhornJobSubId?: number;

	salesforceApplicationId?: string;

	bummerEmail?: string; // If the user bummered out and left an email

	createDate?: Date;
	updateDate?: Date;

	deleted?: boolean;
	deleteDate?: Date;
	deleteUser?: User;
}
