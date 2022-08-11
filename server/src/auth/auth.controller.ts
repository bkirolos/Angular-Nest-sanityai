import { Controller, Request, Response, UseGuards, Post, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private configService: ConfigService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('user')
	getUser(@Request() req) {
		return req.user;
	}

	@Get('oauth2')
	getOAuth2(@Request() req, @Response() res) {
  	res.redirect(this.authService.getOAuth2AuthorizationUrl());
	}

	@Get('getAccessToken')
	getAccessToken(@Request() req, @Response() res) {
		this.authService.oauth2SetAccesCode(req.query.code);
		res.redirect(`${this.configService.get('FRONTEND_URL')}/admin/settings`);
	}

	@Get('sfEnv')
	getSfEnv() {
		 var url = this.authService.getOAuth2AuthorizationUrl();
		 if (url && url.indexOf('//') > -1)
			 url = url.substring(url.indexOf('//') + 2);
		 if (url.indexOf('/') > -1)
			 url = url.substring(0, url.indexOf('/'));
		 const info = { 
			 name : url
		 };
		 return info;

	}
}
