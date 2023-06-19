import { Module } from "@nestjs/common";
import { TemplateModule } from "@open-press/models";
import { PluginTailwindClassesBuilderService } from "./plugin-tailwind-classes-builder.service";

@Module({
	imports: [TemplateModule],
	providers: [PluginTailwindClassesBuilderService],
	exports: [PluginTailwindClassesBuilderService],
})
export class PluginTailwindClassesBuilderModule {}
