import { DateTime } from "luxon";

/**
 * Mongoose setter for Luxon DateTime.
 * This setter will convert the value to ISO string.
 * @example
 * import { DateTime } from "luxon";
 * import { Schema } from "mongoose";
 * import { mongooseLuxonSetter } from "@aetheria/common";
 *
 * const schema = new Schema({
 * 	created_at: {
 * 		required: true,
 * 		default: DateTime.now().toISO(),
 * 		type: String,
 * 		set: mongooseLuxonSetter,
 * 	}
 * });
 *
 * // or
 *
 * @Prop({
 * 		required: true,
 * 		default: DateTime.now().toISO(),
 * 		type: String,
 * 		set: mongooseLuxonSetter,
 * 	})
 * 	updated_at!: string | DateTime;
 * @param {string | DateTime} value - The value to set.
 * @returns {string} - The value to set.
 */
export const mongooseLuxonSetter = (value: string | DateTime): string =>
	(value instanceof DateTime ? value.toISO() : DateTime.fromISO(value).toISO()) || "";
