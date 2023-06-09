import { Module } from "@nestjs/common";
import { TemplateModelModule } from "@open-press/models";
import { TemplateController } from "./template.controller";

@Module({
	imports: [TemplateModelModule],
	controllers: [TemplateController],
	exports: [TemplateModelModule],
})
export class TemplateModule {}
