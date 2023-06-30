import { TemplateDocument } from "../../";

export type TemplateServiceDeleteBeforeEvent = {
	template_id: string;
};

export type TemplateServiceDeleteAfterEvent = {
	document: TemplateDocument;
};
