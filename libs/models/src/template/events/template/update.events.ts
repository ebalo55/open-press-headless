import { TemplateDocument, UpdateTemplateDTO } from "@open-press/models";

export type TemplateServiceUpdateBeforeEvent = {
	template_id: string;
	template: UpdateTemplateDTO;
};

export type TemplateServiceUpdateAfterEvent = {
	document: TemplateDocument;
};
