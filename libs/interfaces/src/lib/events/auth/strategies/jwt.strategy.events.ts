import { UserDocument } from "@open-press/models";
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
