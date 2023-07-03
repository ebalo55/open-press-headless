import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import { HydratedDocument, Model } from "mongoose";
import { mongooseLuxonSetter } from "../../schemas";

@Schema()
export class User {
	/**
	 * User's name.
	 * @type {string}
	 */
	@Prop({
		required: true,
		maxlength: 255,
	})
	name!: string;

	/**
	 * User's email.
	 * @type {string}
	 */
	@Prop({
		required: true,
		maxlength: 255,
		unique: true,
	})
	email!: string;

	/**
	 * User's password.
	 * @type {string}
	 */
	@Prop({ required: true })
	password!: string;

	/**
	 * User's creation date - autofilled when using UserService.
	 * @type {DateTime}
	 */
	@Prop({
		required: true,
		default: DateTime.now(),
		type: String,
		set: mongooseLuxonSetter,
	})
	created_at!: string | DateTime;

	/**
	 * User's last update date - autofilled when using UserService.
	 * @type {DateTime}
	 */
	@Prop({
		required: true,
		default: DateTime.now(),
		type: String,
		set: mongooseLuxonSetter,
	})
	updated_at!: string | DateTime;

	/**
	 * User's extra data - can be used to store anything.
	 * NOTE: This field is not allowed by any default validation schema, you should create your own validation schema
	 *  if you want to use it.
	 * @type {Record<string, any>} - any extra data.
	 */
	@Prop({
		required: true,
		type: Object,
		default: {},
	})
	extra!: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Type for a hydrated User document, returned in queries.
 */
export type UserDocument = HydratedDocument<User>;

/**
 * Type for a User mongoose model, this type is not returned in query - you should use UserDocument instead.
 */
export type UserModel = Model<User>;
