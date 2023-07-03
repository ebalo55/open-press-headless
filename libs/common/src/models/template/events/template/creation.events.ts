import { CreateTemplateDTO } from "../../template.dto";
import { TemplateDocument } from "../../template.schema";

export type TemplateServiceCreationBeforeEvent = {
	template: CreateTemplateDTO;
};

export type TemplateServiceCreationAfterEvent = {
	document: TemplateDocument;
};
