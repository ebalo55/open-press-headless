import { TemplateDocument } from "@aetheria/models";

export type TemplateServiceFindBeforeEvent = {
	template_id: string;
};

export type TemplateServiceFindAfterEvent = {
	document: TemplateDocument;
};
