import { UserDocument } from "@aetheria/common";

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
