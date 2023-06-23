import { JwtResponse } from "@aetheria/backend-interfaces";
import { UserDocument, UserNotFoundError } from "@aetheria/models";

export type AuthServiceBeforeValidationEvent = {
	email: string;
	password: string;
};

export type AuthServiceValidationSuccessEvent = {
	user: UserDocument;
};

export type AuthServiceValidationFailedEvent = {
	error: UserNotFoundError | Error | unknown;
};

export type AuthServiceUserLoggedInEvent = {
	jwt: JwtResponse;
};
