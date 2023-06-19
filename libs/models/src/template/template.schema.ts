import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { mongooseLuxonSetter } from "@open-press/support";
import { DateTime } from "luxon";
import { HydratedDocument, Model } from "mongoose";

@Schema()
export class Template {
	@Prop({
		required: true,
		unique: true,
	})
	name!: string;

	@Prop({
		required: true,
	})
	html!: string;

	@Prop({
		required: true,
	})
	css!: string;

	@Prop({
		required: true,
		type: Object,
	})
	project_data!: {
		assets: any[];
		styles: any[];
		pages: any[];
	};

	/**
	 * Template's creation date - autofilled when using TemplateService.
	 * @type {DateTime}
	 */
	@Prop({
		required: true,
		default: DateTime.now().toISO(),
		type: String,
		set: mongooseLuxonSetter,
	})
	created_at!: string | DateTime;

	/**
	 * Template's last update date - autofilled when using TemplateService.
	 * @type {DateTime}
	 */
	@Prop({
		required: true,
		default: DateTime.now().toISO(),
		type: String,
		set: mongooseLuxonSetter,
	})
	updated_at!: string | DateTime;

	/**
	 * Template's extra data - can be used to store anything.
	 * NOTE: This field is not allowed by any default validation schema, you should create your own validation schema
	 *  if you want to use it.
	 * @type {Record<string, any>} - The extra data.
	 */
	@Prop({
		required: true,
		default: {},
		type: Object,
	})
	extra!: Record<string, any>;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

/**
 * Type for a hydrated Template document, returned in queries.
 */
export type TemplateDocument = HydratedDocument<Template>;

/**
 * Type for a template mongoose model, this type is not returned in query - you should use TemplateDocument instead.
 */
export type TemplateModel = Model<Template>;
