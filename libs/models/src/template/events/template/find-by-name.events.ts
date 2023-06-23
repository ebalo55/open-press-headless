import { TemplateDocument } from "@aetheria/models";

export type TemplateServiceFindByNameBeforeEvent = {
	name: string;
};

export type TemplateServiceFindByNameAfterEvent = {
	document: TemplateDocument;
};
