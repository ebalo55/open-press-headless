import { tap } from "lodash";
import { Command, CommandRunner } from "nest-commander";
import { exec } from "node:child_process";
import { cp, readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { makeLogger } from "../logger";

@Command({
	name: "build",
	description: "Build the application plugins",
})
export class Build extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;

	constructor() {
		super();
		this.logger = makeLogger("Build");
	}

	public async run(passedParams: string[], options?: Record<string, any>) {
		const plugin_names = await this.getPlugins();
		await this.buildPlugins(plugin_names);
	}

	/**
	 * Build a plugin
	 * @param {string} plugin - Plugin to build.
	 * @returns {Promise<void>}
	 * @private
	 */
	private async buildPlugin(plugin: string) {
		this.logger.info(`Building plugin ${plugin}`);

		exec(`rm -rf ./dist/libs/${plugin} && nest build ${plugin}`, (error, stdout, stderr) => {
			if (error) {
				console.error(`error: ${error.message}`);
				return;
			}

			if (stderr) {
				stderr?.split("\n").forEach((line) => {
					this.logger.error(`[${plugin}] - ${line}`);
				});
			}

			if (stdout.length > 0) {
				stdout.split("\n").forEach((line) => {
					this.logger.info(`[${plugin}] - ${line}`);
				});
			} else {
				this.logger.info(`[${plugin}] - Built successfully`);
			}
		});
	}

	private async copyAssets(plugin: string) {
		this.logger.info(`Copying assets for plugin ${plugin}`);

		try {
			const package_json = JSON.parse(await readFile(resolve(cwd(), "libs", plugin, "package.json"), "utf-8"));
			if (package_json?.aetheria?.assets && Array.isArray(package_json?.aetheria?.assets)) {
				this.logger.info(`[${plugin}] - Found ${package_json.aetheria.assets.length + 1} assets to copy`);
				await Promise.all(
					package_json.aetheria.assets.map(async (asset: string) => {
						this.logger.info(`[${plugin}] - Copying ${asset}`);
						await cp(resolve(cwd(), "libs", plugin, asset), resolve(cwd(), "dist", "libs", plugin, asset));
					})
				);
			}

			this.logger.info(`[${plugin}] - Copying package.json`);
			await cp(
				resolve(cwd(), "libs", plugin, "package.json"),
				resolve(cwd(), "dist", "libs", plugin, "package.json")
			);

			this.logger.info(`[${plugin}] - All assets copied successfully`);
		} catch (e: any) {
			this.logger.debug(`[${plugin}] [ERR] - ${e.message}`);
			this.logger.warn(`[${plugin}] - No assets to copy`);
		}
	}

	/**
	 * Build the plugins
	 * @param {string[]} plugins - Plugins to build.
	 * @returns {Promise<void>}
	 * @private
	 */
	private async buildPlugins(plugins: string[]) {
		await Promise.all(plugins.map((plugin) => this.buildPlugin(plugin)));
		await Promise.all(plugins.map((plugin) => this.copyAssets(plugin)));
	}

	/**
	 * Get the plugins to build.
	 * @returns {Promise<string[]>} - Plugins to build.
	 */
	private async getPlugins() {
		this.logger.info("Getting plugins");

		const files = await readdir(resolve(cwd(), "libs"), { encoding: "utf-8" });
		return tap(
			files.filter((file) => file.startsWith("plugin-")),
			(plugins) => {
				this.logger.info(`Found ${plugins.length} plugins`);
			}
		);
	}
}
