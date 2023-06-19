import { TemplateDocument } from "@open-press/models";

export type TemplateServiceDeleteBeforeEvent = {
	template_id: string;
};

export type TemplateServiceDeleteAfterEvent = {
	document: TemplateDocument;
};
