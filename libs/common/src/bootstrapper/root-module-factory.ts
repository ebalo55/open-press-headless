import { BootstrapOptions } from "@aetheria/backend-interfaces";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DynamicModule, ModuleMetadata, Type } from "@nestjs/common";
import { PluginLoaderModule } from "./modules";
import { registerPlugins } from "./register-plugins";

/**
 * Creates the plugin wrapped root module for the application.
 * @param {Type} root_module The root module of the application.
 * @param configuration The configuration of the application.
 * @returns {Promise<DynamicModule>} The plugin wrapped root module.
 */
export async function makeRootModule(root_module: Type, configuration?: BootstrapOptions) {
	const imports: ModuleMetadata["imports"] = [root_module];

	await registerPlugins(imports, configuration);
	return PluginLoaderModule.forModule(imports);
}
