import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";

@Module({})
export class PluginLoaderModule {
	public static forModule(imports: NonNullable<ModuleMetadata["imports"]>): DynamicModule {
		return {
			global: true,
			module: PluginLoaderModule,
			imports,
		};
	}
}
