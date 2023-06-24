import { AetheriaConfiguration } from "@aetheria/backend-interfaces";
import * as Table from "cli-table3";
import { CommandRunner, SubCommand } from "nest-commander";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { makeLogger } from "../logger";

@SubCommand({
	name: "list",
	description: "Build the application plugins",
})
export class PluginSubList extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;

	constructor() {
		super();
		this.logger = makeLogger("Build");
	}

	public async run(passedParams: string[], options?: Record<string, any>) {
		const plugins = await this.getPlugins();

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const table = new Table({
			head: ["Plugin", "Version"],
			style: {
				head: ["bold", "green"],
			},
		});
		table.push(...plugins);

		console.log(table.toString());
	}

	private async getConfiguration() {
		const plugins = await readFile("./aetheria.json", "utf-8");
		return JSON.parse(plugins) as AetheriaConfiguration;
	}

	private async getPlugins() {
		const configuration = await this.getConfiguration();

		return await Promise.all(
			configuration.plugins.map(async (plugin): Promise<[string, string]> => {
				const package_json = JSON.parse(
					await readFile(resolve(cwd(), plugin.resolve, "package.json"), "utf-8")
				);

				return [plugin.id, package_json.version ? `v${package_json.version}` : "Unknown"];
			})
		);
	}
}
