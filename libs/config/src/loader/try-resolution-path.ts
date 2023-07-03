import { AetheriaPlugin } from "@aetheria/backend-interfaces";
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
 * @param resolution_path The path to the plugins resolution directory, if not given, the current working directory is
 *     used
 * @param filename The filename to resolve, defaults to "package.json"
 * @returns {Promise<string>} The package.json file content
 */
export const tryResolutionPaths = async (
	plugin: AetheriaPlugin,
	resolution_path?: string,
	filename = "package.json"
): Promise<string> => {
	const resolution_array = [
		readFile(resolve(cwd(), plugin.resolve, filename), "utf-8"),
		readFile(resolve(cwd(), plugin.resolve, "..", filename), "utf-8"),
		readFile(resolve(cwd(), "node_modules", plugin.id, filename), "utf-8"),
	];

	if (resolution_path) {
		resolution_array.unshift(
			readFile(resolve(resolution_path, plugin.resolve, filename), "utf-8"),
			readFile(resolve(resolution_path, plugin.resolve, "..", filename), "utf-8"),
			readFile(resolve(resolution_path, plugin.id, filename), "utf-8"),
			readFile(resolve(resolution_path, plugin.id, "..", filename), "utf-8")
		);
	}

	return Promise.any(resolution_array);
};
