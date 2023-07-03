import { AetheriaConfiguration, AetheriaResolvedPlugin } from "@aetheria/backend-interfaces";
import { resolvePlugin } from "./resolve-plugin";

/**
 * Resolve the plugins from the configuration
 * @param configuration The configuration to resolve the plugins from
 * @param resolution_path The path to the plugins resolution directory, if not given, the current working directory is
 *    used
 */
export const resolvePlugins = async (
	configuration: AetheriaConfiguration,
	resolution_path?: string,
): Promise<AetheriaResolvedPlugin[]> => {
	return await Promise.all(
		configuration.plugins.map(async (plugin): Promise<AetheriaResolvedPlugin> => {
			return await resolvePlugin(plugin, resolution_path);
		}),
	);
};
