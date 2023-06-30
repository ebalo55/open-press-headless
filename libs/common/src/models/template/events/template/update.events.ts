import { UpdateTemplateDTO } from "../../template.dto";
import { TemplateDocument } from "../../template.schema";

export type TemplateServiceUpdateBeforeEvent = {
	template_id: string;
	template: UpdateTemplateDTO;
};

export type TemplateServiceUpdateAfterEvent = {
	document: TemplateDocument;
};
