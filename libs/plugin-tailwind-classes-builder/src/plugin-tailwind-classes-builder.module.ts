import { TemplateModule } from "@aetheria/common";
import { Module } from "@nestjs/common";
import { PluginTailwindClassesBuilderService } from "./plugin-tailwind-classes-builder.service";

@Module({
	imports: [TemplateModule],
	providers: [PluginTailwindClassesBuilderService],
	exports: [PluginTailwindClassesBuilderService],
})
export class PluginTailwindClassesBuilderModule {}
