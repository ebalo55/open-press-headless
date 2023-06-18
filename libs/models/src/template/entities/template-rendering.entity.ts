import { PickType } from "@nestjs/mapped-types";
import { MongoseId } from "@open-press/backend-interfaces";
import { TemplateDocument, TemplateEntity } from "@open-press/models";

export class TemplateRenderingEntity extends PickType(TemplateEntity, ["html", "css"] as const) {
	constructor(template: Partial<(TemplateDocument | TemplateEntity) & MongoseId>) {
		super(template);
		Object.assign(this, {
			html: template.html,
			css: template.css,
		});
	}
}
