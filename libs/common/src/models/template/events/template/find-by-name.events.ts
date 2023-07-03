import { TemplateDocument } from "../../template.schema";

export type TemplateServiceFindByNameBeforeEvent = {
	name: string;
};

export type TemplateServiceFindByNameAfterEvent = {
	document: TemplateDocument;
};
