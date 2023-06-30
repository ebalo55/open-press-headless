import { TemplateDocument } from "../../";

export type TemplateServiceFindByNameBeforeEvent = {
	name: string;
};

export type TemplateServiceFindByNameAfterEvent = {
	document: TemplateDocument;
};
