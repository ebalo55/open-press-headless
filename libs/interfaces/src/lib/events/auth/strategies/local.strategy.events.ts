import { UserDocument } from "@aetheria/models";

export type PassportLocalStrategyBeforeValidationEvent = {
	email: string;
	password: string;
};

export type PassportLocalStrategyValidationSuccessEvent = {
	user: UserDocument;
};

export type PassportLocalStrategyValidationFailedEvent = {
	email: string;
	password: string;
};
