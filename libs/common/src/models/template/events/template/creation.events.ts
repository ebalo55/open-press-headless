import { CreateTemplateDTO, TemplateDocument } from "../../";

export type TemplateServiceCreationBeforeEvent = {
	template: CreateTemplateDTO;
};

export type TemplateServiceCreationAfterEvent = {
	document: TemplateDocument;
};
