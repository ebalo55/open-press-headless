import { TemplateDocument, UpdateTemplateDTO } from "@aetheria/models";

export type TemplateServiceUpdateBeforeEvent = {
	template_id: string;
	template: UpdateTemplateDTO;
};

export type TemplateServiceUpdateAfterEvent = {
	document: TemplateDocument;
};
