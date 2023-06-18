import { MongoseId } from "@open-press/backend-interfaces";
import { TemplateDocument } from "@open-press/models";

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
