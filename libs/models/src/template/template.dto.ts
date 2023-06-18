import { z } from "zod";

export const CreateTemplateDTOValidationSchema = z.object({
	/**
	 * @description The name of the template.
	 */
	name: z.string().min(3).toLowerCase(),

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
