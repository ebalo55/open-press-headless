import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONNECTIONS } from "@open-press/config";
import { Template, TemplateSchema } from "./template.schema";
import { TemplateService } from "./template.service";

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: Template.name,
					schema: TemplateSchema,
				},
			],
			DATABASE_CONNECTIONS.default
		),
	],
	providers: [TemplateService],
	exports: [TemplateService],
})
export class TemplateModelModule {}
