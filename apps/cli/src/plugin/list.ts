import * as Table from "cli-table3";
import { CommandRunner, SubCommand } from "nest-commander";
import { makeLogger } from "../logger";
import { getConfiguration, resolvePlugins } from "@aetheria/config";

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

	private async getPlugins() {
		const configuration = await getConfiguration();
		const plugins = await resolvePlugins(configuration);

		return plugins.map((plugin): [string, string] => [plugin.name, plugin.version]);
	}
}
