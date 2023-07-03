import { TemplateDocument } from "../../template.schema";

export type TemplateServiceDeleteBeforeEvent = {
	template_id: string;
};

export type TemplateServiceDeleteAfterEvent = {
	document: TemplateDocument;
};
