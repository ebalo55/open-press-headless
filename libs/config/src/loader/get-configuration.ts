import { readFile } from "node:fs/promises";
import { AetheriaConfiguration } from "@aetheria/backend-interfaces";
import { resolve } from "node:path";
import { cwd } from "node:process";

/**
 * Get the configuration from the aetheria.json file
 * @param resolution_path The path to the aetheria.json file
 * @returns {Promise<AetheriaConfiguration>} The configuration
 */
export const getConfiguration = async (resolution_path?: string): Promise<AetheriaConfiguration> => {
	const plugins = await readFile(resolve(resolution_path ?? cwd(), "./aetheria.json"), "utf-8");
	return JSON.parse(plugins) as AetheriaConfiguration;
};
