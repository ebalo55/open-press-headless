import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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
		set: (value: string | DateTime): string =>
			(value instanceof DateTime ? value.toISO() : DateTime.fromISO(value).toISO()) || "",
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
		set: (value: string | DateTime): string =>
			(value instanceof DateTime ? value.toISO() : DateTime.fromISO(value).toISO()) || "",
	})
	updated_at!: string | DateTime;
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
