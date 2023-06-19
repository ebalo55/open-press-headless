import { CreateTemplateDTO, TemplateDocument } from "@open-press/models";

export type TemplateServiceCreationBeforeEvent = {
	template: CreateTemplateDTO;
};

export type TemplateServiceCreationAfterEvent = {
	document: TemplateDocument;
};
