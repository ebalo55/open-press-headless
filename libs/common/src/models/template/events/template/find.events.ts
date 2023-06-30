import { TemplateDocument } from "../../";

export type TemplateServiceFindBeforeEvent = {
	template_id: string;
};

export type TemplateServiceFindAfterEvent = {
	document: TemplateDocument;
};
