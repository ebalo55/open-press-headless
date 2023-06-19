import { TemplateDocument } from "@open-press/models";

export type TemplateServiceFindBeforeEvent = {
	template_id: string;
};

export type TemplateServiceFindAfterEvent = {
	document: TemplateDocument;
};
