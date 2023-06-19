import { JwtResponse } from "@open-press/backend-interfaces";
import { UserDocument, UserNotFoundError } from "@open-press/models";

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
