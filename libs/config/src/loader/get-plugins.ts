import { getConfiguration } from "./get-configuration";
import { AetheriaPlugin } from "@aetheria/backend-interfaces";

/**
 * Get the plugins from the configuration, plugins are not resolved yet.
 * @param resolution_path
 */
export const getPlugins = async (resolution_path?: string): Promise<AetheriaPlugin[]> => {
	const configuration = await getConfiguration(resolution_path);

	return configuration.plugins;
};
