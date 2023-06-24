import { Command, CommandRunner } from "nest-commander";
import { makeLogger } from "../logger";
import { PluginSubInstall } from "./install";
import { PluginSubList } from "./list";

@Command({
	name: "plugin",
	description: "Interact with application plugins",
	subCommands: [PluginSubList, PluginSubInstall],
})
export class PluginBase extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;

	constructor() {
		super();
		this.logger = makeLogger("Build");
	}

	public async run(passedParams: string[], options?: Record<string, any>) {
		this.command.help();
	}
}
