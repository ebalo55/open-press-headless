import { TemplateDocument } from "@open-press/models";

export type TemplateServiceFindAllBeforeEvent = Record<string, never>;

export type TemplateServiceFindAllAfterEvent = {
	documents: TemplateDocument[];
};
