import { AetheriaPlugin, AetheriaResolvedPlugin } from "@aetheria/backend-interfaces";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";

/**
 * Resolve the given plugin
 * @param plugin The plugin to resolve
 */
export const resolvePlugin = async (plugin: AetheriaPlugin): Promise<AetheriaResolvedPlugin> => {
	const package_json = JSON.parse(await readFile(resolve(cwd(), plugin.resolve, "package.json"), "utf-8"));

	// load assets from package.json if defined
	let assets: string[] | undefined = undefined;
	if (package_json?.aetheria?.assets && Array.isArray(package_json?.aetheria?.assets)) {
		assets = package_json.aetheria.assets.filter((asset: any) => typeof asset === "string");
	}

	return {
		name: package_json.name as string,
		version: package_json.version ? `v${package_json.version}` : "Unknown",
		assets,
	};
};
