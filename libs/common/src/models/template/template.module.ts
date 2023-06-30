import { Module } from "@nestjs/common";
import { TemplateController, TemplateModelModule } from "./";

@Module({
	imports: [TemplateModelModule],
	controllers: [TemplateController],
	exports: [TemplateModelModule],
})
export class TemplateModule {}
