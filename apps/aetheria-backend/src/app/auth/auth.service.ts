import {
	AuthServiceBeforeValidationEvent,
	AuthServiceUserLoggedInEvent,
	AuthServiceValidationFailedEvent,
	AuthServiceValidationSuccessEvent,
	JwtResponse,
} from "@aetheria/backend-interfaces";
import { AUTH_CONFIG_KEY, AuthConfig } from "@aetheria/config";
import { UserDocument, UserService } from "@aetheria/models";
import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import { tap } from "lodash";
import { AUTH_SERVICE_EVENTS } from "./constants";

@Injectable()
export class AuthService {
	constructor(
		private readonly _users_service: UserService,
		private readonly _jwt_service: JwtService,
		@Inject(AUTH_CONFIG_KEY)
		private readonly _auth_config: AuthConfig,
		private readonly _event_emitter: EventEmitter2
	) {}

	/**
	 * This method validates the user's credentials.
	 * @param {string} email The user's email.
	 * @param {string} password The user's password.
	 * @returns {Promise<null | UserDocument>}
	 */
	async validate(email: string, password: string): Promise<null | UserDocument> {
		this._event_emitter.emit(AUTH_SERVICE_EVENTS.before_validation, {
			email,
			password,
		} as AuthServiceBeforeValidationEvent);

		try {
			return tap(await this._users_service.findByEmailAndPassword(email, password), (user) => {
				this._event_emitter.emit(AUTH_SERVICE_EVENTS.validation_success, {
					user,
				} as AuthServiceValidationSuccessEvent);
			});
		} catch (error) {
			// if the user is not found, fallback to returning null as the strategy will appropriately handle it
			this._event_emitter.emit(AUTH_SERVICE_EVENTS.validation_failed, {
				error,
			} as AuthServiceValidationFailedEvent);
		}

		return null;
	}

	/**
	 * This method generates a JWT token for the user.
	 * @param {UserDocument} user The user document.
	 * @param remember_me
	 * @returns {Promise<{access_token: string}>} The JWT token.
	 */
	async login(user: UserDocument, remember_me: boolean) {
		return tap(
			{
				access_token: this._jwt_service.sign(
					{},
					{
						subject: user.id,
						expiresIn: !remember_me ? this._auth_config.jwt.expires_in : "30 days",
					}
				),
			} as JwtResponse,
			(jwt) => {
				this._event_emitter.emit(AUTH_SERVICE_EVENTS.user_logged_in, { jwt } as AuthServiceUserLoggedInEvent);
			}
		);
	}
}
