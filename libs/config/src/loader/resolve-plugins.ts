import { AetheriaConfiguration, AetheriaResolvedPlugin } from "@aetheria/backend-interfaces";
import { resolvePlugin } from "./resolve-plugin";

/**
 * Resolve the plugins from the configuration
 * @param configuration
 */
export const resolvePlugins = async (configuration: AetheriaConfiguration): Promise<AetheriaResolvedPlugin[]> => {
	return await Promise.all(
		configuration.plugins.map(async (plugin): Promise<AetheriaResolvedPlugin> => {
			return await resolvePlugin(plugin);
		})
	);
};
