import { AetheriaPlugin, AetheriaResolvedPlugin } from "@aetheria/backend-interfaces";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";

/**
 * Try to resolve the package.json file from the given plugin from the given resolution path or the parent directory
 * @param {AetheriaPlugin} plugin The plugin to resolve
 * @returns {Promise<string>} The package.json file content
 */
const tryPackageJsonResolutionPaths = async (plugin: AetheriaPlugin): Promise<string> => {
	try {
		return await readFile(resolve(cwd(), plugin.resolve, "package.json"), "utf-8");
	} catch (e: any) {
		return await readFile(resolve(cwd(), plugin.resolve, "..", "package.json"), "utf-8");
	}
};

/**
 * Resolve the given plugin
 * @param plugin The plugin to resolve
 */
export const resolvePlugin = async (plugin: AetheriaPlugin): Promise<AetheriaResolvedPlugin> => {
	const package_json = JSON.parse(await tryPackageJsonResolutionPaths(plugin));

	// load assets from package.json if defined
	let assets: string[] | undefined = undefined;
	if (package_json?.aetheria?.assets && Array.isArray(package_json?.aetheria?.assets)) {
		assets = package_json.aetheria.assets.filter((asset: any) => typeof asset === "string");
	}

	return {
		name: package_json.name as string,
		/* istanbul ignore next */
		version: package_json.version ? `v${package_json.version}` : "Unknown",
		assets,
	};
};
