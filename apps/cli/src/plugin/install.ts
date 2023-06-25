import { CommandRunner, Option, SubCommand } from "nest-commander";
import { makeLogger } from "../logger";
import { z } from "zod";
import { getConfiguration, resolvePlugin } from "@aetheria/config";
import { AetheriaConfiguration, AetheriaResolvedPlugin } from "@aetheria/backend-interfaces";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

interface Options {
	name: string;
	resolutionPath: string;
	configuration: string;
}

@SubCommand({
	name: "install",
	description: "Install a plugin",
})
export class PluginSubInstall extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;

	constructor() {
		super();
		this.logger = makeLogger("Build");
	}

	/**
	 * Parse the name option
	 * @returns {string}
	 * @param name
	 */
	@Option({
		flags: "-n, --name <name>",
		description: "The name of the plugin to install",
		required: true,
	})
	public parseNameConfig(name: string) {
		const result = z.string().nonempty().safeParse(name);
		if (result.success) {
			return result.data;
		}

		throw new Error(result.error.message);
	}

	/**
	 * Parse the name option
	 * @returns {string}
	 * @param resolution_path
	 */
	@Option({
		flags: "-r, --resolution-path <resolution-path>",
		description: "The path to the plugins resolution directory",
		required: true,
	})
	public parseResolutionPathConfig(resolution_path: string) {
		const result = z.string().nonempty().safeParse(resolution_path);
		if (result.success) {
			return result.data;
		}

		throw new Error(result.error.message);
	}

	/**
	 * Parse the name option
	 * @returns {string}
	 * @param configuration
	 */
	@Option({
		flags: "-c, --configuration <configuration-path>",
		description: "The path to the folder of containing the aetheria.json file",
		required: true,
		defaultValue: ".",
	})
	public parseConfigurationConfig(configuration: string) {
		const result = z.string().nonempty().safeParse(configuration);
		if (result.success) {
			return result.data;
		}

		throw new Error(result.error.message);
	}

	public async run(passedParams: string[], options?: Options) {
		if (!options) {
			this.logger.error("No options provided");
			process.exit(1);
		}

		const resolved_plugin = await resolvePlugin({
			id: options.name,
			resolve: options.resolutionPath,
		});

		this.logger.info(`Installing plugin ${resolved_plugin.name} (${resolved_plugin.version})`);

		const configuration = await getConfiguration(options.configuration);

		if (configuration.plugins.find((value) => resolved_plugin.name === value.id)) {
			this.logger.error(`Plugin ${resolved_plugin.name} is already installed, please uninstall it first`);
			process.exit(1);
		}

		await this.install(resolved_plugin, configuration, options);
	}

	private async install(plugin: AetheriaResolvedPlugin, configuration: AetheriaConfiguration, options: Options) {
		configuration.plugins.push({ id: plugin.name, resolve: options.resolutionPath });

		await writeFile(resolve(options.configuration, "./aetheria.json"), JSON.stringify(configuration, null, 4));

		this.logger.info(`Plugin ${plugin.name} successfully installed`);
	}
}
