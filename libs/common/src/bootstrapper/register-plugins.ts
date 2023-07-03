import { BootstrapOptions } from "@aetheria/backend-interfaces";
import { getPlugins } from "@aetheria/config";
import { ModuleMetadata } from "@nestjs/common";

/**
 * Registers the plugins specified in the Aetheria configuration file.
 * @param {NonNullable<ModuleMetadata["imports"]>} imports The imports array of the root module.
 * @param configuration The configuration of the application.
 * @returns {Promise<void>} A promise that resolves when all plugins have been registered.
 */
export async function registerPlugins(
	imports: NonNullable<ModuleMetadata["imports"]>,
	configuration?: BootstrapOptions
) {
	const config_plugins = await getPlugins(".");

	const plugins = await Promise.all(
		config_plugins.map((plugin) => {
			try {
				const path = require.resolve(plugin.resolve, {
					paths: [process.cwd()],
				});

				return import(path);
			} catch (e: any) {
				if (configuration && configuration.enable_error_logging) {
					console.warn(`Failed to load plugin ${plugin.id} (${plugin.resolve}): ${e.message}`);
				}

				return new Promise((resolve) => resolve(null));
			}
		})
	);

	const plugin_modules = plugins
		.filter(Boolean)
		.map((plugin) => {
			return plugin.default;
		})
		.filter(Boolean);

	imports.push(...plugin_modules);
}
