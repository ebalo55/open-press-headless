import { AetheriaPlugin, AetheriaResolvedPlugin } from "@aetheria/backend-interfaces";
import { tryResolutionPaths } from "./try-resolution-path";

/**
 * Resolve the given plugin
 * @param plugin The plugin to resolve
 * @param resolution_path The path to the plugins resolution directory, if not given, the current working directory is
 *     used
 */
export const resolvePlugin = async (plugin: AetheriaPlugin, resolution_path?: string): Promise<AetheriaResolvedPlugin> => {
	const package_json = JSON.parse(
		await tryResolutionPaths(plugin, {
			filename: "package.json",
			resolution_path,
		})
	);

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
