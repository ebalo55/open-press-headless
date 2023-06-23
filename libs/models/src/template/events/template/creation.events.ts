import { CreateTemplateDTO, TemplateDocument } from "@aetheria/models";

export type TemplateServiceCreationBeforeEvent = {
	template: CreateTemplateDTO;
};

export type TemplateServiceCreationAfterEvent = {
	document: TemplateDocument;
};
