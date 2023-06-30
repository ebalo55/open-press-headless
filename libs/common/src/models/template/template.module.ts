import { Module } from "@nestjs/common";
import { TemplateController } from "./controllers";
import { TemplateModelModule } from "./template-model.module";

@Module({
	imports: [TemplateModelModule],
	controllers: [TemplateController],
	exports: [TemplateModelModule],
})
export class TemplateModule {}
