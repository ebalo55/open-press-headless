import { TemplateDocument } from "@aetheria/models";

export type TemplateServiceFindAllBeforeEvent = Record<string, never>;

export type TemplateServiceFindAllAfterEvent = {
	documents: TemplateDocument[];
};
