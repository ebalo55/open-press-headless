import { JwtResponse } from "@aetheria/backend-interfaces";
import { UserDocument, UserEntity } from "@aetheria/common";
import { Request } from "express";

export type AuthControllerBeforeValidationEvent = {
	request: Request;
};

export type AuthControllerAfterLoginEvent = {
	jwt: JwtResponse;
};

export type AuthControllerBeforeProfileEvent = {
	user: UserDocument;
};

export type AuthControllerAfterProfileEvent = {
	entity: UserEntity;
};

export type AuthControllerBeforeRevalidateEvent = {
	user: UserDocument;
};

export type AuthControllerAfterRevalidateEvent = {
	user: UserDocument;
	status: { can_revalidate: boolean };
};
