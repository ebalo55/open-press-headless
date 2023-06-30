import { TemplateDocument } from "../../";

export type TemplateServiceFindAllBeforeEvent = Record<string, never>;

export type TemplateServiceFindAllAfterEvent = {
	documents: TemplateDocument[];
};
