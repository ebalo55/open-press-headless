import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { User, UserDocument, UserEntity } from "@open-press/models";
import { PublicEndpoint, RestUser } from "@open-press/support";
import { Request } from "express";
import { tap } from "lodash";
import { NonUniformEventList } from "strongly-typed-events";
import { AuthService } from "./auth.service";
import { AUTH_CONTROLLER_EVENTS } from "./constants";
import { JwtAuthGuard, LocalAuthGuard } from "./guards";
import { AuthControllerEvents } from "./types";
import {
	LoginRequestDto,
	LoginRequestValidationSchema,
} from "@open-press/backend-interfaces/lib/dtos/login-request.dto";
import { validate } from "@open-press/utility";

@PublicEndpoint()
@Controller("auth")
export class AuthController {
	private _events = new NonUniformEventList<AuthController, AuthControllerEvents>();

	constructor(private auth_service: AuthService) {}

	/**
	 * This event is emitted before the login process is started.
	 * @returns {IEvent<AuthController, AuthControllerEvents["hook.auth.login.before"]>}
	 */
	get onBeforeLogin() {
		/* istanbul ignore next */
		return this._events.get(AUTH_CONTROLLER_EVENTS.before_validation).asEvent();
	}

	/**
	 * This event is emitted when the login process is successful.
	 * @returns {IEvent<AuthController, AuthControllerEvents["hook.auth.login.after"]>}
	 */
	get onAfterLogin() {
		/* istanbul ignore next */
		return this._events.get(AUTH_CONTROLLER_EVENTS.after_login).asEvent();
	}

	/**
	 * This event is emitted before the profile is returned.
	 * @returns {IEvent<AuthController, AuthControllerEvents["hook.auth.profile.before"]>}
	 */
	get onBeforeProfile() {
		/* istanbul ignore next */
		return this._events.get(AUTH_CONTROLLER_EVENTS.before_profile).asEvent();
	}

	/**
	 * This event is emitted after the profile is returned.
	 * @returns {IEvent<AuthController, AuthControllerEvents["hook.auth.profile.after"]>}
	 */
	get onAfterProfile() {
		/* istanbul ignore next */
		return this._events.get(AUTH_CONTROLLER_EVENTS.after_profile).asEvent();
	}

	/**
	 * Authenticates a user with email and password then returns an access token.
	 * @param {e.Request} request
	 * @param login_request
	 * @returns {Promise<{access_token: string}>}
	 */
	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(@Req() request: Request, @Body() login_request: LoginRequestDto) {
		validate(login_request, LoginRequestValidationSchema);

		this._events.get(AUTH_CONTROLLER_EVENTS.before_validation).dispatch(this, { request });

		return tap(await this.auth_service.login(request.user as UserDocument, login_request.remember_me), (jwt) => {
			this._events.get(AUTH_CONTROLLER_EVENTS.after_login).dispatch(this, { jwt });
		});
	}

	/**
	 * Returns the user's profile.
	 * @param {UserDocument} user The user document.
	 * @returns {Promise<User>} The user profile.
	 */
	@PublicEndpoint(false)
	@UseGuards(JwtAuthGuard)
	@Get("profile")
	async profile(@RestUser() user: UserDocument): Promise<UserEntity> {
		this._events.get(AUTH_CONTROLLER_EVENTS.before_profile).dispatch(this, { user });

		return tap(new UserEntity(user.toObject()), (entity) => {
			this._events.get(AUTH_CONTROLLER_EVENTS.after_profile).dispatch(this, { entity });
		});
	}
}
