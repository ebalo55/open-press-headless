import { TemplateDocument } from "../../template.schema";

export type TemplateServiceFindAllBeforeEvent = Record<string, never>;

export type TemplateServiceFindAllAfterEvent = {
	documents: TemplateDocument[];
};
