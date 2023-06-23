import { MongoseId } from "@aetheria/backend-interfaces";
import { TemplateDocument, TemplateEntity } from "@aetheria/models";
import { PickType } from "@nestjs/mapped-types";

export class TemplateRenderingEntity extends PickType(TemplateEntity, ["html", "css"] as const) {
	scripts?: string;

	constructor(template: Partial<TemplateDocument & MongoseId>) {
		super(template);
		Object.assign(this, {
			html: template.html,
			css: template.css,
			scripts: template.extra?.scripts,
		});
	}
}
