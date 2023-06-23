import { UserDocument } from "@aetheria/models";
import { JwtPayload } from "jsonwebtoken";

export type PassportJwtStrategyBeforeValidationEvent = {
	payload: JwtPayload;
};

export type PassportJwtStrategyValidationSuccessEvent = {
	user: UserDocument;
};

export type PassportJwtStrategyValidationFailedEvent = {
	payload: JwtPayload;
};
