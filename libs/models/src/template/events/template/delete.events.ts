import { TemplateDocument } from "@aetheria/models";

export type TemplateServiceDeleteBeforeEvent = {
	template_id: string;
};

export type TemplateServiceDeleteAfterEvent = {
	document: TemplateDocument;
};
