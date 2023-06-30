import { UserDocument, UserService } from "@aetheria/common";
import { AUTH_CONFIG_KEY, AuthConfig } from "@aetheria/config";
import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { tap } from "lodash";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PASSPORT_JWT_STRATEGY_EVENTS } from "../constants";
import {
	PassportJwtStrategyBeforeValidationEvent,
	PassportJwtStrategyValidationFailedEvent,
	PassportJwtStrategyValidationSuccessEvent,
} from "../events";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(AUTH_CONFIG_KEY)
		private readonly _auth_config: AuthConfig,
		private readonly _user_service: UserService,
		private readonly _event_emitter: EventEmitter2
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			/* istanbul ignore next */
			secretOrKey:
				_auth_config.jwt.encryption === "symmetric" ? _auth_config.jwt.secret : _auth_config.jwt.public_key,
			audience: _auth_config.jwt.audience,
			issuer: _auth_config.jwt.issuer,
		});
	}

	/**
	 * This method is called by Passport when a JWT is provided.
	 * @param payload The payload of the JWT.
	 * @returns {Promise<UserDocument>} The user document.
	 */
	async validate(payload: JwtPayload): Promise<UserDocument | null> {
		this._event_emitter.emit(PASSPORT_JWT_STRATEGY_EVENTS.before_validation, {
			payload,
		} as PassportJwtStrategyBeforeValidationEvent);

		if (payload.sub) {
			return tap(await this._user_service.find(payload.sub), (user) =>
				this._event_emitter.emit(PASSPORT_JWT_STRATEGY_EVENTS.validation_success, {
					user,
				} as PassportJwtStrategyValidationSuccessEvent)
			);
		}

		this._event_emitter.emit(PASSPORT_JWT_STRATEGY_EVENTS.validation_failed, {
			payload,
		} as PassportJwtStrategyValidationFailedEvent);

		return null;
	}
}
