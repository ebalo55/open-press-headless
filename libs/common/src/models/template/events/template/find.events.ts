import { TemplateDocument } from "../../template.schema";

export type TemplateServiceFindBeforeEvent = {
	template_id: string;
};

export type TemplateServiceFindAfterEvent = {
	document: TemplateDocument;
};
