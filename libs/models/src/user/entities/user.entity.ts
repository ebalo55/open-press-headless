import { MongoseId } from "@aetheria/backend-interfaces";
import { Exclude } from "class-transformer";
import { DateTime } from "luxon";

export class UserEntity {
	id!: string;
	name!: string;
	email!: string;

	@Exclude()
	password!: string;

	@Exclude()
	created_at!: DateTime;

	@Exclude()
	updated_at!: DateTime;

	constructor(user: Partial<UserEntity & MongoseId>) {
		Object.assign(this, {
			id: user._id?.toHexString(),
			name: user.name,
			email: user.email,
			password: user.password,
			created_at: user.created_at,
			updated_at: user.updated_at,
		});
	}
}
