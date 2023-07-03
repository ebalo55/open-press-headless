import { AetheriaPlugin, TryResolutionPathConfig } from "@aetheria/backend-interfaces";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";

/**
 * Try to resolve the package.json file from the given plugin:
 * 1. The path specified in the configuration file
 * 2. The parent directory of the path specified in the configuration file
 * 3. The plugin identifier relative to the node_modules directory
 *
 * If resolution_path is given the following additional paths are tried **BEFORE** the default one:
 * 1. The path specified in the configuration file relative to the resolution_path
 * 2. The parent directory of the path specified in the configuration file relative to the resolution_path
 * 3. The plugin identifier relative to the resolution_path
 * 4. The parent directory of the plugin identifier relative to the resolution_path
 *
 * The first one to resolve is returned. If none resolve, an error is thrown.
 * If more than one path resolves the behaviour is undefined.
 *
 * @param {AetheriaPlugin} plugin The plugin to resolve
 * @param config The configuration for the resolution
 * @returns {Promise<string>} The raw file content
 */
export const tryResolutionPaths = async (
	plugin: AetheriaPlugin,
	config: TryResolutionPathConfig = {
		filename: "package.json",
		enable_node_modules: true,
		enable_parent: true,
	}
): Promise<string> => {
	const resolution_array = [
		readFile(resolve(cwd(), plugin.resolve, config.filename), "utf-8"),
		config.enable_parent ? readFile(resolve(cwd(), plugin.resolve, "..", config.filename), "utf-8") : null,
		config.enable_node_modules
			? readFile(resolve(cwd(), "node_modules", plugin.id, config.filename), "utf-8")
			: null,
	];

	if (config?.resolution_path) {
		resolution_array.unshift(
			readFile(resolve(config.resolution_path, plugin.resolve, config.filename), "utf-8"),
			config.enable_parent
				? readFile(resolve(config.resolution_path, plugin.resolve, "..", config.filename), "utf-8")
				: null,
			readFile(resolve(config.resolution_path, plugin.id, config.filename), "utf-8"),
			config.enable_parent
				? readFile(resolve(config.resolution_path, plugin.id, "..", config.filename), "utf-8")
				: null
		);
	}

	return Promise.any(resolution_array.filter((value) => value !== null) as Promise<string>[]);
};
