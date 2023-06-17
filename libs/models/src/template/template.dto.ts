import { MongoseId } from "@open-press/backend-interfaces";
import { TemplateDocument } from "@open-press/models/template/template.schema";
import { z } from "zod";

export const CreateTemplateDTOValidationSchema = z.object({
	/**
	 * @description The name of the template.
	 */
	name: z.string().min(3),

	/**
	 * @description The HTML of the template.
	 */
	html: z.string(),

	/**
	 * @description The CSS of the template.
	 */
	css: z.string(),

	/**
	 * @description The project data of the template. This data are used by the editor.
	 */
	project_data: z.object({
		assets: z.array(z.any()),
		styles: z.array(z.any()),
		pages: z.array(z.any()).length(1),
	}),
});
export type CreateTemplateDTO = z.infer<typeof CreateTemplateDTOValidationSchema>;

export const UpdateTemplateDTOValidationSchema = CreateTemplateDTOValidationSchema.partial();
export type UpdateTemplateDTO = z.infer<typeof UpdateTemplateDTOValidationSchema>;

export class TemplateEntity {
	id!: string;
	name!: string;
	html!: string;
	css!: string;
	project_data!: {
		assets: any[];
		styles: any[];
		pages: any[];
	};
	created_at!: string;
	updated_at!: string;

	constructor(template: Partial<(TemplateDocument | TemplateEntity) & MongoseId>) {
		Object.assign(this, {
			id: template._id?.toHexString(),
			name: template.name,
			html: template.html,
			css: template.css,
			project_data: template.project_data,
			created_at: template.created_at,
			updated_at: template.updated_at,
		});
	}
}
