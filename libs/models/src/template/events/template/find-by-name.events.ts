import { TemplateDocument } from "@open-press/models";

export type TemplateServiceFindByNameBeforeEvent = {
	name: string;
};

export type TemplateServiceFindByNameAfterEvent = {
	document: TemplateDocument;
};
