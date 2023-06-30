import { TemplateDocument, UpdateTemplateDTO } from "../../";

export type TemplateServiceUpdateBeforeEvent = {
	template_id: string;
	template: UpdateTemplateDTO;
};

export type TemplateServiceUpdateAfterEvent = {
	document: TemplateDocument;
};
